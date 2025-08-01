'use client';

import { Add, AddCircle } from 'iconsax-react';
import React, { useState } from 'react';
import { MaterialCheckListIcon } from '../../icons/MaterialCheckListIcon';
import { SupportIcon } from '../../icons/SupportIcon';
import { TodoListIcon } from '../../icons/TodoListIcon';
import { ToolListIcon } from '../../icons/ToolListIcon';
import { AppointmentForm } from '../forms/AppointmentsForm';
import { CreateJobForm } from '../forms/CreateJobForm';
import { TodoForm } from '../forms/TodoForm';
import { AppointmentsComponent } from './AppointmentsComponent';
import { MaterialChecklistComponent } from './MaterialChecklistComponent';
import SideSheet from './SideSheet';
import { TodoChecklistComponent } from './TodoChecklistComponent';
import { TodoComponent } from './TodoComponent';

interface ToolbarItem {
  id: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    color?: string;
  }>;
  label: string;
}

const toolbarItems: ToolbarItem[] = [
  { id: 'todoList', icon: TodoListIcon, label: 'To do Lists' },
  { id: 'appointmentList', icon: SupportIcon, label: 'Appointments' },
  { id: 'toolChecklist', icon: ToolListIcon, label: 'Tools Check List' },
  {
    id: 'materialChecklist',
    icon: MaterialCheckListIcon,
    label: 'Materials Check List',
  },
];

interface FloatingActionButtonProps {
  onToolbarClick?: () => void;
  toolbarItems?: ToolbarItem[];
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onToolbarClick,
  toolbarItems: externalToolbarItems,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showJobSheet, setShowJobSheet] = useState(false);

  const items = externalToolbarItems || toolbarItems;

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleOverlayClick = () => {
    setIsActive(false);
  };

  const handleToolbarClick = (itemId: string) => {
    console.log('Opening component for:', itemId);
    setActiveItem(itemId);
    setIsToolbarOpen(true);
    setIsActive(false);
  };

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleAddTodoClick = () => {
    setShowTodoForm(true);
  };

  const handleAddAppointmentClick = () => {
    setShowAppointmentForm(true);
  };

  const handleTodoFormSubmit = (data: any) => {
    console.log('Todo form submitted:', data);
    setShowTodoForm(false);
  };

  const handleTodoFormCancel = () => {
    setShowTodoForm(false);
  };

  const handleAppointmentFormSubmit = (data: any) => {
    console.log('Appointment form submitted:', data);
    setShowAppointmentForm(false);
  };

  const handleAppointmentFormCancel = () => {
    setShowAppointmentForm(false);
  };

  const handleJobClick = () => {
    setShowJobSheet(true);
    setIsActive(false);
  };

  const handleCreateJobSubmit = (data: any) => {
    console.log('Create job form submitted:', data);
    setShowJobSheet(false);
  };

  const handleCreateJobCancel = () => {
    setShowJobSheet(false);
  };

  return (
    <>
      {/* Overlay */}
      {isActive && (
        <div
          className='fabOverlay active'
          onClick={handleOverlayClick}
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            zIndex: 100,
            top: 0,
            left: 0,
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
            transition: '0.25s',
          }}
        />
      )}

      {/* FAB Widget */}
      <div className={`fabWidget ${isActive ? 'active' : ''}`}>
        <div
          className={`fabTrigger h-14 w-14 rounded-full shadow-lg bg-[var(--secondary)] ${isActive ? 'active' : ''}`}
          onClick={handleToggle}
        >
          <svg
            className='chat-bubble h-full w-full'
            width='80'
            height='80'
            viewBox='0 0 100 100'
          >
            <g className='bubble'>
              <path
                className='line line1'
                d='M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961 36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342 69.29995,40.103201 69.29995,46.784744'
              />
              <path
                className='line line2'
                d='M 13.461999,65.039335 H 58.028684 C 63.483128,65.039335 69.243089,59.000293 69.243089,54.928561 V 45.605853 C 69.243089,40.986964 65.02087,35.419884 58.339327,35.419884'
              />
            </g>
            <circle className='circle circle1' r='1.9' cy='50.7' cx='42.5' />
            <circle className='circle circle2' cx='49.9' cy='50.7' r='1.9' />
            <circle className='circle circle3' r='1.9' cy='50.7' cx='57.3' />
          </svg>
        </div>

        <div className='fabList'>
          {/* Toolbar Items */}

          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`fabButton ${isActive ? 'active' : ''}`}
                data-tooltip={item.label}
                onClick={() => handleToolbarClick(item.id)}
              >
                <Icon
                  size={16}
                  className='text-[#34AD44] !h-8 !w-8'
                  color='#34AD44'
                />
              </button>
            );
          })}
          <button
            className={`fabButton ${isActive ? 'active' : ''}`}
            data-tooltip='Jobs'
            onClick={handleJobClick}
          >
            <Add size='32' color='#34AD44' className='sm:hidden' />
          </button>
        </div>
      </div>

      {/* Toolbar SideSheet */}
      <SideSheet
        title={''}
        open={isToolbarOpen}
        onOpenChange={setIsToolbarOpen}
        size='600px'
      >
        <div className='h-full flex flex-col'>
          {/* Show content directly when item is selected */}
          {activeItem && (
            <>
              <div className='flex items-center pb-4 gap-4 border-b'>
                <h2 className='text-lg font-semibold text-[var(--text-dark)] mr-auto'>
                  {items.find(item => item.id === activeItem)?.label}
                </h2>
                {(activeItem === 'todoList' ||
                  activeItem === 'appointmentList') && (
                  <button
                    onClick={
                      activeItem === 'todoList'
                        ? handleAddTodoClick
                        : handleAddAppointmentClick
                    }
                    className='ml-auto p-1 rounded transition-colors'
                  >
                    <AddCircle size='20' color='#34AD44' />
                  </button>
                )}
              </div>

              <div className='flex-1 py-4 overflow-y-auto'>
                {activeItem === 'todoList' && <TodoComponent />}
                {activeItem === 'appointmentList' && <AppointmentsComponent />}
                {activeItem === 'toolChecklist' && <TodoChecklistComponent />}
                {activeItem === 'materialChecklist' && (
                  <MaterialChecklistComponent />
                )}
              </div>
            </>
          )}
        </div>
      </SideSheet>

      {/* TodoForm SideSheet */}
      <SideSheet
        title='Add To Do List'
        open={showTodoForm}
        onOpenChange={setShowTodoForm}
        size='600px'
      >
        <TodoForm
          onSubmit={handleTodoFormSubmit}
          onCancel={handleTodoFormCancel}
        />
      </SideSheet>

      {/* AppointmentForm SideSheet */}
      <SideSheet
        title='Add Appointment'
        open={showAppointmentForm}
        onOpenChange={setShowAppointmentForm}
        size='600px'
      >
        <AppointmentForm
          onSubmit={handleAppointmentFormSubmit}
          onCancel={handleAppointmentFormCancel}
        />
      </SideSheet>

      {/* Create Job SideSheet */}
      <SideSheet
        title='Create Job'
        open={showJobSheet}
        onOpenChange={setShowJobSheet}
        size='600px'
      >
        <CreateJobForm
          onSubmit={handleCreateJobSubmit}
          onCancel={handleCreateJobCancel}
          isSubmitting={false}
        />
      </SideSheet>
    </>
  );
};

export default FloatingActionButton;
