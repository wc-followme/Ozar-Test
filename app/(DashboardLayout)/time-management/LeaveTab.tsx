'use client';

import { Dropdown } from '@/components/shared/common/Dropdown';
import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { LeaveDetailComponent } from '@/components/shared/common/LeaveDetailComponent';
import {
  leaveBalances,
  leaveData,
  leaveHistoryData,
} from '@/constants/dummy-data';
import {
  LEAVE_HISTORY_COLUMNS,
  PENDING_LEAVE_COLUMNS,
} from '@/constants/tablecolumns';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { MoreVertical } from 'lucide-react';

export const LeaveTab = () => {
  const { sidebarWidth, isClient } = useSidebarState();

  // Calculate dynamic table max-width based on sidebar state
  const getTableStyle = () => {
    console.log('LeaveTab - getTableStyle called:', {
      isClient,
      sidebarWidth,
    });

    if (!isClient) {
      console.log('Not client yet, using conservative default style');
      return { maxWidth: 'calc(100vw - 200px)' };
    }

    // Check if screen is 1024px or less (mobile/tablet)
    const isMobileOrTablet = window.innerWidth <= 1024;

    if (isMobileOrTablet) {
      console.log('Screen width <= 1024px, using mobile width calculation');
      // For mobile/tablet: very conservative calculation to prevent any scrolling
      // Account for main padding (48px) + extra safety margin (32px)
      return { maxWidth: 'calc(100vw - 80px)' };
    }

    // Desktop: use very conservative sidebar-aware calculation
    // Account for: sidebar width + main padding (48px) + container padding (24px) + extra safety margin (48px)
    const totalOffset = sidebarWidth + 48 + 24 + 48; // Very conservative padding
    const maxWidthValue = `calc(100vw - ${totalOffset}px)`;
    console.log(
      'Using desktop calculated max-width:',
      maxWidthValue,
      'totalOffset:',
      totalOffset,
      'sidebarWidth:',
      sidebarWidth
    );
    return { maxWidth: maxWidthValue };
  };

  // Create pending leave columns with custom render functions
  const pendingLeaveColumns = PENDING_LEAVE_COLUMNS.map(column => {
    if (column.key === 'action') {
      return {
        ...column,
        render: () => (
          <Dropdown
            trigger={
              <button className='p-2'>
                <MoreVertical size={22} className='text-[var(--text-dark)]' />
              </button>
            }
            menuOptions={[
              { label: 'Edit', action: 'edit' },
              { label: 'Cancel', action: 'cancel' },
            ]}
            onAction={(action: string) => {
              switch (action) {
                case 'edit':
                  console.log('Edit clicked');
                  break;
                case 'cancel':
                  console.log('Approve clicked');
                  break;
              }
            }}
          />
        ),
      };
    }
    return column;
  });

  // Create leave history columns with custom render functions
  const leaveHistoryColumns = LEAVE_HISTORY_COLUMNS.map(column => {
    if (column.key === 'status') {
      return {
        ...column,
        render: (value: any) => renderStatus(value),
      };
    }
    return column;
  });

  const renderStatus = (status: string) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-[var(--success-15)] text-[var(--success)]';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'rejected':
          return 'bg-[var(--warning-15)] text-[var(--warning)]';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className='space-y-8'>
      {/* Leave Balances Section */}
      <div className=''>
        <div className='mb-6'>
          <h3 className='text-base font-semibold text-[var(--text-dark)]'>
            Leave Balances
          </h3>
        </div>

        <LeaveDetailComponent leaveBalances={leaveBalances} />
      </div>

      {/* Pending Leave Section */}
      <div className=''>
        <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
          Pending Leave
        </h3>
        <div
          data-sidebar-width={sidebarWidth}
          data-max-width={getTableStyle().maxWidth}
          data-is-client={isClient}
        >
          <DynamicTable
            columns={pendingLeaveColumns}
            data={leaveData}
            className='relative block w-full overflow-x-auto overflow-y-hidden overscroll-x-auto'
            style={getTableStyle()}
            showRowNumbers={false}
            tableConfig={{
              headerBgColor: 'bg-[var(--background)]',
              borderColor: 'border-[var(--border-dark)]',
            }}
          />
        </div>
      </div>

      {/* Leave History Section */}
      <div className=''>
        <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
          Leave History
        </h3>
        <div
          data-sidebar-width={sidebarWidth}
          data-max-width={getTableStyle().maxWidth}
          data-is-client={isClient}
        >
          <DynamicTable
            columns={leaveHistoryColumns}
            data={leaveHistoryData}
            className='relative block w-full overflow-x-auto overflow-y-hidden overscroll-x-auto'
            style={getTableStyle()}
            showRowNumbers={false}
            tableConfig={{
              headerBgColor: 'bg-[var(--background)]',
              borderColor: 'border-[var(--border-dark)]',
            }}
          />
        </div>
      </div>
    </div>
  );
};
