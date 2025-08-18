'use client';

import ToolsDetailTopBlock from '@/components/sections/ToolsDetailTopBlock';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { QRCodeSection } from '@/components/shared/common/QRCodeSection';
import SideSheet from '@/components/shared/common/SideSheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchNormal1 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TABLE_ACTION_TRIGGER_ICON,
  TOOL_ACTIONS,
} from '../../../../constants/tableactions';
// Action icons are provided via constants/tableactions
// duplicate import removed
import { AssignForm } from '@/components/shared/forms/AssignForm';
import { LostForm } from '@/components/shared/forms/LostForm';
import { MaintenanceForm } from '@/components/shared/forms/MaintenanceForm';
import { ReturnForm } from '@/components/shared/forms/ReturnForm';
import { DynamicScrollArea } from '../../../../components/shared/common/DynamicScrollArea';
import { DynamicTable } from '../../../../components/shared/common/DynamicTable';
import { availableToolData } from './dummy-data';

interface ToolDetailData {
  id: string;
  toolId: string;
  barcode: string;
  returnedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  dueDate: string;
  returnedDate: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<
    null | 'assign' | 'return' | 'maintenance' | 'lost' | 'addMore'
  >(null);
  const [qrToolIds, setQrToolIds] = useState<
    Array<{ id: string; toolId: string; barcode: string }>
  >([]);
  const [assignDefaults, setAssignDefaults] = useState({
    toolName: 'Drill Machine',
    toolId: '',
    barcode: '',
    condition: '',
    assignDate: '',
    dueDate: '',
    assignee: '',
    job: 'Job#456 Downtown Project',
  });
  const [returnDefaults, setReturnDefaults] = useState({
    toolName: 'Drill Machine',
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    returnedDate: '',
    returnedBy: '',
    job: 'Job#456 Downtown Project',
  });
  const [maintenanceDefaults, setMaintenanceDefaults] = useState({
    toolName: 'Drill Machine',
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    returnedDate: '',
    returnedBy: '',
    job: 'Job#456 Downtown Project',
    issues: '',
  });
  const [lostDefaults, setLostDefaults] = useState({
    toolName: 'Drill Machine',
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    acknowledgeDate: '',
    subsEmployees: '',
    job: 'Job#456 Downtown Project',
    reason: '',
  });

