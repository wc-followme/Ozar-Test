'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, PAGINATION } from '@/constants/common';
import { apiService, CreateToolRequest, Tool } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ToolCardSkeleton from '../../../components/shared/skeleton/ToolCardSkeleton';
import { TOOL_MESSAGES } from './tool-messages';

export default function ToolsManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editToolUuid, setEditToolUuid] = useState<string | null>(null);
  const [editToolData, setEditToolData] = useState<Tool | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Track if the existing image has been deleted
  const [imageDeleted, setImageDeleted] = useState(false);
  // Track the original tool assets from the API to preserve them
  const [originalToolAssets, setOriginalToolAssets] = useState<string>('');

  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError, user } = useAuth();

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;

  // Memoize menu options to prevent unnecessary re-renders
  const menuOptions = useMemo(
    () => [
      {
        label: TOOL_MESSAGES.EDIT_MENU,
        action: ACTIONS.EDIT,
        icon: Edit2,
        variant: 'default' as const,
      },
      {
        label: TOOL_MESSAGES.DELETE_MENU,
        action: ACTIONS.DELETE,
        icon: Trash,
        variant: 'destructive' as const,
      },
    ],
    []
  );

  const cdnPrefix = process.env['NEXT_PUBLIC_CDN_URL'] || '';

  // Load tools from API
  const loadTools = useCallback(
    async (targetPage = 1, append = false) => {
      if (!user) {
        return; // Don't fetch if user is not available yet
      }

      if (targetPage === 1) {
        setLoading(true);
      }

      try {
        const response = await apiService.fetchTools({
          page: targetPage,
          limit: PAGINATION.TOOLS_LIMIT,
        });

        const { statusCode, data, message } = response;

        if (statusCode === 200) {
          // Handle both possible response structures
          let toolsData = data;
          let total = 0;

          if (
            data &&
            typeof data === 'object' &&
            !Array.isArray(data) &&
            'data' in data
          ) {
            const { data: nestedData, total: responseTotal } = data as any;
            toolsData = nestedData;
            total = responseTotal || nestedData.length;
          } else if (Array.isArray(data)) {
            toolsData = data;
            total = data.length;
          }

          setTools(prev => {
            if (append) {
              // Filter out duplicates when appending to prevent duplicate keys
              const existingUuids = new Set(prev.map(tool => tool.uuid));
              const uniqueNewTools = toolsData.filter(
                (tool: Tool) => !existingUuids.has(tool.uuid)
              );
              return [...prev, ...uniqueNewTools];
            } else {
              return Array.isArray(toolsData) ? toolsData : [];
            }
          });

          setPage(targetPage);
          setHasMore(targetPage * PAGINATION.TOOLS_LIMIT < total);
        } else {
          showErrorToast(
            extractApiErrorMessage(message) || 'Failed to load tools'
          );
        }
      } catch (error: any) {
        const { status, message: errorMessage } = error;
        if (status === 401) {
          handleAuthError(error);
        } else {
          showErrorToast(
            extractApiErrorMessage(errorMessage) || 'Failed to load tools'
          );
        }
        if (!append) setTools([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [user, showErrorToast, handleAuthError]
  );

  // Fetch first page of tools
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTools([]);
    loadTools(1, false);
  }, [loadTools]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          loadTools(nextPage, true);
          return nextPage;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadTools]);

  const handleDelete = async (uuid: string) => {
    try {
      const response = await apiService.deleteTool(uuid);
      const { statusCode, message } = response;

      if (statusCode === 200) {
        showSuccessToast(message || TOOL_MESSAGES.DELETE_SUCCESS);
        setTools(tools.filter(tool => tool.uuid !== uuid));
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.DELETE_ERROR
        );
      }
    } catch (error: any) {
      const { status, message: errorMessage } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(errorMessage) || TOOL_MESSAGES.DELETE_ERROR
        );
      }
    }
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setFileKey('');
    setImageDeleted(true);
  };

  const handleEdit = async (uuid: string) => {
    setEditToolUuid(uuid);
    setEditLoading(true);
    setSideSheetOpen(true);
    setImageDeleted(false);
    setOriginalToolAssets('');
    try {
      const response = await apiService.getToolDetails(uuid);
      const { statusCode, data, message } = response;

      if (statusCode === 200 && data) {
        const { tool_assets, assets } = data;
        setEditToolData(data);

        // Check if tool_assets exists in the response
        const toolAssetsValue = tool_assets;

        // Check if we need to extract tool_assets from assets array
        let finalToolAssets = toolAssetsValue;
        if (
          !toolAssetsValue &&
          assets &&
          assets.length > 0 &&
          assets[0]?.media_url
        ) {
          // If tool_assets is empty but assets array has items, use the first asset's media_url
          finalToolAssets = assets[0].media_url;
        }

        setOriginalToolAssets(finalToolAssets ?? '');
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.FETCH_ERROR
        );
      }
    } catch (error) {
      showErrorToast(TOOL_MESSAGES.FETCH_ERROR);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateTool = async (data: {
    name: string;
    available_quantity: number;
    manufacturer: string;
    tool_assets: string;
    service_ids: string;
  }) => {
    const { name, available_quantity, manufacturer, service_ids } = data;

    setFormLoading(true);
    try {
      const payload: CreateToolRequest = {
        name,
        available_quantity,
        manufacturer,
        tool_assets: fileKey,
        service_ids,
      };

      const response = await apiService.createTool(payload);
      const { statusCode, message } = response;

      if (statusCode === 200 || statusCode === 201) {
        showSuccessToast(message || TOOL_MESSAGES.CREATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        setFileKey('');
        // Refresh tools list - use the same API call as initial load
        const refreshResponse = await apiService.fetchTools({
          page: 1,
          limit: PAGINATION.TOOLS_LIMIT,
        });
        const { statusCode: refreshStatusCode, data: refreshData } =
          refreshResponse;

        if (refreshStatusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshData;
          if (
            refreshData &&
            typeof refreshData === 'object' &&
            !Array.isArray(refreshData) &&
            'data' in refreshData
          ) {
            const { data } = refreshData as any;
            toolsData = data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } catch (error: any) {
      const { status, message: errorMessage } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(errorMessage) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTool = async (data: {
    name: string;
    available_quantity: number;
    manufacturer: string;
    tool_assets: string;
    service_ids: string;
  }) => {
    const { name, available_quantity, manufacturer, service_ids } = data;

    // Prevent submission if originalToolAssets is not loaded yet
    if (
      !originalToolAssets &&
      editToolData?.assets &&
      editToolData.assets.length > 0
    ) {
      return;
    }

    setFormLoading(true);
    try {
      // Send tool_assets as it is if not changed, otherwise use new file or empty if deleted
      const toolAssets =
        fileKey || (imageDeleted ? '' : (originalToolAssets ?? ''));

      const payload: CreateToolRequest = {
        name,
        available_quantity,
        manufacturer,
        tool_assets: toolAssets,
        service_ids,
      };

      const response = await apiService.updateTool(editToolUuid!, payload);
      const { statusCode, message } = response;

      if (statusCode === 200) {
        showSuccessToast(TOOL_MESSAGES.UPDATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        setFileKey('');
        setEditToolUuid(null);
        setEditToolData(null);
        setImageDeleted(false);
        setOriginalToolAssets('');
        // Refresh tools list
        const refreshResponse = await apiService.fetchTools({
          page: 1,
          limit: PAGINATION.TOOLS_LIMIT,
        });
        const { statusCode: refreshStatusCode, data: refreshData } =
          refreshResponse;

        if (refreshStatusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshData;
          if (
            refreshData &&
            typeof refreshData === 'object' &&
            !Array.isArray(refreshData) &&
            'data' in refreshData
          ) {
            const { data } = refreshData as any;
            toolsData = data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } catch (error: any) {
      const { status, message: errorMessage } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(errorMessage) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setSideSheetOpen(false);
    setPhoto(null);
    setFileKey('');
    setEditToolUuid(null);
    setEditToolData(null);
    setImageDeleted(false);
    setOriginalToolAssets('');
  };

  const handleOpenCreateForm = () => {
    // Reset all state for create mode
    setPhoto(null);
    setFileKey('');
    setEditToolUuid(null);
    setEditToolData(null);
    setImageDeleted(false);
    setOriginalToolAssets('');
    setSideSheetOpen(true);
  };

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='page-title'>Tools Management</h2>
        </div>
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {[...Array(8)].map((_, index) => (
            <ToolCardSkeleton key={`tool-skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='page-title'>Tools Management</h1>
          <div className='flex items-center gap-4 justify-end'>
            {canEdit && (
              <button
                onClick={handleOpenCreateForm}
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
              >
                <Add size='24' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>Create Tool</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Initial Loading State */}
      {tools.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Tools Grid */}
          {tools.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                title='No Tools Found'
                description="You haven't created any tools yet. Start by adding your first one to organize your tools."
                buttonText='Create Tool'
                onButtonClick={handleOpenCreateForm}
                showButton={canEdit ?? false}
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {tools.map((tool, index) => {
                const {
                  id,
                  name,
                  manufacturer,
                  available_quantity,
                  assets,
                  uuid,
                } = tool;
                const imageUrl =
                  assets && assets[0]?.media_url
                    ? cdnPrefix + assets[0].media_url
                    : '/images/img-placeholder-sm.png';
                return (
                  <ToolCard
                    key={id ?? `${name}-${manufacturer}-${index}`}
                    image={imageUrl}
                    name={name}
                    brand={manufacturer}
                    quantity={available_quantity}
                    videoCount={0} // Static 0 for now as requested
                    menuOptions={menuOptions}
                    onDelete={() => handleDelete(uuid)}
                    onEdit={() => handleEdit(uuid)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {loading && tools.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      {/* Side Sheet for Create Tool */}
      <SideSheet
        title={
          editToolUuid
            ? TOOL_MESSAGES.EDIT_TOOL_TITLE
            : TOOL_MESSAGES.ADD_TOOL_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          if (!open) {
            handleCancel(); // Reset state when sheet is closed
          }
          setSideSheetOpen(open);
        }}
        size='600px'
      >
        {editLoading ? (
          <div className='p-6 text-center'>Loading...</div>
        ) : (
          <ToolForm
            key={editToolUuid || 'create'} // Force re-render when switching modes
            photo={photo}
            setPhoto={setPhoto}
            handleDeletePhoto={handleDeletePhoto}
            uploading={uploading}
            onSubmit={editToolUuid ? handleUpdateTool : handleCreateTool}
            loading={formLoading}
            onCancel={handleCancel}
            setUploading={setUploading}
            setFileKey={setFileKey}
            existingImageUrl={
              imageDeleted
                ? undefined
                : editToolData?.assets?.[0]?.media_url
                  ? cdnPrefix + editToolData.assets[0].media_url
                  : undefined
            }
            existingToolAssets={imageDeleted ? '' : originalToolAssets}
            initialValues={
              editToolData
                ? (() => {
                    const { name, available_quantity, manufacturer, services } =
                      editToolData;
                    return {
                      name,
                      available_quantity,
                      manufacturer,
                      services: services?.map(s => s.id) || [],
                    };
                  })()
                : {}
            }
            isEdit={!!editToolUuid}
          />
        )}
      </SideSheet>
    </div>
  );
}
