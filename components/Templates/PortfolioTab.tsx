'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { PortfolioBox } from '@/components/shared/common/PortfolioBox';
import SideSheet from '@/components/shared/common/SideSheet';
import {
  AddMediaForm,
  AddMediaFormData,
} from '@/components/shared/forms/AddMediaForm';
import { Button } from '@/components/ui/button';
import { portfolioProjects } from '@/constants/dummy-data';
import { useState } from 'react';

export const PortfolioTab = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [localPortfolioProjects, setLocalPortfolioProjects] =
    useState(portfolioProjects);

  const handleEdit = (id: string) => {
    const project = localPortfolioProjects.find(p => p.id === id);
    if (project) {
      setEditingProject(project);
      setIsAddProjectOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      console.log('Deleting portfolio project:', projectToDelete);
      // Remove project from local state
      setLocalPortfolioProjects(prev =>
        prev.filter(project => project.id !== projectToDelete)
      );
    }
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleAddProject = () => {
    setIsAddProjectOpen(true);
  };

  const handleProjectSubmit = async (data: AddMediaFormData) => {
    setIsSubmitting(true);
    try {
      // Get the first image file for preview
      const firstImageFile = data.media.find(file =>
        file.type.startsWith('image/')
      );
      const previewImageUrl = firstImageFile
        ? URL.createObjectURL(firstImageFile)
        : null;

      if (editingProject) {
        console.log('Updating project:', editingProject.id, data);
        // Update project in local state
        setLocalPortfolioProjects(prev =>
          prev.map(project =>
            project.id === editingProject.id
              ? {
                  ...project,
                  title: data.projectName,
                  ...(previewImageUrl && { image: previewImageUrl }), // Only set image if we have one
                  imageCount: data.media.filter(file =>
                    file.type.startsWith('image/')
                  ).length,
                  videoCount: data.media.filter(file =>
                    file.type.startsWith('video/')
                  ).length,
                }
              : project
          )
        );
      } else {
        console.log('Adding new project:', data);
        // Add new project to local state
        const newProject = {
          id: `project-${Date.now()}`, // Generate unique ID
          title: data.projectName,
          type: 'Residential', // Default type
          year: new Date().getFullYear().toString(),
          imageCount: data.media.filter(file => file.type.startsWith('image/'))
            .length,
          videoCount: data.media.filter(file => file.type.startsWith('video/'))
            .length,
          ...(previewImageUrl && { image: previewImageUrl }), // Only add image if we have one
        };
        setLocalPortfolioProjects(prev => [...prev, newProject]);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the side sheet after successful submission
      setIsAddProjectOpen(false);
      setEditingProject(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving project:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancelAddProject = () => {
    setIsAddProjectOpen(false);
    setEditingProject(null);
  };

  return (
    <div className='space-y-6 w-full'>
      <div className='flex justify-end'>
        <Button onClick={handleAddProject} className='btn-primary'>
          Add Project
        </Button>
      </div>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {localPortfolioProjects.map(project => (
          <PortfolioBox
            key={project.id}
            id={project.id}
            title={project.title}
            {...(project.image && { image: project.image })}
            imageCount={project.imageCount}
            videoCount={project.videoCount}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={cancelDelete}
        onDelete={confirmDelete}
        title='Delete Portfolio Project'
        subtitle='Are you sure you want to delete this portfolio project? This action cannot be undone.'
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
