'use client';

import ToolsDetailTopBlock from '@/components/sections/ToolsDetailTopBlock';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { QRCodeSection } from '@/components/shared/common/QRCodeSection';
import SideSheet from '@/components/shared/common/SideSheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { APP_CONFIG, ROUTES } from '@/constants/common';
import {
  apiService,
  FetchToolItemsResponse,
  GetToolQuantityStatisticsResponse,
  GetToolResponse,
  Tool,
  ToolItemDetail,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { SearchNormal1 } from 'iconsax-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  AssignedTab,
  AvailableTab,
  LostTab,
  MaintenanceTab,
} from '../components';
import {
  TOOL_DETAIL_ACTION_KEYS,
  TOOL_DETAIL_BREADCRUMB,
  TOOL_DETAIL_DEFAULTS,
  TOOL_DETAIL_LABELS,
  TOOL_DETAIL_MESSAGES,
  TOOL_DETAIL_STATIC,
  TOOL_DETAIL_TAB_STATUS,
} from '../constants';
import { TransformedRowData } from '../types';
// Action icons are provided via constants/tableactions
// duplicate import removed
import { AssignForm } from '@/components/shared/forms/AssignForm';
import { LostForm } from '@/components/shared/forms/LostForm';
import { MaintenanceForm } from '@/components/shared/forms/MaintenanceForm';
import { ReturnForm } from '@/components/shared/forms/ReturnForm';
import ToolDetailSkeleton from '@/components/shared/skeleton/ToolDetailSkeleton';

