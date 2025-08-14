'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchNormal1 } from 'iconsax-react';
import { Edit, Eye, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ToolDetailData {
  id: string;
  toolId: string;
  barcode: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  assignedDate: string;
  dueDate: string;
  condition: string;
  issue?: string;
  assignedStatus:
    | 'Temporary'
    | 'Permanent'
    | 'Available'
    | 'Maintenance'
    | 'Lost';
}

export default function ToolDetailPage() {
  const [selectedTab, setSelectedTab] = useState('available');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for different tabs
  const availableToolData: ToolDetailData[] = [
    {
      id: '1',
      toolId: '11345',
      barcode: 'QR12345',
      assignedTo: {
        name: 'Available',
        avatar: '/images/avatars/avatar-1.png',
      },
      employeeType: 'Ready',
      assignedJob: 'Not Assigned',
      assignedDate: '-',
      dueDate: '-',
      condition: 'Good',
      assignedStatus: 'Available',
    },
    {
      id: '2',
      toolId: '10345',
      barcode: 'QR12346',
      assignedTo: {
        name: 'Available',
        avatar: '/images/avatars/avatar-2.png',
      },
      employeeType: 'Ready',
      assignedJob: 'Not Assigned',
      assignedDate: '-',
      dueDate: '-',
      condition: 'Excellent',
      assignedStatus: 'Available',
    },
    {
      id: '3',
      toolId: '12745',
      barcode: 'QR12347',
      assignedTo: {
        name: 'Available',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Ready',
      assignedJob: 'Not Assigned',
      assignedDate: '-',
      dueDate: '-',
      condition: 'Decent',
      assignedStatus: 'Available',
    },
    {
      id: '4',
      toolId: '12344',
      barcode: 'QR12386',
      assignedTo: {
        name: 'Available',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Ready',
      assignedJob: 'Not Assigned',
      assignedDate: '-',
      dueDate: '-',
      condition: 'Good',
      assignedStatus: 'Available',
    },
    {
      id: '5',
      toolId: '12746',
      barcode: 'QR12348',
      assignedTo: {
        name: 'Available',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Ready',
      assignedJob: 'Not Assigned',
      assignedDate: '-',
      dueDate: '-',
      condition: 'Excellent',
      assignedStatus: 'Available',
    },
  ];

  const assignedToolData: ToolDetailData[] = [
    {
      id: '3',
      toolId: '11345',
      barcode: 'QR12345',
      assignedTo: {
        name: 'Liam Anderson',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Good',
      assignedStatus: 'Temporary',
    },
    {
      id: '4',
      toolId: '10345',
      barcode: 'QR12346',
      assignedTo: {
        name: 'Emma Thompson',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Excellent',
      assignedStatus: 'Temporary',
    },
    {
      id: '5',
      toolId: '12745',
      barcode: 'QR12347',
      assignedTo: {
        name: 'Noah Johnson',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Decent',
      assignedStatus: 'Permanent',
    },
    {
      id: '6',
      toolId: '12344',
      barcode: 'QR12386',
      assignedTo: {
        name: 'Olivia Davis',
        avatar: '/images/avatars/avatar-6.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Good',
      assignedStatus: 'Temporary',
    },
    {
      id: '7',
      toolId: '12748',
      barcode: 'QR12350',
      assignedTo: {
        name: 'William Brown',
        avatar: '/images/avatars/avatar-7.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Excellent',
      assignedStatus: 'Permanent',
    },
    {
      id: '8',
      toolId: '12749',
      barcode: 'QR12351',
      assignedTo: {
        name: 'Sophia Wilson',
        avatar: '/images/avatars/avatar-8.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '26/08/2024',
      dueDate: '30/08/2024',
      condition: 'Decent',
      assignedStatus: 'Temporary',
    },
  ];

  const maintenanceToolData: ToolDetailData[] = [
    {
      id: '1',
      toolId: '11345',
      barcode: 'QR12345',
      assignedTo: {
        name: 'Liam Anderson',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Jam',
      assignedStatus: 'Maintenance',
    },
    {
      id: '2',
      toolId: '10345',
      barcode: 'QR12346',
      assignedTo: {
        name: 'Emma Thompson',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Overheat',
      assignedStatus: 'Maintenance',
    },
    {
      id: '3',
      toolId: '12745',
      barcode: 'QR12347',
      assignedTo: {
        name: 'Noah Johnson',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Vibration',
      assignedStatus: 'Maintenance',
    },
    {
      id: '4',
      toolId: '12344',
      barcode: 'QR12386',
      assignedTo: {
        name: 'Olivia Davis',
        avatar: '/images/avatars/avatar-6.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Stall',
      assignedStatus: 'Maintenance',
    },
    {
      id: '5',
      toolId: '12746',
      barcode: 'QR12348',
      assignedTo: {
        name: 'William Brown',
        avatar: '/images/avatars/avatar-7.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Noise',
      assignedStatus: 'Maintenance',
    },
    {
      id: '6',
      toolId: '12747',
      barcode: 'QR12349',
      assignedTo: {
        name: 'Sophia Wilson',
        avatar: '/images/avatars/avatar-8.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Leak',
      assignedStatus: 'Maintenance',
    },
    {
      id: '7',
      toolId: '12748',
      barcode: 'QR12350',
      assignedTo: {
        name: 'Michael Garcia',
        avatar: '/images/avatars/avatar-1.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Poor',
      issue: 'Short',
      assignedStatus: 'Maintenance',
    },
  ];

  const lostToolData: ToolDetailData[] = [
    {
      id: '1',
      toolId: '11345',
      barcode: 'QR12345',
      assignedTo: {
        name: 'Liam Anderson',
        avatar: '/images/avatars/avatar-3.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
    {
      id: '2',
      toolId: '10345',
      barcode: 'QR12346',
      assignedTo: {
        name: 'Emma Thompson',
        avatar: '/images/avatars/avatar-4.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
    {
      id: '3',
      toolId: '12745',
      barcode: 'QR12347',
      assignedTo: {
        name: 'Noah Johnson',
        avatar: '/images/avatars/avatar-5.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
    {
      id: '4',
      toolId: '12344',
      barcode: 'QR12386',
      assignedTo: {
        name: 'Olivia Davis',
        avatar: '/images/avatars/avatar-6.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
    {
      id: '5',
      toolId: '12746',
      barcode: 'QR12348',
      assignedTo: {
        name: 'William Brown',
        avatar: '/images/avatars/avatar-7.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
    {
      id: '6',
      toolId: '12747',
      barcode: 'QR12349',
      assignedTo: {
        name: 'Sophia Wilson',
        avatar: '/images/avatars/avatar-8.png',
      },
      employeeType: 'Employees',
      assignedJob: 'Job#456 Downtown Project',
      assignedDate: '30/08/2024',
      dueDate: '30/08/2024',
      condition: 'Unknown',
      assignedStatus: 'Lost',
    },
  ];

  // Column configuration for the DynamicTable
  const toolTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'assignedTo',
      label: 'Assigned to',
      type: 'avatar' as const,
      avatarKey: 'assignedTo',
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
      key: 'dueDate',
      label: 'Due Date',
      type: 'date' as const,
    },
    {
      key: 'condition',
      label: 'Condition',
      type: 'status' as const,
    },
    {
      key: 'assignedStatus',
      label: 'Assigned Status',
      type: 'status' as const,
    },
  ];

  // Column configuration specifically for assigned tab
  const assignedTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'assignedTo',
      label: 'Assigned to',
      type: 'avatar' as const,
      avatarKey: 'assignedTo',
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
      key: 'dueDate',
      label: 'Due Date',
      type: 'date' as const,
    },
    {
      key: 'condition',
      label: 'Condition',
      type: 'status' as const,
    },
  ];

  // Column configuration specifically for maintenance tab
  const maintenanceTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'assignedTo',
      label: 'Assigned to',
      type: 'avatar' as const,
      avatarKey: 'assignedTo',
      subtitleKey: 'employeeType',
    },
    {
      key: 'assignedJob',
      label: 'Assigned Job',
      type: 'text' as const,
    },
    {
      key: 'assignedDate',
      label: 'Returned Date',
      type: 'date' as const,
    },
    {
      key: 'issue',
      label: 'Issue',
      type: 'text' as const,
    },
  ];

  // Column configuration specifically for lost tab
  const lostTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'assignedTo',
      label: 'Assigned to',
      type: 'avatar' as const,
      avatarKey: 'assignedTo',
      subtitleKey: 'employeeType',
    },
    {
      key: 'assignedJob',
      label: 'Assigned Job',
      type: 'text' as const,
    },
    {
      key: 'assignedDate',
      label: 'Lost Date',
      type: 'date' as const,
    },
  ];

  // Actions for the DynamicTable
  const toolTableActions = [
    {
      key: 'more',
      icon: 'More',
      isDropdown: true,
      dropdownOptions: [
        {
          label: 'View Details',
          action: 'view',
          icon: Eye,
        },
        {
          label: 'Edit Assignment',
          action: 'edit',
          icon: Edit,
        },
        {
          label: 'Delete',
          action: 'delete',
          icon: Trash,
          variant: 'destructive' as const,
        },
      ],
      onDropdownAction: (action: string, row: ToolDetailData) => {
        if (action === 'delete') {
          setItemToDelete(row);
          setShowDeleteModal(true);
        } else if (action === 'view') {
          console.log('View details for:', row);
        } else if (action === 'edit') {
          console.log('Edit assignment for:', row);
        }
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      console.log('Deleted item:', itemToDelete);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Get data based on selected tab
  const getCurrentTabData = () => {
    switch (selectedTab) {
      case 'available':
        return availableToolData;
      case 'assigned':
        return assignedToolData;
      case 'maintenance':
        return maintenanceToolData;
      case 'lost':
        return lostToolData;
      default:
        return availableToolData;
    }
  };

  // Filter data based on selected tab and search query
  const filteredData = getCurrentTabData().filter((item: ToolDetailData) => {
    const matchesSearch =
      searchQuery === '' ||
      item.toolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedJob.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Tools', href: '/tools-management' },
    { name: 'Drill Machine' },
  ];

  return (
    <div className='w-full space-y-6'>
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbData} className='mb-4' />

      {/* Main Tool Information Block */}
      <div className='bg-white rounded-xl border border-[var(--border-dark)] p-6'>
        <div className='flex items-start gap-6'>
          {/* Tool Image */}
          <div className='w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
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
            <h1 className='text-lg font-bold text-[var(--text-dark)] mb-4'>
              Drill Machine
            </h1>

            {/* Statistics */}
            <div className='flex gap-8 mb-6'>
              <div>
                <span className='text-sm text-[var(--text-secondary)]'>
                  Quantity
                </span>
                <p className='text-lg font-bold text-[var(--text-dark)]'>100</p>
              </div>
              <div>
                <span className='text-sm text-[var(--text-secondary)]'>
                  Videos
                </span>
                <p className='text-lg font-bold text-[var(--text-dark)]'>02</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 flex-shrink-0'>
            <Button variant='outline' className='px-4 py-2 btn-secondary'>
              Videos Tutorial
            </Button>
            <Button variant='outline' className='px-4 py-2 btn-secondary'>
              Assign Tool
            </Button>
            <Button className='px-4 py-2 btn-primary'>Add More</Button>
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
                  value='available'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span className='flex items-center gap-2'>
                    <span>Available</span>
                    <Badge className='bg-[var(--badge-bg)] text-white font-bold'>
                      50
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='assigned'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span className='flex items-center gap-2'>
                    <span>Assigned</span>
                    <Badge className='bg-transparent text-[var(--text-dark)] font-bold'>
                      16
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='maintenance'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span className='flex items-center gap-2'>
                    <span>Maintenance</span>
                    <Badge className='bg-orange-100 text-orange-600 font-bold'>
                      09
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='lost'
                  className='px-6 py-[10px] text-base text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
                >
                  <span className='flex items-center gap-2'>
                    <span>Lost</span>
                    <Badge className='bg-orange-100 text-orange-600 font-bold'>
                      10
                    </Badge>
                  </span>
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
            <TabsContent value='available' className='mt-6'>
              <DynamicTable
                columns={toolTableColumns}
                data={filteredData}
                actions={toolTableActions}
                emptyMessage='No available tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[#F5F7FA]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
              />
            </TabsContent>

            <TabsContent value='assigned' className='mt-6'>
              <DynamicTable
                columns={assignedTableColumns}
                data={filteredData}
                actions={toolTableActions}
                emptyMessage='No assigned tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[#F5F7FA]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
              />
            </TabsContent>

            <TabsContent value='maintenance' className='mt-6'>
              <DynamicTable
                columns={maintenanceTableColumns}
                data={filteredData}
                actions={toolTableActions}
                emptyMessage='No tools under maintenance found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[#F5F7FA]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
              />
            </TabsContent>

            <TabsContent value='lost' className='mt-6'>
              <DynamicTable
                columns={lostTableColumns}
                data={filteredData}
                actions={toolTableActions}
                emptyMessage='No lost tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[#F5F7FA]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title={`Delete ${itemToDelete?.toolId} / ${itemToDelete?.barcode}?`}
        subtitle='Are you sure you want to delete this tool? This action cannot be undone.'
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        archiveButtonText='Delete'
      />
    </div>
  );
}
