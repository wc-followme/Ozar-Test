'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { PortfolioBox } from '@/components/shared/common/PortfolioBox';
import SideSheet from '@/components/shared/common/SideSheet';
import {
  AddMediaForm,
  AddMediaFormData,
} from '@/components/shared/forms/AddMediaForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  PROJECT_MESSAGES,
  UPLOAD_PURPOSES,
} from '@/constants/common';
import { apiService, PortfolioProject } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const PortfolioTab = ({
  companyId,
  canEditCompany = false,
  isCompanyOrUserProfile = false,
  userId,
}: {
  companyId?: string;
  canEditCompany?: boolean;
  isCompanyOrUserProfile?: boolean;
  userId?: string | undefined;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(
    null
  );
  const [portfolioProjects, setPortfolioProjects] = useState<
    PortfolioProject[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Fetch projects with pagination
  const fetchProjects = useCallback(
    async (targetPage = 1, append = false) => {
      // Use userId for user profiles, otherwise use companyId
      const targetId = isCompanyOrUserProfile ? userId : companyId;
      if (!targetId) return;

      try {
        if (targetPage === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        // Use different API endpoints based on profile type
        const response = isCompanyOrUserProfile
          ? await apiService.fetchUserProjects({
              user_id: targetId,
              page: targetPage,
              limit: 12, // Smaller limit for pagination
            })
          : await apiService.fetchProjects({
              company_id: targetId,
              page: targetPage,
              limit: 12, // Smaller limit for pagination
            });

        if (response.statusCode === 200 || response.statusCode === 201) {
          const newProjects = response.data.data;
          setPortfolioProjects(prev =>
            append ? [...prev, ...newProjects] : newProjects
          );
          setHasMore(newProjects.length === 12); // Match the limit
          setPage(targetPage);
        } else {
          throw new Error(response.message || 'Failed to fetch projects');
        }
      } catch (error) {
        if (handleAuthError(error)) return;
        const errorMessage = extractApiErrorMessage(
          error,
          PROJECT_MESSAGES.FETCH_ERROR
        );
        setError(errorMessage);
        showErrorToast(errorMessage);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [companyId, userId, isCompanyOrUserProfile, handleAuthError, showErrorToast]
  );

  // Initial fetch and refetch when companyId changes
  useEffect(() => {
    fetchProjects(1, false);
  }, [fetchProjects]);

  // Load more projects
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchProjects(page + 1, true);
    }
  }, [fetchProjects, page, hasMore, isLoadingMore]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    // Add a small delay to ensure the DOM element is rendered
    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore, portfolioProjects.length]);

  const handleEdit = (id: string) => {
    const project = portfolioProjects.find(p => p.uuid === id);
    if (project) {
      setEditingProject(project);
      setIsAddProjectOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const response = isCompanyOrUserProfile
        ? await apiService.deleteUserProject(projectToDelete)
        : await apiService.deleteProject(projectToDelete);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(response.message || PROJECT_MESSAGES.DELETE_SUCCESS);
        setPortfolioProjects(prev =>
          prev.filter(p => p.uuid !== projectToDelete)
        );
      } else {
        showErrorToast(response.message || PROJECT_MESSAGES.DELETE_ERROR);
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      const errorMessage = extractApiErrorMessage(
        error,
        'Failed to delete portfolio project'
      );
      showErrorToast(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleAddProject = () => {
    setEditingProject(null); // Reset editing state
    setIsAddProjectOpen(true);
  };

  const handleProjectSubmit = async (data: AddMediaFormData) => {
    // Use userId for user profiles, otherwise use companyId
    const targetId = isCompanyOrUserProfile ? userId : companyId;
    if (!targetId) {
      showErrorToast(
        isCompanyOrUserProfile
          ? 'User ID is required'
          : PROJECT_MESSAGES.COMPANY_ID_REQUIRED
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Collect all image files and upload to get file keys
      const imageFiles = (data.media || []).filter(file =>
        file.type.startsWith('image/')
      );
      const uploadedImageKeys: string[] = [];

      for (const imageFile of imageFiles) {
        try {
          const { name: fileName, type: fileType, size: fileSize } = imageFile;
          const ext = fileName.split('.').pop() || 'png';
          const timestamp = Date.now();
          const projectUuid = uuidv4();
          const generatedFileName = `project_${projectUuid}_${timestamp}.${ext}`;

          const presigned = await getPresignedUrl({
            fileName: generatedFileName,
            fileType,
            fileSize,
            purpose: UPLOAD_PURPOSES.COMPANY_PROJECT,
            customPath: '',
          });

          const { data: presignedData } = presigned;
          await uploadFileToPresignedUrl(presignedData['uploadUrl'], imageFile);
          if (presignedData['fileKey']) {
            uploadedImageKeys.push(presignedData['fileKey']);
          }
        } catch (uploadError) {
          if (handleAuthError(uploadError)) {
            setIsSubmitting(false);
            return;
          }
          showErrorToast(PROJECT_MESSAGES.UPLOAD_ERROR);
          setIsSubmitting(false);
          return;
        }
      }

      // Edit mode: merge remaining existing images with newly uploaded ones
      const baseExisting =
        editingProject && Array.isArray(data.existingImages)
          ? data.existingImages
          : editingProject?.images || [];
      const mergedImages = [...baseExisting, ...uploadedImageKeys];
      const finalImages = Array.from(new Set(mergedImages));

      const projectData = {
        name: data.projectName,
        ...(finalImages.length > 0 && { images: finalImages }),
        ...(isCompanyOrUserProfile
          ? { user_id: targetId }
          : { company_id: targetId }),
      };

      if (editingProject) {
        // Update existing project
        const response = isCompanyOrUserProfile
          ? await apiService.updateUserProject(editingProject.uuid, projectData)
          : await apiService.updateProject(editingProject.uuid, projectData);

        if (response.statusCode === 200 || response.statusCode === 201) {
          showSuccessToast(response.message || PROJECT_MESSAGES.UPDATE_SUCCESS);
          const updatedProject = response.data;
          setPortfolioProjects(prev =>
            prev.map(p =>
              p.uuid === editingProject.uuid
                ? updatedProject || {
                    ...p,
                    name: projectData.name,
                    images: finalImages,
                  }
                : p
            )
          );
        } else {
          showErrorToast(response.message || PROJECT_MESSAGES.UPDATE_ERROR);
        }
      } else {
        // Create new project
        const response = isCompanyOrUserProfile
          ? await apiService.createUserProject(projectData)
          : await apiService.createProject(projectData);

        if (response.statusCode === 200 || response.statusCode === 201) {
          showSuccessToast(response.message || PROJECT_MESSAGES.CREATE_SUCCESS);
          const createdProject = response.data;
          if (createdProject) {
            setPortfolioProjects(prev => [createdProject, ...prev]);
          }
        } else {
          showErrorToast(response.message || PROJECT_MESSAGES.CREATE_ERROR);
        }
      }

      // Close the side sheet after successful submission
      setIsAddProjectOpen(false);
      setEditingProject(null);
    } catch (error) {
      if (handleAuthError(error)) return;
      const errorMessage = extractApiErrorMessage(
        error,
        editingProject
          ? PROJECT_MESSAGES.UPDATE_ERROR
          : PROJECT_MESSAGES.CREATE_ERROR
      );
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAddProject = () => {
    setIsAddProjectOpen(false);
    setEditingProject(null);
  };

  return (
    <div className='space-y-6 w-full'>
      {canEditCompany && (
        <div className='flex justify-end'>
          <Button onClick={handleAddProject} className='btn-primary'>
            Add Project
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading projects...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>{error}</p>
            <Button onClick={() => fetchProjects(1, false)} variant='outline'>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!loading && !error && (
        <div className='space-y-4'>
          {portfolioProjects.length === 0 ? (
            <NoDataFound
              title=''
              description='No projects found'
              buttonText=''
              showButton={false}
            />
          ) : (
            <>
              <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                {portfolioProjects.map((project: PortfolioProject) => {
                  const displayTitle = project.name || project.title || '';
                  const rawImage =
                    (project.images && project.images[0]) ||
                    project.image ||
                    APP_CONFIG.IMAGES.PROJECT_PLACEHOLDER;
                  const displayImage =
                    rawImage &&
                    (rawImage.startsWith('http') || rawImage.startsWith('/'))
                      ? rawImage
                      : `${APP_CONFIG.CDN_URL}${rawImage}`;
                  const imageCount =
                    project.images?.length || project.imageCount || 0;
                  const videoCount = project.videoCount || 0;
                  return (
                    <PortfolioBox
                      key={project.uuid}
                      id={project.uuid}
                      title={displayTitle}
                      {...(displayImage && { image: displayImage })}
                      imageCount={imageCount}
                      videoCount={videoCount}
                      onEdit={canEditCompany ? handleEdit : undefined}
                      onDelete={canEditCompany ? handleDelete : undefined}
                      showEditMenu={canEditCompany}
                    />
                  );
                })}
              </div>

              {/* Infinite scroll trigger element */}
              {hasMore && (
                <div ref={loadMoreRef} className='flex justify-center pt-4'>
                  {isLoadingMore && (
                    <div className='text-center py-4'>
                      <LoadingComponent variant='inline' size='md' text='' />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={cancelDelete}
        onDelete={confirmDelete}
        title='Delete Project'
        subtitle='Are you sure you want to delete this project? This action cannot be undone.'
        archiveButtonText='Delete'
      />

      {/* Add/Edit Project SideSheet */}
      <SideSheet
        open={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        size='600px'
      >
        <AddMediaForm
          onSubmit={handleProjectSubmit}
          onCancel={handleCancelAddProject}
          isLoading={isSubmitting}
          initialData={editingProject}
        />
      </SideSheet>
    </div>
  );
};
