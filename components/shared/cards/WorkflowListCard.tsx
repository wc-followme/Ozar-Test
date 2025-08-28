'use client';

import { DetailBoxComponent } from '@/components/shared/common/DetailBoxComponent';
import { TickCircle } from 'iconsax-react';
import Image from 'next/image';

interface WorkflowItem {
  id: string;
  roomName: string;
  trade: string;
  startDate: string;
  endDate: string;
  status: 'Done' | 'InProgress' | 'Pending';
  servicesCount: number;
  assignedUsers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  isSelected: boolean;
  isExpanded?: boolean;
  subServices?: Array<{
    id: string;
    name: string;
    assignedUsers: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  }>;
}

interface WorkflowListCardProps {
  workflowItem: WorkflowItem;
  onToggleExpand?: (id: string) => void;
  className?: string;
}

export function WorkflowListCard({
  workflowItem,
  onToggleExpand,
  className = '',
}: WorkflowListCardProps) {
  const getStatusColor = (status: WorkflowItem['status']) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: WorkflowItem['status']) => {
    if (status === 'Done') {
      return <TickCircle className='w-4 h-4 text-green-500' />;
    }
    return null;
  };

  return (
    <div
      className={`border border-[var(--border-dark)] p-4 rounded-[10px] ${className}`}
    >
      {/* Column Headers */}
      <div className='flex items-center space-x-6'>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-[var(--text-secondary)] capitalize tracking-wide mb-1'>
            Room name
          </h3>
          <h4 className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.roomName}
          </h4>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Trade
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.trade}
          </p>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Start Date
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.startDate}
          </p>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            End Date
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.endDate}
          </p>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Status
          </h3>
          <div className='flex flex-1 items-center gap-1'>
            <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
              {workflowItem.status}
            </p>
          </div>
        </div>
        <div className='flex-1 min-w-0 text-center'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Services
          </h3>
          <span className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.servicesCount.toString().padStart(2, '0')}
          </span>
        </div>
        <div className='flex-1 min-w-0 flex justify-end'>
          <div className='text-right'>
            <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
              Assigned
            </h3>
            <div className='flex items-center -space-x-2 justify-end'>
              {workflowItem.assignedUsers.slice(0, 3).map((user, index) => (
                <Image
                  src={'/images/img-placeholder-sm.png'}
                  alt={user.name}
                  width={30}
                  height={30}
                  className='w-[30px] h-[30px] rounded-full object-cover border-2 border-white'
                  key={user.id}
                />
              ))}
              <div className='w-[30px] h-[30px] rounded-full bg-[#F5F7FA] border-2 border-white flex items-center justify-center'>
                <span className='text-[var(--text-dark)] text-sm font-medium'>
                  +2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse for Sub-services */}
      {workflowItem.subServices && workflowItem.subServices.length > 0 && (
        <div className='mt-4'>
          <div className='grid grid-cols-4 gap-3'>
            {workflowItem.subServices.map(service => (
              <DetailBoxComponent
                key={service.id}
                label='Service'
                value={service.name}
                assignedUsers={service.assignedUsers}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
