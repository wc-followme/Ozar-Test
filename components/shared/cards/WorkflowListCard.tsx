'use client';

import { DetailBoxComponent } from '@/components/shared/common/DetailBoxComponent';
import { IconGripVertical } from '@tabler/icons-react';
import { TickCircle } from 'iconsax-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Dynamically import Sortable components to avoid SSR issues
const Sortable = dynamic(
  () =>
    import('@/components/ui/sortable').then(mod => ({ default: mod.Sortable })),
  { ssr: false }
);
const SortableItem = dynamic(
  () =>
    import('@/components/ui/sortable-item').then(mod => ({
      default: mod.SortableItem,
    })),
  { ssr: false }
);

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
  showAddButton?: boolean;
  showDragHandle?: boolean;
  onServiceReorder?: (services: WorkflowItem['subServices']) => void;
  showCardDragHandle?: boolean;
  cardDragHandleProps?: {
    listeners?: any;
    attributes?: any;
  };
  isDragging?: boolean;
}

export function WorkflowListCard({
  workflowItem,
  onToggleExpand,
  className = '',
  showAddButton = true,
  showDragHandle = false,
  onServiceReorder,
  showCardDragHandle = false,
  cardDragHandleProps,
  isDragging = false,
}: WorkflowListCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleServiceReorder = (reorderedServices: any[]) => {
    if (onServiceReorder) {
      onServiceReorder(reorderedServices);
    }
  };

  // Render the non-sortable version (fallback)
  const renderNonSortableServices = () => (
    <div className='grid grid-cols-4 gap-3'>
      {workflowItem.subServices?.map(service => (
        <DetailBoxComponent
          key={`${workflowItem.id}-${service.id}`}
          label='Service'
          value={service.name}
          assignedUsers={service.assignedUsers}
          startDate={workflowItem.startDate}
          dueDate={workflowItem.endDate}
          showAddButton={showAddButton}
          showDragHandle={false}
        />
      ))}
    </div>
  );

  // Render the sortable version (client-only)
  const renderSortableServices = () => {
    if (!workflowItem.subServices || workflowItem.subServices.length === 0) {
      return null;
    }

    if (!mounted || !Sortable || !SortableItem) {
      return renderNonSortableServices();
    }

    return (
      <Sortable
        items={workflowItem.subServices}
        onReorder={handleServiceReorder}
        idField='id'
      >
        <div className='grid grid-cols-4 gap-3'>
          {workflowItem.subServices.map(service => (
            <SortableItem
              key={`${workflowItem.id}-${service.id}`}
              id={service.id}
            >
              {(dragHandleProps: any) => (
                <DetailBoxComponent
                  key={`${workflowItem.id}-${service.id}`}
                  label='Service'
                  value={service.name}
                  assignedUsers={service.assignedUsers}
                  startDate={workflowItem.startDate}
                  dueDate={workflowItem.endDate}
                  showAddButton={showAddButton}
                  showDragHandle={showDragHandle}
                  dragHandleProps={dragHandleProps}
                />
              )}
            </SortableItem>
          ))}
        </div>
      </Sortable>
    );
  };

  return (
    <div
      className={`border border-[var(--border-dark)] p-4 rounded-[10px] ${className}`}
    >
      {/* Column Headers */}
      <div className='flex items-center space-x-6'>
        {/* Card Drag Handle - 6 dots icon (only shown when showCardDragHandle is true) */}
        {showCardDragHandle && (
          <div
            className='flex flex-col space-y-1 cursor-grab active:cursor-grabbing flex-shrink-0'
            {...cardDragHandleProps?.listeners}
            {...cardDragHandleProps?.attributes}
          >
            <IconGripVertical size={20} color='#9CA3AF' />
          </div>
        )}

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
      {workflowItem.subServices &&
        workflowItem.subServices.length > 0 &&
        !isDragging && (
          <div className='mt-4'>
            {showDragHandle
              ? renderSortableServices()
              : renderNonSortableServices()}
          </div>
        )}
    </div>
  );
}