  // Column configuration for the DynamicTable - Updated to match image
  const toolTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
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
      key: 'dueDate',
      label: 'Due Date',
      type: 'date' as const,
    },
    {
      key: 'returnedDate',
      label: 'Returned Date',
      type: 'date' as const,
    },
    {
      key: 'condition',
      label: 'Condition',
      type: 'status' as const,
    },
  ];

  // Column configuration specifically for assigned tab - Updated to match image
  const assignedTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'returnedBy',
      label: 'Assigned to',
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
      key: 'returnedDate',
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

  // Column configuration specifically for maintenance tab - Updated to match image
  const maintenanceTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'returnedBy',
      label: 'Assigned to',
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

  // Column configuration specifically for lost tab - Updated to match image
  const lostTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
    {
      key: 'returnedBy',
      label: 'Assigned to',
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
      key: 'returnedDate',
      label: 'Lost Date',
      type: 'date' as const,
    },
  ];

  // Actions for Available tab - from constants
  const availableTableActions = [
    {
      key: 'more',
      icon: TABLE_ACTION_TRIGGER_ICON,
      iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
      isDropdown: true,
      dropdownOptions: TOOL_ACTIONS.available,
      onDropdownAction: (action: string, row: ToolDetailData) => {
        if (action === 'assign') {
          setAssignDefaults({
            toolName: 'Drill Machine',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            assignDate: '',
            dueDate: '',
            assignee: '',
            job: row.assignedJob,
          });
          setActiveSheet('assign');
          setSideSheetOpen(true);
        } else if (action === 'maintenance') {
          setMaintenanceDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            returnedDate: '',
            returnedBy: '',
            job: row.assignedJob,
            issues: '',
          });
          setActiveSheet('maintenance');
          setSideSheetOpen(true);
        } else if (action === 'lost') {
          setLostDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            acknowledgeDate: '',
            subsEmployees: '',
            job: row.assignedJob,
            reason: '',
          });
          setActiveSheet('lost');
          setSideSheetOpen(true);
        } else if (action === 'details') {
          router.push(`/tools-management/tool-detail/${row.toolId}`);
        }
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  // Actions for Assigned tab - from constants
  const assignedTableActions = [
    {
      key: 'more',
      icon: TABLE_ACTION_TRIGGER_ICON,
      iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
      isDropdown: true,
      dropdownOptions: TOOL_ACTIONS.assigned,
      onDropdownAction: (action: string, row: ToolDetailData) => {
        if (action === 'return') {
          setReturnDefaults({
            toolName: 'Drill Machine',
            dueDate: row.dueDate,
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            returnedDate: '',
            returnedBy: '',
            job: row.assignedJob,
          });
          setActiveSheet('return');
          setSideSheetOpen(true);
        } else if (action === 'maintenance') {
          setMaintenanceDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            returnedDate: '',
            returnedBy: '',
            job: row.assignedJob,
            issues: '',
          });
          setActiveSheet('maintenance');
          setSideSheetOpen(true);
        } else if (action === 'lost') {
          setLostDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            acknowledgeDate: '',
            subsEmployees: '',
            job: row.assignedJob,
            reason: '',
          });
          setActiveSheet('lost');
          setSideSheetOpen(true);
        } else if (action === 'details') {
          router.push(`/tools-management/tool-detail/${row.toolId}`);
        }
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  // Actions for Maintenance tab - from constants
  const maintenanceTableActions = [
    {
      key: 'more',
      icon: TABLE_ACTION_TRIGGER_ICON,
      iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
      isDropdown: true,
      dropdownOptions: TOOL_ACTIONS.maintenance,
      onDropdownAction: (action: string, row: ToolDetailData) => {
        if (action === 'available') {
          console.log('Mark as available:', row);
        } else if (action === 'lost') {
          setLostDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            acknowledgeDate: '',
            subsEmployees: '',
            job: row.assignedJob,
            reason: '',
          });
          setActiveSheet('lost');
          setSideSheetOpen(true);
        } else if (action === 'details') {
          router.push(`/tools-management/tool-detail/${row.toolId}`);
        }
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  // Actions for Lost tab - from constants
  const lostTableActions = [
    {
      key: 'more',
      icon: TABLE_ACTION_TRIGGER_ICON,
      iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
      isDropdown: true,
      dropdownOptions: TOOL_ACTIONS.lost,
      onDropdownAction: (action: string, row: ToolDetailData) => {
        if (action === 'edit') {
          console.log('Edit tool:', row);
        } else if (action === 'maintenance') {
          setMaintenanceDefaults({
            toolName: 'Drill Machine',
            dueDate: '',
            toolId: row.toolId,
            barcode: row.barcode,
            condition: row.condition,
            returnedDate: '',
            returnedBy: '',
            job: row.assignedJob,
            issues: '',
          });
          setActiveSheet('maintenance');
          setSideSheetOpen(true);
        } else if (action === 'details') {
          router.push(`/tools-management/tool-detail/${row.toolId}`);
        }
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

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
      item.returnedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedJob.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Tools', href: '/tools-management' },
    { name: 'Drill Machine' },
  ];

  const router = useRouter();

  return (
    <div className='w-full space-y-6'>
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbData} className='mb-4' />

      {/* Main Tool Information Block */}
      <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
        <ToolsDetailTopBlock
          imageSrc='/images/tools-management/tools-img-1.png'
          title='Drill Machine'
          quantity={100}
          videosCount={2}
          videosHref='/tools-management/tool-detail/videos-tutorial'
          onAssign={() => {
            setActiveSheet('assign');
            setSideSheetOpen(true);
          }}
          onAddMore={() => {
            setActiveSheet('addMore');
            setSideSheetOpen(true);
          }}
        />
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
                <DynamicScrollArea className='w-full'>
                  <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                    <TabsTrigger
                      value='available'
                      className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>Available</span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'available' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[#90C91D]'}`}
                        >
                          50
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='assigned'
                      className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>Assigned</span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'assigned' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--text-secondary)]'}`}
                        >
                          16
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='maintenance'
                      className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>
                          Maintenance
                        </span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'maintenance' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[#EBB402]'}`}
                        >
                          09
                        </Badge>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='lost'
                      className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-sm xl:text-base'>Lost</span>
                        <Badge
                          className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'lost' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[#00A8BF]'}`}
                        >
                          10
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
            <TabsContent value='available' className='mt-6'>
              <DynamicTable
                columns={toolTableColumns}
                data={filteredData}
                actions={availableTableActions}
                emptyMessage='No available tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[var(--background)]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
                className='max-w-[calc(100vw_-_80px)]'
              />
            </TabsContent>

            <TabsContent value='assigned' className='mt-6'>
              <DynamicTable
                columns={assignedTableColumns}
                data={filteredData}
                actions={assignedTableActions}
                emptyMessage='No assigned tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[var(--background)]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
                className='max-w-[calc(100vw_-_80px)]'
              />
            </TabsContent>

            <TabsContent value='maintenance' className='mt-6'>
              <DynamicTable
                columns={maintenanceTableColumns}
                data={filteredData}
                actions={maintenanceTableActions}
                emptyMessage='No tools under maintenance found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[var(--background)]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
                className='max-w-[calc(100vw_-_80px)]'
              />
            </TabsContent>

            <TabsContent value='lost' className='mt-6'>
              <DynamicTable
                columns={lostTableColumns}
                data={filteredData}
                actions={lostTableActions}
                emptyMessage='No lost tools found'
                showRowNumbers={false}
                tableConfig={{
                  headerBgColor: 'bg-[var(--background)]',
                  borderColor: 'border-[var(--border-dark)]',
                  hoverColor: 'hover:bg-[var(--background-light)]',
                }}
                className='max-w-[calc(100vw_-_80px)]'
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Unified SideSheet */}
        <SideSheet
          open={sideSheetOpen}
          onOpenChange={open => {
            setSideSheetOpen(open);
            if (!open) setActiveSheet(null);
          }}
          title={
            activeSheet === 'assign'
              ? 'Assign'
              : activeSheet === 'return'
                ? 'Return Tool'
                : activeSheet === 'maintenance'
                  ? 'Maintenance'
                  : activeSheet === 'lost'
                    ? 'Lost'
                    : 'Add More Tools'
          }
          size='600px'
        >
          {activeSheet === 'addMore' && (
            <>
              <QRCodeSection
                toolIds={qrToolIds}
                onToolIdsChange={setQrToolIds}
              />
              <div className='flex gap-3 items-center pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setSideSheetOpen(false)}
                  className='btn-secondary'
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log('Add more tools:', qrToolIds);
                    setSideSheetOpen(false);
                  }}
                  className='btn-primary'
                >
                  Add
                </Button>
              </div>
            </>
          )}

          {activeSheet === 'assign' && (
            <AssignForm
              defaultValues={assignDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={vals => {
                console.log('Assign submit:', vals);
                setSideSheetOpen(false);
              }}
            />
          )}

          {activeSheet === 'return' && (
            <ReturnForm
              defaultValues={returnDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={vals => {
                console.log('Return submit:', vals);
                setSideSheetOpen(false);
              }}
            />
          )}

          {activeSheet === 'maintenance' && (
            <MaintenanceForm
              defaultValues={maintenanceDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={vals => {
                console.log('Maintenance submit:', vals);
                setSideSheetOpen(false);
              }}
            />
          )}

          {activeSheet === 'lost' && (
            <LostForm
              defaultValues={lostDefaults}
              onCancel={() => setSideSheetOpen(false)}
              onSubmit={vals => {
                console.log('Lost submit:', vals);
                setSideSheetOpen(false);
              }}
            />
          )}
        </SideSheet>
      </div>
    </div>
  );
}
