'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchNormal1 } from 'iconsax-react';
import Image from 'next/image';
import { useState } from 'react';

interface ToolHistoryData {
  id: string;
  borrowedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  borrowedDate: string;
  returnedDate: string;
}

interface ToolMaintenanceData {
  id: string;
  returnedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  assignedDate: string;
  returnedDate: string;
  issue: string;
}

export default function ToolDetailSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const [selectedTab, setSelectedTab] = useState('borrowed');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for borrowed history - matching the image
  const borrowedHistoryData: ToolHistoryData[] = [
    {
      id: '1',
      borrowedBy: {
        name: 'Liam Anderson',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '2',
      borrowedBy: {
        name: 'Emma Thompson',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '3',
      borrowedBy: {
        name: 'Noah Johnson',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '4',
      borrowedBy: {
        name: 'Olivia Martinez',
        avatar: '/images/avatars/avatar-6.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '5',
      borrowedBy: {
        name: 'Ava Robinson',
        avatar: '/images/avatars/avatar-7.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '6',
      borrowedBy: {
        name: 'Ethan Clark',
        avatar: '/images/avatars/avatar-8.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '7',
      borrowedBy: {
        name: 'Sophia Lewis',
        avatar: '/images/avatars/avatar-1.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '8',
      borrowedBy: {
        name: 'Mason Walker',
        avatar: '/images/avatars/avatar-2.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
    {
      id: '9',
      borrowedBy: {
        name: 'Isabella Hall',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      borrowedDate: '16/08/2024',
      returnedDate: '30/08/2024',
    },
  ];

  // Sample data for maintenance history - matching the image
  const maintenanceHistoryData: ToolMaintenanceData[] = [
    {
      id: '1',
      returnedBy: {
        name: 'Liam Anderson',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Jam',
    },
    {
      id: '2',
      returnedBy: {
        name: 'Emma Thompson',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Overheat',
    },
    {
      id: '3',
      returnedBy: {
        name: 'Noah Johnson',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Vibration',
    },
    {
      id: '4',
      returnedBy: {
        name: 'Olivia Martinez',
        avatar: '/images/avatars/avatar-6.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Stall',
    },
    {
      id: '5',
      returnedBy: {
        name: 'Ava Robinson',
        avatar: '/images/avatars/avatar-7.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Noise',
    },
    {
      id: '6',
      returnedBy: {
        name: 'Ethan Clark',
        avatar: '/images/avatars/avatar-8.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Leak',
    },
    {
      id: '7',
      returnedBy: {
        name: 'Sophia Lewis',
        avatar: '/images/avatars/avatar-1.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Leak',
    },
    {
      id: '8',
      returnedBy: {
        name: 'Mason Walker',
        avatar: '/images/avatars/avatar-2.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Short',
    },
    {
      id: '9',
      returnedBy: {
        name: 'Isabella Hall',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '16/08/2024',
      returnedDate: '16/08/2024',
      issue: 'Short',
    },
  ];

  // Column configuration for borrowed history table
  const borrowedHistoryColumns = [
    {
      key: 'borrowedBy',
      label: 'Borrowed By',
      type: 'avatar' as const,
      avatarKey: 'borrowedBy',
      subtitleKey: 'employeeType',
    },
    {
      key: 'assignedJob',
      label: 'Assigned Job',
      type: 'text' as const,
    },
    {
      key: 'borrowedDate',
      label: 'Borrowed Date',
      type: 'date' as const,
    },
    {
      key: 'returnedDate',
      label: 'Returned Date',
      type: 'date' as const,
    },
  ];

  // Column configuration for maintenance history table
  const maintenanceHistoryColumns = [
    {
      key: 'returnedBy',
      label: 'Returned By',
      type: 'avatar' as const,
      avatarKey: 'returnedBy',
      subtitleKey: 'employeeType',
    },
    {
      key: 'assignedJob',
      label: 'Assigned Job',
      type: 'text' as const,
    },
    {
      key: 'assignedDate',
      label: 'Assigned Date',
      type: 'date' as const,
    },
    {
      key: 'returnedDate',
      label: 'Returned Date',
      type: 'date' as const,
    },
    {
      key: 'issue',
      label: 'Issue',
      type: 'text' as const,
    },
  ];

  // Get data based on selected tab
  const getCurrentTabData = () => {
    switch (selectedTab) {
      case 'borrowed':
        return borrowedHistoryData;
      case 'maintenance':
        return maintenanceHistoryData;
      default:
        return borrowedHistoryData;
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
            onValueChange={setSelectedTab}
            className='w-full mb-4'
          >
            <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
              <TabsList className='flex bg-[var(--dark-background)] p-1 rounded-[32px] h-auto font-normal border border-[var(--border-dark)]'>
                <TabsTrigger
                  value='borrowed'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span>Borrowed History</span>
                </TabsTrigger>
                <TabsTrigger
                  value='maintenance'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span>Maintenance History</span>
                </TabsTrigger>
              </TabsList>
              {/* Search Bar */}
              <div className='relative sm:flex-initial ml-auto'>
                <SearchNormal1
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]'
                  color='var(--primary)'
                  size={20}
                />
                <Input
                  placeholder='Search here...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10 pr-4 lg:w-[360px] w-full h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
                />
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value='borrowed' className='mt-6'>
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
              />
            </TabsContent>

            <TabsContent value='maintenance' className='mt-6'>
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
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