export default function ToolDetailPage() {
  const params = useParams();
  const { uuid } = params;
  const { handleAuthError } = useAuth();
  const [selectedTab, setSelectedTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<
    null | 'assign' | 'return' | 'maintenance' | 'lost' | 'addMore'
  >(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);

  // Tool data state
  const [toolData, setToolData] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quantity statistics state
  const [quantityStats, setQuantityStats] = useState<
    GetToolQuantityStatisticsResponse['data'] | null
  >(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  // Tool items state - single state for current tab data
  const [toolItemsData, setToolItemsData] = useState<ToolItemDetail[]>([]);
  const [toolItemsLoading, setToolItemsLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  // Function to fetch tool details
  const fetchToolDetails = useCallback(async () => {
    if (!uuid) return;

    try {
      setLoading(true);
      setError(null);

      const toolResponse: GetToolResponse = await apiService.getToolDetails(
        uuid as string
      );

      if (toolResponse.statusCode === 200 && toolResponse.data) {
        setToolData(toolResponse.data);
      } else {
        setError(toolResponse.message || 'Failed to fetch tool details');
      }
    } catch (error: any) {
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        setError(error.message || 'Failed to fetch tool details');
      }
    } finally {
      setLoading(false);
    }
  }, [uuid, handleAuthError]);

  // Function to fetch quantity statistics
  const fetchQuantityStatistics = useCallback(async () => {
    if (!uuid) return;

    try {
      setStatsLoading(true);

      const statsResponse: GetToolQuantityStatisticsResponse =
        await apiService.getToolQuantityStatistics(uuid as string);

      if (statsResponse.statusCode === 200 && statsResponse.data) {
        setQuantityStats(statsResponse.data);
      }
    } catch (error: any) {
      if (error.status === 401) {
        handleAuthError(error);
      }
      // Don't fail the entire request if stats fail, just log the error
    } finally {
      setStatsLoading(false);
    }
  }, [uuid]);

  // Function to fetch tool items for a specific tab
  const fetchToolItemsForTab = useCallback(
    async (tabName: string, searchQuery?: string) => {
      if (!uuid) return;

      try {
        setToolItemsLoading(true);

        const status =
          TOOL_DETAIL_TAB_STATUS[
            tabName.toUpperCase() as keyof typeof TOOL_DETAIL_TAB_STATUS
          ];

        const response: FetchToolItemsResponse =
          await apiService.fetchToolItems({
            tool_uuid: uuid as string,
            status,
            limit: 50, // Adjust as needed
            ...(searchQuery && { search: searchQuery }), // Add search parameter for barcode
          });
        if (response.statusCode === 200 && response.data) {
          setToolItemsData(response.data.toolItems);
        }
      } catch (error: any) {
        if (error.status === 401) {
          handleAuthError(error);
        }
        // Don't fail the entire request if tool items fail, just log the error
      } finally {
        setToolItemsLoading(false);
      }
    },
    [uuid]
  );

  // Common function to update tool item
  const updateToolItem = useCallback(
    async (
      toolItemUuid: string,
      payload: {
        status?: 'available' | 'assigned' | 'maintenance' | 'lost';
        condition?: 'excellent' | 'good' | 'decent' | 'poor';
        assigned_job_id?: string | number;
        assigned_by_id?: string | number;
        returned_by_id?: string | number;
        due_date?: string;
        returned_date?: string;
        assigned_date?: string;
        assigned_status?: 'temporary' | 'permanent';
        issue?: string;
        lost_date?: string;
      }
    ) => {
      try {
        const response = await apiService.updateToolItem(toolItemUuid, payload);

        if (response.statusCode === 200 || response.statusCode === 201) {
          showSuccessToast(
            extractApiSuccessMessage(response, 'Tool updated successfully')
          );
          return true;
        } else {
          showErrorToast(response.message || 'Failed to update tool');
          return false;
        }
      } catch (error: any) {
        if (error.status === 401) {
          handleAuthError(error);
        } else {
          const message = extractApiErrorMessage(
            error,
            'Failed to update tool'
          );
          showErrorToast(message);
        }
        return false;
      }
    },
    [showSuccessToast, showErrorToast, handleAuthError]
  );

  // Reset fetch flag when UUID changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [uuid]);

  // Fetch tool details and quantity statistics on component mount
  useEffect(() => {
    const fetchToolData = async () => {
      if (!uuid || hasFetchedRef.current) return;

      // Mark as fetched to prevent duplicate calls
      hasFetchedRef.current = true;

      // Fetch tool details first
      await fetchToolDetails();

      // Then fetch quantity statistics
      await fetchQuantityStatistics();
    };

    fetchToolData();
  }, [fetchToolDetails, fetchQuantityStatistics]);

  // Debounced search callback
  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      setDebouncedSearchQuery(query);
    },
    500 // 500ms delay
  );

  // Update debounced search when search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Fetch tool items when tab changes or debounced search query changes
  useEffect(() => {
    if (toolData && uuid) {
      fetchToolItemsForTab(selectedTab, debouncedSearchQuery);
    }
  }, [selectedTab, debouncedSearchQuery, toolData, uuid, fetchToolItemsForTab]);

  const [assignDefaults, setAssignDefaults] = useState(
    TOOL_DETAIL_DEFAULTS.ASSIGN
  );
  const [returnDefaults, setReturnDefaults] = useState(
    TOOL_DETAIL_DEFAULTS.RETURN
  );
  const [maintenanceDefaults, setMaintenanceDefaults] = useState(
    TOOL_DETAIL_DEFAULTS.MAINTENANCE
  );
  const [lostDefaults, setLostDefaults] = useState(TOOL_DETAIL_DEFAULTS.LOST);
  const [currentToolItemUuid, setCurrentToolItemUuid] = useState<string>('');

  // Function to search tool item by barcode or ID
  const searchToolItemByIdentifier = useCallback(
    async (identifier: string) => {
      if (!identifier.trim()) return;

      try {
        const response = await apiService.getToolItemByBarcode(
          identifier.trim(),
          uuid as string
        );

        if (response.statusCode === 200 && response.data) {
          const toolItem = response.data;

          const { id: toolId, barcode, condition } = toolItem;
          const toolCondition = condition.toLowerCase();
          // Update assign form with found tool item data
          setAssignDefaults({
            toolName: toolItem.tool?.name || '',
            toolId: toolId.toString() || '',
            barcode: barcode || '',
            condition: toolCondition || '',
            assignDate: '',
            dueDate: '-',
            assignee: '',
            assigneeId: '',
            job: '',
            assignedStatus: '',
            isBarcodeEnabled: false,
            isScanMode: false,
          });

          // Store the tool item UUID for assignment
          setCurrentToolItemUuid(toolItem.uuid);

          showSuccessToast('Tool item found successfully');
        } else {
          showErrorToast('Tool item not found');
        }
      } catch (error: any) {
        if (error.status === 401) {
          handleAuthError(error);
        } else {
          showErrorToast('Failed to search tool item');
        }
      }
    },
    [handleAuthError, showSuccessToast, showErrorToast]
  );

  // Common function to handle dropdown actions
  const handleDropdownAction = async (
    action: string,
    row: TransformedRowData
  ) => {
    const {
      id,
      toolId,
      barcode,
      condition,
      assignedJob,
      dueDate,
      assignedTo,
      assignedJobId,
    } = row;
    console.log('row', { row });
    const { name: toolName } = toolData || {};
    const toolCondition = condition.toLowerCase();
    const { id: assignedToId } = assignedTo || {};

    // Store the tool item UUID for API calls
    setCurrentToolItemUuid(id);

    if (action === TOOL_DETAIL_ACTION_KEYS.ASSIGN) {
      setAssignDefaults({
        toolName: toolName || '-',
        toolId: toolId,
        barcode,
        condition: toolCondition,
        assignDate: '',
        dueDate: '',
        assignee: '',
        assigneeId: '',
        job: assignedJob || '',
        assignedStatus: '',
        isBarcodeEnabled: false, // Disable barcode field when assigning from dropdown
        isScanMode: false,
      });
      setActiveSheet('assign');
      setSideSheetOpen(true);
    } else if (action === TOOL_DETAIL_ACTION_KEYS.RETURN) {
      setReturnDefaults({
        toolName: toolName || '-',
        dueDate: dueDate !== '-' ? dueDate : '', // Use due date from row data, handle '-' case
        toolId: toolId,
        barcode,
        condition: toolCondition,
        returnedDate: new Date().toISOString(),
        returnedById: assignedToId?.toString() || '',
        job: assignedJobId || '',
      });
      setActiveSheet('return');
      setSideSheetOpen(true);
    } else if (action === TOOL_DETAIL_ACTION_KEYS.MAINTENANCE) {
      setMaintenanceDefaults({
        toolName: toolName || '-',
        dueDate: dueDate !== '-' ? dueDate : '-',
        toolId: toolId,
        barcode,
        condition: toolCondition,
        returnedDate: new Date().toISOString(), // Set default to today
        returnedBy: '',
        returnedById: '',
        job: '',
        issues: '', // Default value since it's now required
      });
      setActiveSheet('maintenance');
      setSideSheetOpen(true);
    } else if (action === TOOL_DETAIL_ACTION_KEYS.LOST) {
      setLostDefaults({
        toolName: toolData?.name || TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME,
        dueDate,
        toolId: toolId,
        barcode,
        condition: toolCondition,
        acknowledgeDate: new Date().toISOString(),
        subsEmployees: '',
        subsEmployeesId: '',
        job: '',
        reason: '',
      });
      setActiveSheet('lost');
      setSideSheetOpen(true);
    } else if (action === TOOL_DETAIL_ACTION_KEYS.AVAILABLE) {
      if (!id) {
        showErrorToast('No tool item selected');
        return;
      }

      // Prepare payload for marking tool as available
      const payload = {
        status: 'available' as const,
        condition: toolCondition as 'excellent' | 'good' | 'decent' | 'poor',
      };

      const success = await updateToolItem(id, payload);

      if (success) {
        // Refresh the current tab data
        if (toolData && uuid) {
          fetchToolItemsForTab(selectedTab, searchQuery);
        }
        // Refresh quantity statistics
        fetchQuantityStatistics();
      }
    } else if (action === TOOL_DETAIL_ACTION_KEYS.DETAILS) {
      router.push(`${ROUTES.TOOL_DETAIL}/${uuid}/${id}`);
    }
  };

  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: TOOL_DETAIL_BREADCRUMB.TOOLS, href: ROUTES.TOOLS_MANAGEMENT },
    { name: toolData?.name || TOOL_DETAIL_BREADCRUMB.LOADING },
  ];

  const router = useRouter();

  // Show skeleton while loading
  if (loading) {
    return <ToolDetailSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className='w-full space-y-6'>
        <Breadcrumb items={breadcrumbData} className='mb-4' />
        <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
          <div className='flex items-center justify-center py-8'>
            <div className='text-[var(--error)]'>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show main content when data is loaded
  if (!toolData) {
    return <ToolDetailSkeleton />;
  }

  return (
    <div className='w-full space-y-6'>
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbData} className='mb-4' />

      {/* Main Tool Information Block */}
      <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
        {(() => {
          const {
            image_url,
            name,
            total_quantity,
            video_tutorial_urls,
            video_tutorial_link,
          } = toolData;

          return (
            <ToolsDetailTopBlock
              imageSrc={
                image_url
                  ? `${APP_CONFIG.CDN_URL}${image_url}`
                  : '/images/tools-management/tools-img-1.png'
              }
              title={name}
              quantity={total_quantity || 0}
              videosCount={
                (video_tutorial_urls?.length || 0) +
                (video_tutorial_link?.length || 0)
              }
              videosHref={`${ROUTES.TOOL_VIDEOS_TUTORIAL}/${uuid}`}
              onAssign={() => {
                // Set default values for assign form with enabled Tool ID / Barcode field
                setAssignDefaults({
                  toolName:
                    toolData?.name || TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME,
                  toolId: '',
                  barcode: '',
                  condition: '',
                  assignDate: '',
                  dueDate: '',
                  assignee: '',
                  assigneeId: '',
                  job: '',
                  assignedStatus: '',
                  isBarcodeEnabled: true, // Enable the barcode field
                  isScanMode: false, // Track scan mode
                });
                setActiveSheet('assign');
                setSideSheetOpen(true);
              }}
              onAddMore={() => {
                setActiveSheet('addMore');
                setSideSheetOpen(true);
              }}
            />
          );
        })()}

        {/* Status Tabs and Search - Only show when tool data is loaded */}
        {toolData && (
          <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
            {/* Status Tabs */}
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className='w-full mb-4'
            >
              <div className='flex flex-col lg:flex-row gap-3 flex-wrap sm:gap-4 items-start lg:items-center justify-between w-full'>
                <div className='flex flex-row items-center gap-2 w-fit overflow-auto max-w-[calc(100vw_-_84px)]'>
                  {/* <DynamicScrollArea className='w-full'> */}
                  <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                    <TabsTrigger
                      value='available'
                      className='px-6 lg:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>
                          {TOOL_DETAIL_LABELS.TABS.AVAILABLE}
                        </span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'available' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--success)]'}`}
                        >
                          {statsLoading
                            ? '...'
                            : quantityStats?.available_quantity || 0}
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='assigned'
                      className='px-6 lg:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>
                          {TOOL_DETAIL_LABELS.TABS.ASSIGNED}
                        </span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'assigned' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--text-secondary)]'}`}
                        >
                          {statsLoading
                            ? '...'
                            : quantityStats?.assigned_quantity || 0}
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='maintenance'
                      className='px-6 lg:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>
                          {TOOL_DETAIL_LABELS.TABS.MAINTENANCE}
                        </span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'maintenance' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--error)]'}`}
                        >
                          {statsLoading
                            ? '...'
                            : quantityStats?.maintenance_quantity || 0}
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='lost'
                      className='px-6 lg:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>
                          {TOOL_DETAIL_LABELS.TABS.LOST}
                        </span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'lost' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--info)]'}`}
                        >
                          {statsLoading
                            ? '...'
                            : quantityStats?.lost_quantity || 0}
                        </Badge>
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  {/* </DynamicScrollArea> */}
                </div>
                {/* Search Bar */}
                <div className='relative w-full sm:w-auto lg:w-[360px] ml-auto'>
                  <SearchNormal1
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]'
                    color='var(--primary)'
                    size={20}
                  />
                  <Input
                    placeholder={TOOL_DETAIL_LABELS.MESSAGES.SEARCH_PLACEHOLDER}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='pl-10 pr-4 w-full sm:w-auto lg:w-[360px] h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
                  />
                </div>
              </div>

              {/* Tab Content */}
              <TabsContent value='available' className='mt-6'>
                <AvailableTab
                  data={toolItemsData}
                  loading={toolItemsLoading}
                  onDropdownAction={handleDropdownAction}
                />
              </TabsContent>

              <TabsContent value='assigned' className='mt-6'>
                <AssignedTab
                  data={toolItemsData}
                  loading={toolItemsLoading}
                  onDropdownAction={handleDropdownAction}
                />
              </TabsContent>

              <TabsContent value='maintenance' className='mt-6'>
                <MaintenanceTab
                  data={toolItemsData}
                  loading={toolItemsLoading}
                  onDropdownAction={handleDropdownAction}
                />
              </TabsContent>

              <TabsContent value='lost' className='mt-6'>
                <LostTab
                  data={toolItemsData}
                  loading={toolItemsLoading}
                  onDropdownAction={handleDropdownAction}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Unified SideSheet */}
        <SideSheet
          open={sideSheetOpen}
          onOpenChange={open => {
            setSideSheetOpen(open);
            if (!open) setActiveSheet(null);
          }}
          title={
            activeSheet === 'assign'
              ? TOOL_DETAIL_MESSAGES.CONFIRMATION.ASSIGN_TITLE
              : activeSheet === 'return'
                ? TOOL_DETAIL_MESSAGES.CONFIRMATION.RETURN_TITLE
                : activeSheet === 'maintenance'
                  ? TOOL_DETAIL_MESSAGES.CONFIRMATION.MAINTENANCE_TITLE
                  : activeSheet === 'lost'
                    ? TOOL_DETAIL_MESSAGES.CONFIRMATION.LOST_TITLE
                    : TOOL_DETAIL_MESSAGES.CONFIRMATION.ADD_MORE_TITLE
          }
          size='600px'
        >
          {activeSheet === 'addMore' && (
            <>
              <QRCodeSection
                barcodes={barcodes}
                onBarcodesChange={setBarcodes}
              />
              <div className='flex gap-3 items-center pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setSideSheetOpen(false)}
                  className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                >
                  {TOOL_DETAIL_LABELS.BUTTONS.CANCEL}
                </Button>
                <Button
                  onClick={async () => {
                    if (!uuid || barcodes.length === 0) {
                      showErrorToast(
                        TOOL_DETAIL_MESSAGES.ERROR.ADD_BARCODE_REQUIRED
                      );
                      return;
                    }

                    try {
                      if (!uuid) {
                        showErrorToast(
                          TOOL_DETAIL_MESSAGES.ERROR.TOOL_ID_NOT_FOUND
                        );
                        return;
                      }

                      // Add all barcodes in a single API call
                      const response = await apiService.addToolItemBarcodes(
                        uuid as string,
                        { barcodes }
                      );

                      if (
                        response.statusCode === 200 ||
                        response.statusCode === 201
                      ) {
                        // Handle detailed response with success/error breakdown
                        const { data } = response;
                        const { successful, failed } = data.summary;

                        if (successful > 0 && failed === 0) {
                          // All barcodes added successfully
                          showSuccessToast(
                            `${TOOL_DETAIL_MESSAGES.SUCCESS.BARCODES_ADDED} (${successful} barcode${successful > 1 ? 's' : ''})`
                          );
                        } else if (successful > 0 && failed > 0) {
                          // Some barcodes added, some failed
                          showSuccessToast(
                            `${successful} ${TOOL_DETAIL_MESSAGES.SUCCESS.BARCODES_PARTIAL}`
                          );
                        } else if (successful === 0 && failed > 0) {
                          // All barcodes failed
                          showErrorToast(
                            `${TOOL_DETAIL_MESSAGES.SUCCESS.BARCODES_ALL_EXIST} (${failed} barcode${failed > 1 ? 's' : ''})`
                          );
                        } else {
                          // Fallback success message
                          showSuccessToast(
                            TOOL_DETAIL_MESSAGES.SUCCESS.BARCODES_ADDED
                          );
                        }

                        setSideSheetOpen(false);
                        setBarcodes([]); // Reset barcodes state

                        // Refresh tool data
                        await fetchToolDetails();

                        // Refresh quantity statistics
                        await fetchQuantityStatistics();
                      } else {
                        showErrorToast(
                          response.message ||
                            TOOL_DETAIL_MESSAGES.ERROR.ADD_BARCODE_FAILED
                        );
                      }
                    } catch (error: any) {
                      if (error.status === 401) {
                        handleAuthError(error);
                      } else {
                        // Use the error message from the API response if available
                        const errorMessage =
                          error.message ||
                          error.details?.message ||
                          TOOL_DETAIL_MESSAGES.ERROR.ADD_BARCODE_FAILED;
                        showErrorToast(errorMessage);
                      }
                    }
                  }}
                  className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                >
                  {TOOL_DETAIL_LABELS.BUTTONS.ADD}
                </Button>
              </div>
            </>
          )}

          {activeSheet === 'assign' && (
            <AssignForm
              defaultValues={assignDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onBarcodeSearch={searchToolItemByIdentifier}
              onScanModeToggle={(isScanMode: boolean) => {
                if (isScanMode) {
                  setAssignDefaults(prev => ({
                    ...prev,
                    isScanMode,
                    isBarcodeEnabled: true,
                    barcode: '',
                  }));
                } else {
                  setAssignDefaults(prev => ({ ...prev, isScanMode: false }));
                }
              }}
              onSubmit={async vals => {
                if (!currentToolItemUuid) {
                  showErrorToast('No tool item selected for assignment');
                  return;
                }
                console.log('vals', { vals });
                // Prepare payload for tool assignment
                const payload = {
                  status: 'assigned' as const,
                  condition: vals.condition as
                    | 'excellent'
                    | 'good'
                    | 'decent'
                    | 'poor',
                  assigned_job_id: vals.job,
                  assigned_by_id: parseInt(vals.assigneeId),
                  due_date: vals.dueDate,
                  assigned_date: vals.assignDate,
                  assigned_status: vals.assignedStatus as
                    | 'temporary'
                    | 'permanent',
                };

                const success = await updateToolItem(
                  currentToolItemUuid,
                  payload
                );

                if (success) {
                  setSideSheetOpen(false);
                  // Refresh the current tab data
                  if (toolData && uuid) {
                    fetchToolItemsForTab(selectedTab, debouncedSearchQuery);
                  }
                  // Refresh quantity statistics
                  fetchQuantityStatistics();
                }
              }}
            />
          )}

          {activeSheet === 'return' && (
            <ReturnForm
              defaultValues={returnDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={async vals => {
                if (!currentToolItemUuid) {
                  showErrorToast('No tool item selected for return');
                  return;
                }

                // Prepare payload for tool return
                const payload = {
                  status: 'available' as const,
                  condition: vals.condition as
                    | 'excellent'
                    | 'good'
                    | 'decent'
                    | 'poor',
                  returned_by_id: parseInt(vals.returnedById),
                  returned_date: vals.returnedDate,
                };

                const success = await updateToolItem(
                  currentToolItemUuid,
                  payload
                );

                if (success) {
                  setSideSheetOpen(false);
                  // Refresh the current tab data
                  if (toolData && uuid) {
                    fetchToolItemsForTab(selectedTab, debouncedSearchQuery);
                  }
                  // Refresh quantity statistics
                  fetchQuantityStatistics();
                }
              }}
            />
          )}

          {activeSheet === 'maintenance' && (
            <MaintenanceForm
              defaultValues={maintenanceDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={async vals => {
                if (!currentToolItemUuid) {
                  showErrorToast('No tool item selected for maintenance');
                  return;
                }

                // Prepare payload for tool maintenance
                const payload = {
                  status: 'maintenance' as const,
                  condition: vals.condition as
                    | 'excellent'
                    | 'good'
                    | 'decent'
                    | 'poor',
                  returned_by_id: parseInt(vals.returnedById),
                  returned_date: vals.returnedDate,
                  assigned_job_id: vals.job, // Include the job ID
                  issue: vals.issues || '',
                };

                const success = await updateToolItem(
                  currentToolItemUuid,
                  payload
                );

                if (success) {
                  setSideSheetOpen(false);
                  // Refresh the current tab data
                  if (toolData && uuid) {
                    fetchToolItemsForTab(selectedTab, debouncedSearchQuery);
                  }
                  // Refresh quantity statistics
                  fetchQuantityStatistics();
                }
              }}
            />
          )}

          {activeSheet === 'lost' && (
            <LostForm
              defaultValues={lostDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={async vals => {
                const {
                  acknowledgeDate,
                  reason,
                  job,
                  subsEmployeesId,
                  condition,
                } = vals;
                if (!currentToolItemUuid) {
                  showErrorToast('No tool item selected for lost status');
                  return;
                }

                // Prepare payload for marking tool as lost
                const payload = {
                  status: 'lost' as const,
                  condition: condition as
                    | 'excellent'
                    | 'good'
                    | 'decent'
                    | 'poor',
                  assigned_job_id: job,
                  assigned_by_id: parseInt(subsEmployeesId),
                  lost_date: acknowledgeDate,
                  issue: reason,
                };

                const success = await updateToolItem(
                  currentToolItemUuid,
                  payload
                );

                if (success) {
                  setSideSheetOpen(false);
                  // Refresh the current tab data
                  if (toolData && uuid) {
                    fetchToolItemsForTab(selectedTab, debouncedSearchQuery);
                  }
                  // Refresh quantity statistics
                  fetchQuantityStatistics();
                }
              }}
            />
          )}
        </SideSheet>
      </div>
    </div>
  );
}
