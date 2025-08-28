'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_CONFIG, ROUTES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { SearchNormal1 } from 'iconsax-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import LoadingComponent from '../../../../../../components/shared/common/LoadingComponent';

// Lazy load components
const ToolDetailSkeleton = dynamic(
  () => import('@/components/shared/skeleton/ToolDetailSkeleton')
);
const BorrowedHistoryTab = dynamic(() =>
  import('../../components').then(mod => ({ default: mod.BorrowedHistoryTab }))
);
const MaintenanceHistoryTab = dynamic(() =>
  import('../../components').then(mod => ({
    default: mod.MaintenanceHistoryTab,
  }))
);

export default function ToolDetailSlugPage() {
  const params = useParams();
  const { uuid, toolUuid } = params;
  const { handleAuthError } = useAuth();
  const [selectedTab, setSelectedTab] = useState('borrowed');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Tool item data state
  const [toolItemData, setToolItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // History data state
  const [borrowedHistoryData, setBorrowedHistoryData] = useState<any[]>([]);
  const [maintenanceHistoryData, setMaintenanceHistoryData] = useState<any[]>(
    []
  );
  const [historyLoading, setHistoryLoading] = useState(false);

  // History counts state
  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [maintenanceCount, setMaintenanceCount] = useState<number>(0);
  const [countsLoading, setCountsLoading] = useState(false);

  // Pagination state for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [_totalPages, setTotalPages] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Refs to prevent duplicate API calls
  const hasFetchedToolDetails = useRef(false);
  const hasFetchedCounts = useRef(false);

  // Function to fetch tool item details
  const fetchToolItemDetails = useCallback(async () => {
    if (!toolUuid || hasFetchedToolDetails.current) return;

    try {
      hasFetchedToolDetails.current = true;
      setLoading(true);
      setError(null);

      const response = await apiService.getToolItemDetail(toolUuid as string);

      if (response.statusCode === 200 && response.data) {
        setToolItemData(response.data);
      } else {
        setError(response.message || 'Failed to fetch tool item details');
      }
    } catch (error: any) {
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        setError(error.message || 'Failed to fetch tool item details');
      }
    } finally {
      setLoading(false);
    }
  }, [toolUuid, handleAuthError]);

  // Function to fetch history counts
  const fetchHistoryCounts = useCallback(async () => {
    if (!toolItemData?.id || hasFetchedCounts.current) return;

    try {
      hasFetchedCounts.current = true;
      setCountsLoading(true);

      // Fetch history statistics using new API (without search parameter)
      const statisticsResponse = await apiService.getToolHistoryStatistics({
        toolItemId: toolItemData.id,
      });

      if (statisticsResponse.statusCode === 200 && statisticsResponse.data) {
        const { borrowedCount, maintenanceCount } = statisticsResponse.data;
        setBorrowedCount(borrowedCount || 0);
        setMaintenanceCount(maintenanceCount || 0);
      }
    } catch (error: any) {
      if (error.status === 401) {
        handleAuthError(error);
      }
    } finally {
      setCountsLoading(false);
    }
  }, [toolItemData?.id, handleAuthError]);

  // Function to fetch history data for selected tab with pagination
  const fetchHistoryData = useCallback(
    async (
      tabName: string,
      searchQuery?: string,
      page: number = 1,
      isLoadMore: boolean = false
    ) => {
      if (!toolItemData?.id) return;

      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setHistoryLoading(true);
        }

        if (tabName === 'borrowed') {
          // Fetch borrowed history using new API with pagination and sorting
          const borrowedResponse = await apiService.getBorrowedHistory({
            page,
            limit: 10, // Fixed limit for pagination
            toolItemId: toolItemData.id,
            ...(searchQuery && { search: searchQuery }), // Add search parameter conditionally
          });
          if (borrowedResponse.statusCode === 200 && borrowedResponse.data) {
            const {
              data,
              total,
              page: responsePage,
              limit: responseLimit,
            } = borrowedResponse.data;

            // Calculate total pages from total and limit
            const calculatedTotalPages = Math.ceil(total / responseLimit);

            if (isLoadMore) {
              // Append new data for infinite scroll
              setBorrowedHistoryData(prev => [...prev, ...(data || [])]);
            } else {
              // Replace data for new search or tab change
              setBorrowedHistoryData(data || []);
            }

            setCurrentPage(responsePage || page);
            setTotalPages(calculatedTotalPages);
            setHasMoreData((responsePage || page) < calculatedTotalPages);
          }
        } else if (tabName === 'maintenance') {
          // Fetch maintenance history using new API with pagination and sorting
          const maintenanceResponse = await apiService.getMaintenanceHistory({
            page,
            limit: 10, // Fixed limit for pagination
            toolItemId: toolItemData.id,
            sort_by: 'updated_at', // Sort by update date
            sort_order: 'DESC', // Latest first (descending order)
            ...(searchQuery && { search: searchQuery }), // Add search parameter conditionally
          });
          if (
            maintenanceResponse.statusCode === 200 &&
            maintenanceResponse.data
          ) {
            const {
              data,
              total,
              page: responsePage,
              limit: responseLimit,
            } = maintenanceResponse.data;

            // Calculate total pages from total and limit
            const calculatedTotalPages = Math.ceil(total / responseLimit);

            if (isLoadMore) {
              // Append new data for infinite scroll
              setMaintenanceHistoryData(prev => [...prev, ...(data || [])]);
            } else {
              // Replace data for new search or tab change
              setMaintenanceHistoryData(data || []);
            }

            setCurrentPage(responsePage || page);
            setTotalPages(calculatedTotalPages);
            setHasMoreData((responsePage || page) < calculatedTotalPages);
          }
        }
      } catch (error: any) {
        if (error.status === 401) {
          handleAuthError(error);
        }
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setHistoryLoading(false);
        }
      }
    },
    [toolItemData?.id, handleAuthError]
  );

  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!hasMoreData || isLoadingMore || !selectedTab) return;

    const nextPage = currentPage + 1;
    await fetchHistoryData(selectedTab, debouncedSearchQuery, nextPage, true);
  }, [
    hasMoreData,
    isLoadingMore,
    selectedTab,
    currentPage,
    debouncedSearchQuery,
    fetchHistoryData,
  ]);

  // Function to reset pagination when tab or search changes
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setHasMoreData(true);
    setIsLoadingMore(false);
  }, []);

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

  // Reset fetch flags when toolUuid changes
  useEffect(() => {
    hasFetchedToolDetails.current = false;
    hasFetchedCounts.current = false;
  }, [toolUuid]);

  // Fetch tool item details on component mount
  useEffect(() => {
    fetchToolItemDetails();
  }, [fetchToolItemDetails]);

  // Fetch history counts after tool item details are loaded
  useEffect(() => {
    if (toolItemData) {
      fetchHistoryCounts();
    }
  }, [toolItemData, fetchHistoryCounts]);

  // Fetch history data when tab changes or search query changes
  useEffect(() => {
    if (toolItemData && selectedTab) {
      resetPagination();
      fetchHistoryData(selectedTab, debouncedSearchQuery, 1, false);
    }
  }, [
    selectedTab,
    toolItemData,
    debouncedSearchQuery,
    fetchHistoryData,
    resetPagination,
  ]);

  // Infinite scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Trigger 1000px before bottom
      ) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData]);
  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Tools', href: ROUTES.TOOLS_MANAGEMENT },
    {
      name: toolItemData?.tool?.name || 'Loading...',
      href: `${ROUTES.TOOL_DETAIL}/${uuid}`,
    },
    { name: toolItemData?.barcode || toolUuid },
  ];

  // Show loading state
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
  if (!toolItemData) {
    return (
      <div className='w-full space-y-6'>
        <Breadcrumb items={breadcrumbData} className='mb-4' />
        <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
          <div className='flex items-center justify-center py-8'>
            <div className='text-[var(--error)]'>Tool item not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full space-y-6'>
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbData} className='mb-4' />

      {/* Main Tool Information Block */}
      <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
        <div className='flex items-start gap-6 mb-4'>
          {/* Tool Image */}
          <div className='w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
            <Image
              src={
                toolItemData.tool?.image_url
                  ? `${APP_CONFIG.CDN_URL}${toolItemData.tool.image_url}`
                  : ''
              }
              alt={toolItemData.tool?.name || 'Tool'}
              className='w-full h-full object-cover'
              height={80}
              width={80}
            />
          </div>

          {/* Tool Info */}
          <div className='flex-1'>
            <h1 className='text-lg font-bold text-[var(--text-dark)]'>
              {toolItemData.tool?.name || 'Unknown Tool'}
            </h1>

            {/* Tool ID / Barcode */}
            <div className='mb-4'>
              <span className='text-sm text-[var(--text-secondary)]'>
                Tool ID / Barcode
              </span>
              <p className='text-base font-normal text-[var(--text-dark)]'>
                {toolItemData.id} / {toolItemData.barcode}
              </p>
            </div>
          </div>
        </div>

        {/* Status Tabs and Search */}
        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          {/* Status Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full mb-4'
          >
            <div className='flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center justify-between w-full'>
              <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_84px)]'>
                <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                  <TabsTrigger
                    value='borrowed'
                    className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                  >
                    <span className='flex items-center gap-2'>
                      <span className='text-sm xl:text-base'>
                        Borrowed History
                      </span>
                      <Badge
                        className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'borrowed' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--success)]'}`}
                      >
                        {countsLoading ? '...' : borrowedCount}
                      </Badge>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='maintenance'
                    className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                  >
                    <span className='flex items-center gap-2'>
                      <span className='text-sm xl:text-base'>
                        Maintenance History
                      </span>
                      <Badge
                        className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'maintenance' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--error)]'}`}
                      >
                        {countsLoading ? '...' : maintenanceCount}
                      </Badge>
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* Search Bar */}
              <div className='relative w-full sm:w-auto sm:flex-initial lg:ml-auto'>
                <SearchNormal1
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]'
                  color='var(--primary)'
                  size={20}
                />
                <Input
                  placeholder='Search here...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 pr-4 w-full sm:w-auto lg:w-[360px] h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
                />
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value='borrowed' className='mt-6'>
              <BorrowedHistoryTab
                data={borrowedHistoryData}
                loading={historyLoading}
              />
              {/* Infinite scroll loader */}
              {isLoadingMore && (
                <div className='text-center py-4'>
                  <LoadingComponent variant='inline' size='md' text={''} />
                </div>
              )}
            </TabsContent>

            <TabsContent value='maintenance' className='mt-6'>
              <MaintenanceHistoryTab
                data={maintenanceHistoryData}
                loading={historyLoading}
              />
              {/* Infinite scroll loader */}
              {isLoadingMore && (
                <div className='text-center py-4'>
                  <LoadingComponent variant='inline' size='md' text={''} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
