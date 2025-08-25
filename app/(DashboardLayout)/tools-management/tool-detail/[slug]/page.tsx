'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import { DynamicTable } from '@/components/shared/common/DynamicTable';
import TableSkeleton from '@/components/shared/skeleton/TableSkeleton';
import ToolDetailSkeleton from '@/components/shared/skeleton/ToolDetailSkeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchNormal1 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  toolBorrowedHistoryData,
  toolMaintenanceHistoryData,
} from '../../../../../constants/dummy-data';
import {
  TOOL_HISTORY_BORROWED_COLUMNS,
  TOOL_HISTORY_MAINTENANCE_COLUMNS,
} from '../../../../../constants/tablecolumns';

export default function ToolDetailSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const [selectedTab, setSelectedTab] = useState('borrowed');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle tab change with table loading simulation
  const handleTabChange = (newTab: string) => {
    if (newTab !== selectedTab) {
      setTableLoading(true);
      // Simulate table data loading on tab change
      setTimeout(() => {
        setTableLoading(false);
      }, 3500); // 3.5 seconds timeout for table loading
      setSelectedTab(newTab);
    }
  };

  // Show loading state with full page skeleton
  if (loading) {
    return <ToolDetailSkeleton showActionButtons={false} />;
  }

  // Column configuration for borrowed history table - moved to constants/tablecolumns
  const borrowedHistoryColumns = TOOL_HISTORY_BORROWED_COLUMNS;

  // Column configuration for maintenance history table - moved to constants/tablecolumns
  const maintenanceHistoryColumns = TOOL_HISTORY_MAINTENANCE_COLUMNS;

  // Get data based on selected tab
  const getCurrentTabData = () => {
    switch (selectedTab) {
      case 'borrowed':
        return toolBorrowedHistoryData;
      case 'maintenance':
        return toolMaintenanceHistoryData;
      default:
        return toolBorrowedHistoryData;
    }
  };

  // Filter data based on selected tab and search query
  const filteredData = getCurrentTabData().filter((item: any) => {
    const matchesSearch =
      searchQuery === '' ||
      (item.borrowedBy?.name || item.returnedBy?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.assignedJob.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Tools', href: '/tools-management' },
    { name: 'Drill Machine', href: '/tools-management/tool-detail' },
    { name: params.slug },
  ];

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
              src='/images/tools-management/tools-img-1.png'
              alt='Drill Machine'
              className='w-full h-full object-cover'
              height={80}
              width={80}
            />
          </div>

          {/* Tool Info */}
          <div className='flex-1'>
            <h1 className='text-lg font-bold text-[var(--text-dark)]'>
              Drill Machine
            </h1>

            {/* Tool ID / Barcode */}
            <div className='mb-4'>
              <span className='text-sm text-[var(--text-secondary)]'>
                Tool ID / Barcode
              </span>
              <p className='text-base font-normal text-[var(--text-dark)]'>
                11345 / QR12345
              </p>
            </div>
          </div>
        </div>

        {/* Status Tabs and Search */}
        <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
          {/* Status Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={handleTabChange}
            className='w-full mb-4'
          >
            <div className='flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center justify-between w-full'>
              <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_84px)]'>
                <DynamicScrollArea className='w-full'>
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
                          {toolBorrowedHistoryData.length}
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
                          {toolMaintenanceHistoryData.length}
                        </Badge>
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </DynamicScrollArea>
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
              {tableLoading ? (
                <TableSkeleton
                  columns={borrowedHistoryColumns.length}
                  rows={5}
                  showRowNumbers={false}
                  showActions={false}
                />
              ) : (
                <DynamicTable
                  columns={borrowedHistoryColumns}
                  data={filteredData}
                  emptyMessage='No borrowed history found'
                  showRowNumbers={false}
                  tableConfig={{
                    headerBgColor: 'bg-[var(--background)]',
                    borderColor: 'border-[var(--border-dark)]',
                    hoverColor: 'hover:bg-[var(--background-light)]',
                  }}
                  className='max-w-[calc(100vw_-_80px)]'
                />
              )}
            </TabsContent>

            <TabsContent value='maintenance' className='mt-6'>
              {tableLoading ? (
                <TableSkeleton
                  columns={maintenanceHistoryColumns.length}
                  rows={5}
                  showRowNumbers={false}
                  showActions={false}
                />
              ) : (
                <DynamicTable
                  columns={maintenanceHistoryColumns}
                  data={filteredData}
                  emptyMessage='No maintenance history found'
                  showRowNumbers={false}
                  tableConfig={{
                    headerBgColor: 'bg-[var(--background)]',
                    borderColor: 'border-[var(--border-dark)]',
                    hoverColor: 'hover:bg-[var(--background-light)]',
                  }}
                  className='max-w-[calc(100vw_-_80px)]'
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
