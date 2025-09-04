'use client';

import { Dropdown } from '@/components/shared/common/Dropdown';
import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { LeaveDetailComponent } from '@/components/shared/common/LeaveDetailComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import { ApplyLeaveForm } from '@/components/shared/forms/ApplyLeaveForm';
import { Button } from '@/components/ui/button';
import {
  leaveBalances,
  leaveData,
  leaveHistoryData,
} from '@/constants/dummy-data';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

export const LeaveTab = () => {
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  // Pending Leave columns
  const pendingLeaveColumns = [
    {
      key: 'leaveDate',
      label: 'Leave Date',
      width: 'w-40',
      type: 'text' as const,
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      width: 'w-32',
      type: 'text' as const,
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-24',
      type: 'text' as const,
    },
    {
      key: 'actionOn',
      label: 'Action on',
      width: 'w-28',
      type: 'text' as const,
    },
    {
      key: 'leaveNote',
      label: 'Leave Note',
      width: 'w-48',
      type: 'text' as const,
    },
    {
      key: 'rejectNote',
      label: 'Reject Note',
      width: 'w-32',
      type: 'text' as const,
    },
    {
      key: 'action',
      label: 'Action',
      width: 'w-20',
      type: 'custom' as const,
      render: () => (
        <Dropdown
          trigger={
            <button className='p-2'>
              <MoreVertical size={22} className='text-[var(--text-dark)]' />
            </button>
          }
          menuOptions={[
            { label: 'Edit', action: 'edit' },
            { label: 'Approve', action: 'approve' },
            { label: 'Reject', action: 'reject' },
          ]}
          onAction={(action: string) => {
            switch (action) {
              case 'edit':
                console.log('Edit clicked');
                break;
              case 'approve':
                console.log('Approve clicked');
                break;
              case 'reject':
                console.log('Reject clicked');
                break;
            }
          }}
        />
      ),
      align: 'center' as const,
    },
  ];

  // Leave History columns
  const leaveHistoryColumns = [
    {
      key: 'leaveDates',
      label: 'Leave Dates',
      width: 'w-40',
      type: 'text' as const,
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      width: 'w-32',
      type: 'text' as const,
    },
    {
      key: 'leaveNote',
      label: 'Leave Note',
      width: 'w-48',
      type: 'text' as const,
    },
    {
      key: 'actionOn',
      label: 'Action on',
      width: 'w-28',
      type: 'text' as const,
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-24',
      type: 'custom' as const,
      render: (value: any) => renderStatus(value),
      align: 'center' as const,
    },
    {
      key: 'note',
      label: 'Note',
      width: 'w-48',
      type: 'text' as const,
    },
    {
      key: 'actionBy',
      label: 'Action By',
      width: 'w-36',
      type: 'text' as const,
    },
  ];

  const renderStatus = (status: string) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-[#90C91D26] text-[#90C91D]';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'rejected':
          return 'bg-[#D4323226] text-[#D43232]';
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
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-base font-semibold text-[var(--text-dark)]'>
            Leave Balances
          </h3>
          <Button
            className='btn-primary ml-auto'
            onClick={() => setIsApplyLeaveOpen(true)}
          >
            Apply Leave
          </Button>
        </div>

        <LeaveDetailComponent leaveBalances={leaveBalances} />
      </div>

      {/* Pending Leave Section */}
      <div className=''>
        <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
          Pending Leave
        </h3>
        <DynamicTable
          columns={pendingLeaveColumns}
          data={leaveData}
          className='w-full'
          showRowNumbers={false}
          tableConfig={{
            headerBgColor: 'bg-[var(--background)]',
            borderColor: 'border-[var(--border-dark)]',
          }}
        />
      </div>

      {/* Leave History Section */}
      <div className=''>
        <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
          Leave History
        </h3>
        <DynamicTable
          columns={leaveHistoryColumns}
          data={leaveHistoryData}
          className='w-full'
          showRowNumbers={false}
          tableConfig={{
            headerBgColor: 'bg-[var(--background)]',
            borderColor: 'border-[var(--border-dark)]',
          }}
        />
      </div>

      {/* Apply Leave Side Sheet */}
      <SideSheet
        open={isApplyLeaveOpen}
        onOpenChange={setIsApplyLeaveOpen}
        title='Apply Leave'
        size='600px'
      >
        <ApplyLeaveForm
          onCancel={() => setIsApplyLeaveOpen(false)}
          onSubmit={(data: any) => {
            console.log('Leave application submitted:', data);
            setIsApplyLeaveOpen(false);
          }}
        />
      </SideSheet>
    </div>
  );
};
