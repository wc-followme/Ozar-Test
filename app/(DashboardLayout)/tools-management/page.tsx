'use client';

import AccessDenied from '@/components/shared/common/AccessDenied';
import SideSheet from '@/components/shared/common/SideSheet';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, APP_CONFIG, PAGINATION } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { useCompanyChange } from '@/hooks/use-company-change';
import {
  apiService,
  CreateToolRequest,
  Tool,
  UpdateToolRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Refresh, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ToolCardSkeleton from '../../../components/shared/skeleton/ToolCardSkeleton';
import ArchiveTab from './components/ArchiveTab';
import ToolsTab from './components/ToolsTab';
import { TOOL_MESSAGES } from './tool-messages';

export default function ToolsManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editToolUuid, setEditToolUuid] = useState<string | null>(null);
  const [editToolData, setEditToolData] = useState<Tool | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Track if the existing image has been deleted
  const [imageDeleted, setImageDeleted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('tools');

  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError, user } = useAuth();

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;
  const canViewTools = userPermissions?.tools?.view;

  // Memoize menu options based on selected tab
  const menuOptions = useMemo(
    () =>
      selectedTab === 'archive'
        ? [
            {
              label: 'Retrieve Tool',
              action: ACTIONS.RETRIEVE,
              icon: Refresh,
              variant: 'default' as const,
            },
          ]
        : [
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
    [selectedTab]
  );

  // No local CDN variable; use APP_CONFIG.CDN_URL directly where needed

  // Load tools from API based on current tab
  const loadTools = useCallback(
    async (targetPage = 1, append = false) => {
      if (!user) {
        return; // Don't fetch if user is not available yet
      }

      if (targetPage === 1) {
        setLoading(true);
      }

      try {
        // Get selected company ID using common function
        const companyId = getCompanyId();

        const response = await apiService.fetchTools({
          page: targetPage,
          limit: PAGINATION.TOOLS_LIMIT,
          status: selectedTab === 'archive' ? 'INACTIVE' : 'ACTIVE',
          ...(companyId ? { company_id: companyId } : {}),
        });

        const { statusCode, data, message } = response;

        if (statusCode === 200) {
          // Handle possible response structures
          // Legacy: data: Tool[]
          // Old nested: data: { data: Tool[], total }
          // New: data: { tools: Tool[], total, page, limit, totalPages }
          let toolsData: unknown = [];
          let total = 0;

          if (Array.isArray(data)) {
            toolsData = data;
            total = data.length;
          } else if (data && typeof data === 'object') {
            const obj = data as unknown as Record<string, unknown>;
            if (Array.isArray(obj['tools'])) {
              toolsData = obj['tools'];
              total =
                (obj['total'] as number) || (obj['tools'] as unknown[]).length;
            } else if (
              obj['data'] &&
              Array.isArray((obj['data'] as any).data)
            ) {
              const nested = obj['data'] as { data: unknown[]; total?: number };
              toolsData = nested.data;
              total = nested.total ?? nested.data.length;
            }
          }

          setTools(prev => {
            if (append) {
              const existingUuids = new Set(prev.map(tool => tool.uuid));
              const uniqueNewTools = (toolsData as Tool[]).filter(
                (tool: Tool) => !existingUuids.has(tool.uuid)
              );
              return [...prev, ...uniqueNewTools];
            }
            return Array.isArray(toolsData) ? (toolsData as Tool[]) : [];
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
    [user, showErrorToast, handleAuthError, selectedTab]
  );

  // Handle company changes
  const refetchTools = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setTools([]);
    loadTools(1, false);
  }, [loadTools]);

  useCompanyChange(refetchTools);

  // Load tools when component mounts or tab changes
  useEffect(() => {
    if (user) {
      setTools([]);
      setPage(1);
      setHasMore(true);
      loadTools(1, false);
    }
  }, [selectedTab, user, loadTools]);

  const handleDelete = async (uuid: string) => {
    try {
      const response = await apiService.deleteTool(uuid);
      const { statusCode, message } = response;

      if (statusCode === 200) {
        showSuccessToast(message || TOOL_MESSAGES.DELETE_SUCCESS);
        setTools(prev => prev.filter(tool => tool.uuid !== uuid));
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
    setImageDeleted(true);
  };

  // Retrieve tool handler (for archived tools)
  const handleRetrieveTool = async (uuid: string) => {
    try {
      const response = await apiService.updateTool(uuid, { status: 'ACTIVE' });
      const { statusCode, message } = response;

      if (statusCode === 200) {
        showSuccessToast(message || 'Tool retrieved successfully');
        // Update local state - remove tool from current list (archive tab)
        setTools(prev => prev.filter(tool => tool.uuid !== uuid));
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || 'Failed to retrieve tool'
        );
      }
    } catch (error: any) {
      const { status } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(extractApiErrorMessage(error));
      }
    }
  };

  const handleEdit = async (uuid: string) => {
    // Find tool data from current state instead of API call
    const toolData = tools.find(tool => tool.uuid === uuid);

    if (!toolData) {
      showErrorToast('Tool not found');
      return;
    }

    setEditToolUuid(uuid);
    setEditLoading(false); // No loading needed since we have data
    setSideSheetOpen(true);
    setImageDeleted(false);
    setEditToolData(toolData);
  };

  const handleCreateTool = async (data: {
    name: string;
    brandName: string;
    image_url: string;
    service_ids: string;
    video_tutorial_urls?: string[];
    video_tutorial_links?: string[];
    barcodes?: string[];
  }) => {
    const {
      name,
      brandName,
      service_ids,
      image_url,
      video_tutorial_urls,
      video_tutorial_links,
      barcodes,
    } = data;

    console.log('=== CREATE TOOL PAYLOAD DATA ===');
    console.log('Form data:', data);
    console.log('Video tutorial URLs:', video_tutorial_urls);
    console.log('Video tutorial links:', video_tutorial_links);
    console.log('Barcodes:', barcodes);

    setFormLoading(true);
    try {
      // Get selected company ID using common function
      const companyId = getCompanyId();

      const payload: CreateToolRequest = {
        name: name.trim(),
        brand_name: brandName.trim(),
        service_ids,
        ...(companyId ? { company_id: companyId } : {}),
        image_url: image_url || '',
        video_tutorial_urls: video_tutorial_urls || [],
        video_tutorial_link: video_tutorial_links || [],
        barcodes: barcodes || [],
      };

      console.log('Final create payload:', payload);
      console.log('================================');

      const response = await apiService.createTool(payload);
      const { statusCode, message } = response;

      if (statusCode === 200 || statusCode === 201) {
        showSuccessToast(message || TOOL_MESSAGES.CREATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        // Refresh tools list using existing loadTools function
        await loadTools(1, false);
      } else {
        showErrorToast(message);
      }
    } catch (error: any) {
      const { status } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(extractApiErrorMessage(error));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTool = async (data: {
    name: string;
    brandName: string;
    image_url: string;
    service_ids: string;
    video_tutorial_urls?: string[];
    video_tutorial_links?: string[];
    barcodes?: string[];
  }) => {
    const {
      name,
      brandName,
      service_ids,
      image_url,
      video_tutorial_urls,
      video_tutorial_links,
      barcodes,
    } = data;

    console.log('=== UPDATE TOOL PAYLOAD DATA ===');
    console.log('Form data:', data);
    console.log('Video tutorial URLs:', video_tutorial_urls);
    console.log('Video tutorial links:', video_tutorial_links);
    console.log('Barcodes:', barcodes);

    // No guard needed based on legacy assets shape

    setFormLoading(true);
    try {
      const payload: UpdateToolRequest = {
        name: name.trim(),
        brand_name: brandName.trim(),
        service_ids,
        image_url: image_url || '',
        video_tutorial_urls: video_tutorial_urls || [],
        video_tutorial_link: video_tutorial_links || [],
        barcodes: barcodes || [],
      };

      console.log('Final update payload:', payload);
      console.log('================================');

      const response = await apiService.updateTool(editToolUuid!, payload);

      const { statusCode, message } = response;

      if (statusCode === 200 && response.data) {
        showSuccessToast(message || TOOL_MESSAGES.UPDATE_SUCCESS);

        // Update local state using the actual API response data
        const updatedToolData = response.data;
        setTools(prev =>
          prev.map(tool =>
            tool.uuid === editToolUuid
              ? ({
                  ...tool,
                  ...updatedToolData,
                } as Tool)
              : tool
          )
        );

        setSideSheetOpen(false);
        setPhoto(null);
        setEditToolUuid(null);
        setEditToolData(null);
        setImageDeleted(false);
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } catch (error: any) {
      const { status } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(extractApiErrorMessage(error));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setSideSheetOpen(false);
    setPhoto(null);
    setEditToolUuid(null);
    setEditToolData(null);
    setImageDeleted(false);
  };

  const handleOpenCreateForm = () => {
    // Reset all state for create mode
    setPhoto(null);
    setEditToolUuid(null);
    setEditToolData(null);
    setImageDeleted(false);
    setSideSheetOpen(true);
  };

  // Check if user has permission to view tools
  if (userPermissions && !canViewTools) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.TOOL_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.TOOL_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.TOOL_DETAILS_REDIRECT_TEXT}
      />
    );
  }

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
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>Tools Management</h2>
        </div>
      </div>

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex sm:flex-row flex-col-reverse items-center justify-between sm:gap-3'>
            <TabsList className='grid w-full sm:max-w-[328px] grid-cols-2 bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='tools'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Tools
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
              {canEdit && (
                <button
                  onClick={handleOpenCreateForm}
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                >
                  <Add
                    size='24'
                    color='var(--icon-dark)'
                    className='sm:hidden'
                  />
                  <span className='hidden sm:inline'>Add Tool</span>
                </button>
              )}
            </div>
          </div>

          {/* Tools Tab Content */}
          <TabsContent value='tools' className='mt-6'>
            <ToolsTab
              tools={tools}
              loading={loading}
              hasMore={hasMore}
              selectedTab={selectedTab}
              menuOptions={menuOptions}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onOpenCreateForm={handleOpenCreateForm}
              canEdit={canEdit ?? false}
              loadTools={loadTools}
              setPage={setPage}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveTab
              archivedTools={tools}
              archivedLoading={loading}
              archiveHasMore={hasMore}
              selectedTab={selectedTab}
              menuOptions={menuOptions}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onRetrieve={handleRetrieveTool}
              onOpenCreateForm={handleOpenCreateForm}
              canEdit={canEdit ?? false}
              loadTools={loadTools}
              setArchivePage={setPage}
            />
          </TabsContent>
        </Tabs>
      </div>

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
            existingImageUrl={
              imageDeleted
                ? undefined
                : (editToolData as any)?.image_url
                  ? APP_CONFIG.CDN_URL + (editToolData as any).image_url
                  : undefined
            }
            initialValues={
              editToolData
                ? (() => {
                    const {
                      name,
                      brand_name,
                      services,
                      video_tutorial_urls,
                      video_tutorial_link,
                      tool_items,
                    } = editToolData as any;

                    // Keep video tutorial URLs and links separate
                    const existingVideoUrls = (video_tutorial_urls || []).map(
                      (url: string) => APP_CONFIG.CDN_URL + url
                    ); // Prefix S3 paths for display
                    const existingVideoLinks = video_tutorial_link || [];

                    // Extract existing barcodes with toolId information
                    const existingToolIds =
                      tool_items?.map((item: any) => ({
                        id: item.uuid,
                        toolId: item.id?.toString() || '-',
                        barcode: item.barcode || '',
                      })) || [];

                    return {
                      name: name ?? '',
                      brandName: brand_name ?? '',
                      services: services?.map((s: any) => s.id) || [],
                      videos: existingVideoUrls, // Existing S3 video URLs with CDN prefix
                      videoLinks: existingVideoLinks, // Existing external links
                      toolIds: existingToolIds, // Existing barcodes with toolId
                      image_url: (editToolData as any)?.image_url || '', // Existing image URL
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
