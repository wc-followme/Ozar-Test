'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS } from '@/constants/common';
import { apiService, CreateToolRequest, Tool } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
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
  useEffect(() => {
    const loadTools = async () => {
      console.log('loadTools called, user:', user);
      console.log('user?.company_id:', user?.company_id);

      if (!user) {
        console.log('User not available yet, waiting...');
        return; // Don't set loading to false, wait for user to load
      }

      setLoading(true);
      try {
        console.log('Making API call WITHOUT company_id');
        const response = await apiService.fetchTools({
          page: 1,
          limit: 50,
        });

        console.log('API response:', response);
        if (response.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = response.data;
          if (
            response.data &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data) &&
            'data' in response.data
          ) {
            toolsData = (response.data as any).data;
          }
          console.log('Tools data to set:', toolsData);
          setTools(Array.isArray(toolsData) ? toolsData : []);
        } else {
          showErrorToast(
            extractApiErrorMessage(response.message) || 'Failed to load tools'
          );
        }
      } catch (error: any) {
        console.error('Error loading tools:', error);
        if (error.status === 401) {
          handleAuthError(error);
        } else {
          showErrorToast(
            extractApiErrorMessage(error.message) || 'Failed to load tools'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [user, showErrorToast, handleAuthError]);

  const handleDelete = async (uuid: string) => {
    try {
      const response = await apiService.deleteTool(uuid);
      if (response.statusCode === 200) {
        showSuccessToast(response.message || TOOL_MESSAGES.DELETE_SUCCESS);
        setTools(tools.filter(tool => tool.uuid !== uuid));
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.DELETE_ERROR
        );
      }
    } catch (error: any) {
      console.error('Delete tool error:', error);
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.DELETE_ERROR
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
      if (response.statusCode === 200 && response.data) {
        setEditToolData(response.data);
        // Check if tool_assets exists in the response
        const toolAssetsValue = response.data.tool_assets;

        // Check if we need to extract tool_assets from assets array
        let finalToolAssets = toolAssetsValue;
        if (
          !toolAssetsValue &&
          response.data.assets &&
          response.data.assets.length > 0 &&
          response.data.assets[0]?.media_url
        ) {
          // If tool_assets is empty but assets array has items, use the first asset's media_url
          finalToolAssets = response.data.assets[0].media_url;
        }

        setOriginalToolAssets(finalToolAssets ?? '');
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.FETCH_ERROR
        );
      }
    } catch (error) {
      console.error('Error fetching tool details:', error);
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
    setFormLoading(true);
    try {
      const payload: CreateToolRequest = {
        name: data.name,
        available_quantity: data.available_quantity,
        manufacturer: data.manufacturer,
        tool_assets: fileKey,
        service_ids: data.service_ids,
      };

      const response = await apiService.createTool(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(response.message || TOOL_MESSAGES.CREATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        setFileKey('');
        // Refresh tools list - use the same API call as initial load
        const refreshResponse = await apiService.fetchTools({
          page: 1,
          limit: 50,
        });
        if (refreshResponse.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshResponse.data;
          if (
            refreshResponse.data &&
            typeof refreshResponse.data === 'object' &&
            !Array.isArray(refreshResponse.data) &&
            'data' in refreshResponse.data
          ) {
            toolsData = (refreshResponse.data as any).data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } catch (error: any) {
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.CREATE_ERROR
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
        name: data.name,
        available_quantity: data.available_quantity,
        manufacturer: data.manufacturer,
        tool_assets: toolAssets,
        service_ids: data.service_ids,
      };

      const response = await apiService.updateTool(editToolUuid!, payload);

      if (response.statusCode === 200) {
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
          limit: 50,
        });
        if (refreshResponse.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshResponse.data;
          if (
            refreshResponse.data &&
            typeof refreshResponse.data === 'object' &&
            !Array.isArray(refreshResponse.data) &&
            'data' in refreshResponse.data
          ) {
            toolsData = (refreshResponse.data as any).data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } catch (error: any) {
      console.error('Error updating tool:', error);
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.UPDATE_ERROR
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

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {tools.map((tool, index) => {
            const imageUrl =
              tool.assets && tool.assets[0]?.media_url
                ? cdnPrefix + tool.assets[0].media_url
                : '/images/img-placeholder-sm.png';
            return (
              <ToolCard
                key={tool.id ?? `${tool.name}-${tool.manufacturer}-${index}`}
                image={imageUrl}
                name={tool.name}
                brand={tool.manufacturer}
                quantity={tool.available_quantity}
                videoCount={0} // Static 0 for now as requested
                menuOptions={menuOptions}
                onDelete={() => handleDelete(tool.uuid)}
                onEdit={() => handleEdit(tool.uuid)}
              />
            );
          })}
        </div>
      ) : (
        <NoDataFound
          title='No Tools Found'
          description="You haven't created any tools yet. Start by adding your first one to organize your tools."
          buttonText='Create Tool'
          onButtonClick={handleOpenCreateForm}
          showButton={canEdit ?? false}
        />
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
                : editToolData &&
                    editToolData.assets &&
                    editToolData.assets[0]?.media_url
                  ? cdnPrefix + editToolData.assets[0].media_url
                  : undefined
            }
            existingToolAssets={imageDeleted ? '' : originalToolAssets}
            initialValues={
              editToolData
                ? {
                    name: editToolData.name,
                    available_quantity: editToolData.available_quantity,
                    manufacturer: editToolData.manufacturer,
                    services: editToolData.services?.map(s => s.id) || [],
                  }
                : {}
            }
            isEdit={!!editToolUuid}
          />
        )}
      </SideSheet>
    </div>
  );
}
