'use client';

import { IconGripVertical } from '@tabler/icons-react';
import { AddCircle } from 'iconsax-react';
import { useState } from 'react';
import { AddEmployeeToPollPlanning } from '../forms/AddEmployeeToPollPlanning';
import { AddRespondToPollPlanning } from '../forms/AddRespondToPollPlanning';
import { Avatar } from './Avatar';
import SideSheet from './SideSheet';

interface DetailBoxProps {
  label: string;
  value: string;
  assignedUsers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  className?: string;
  startDate?: string;
  dueDate?: string;
  showAddButton?: boolean;
  showDragHandle?: boolean;
  dragHandleProps?: {
    listeners?: any;
    attributes?: any;
  };
  isActive?: boolean;
  isPollPlanningStarted?: boolean;
  onActivate?: () => void;
  cardIndex?: number;
}

export function DetailBoxComponent({
  label,
  value,
  assignedUsers,
  className = '',
  startDate,
  dueDate,
  showAddButton = true,
  showDragHandle = false,
  dragHandleProps,
  isPollPlanningStarted = false,
  onActivate,
  cardIndex = 0,
}: DetailBoxProps) {
  const [respondSideSheetOpen, setRespondSideSheetOpen] = useState(false);
  const [addEmployeeSideSheetOpen, setAddEmployeeSideSheetOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespondCancel = () => {
    setRespondSideSheetOpen(false);
  };

  const handleAddEmployeeCancel = () => {
    setAddEmployeeSideSheetOpen(false);
  };

  const handleAddEmployee = async (employeeData: {
    room: string;
    trade: string;
    service: string;
    employeeIds: string[];
  }) => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the employee data
      console.log('Adding employee with data:', employeeData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the sidesheet after successful submission
      setAddEmployeeSideSheetOpen(false);

      // You might want to show a success toast here
      console.log('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRespond = async (respondData: {
    room: string;
    trade: string;
    service: string;
    startDate: string;
    dueDate: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the response data
      console.log('Adding response with data:', respondData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the sidesheet after successful submission
      setRespondSideSheetOpen(false);

      // You might want to show a success toast here
      console.log('Response added successfully!');
    } catch (error) {
      console.error('Error adding response:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-[10px] p-4 border-2 flex ${className} min-h-[140px] h-full w-full ${
          isPollPlanningStarted
            ? cardIndex === 0
              ? 'bg-[var(--white-background)] border-[var(--border-dark)]'
              : cardIndex === 1
                ? 'bg-[var(--secondary-15)] border-[var(--secondary)]'
                : 'bg-[var(--background)] border-[var(--border-dark)]'
            : 'border-[var(--border-dark)]'
        } ${isPollPlanningStarted && cardIndex === 1 ? 'cursor-pointer' : ''}`}
        style={{
          minWidth: '100%',
          maxWidth: '100%',
        }}
        onClick={
          isPollPlanningStarted && cardIndex === 1 ? onActivate : undefined
        }
      >
        {/* Drag Handle - 6 dots icon (only shown when showDragHandle is true) */}

        {/* Content Section */}
        <div className='flex-1 flex flex-col'>
          {/* Top Section - Service Name and Add Button */}
          <div className='w-full flex items-center justify-between mb-4'>
            {showDragHandle && (
              <div
                className='flex flex-col space-y-1 mr-5 cursor-grab active:cursor-grabbing w-4 flex-shrink-0'
                data-drag-handle='true'
                {...dragHandleProps?.listeners}
                {...dragHandleProps?.attributes}
              >
                <IconGripVertical size={28} color='#C0C6CD' />
              </div>
            )}
            {/* Left Section - Text Content */}
            <div className='flex-1 min-w-0'>
              <p className={`text-sm font-medium mb-1 `}>{label}</p>
              <p className={`text-base font-medium truncate`}>{value}</p>
            </div>

            {/* Right Section - Buttons */}
            {isPollPlanningStarted && cardIndex < 2 ? (
              <div className='flex gap-2'>
                {cardIndex === 0 ? (
                  <button
                    className='btn-secondary !px-12 !py-2'
                    onClick={() => console.log('Edit clicked for:', value)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className='btn-primary !px-8 !py-2 !bg-[var(--secondary-15)] hover:!bg-[var(--secondary-15)] !text-[var(--secondary)]'
                    onClick={() => setRespondSideSheetOpen(true)}
                  >
                    Add Respond
                  </button>
                )}
              </div>
            ) : !isPollPlanningStarted && showAddButton ? (
              <div className='flex gap-2'>
                <button
                  className='w-8 h-8 '
                  onClick={() => setAddEmployeeSideSheetOpen(true)}
                >
                  <AddCircle size='32' color='var(--secondary)' />
                </button>
              </div>
            ) : null}
          </div>

          {/* Middle Section - Assigned Users */}
          {assignedUsers && assignedUsers.length > 0 && (
            <div className='mb-4'>
              <div className='flex gap-3 flex-wrap'>
                {assignedUsers.map(user => (
                  <div key={user.id} className='flex items-center gap-1'>
                    <Avatar
                      name={user.name}
                      image={user.image}
                      width={26}
                      height={26}
                      className='flex-shrink-0 rounded-full text-xs'
                    />
                    <span className={`text-xs font-medium`}>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section - Start Date and Due Date (always shown) */}
          <div className='flex items-center justify-between mt-auto'>
            {/* Start Date */}
            <div className='flex-1 min-w-0'>
              <p className={`text-sm font-medium mb-1`}>Start Date</p>
              <p className={`text-base font-medium`}>{startDate || '-'}</p>
            </div>

            {/* Due Date */}
            <div className='flex-1 min-w-0 text-right'>
              <p className={`text-sm font-medium mb-1`}>Due Date</p>
              <p className={`text-base font-medium`}>{dueDate || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Respond to Poll Planning SideSheet */}
      <SideSheet
        title='Add Respond to Poll Planning'
        open={respondSideSheetOpen}
        onOpenChange={setRespondSideSheetOpen}
        size='600px'
      >
        <AddRespondToPollPlanning
          onSave={handleAddRespond}
          onCancel={handleRespondCancel}
          isSubmitting={isSubmitting}
        />
      </SideSheet>

      {/* Add Employee to Poll Planning SideSheet */}
      <SideSheet
        title='Add Employee to Poll Planning'
        open={addEmployeeSideSheetOpen}
        onOpenChange={setAddEmployeeSideSheetOpen}
        size='600px'
      >
        <AddEmployeeToPollPlanning
          onSave={handleAddEmployee}
          onCancel={handleAddEmployeeCancel}
          isSubmitting={isSubmitting}
          availableEmployees={[]}
        />
      </SideSheet>
    </>
  );
}
