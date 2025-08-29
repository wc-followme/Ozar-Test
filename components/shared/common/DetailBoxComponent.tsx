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
}: DetailBoxProps) {
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [respondSideSheetOpen, setRespondSideSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock employee data - in real app, this would come from props or API
  const availableEmployees = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Project Manager',
      profilePicture: '/images/user-img-placeholder.png',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Developer',
      profilePicture: '/images/user-img-placeholder.png',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'Designer',
      profilePicture: '/images/user-img-placeholder.png',
    },
  ];

  const handleAddToPoll = async (pollData: {
    room: string;
    trade: string;
    service: string;
    employeeIds: string[];
  }) => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the poll data
      console.log('Creating poll with data:', pollData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the sidesheet after successful submission
      setSideSheetOpen(false);

      // You might want to show a success toast here
      console.log('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSideSheetOpen(false);
  };

  const handleRespondCancel = () => {
    setRespondSideSheetOpen(false);
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
        className={`rounded-[10px] p-4 border flex border-[var(--border-dark)] ${className}`}
      >
        {/* Drag Handle - 6 dots icon (only shown when showDragHandle is true) */}
        {showDragHandle && (
          <div
            className='flex flex-col space-y-1 mr-3 cursor-grab active:cursor-grabbing'
            {...dragHandleProps?.listeners}
            {...dragHandleProps?.attributes}
          >
            <IconGripVertical size={20} color='var(--text-secondary)' />
          </div>
        )}

        {/* Content Section */}
        <div className='flex-1 flex flex-col'>
          {/* Top Section - Service Name and Add Button */}
          <div className='w-full flex items-center justify-between mb-4'>
            {/* Left Section - Text Content */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-[var(--text-secondary)] font-medium mb-1'>
                {label}
              </p>
              <p className='text-[var(--text-dark)] text-base font-medium truncate'>
                {value}
              </p>
            </div>

            {/* Right Section - Add Button */}
            {showAddButton && (
              <button
                className='w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors'
                onClick={() => setSideSheetOpen(true)}
              >
                <AddCircle size='30' color='#34AD44' />
              </button>
            )}
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
                    <span className='text-[var(--text-dark)] text-xs font-medium'>
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section - Start Date and Due Date (always shown) */}
          <div className='flex items-center justify-between mt-auto'>
            {/* Start Date */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-[var(--text-secondary)] font-medium mb-1'>
                Start Date
              </p>
              <p className='text-[var(--text-dark)] text-base font-medium'>
                {startDate || '-'}
              </p>
            </div>

            {/* Due Date */}
            <div className='flex-1 min-w-0 text-right'>
              <p className='text-sm text-[var(--text-secondary)] font-medium mb-1'>
                Due Date
              </p>
              <p className='text-[var(--text-dark)] text-base font-medium'>
                {dueDate || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Planning SideSheet */}
      {showAddButton && (
        <SideSheet
          title='Add Employee to Poll Planning'
          open={sideSheetOpen}
          onOpenChange={setSideSheetOpen}
          size='600px'
        >
          <AddEmployeeToPollPlanning
            onSave={handleAddToPoll}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            availableEmployees={availableEmployees}
          />
        </SideSheet>
      )}

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
    </>
  );
}
