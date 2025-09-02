'use client';

import { Avatar } from '@/components/shared/common/Avatar';
import { DetailBoxComponent } from '@/components/shared/common/DetailBoxComponent';
import { IconGripVertical } from '@tabler/icons-react';

import dynamic from 'next/dynamic';
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
  isPollPlanningStarted?: boolean;
  activeServiceId?: string;
  onServiceActivate?: (serviceId: string) => void;
}

export function WorkflowListCard({
  workflowItem,
  className = '',
  showAddButton = true,
  showDragHandle = false,
  onServiceReorder,
  showCardDragHandle = false,
  cardDragHandleProps,
  isDragging = false,
  isPollPlanningStarted = false,
  activeServiceId = '',
  onServiceActivate,
}: WorkflowListCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleServiceReorder = (reorderedServices: any[]) => {
    if (onServiceReorder) {
      onServiceReorder(reorderedServices);
    }
  };

  const handleServiceDragStart = () => {
    // Don't set localIsDragging for service-level drags
    // This prevents the main card from changing during service drag
  };

  const handleServiceDragEnd = () => {
    // Don't set localIsDragging for service-level drags
    // This prevents the main card from changing during service drag
  };

  // Render the non-sortable version (fallback)
  const renderNonSortableServices = () => (
    <div className='overflow-x-auto'>
      <div className='grid grid-cols-autofit-sm sm:grid-cols-autofit md:grid-cols-autofit-md xl:grid-cols-autofit-xl gap-3 min-h-[200px] min-w-[720px]'>
        {workflowItem.subServices?.map((service, index) => (
          <DetailBoxComponent
            key={`${workflowItem.id}-${service.id}`}
            label='Service'
            value={service.name}
            assignedUsers={service.assignedUsers}
            startDate={workflowItem.startDate}
            dueDate={workflowItem.endDate}
            showAddButton={showAddButton}
            showDragHandle={false}
            isActive={isPollPlanningStarted && service.id === activeServiceId}
            isPollPlanningStarted={isPollPlanningStarted}
            onActivate={() => onServiceActivate?.(service.id)}
            cardIndex={index}
          />
        ))}
      </div>
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
        onDragStart={handleServiceDragStart}
        onDragEnd={handleServiceDragEnd}
      >
        <div className='overflow-x-auto'>
          <div className='grid grid-cols-autofit-sm sm:grid-cols-autofit md:grid-cols-autofit-md xl:grid-cols-autofit-xl gap-3 min-h-[200px] min-w-[720px]'>
            {workflowItem.subServices.map((service, index) => (
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
                    isActive={
                      isPollPlanningStarted && service.id === activeServiceId
                    }
                    isPollPlanningStarted={isPollPlanningStarted}
                    onActivate={() => onServiceActivate?.(service.id)}
                    cardIndex={index}
                  />
                )}
              </SortableItem>
            ))}
          </div>
        </div>
      </Sortable>
    );
  };

  return (
    <div
      className={`border border-[var(--border-dark)] p-4 rounded-[10px] transition-all duration-200 min-w-fit ${className} ${
        isDragging ? 'shadow-lg transform-none' : ''
      }`}
      style={{
        transform: isDragging ? 'none' : undefined,
        width: isDragging ? '100%' : undefined,
        height: isDragging ? '86px' : undefined,
        minHeight: isDragging ? '86px' : undefined,
        maxHeight: isDragging ? '86px' : undefined,
      }}
    >
      {/* Column Headers */}
      <div className='flex items-center space-x-6 overflow-x-auto'>
        {/* Card Drag Handle - 6 dots icon (only shown when showCardDragHandle is true) */}
        {showCardDragHandle && (
          <div
            className='flex flex-col space-y-1 cursor-grab active:cursor-grabbing flex-shrink-0 w-6'
            data-drag-handle='true'
            {...cardDragHandleProps?.listeners}
            {...cardDragHandleProps?.attributes}
          >
            <IconGripVertical size={28} color='#C0C6CD' />
          </div>
        )}

        <div className='flex-1 min-w-[120px]'>
          <h3 className='text-sm font-medium text-[var(--text-secondary)] capitalize tracking-wide mb-1'>
            Room name
          </h3>
          <h4 className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.roomName}
          </h4>
        </div>
        <div className='flex-1 min-w-[100px]'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Trade
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.trade}
          </p>
        </div>
        <div className='flex-1 min-w-[100px]'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Start Date
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.startDate}
          </p>
        </div>
        <div className='flex-1 min-w-[100px]'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            End Date
          </h3>
          <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.endDate}
          </p>
        </div>
        <div className='flex-1 min-w-[80px]'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Status
          </h3>
          <div className='flex flex-1 items-center gap-1'>
            <p className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
              {workflowItem.status}
            </p>
          </div>
        </div>
        <div className='flex-1 min-w-[80px] text-center'>
          <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
            Services
          </h3>
          <span className='text-base font-medium text-[var(--text-dark)] capitalize tracking-wide mb-1'>
            {workflowItem.servicesCount.toString().padStart(2, '0')}
          </span>
        </div>
        <div className='flex-1 min-w-[120px] flex justify-end'>
          <div className='text-right'>
            <h3 className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
              Assigned
            </h3>
            <div className='flex items-center -space-x-2 justify-end'>
              {workflowItem.assignedUsers.slice(0, 3).map(user => (
                <Avatar
                  name={user.name}
                  image={user.image}
                  width={30}
                  height={30}
                  className='w-[30px] h-[30px] rounded-full border-2 border-[var(--card-background)] text-xs '
                  key={user.id}
                  swapColors
                  autoTextColor
                />
              ))}
              <div className='w-[30px] h-[30px] rounded-full bg-[var(--background)] relative border-2 border-[var(--white-background)] flex items-center justify-center'>
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
          {!isDragging ? (
            showDragHandle ? (
              renderSortableServices()
            ) : (
              renderNonSortableServices()
            )
          ) : (
            <div className='overflow-x-auto'>
              <div className='grid grid-cols-autofit-sm sm:grid-cols-autofit md:grid-cols-autofit-md xl:grid-cols-autofit-xl gap-3 xl:gap-6 min-h-[200px] min-w-[720px] opacity-0 pointer-events-none'>
                {/* Placeholder to maintain layout during drag */}
                {workflowItem.subServices.map(service => (
                  <div
                    key={`placeholder-${service.id}`}
                    className='h-[140px] min-h-[140px] max-h-[140px]'
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
