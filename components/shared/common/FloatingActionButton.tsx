'use client';

import { IconCategoryPlus, IconX } from '@tabler/icons-react';
import { Add, AddCircle } from 'iconsax-react';
import React, { useState } from 'react';
import { MaterialCheckListIcon } from '../../icons/MaterialCheckListIcon';
import { SupportIcon } from '../../icons/SupportIcon';
import { TodoListIcon } from '../../icons/TodoListIcon';
import { ToolListIcon } from '../../icons/ToolListIcon';
import { Button } from '../../ui/button';
import { AppointmentForm } from '../forms/AppointmentsForm';
import { CreateJobForm } from '../forms/CreateJobForm';
import { TodoForm } from '../forms/TodoForm';
import { AppointmentsComponent } from './AppointmentsComponent';
import { MaterialChecklistComponent } from './MaterialChecklistComponent';
import SideSheet from './SideSheet';
import { TodoComponent } from './TodoComponent';
import { ToolsChecklistComponent } from './ToolsChecklistComponent';

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
  toolbarItems?: ToolbarItem[];
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
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
    setActiveItem(itemId);
    setIsToolbarOpen(true);
    setIsActive(false);
  };

  const handleAddTodoClick = () => {
    setShowTodoForm(true);
    setIsActive(false);
    setIsToolbarOpen(false);
  };

  const handleAddAppointmentClick = () => {
    setShowAppointmentForm(true);
    setIsActive(false);
    setIsToolbarOpen(false);
  };

  const handleTodoFormSubmit = () => {
    setShowTodoForm(false);
  };

  const handleTodoFormCancel = () => {
    setShowTodoForm(false);
  };

  const handleAppointmentFormSubmit = () => {
    setShowAppointmentForm(false);
  };

  const handleAppointmentFormCancel = () => {
    setShowAppointmentForm(false);
  };

  const handleJobClick = () => {
    setShowJobSheet(true);
    setIsActive(false);
    setIsToolbarOpen(false);
  };

  const handleCreateJobSubmit = () => {
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
        <Button
          className={`fabTrigger h-14 w-14 rounded-full shadow-lg !bg-[var(--secondary)] ${isActive ? 'active' : ''}`}
          onClick={handleToggle}
        >
          <div className='relative h-full w-full flex items-center justify-center'>
            {/* Category Plus Icon - fades out when active */}
            <div className={`category-plus-icon ${isActive ? 'fade-out' : ''}`}>
              <IconCategoryPlus size={32} color='#fff' className='!h-8 !w-8' />
            </div>

            {/* Close Icon (X) - fades in when active */}
            <div className={`close-icon ${isActive ? 'fade-in' : ''}`}>
              <IconX size={32} color='#fff' className='!h-8 !w-8' />
            </div>
          </div>
        </Button>

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
                  className='text-greenbrand !h-8 !w-8'
                  color='var(--greenbrand)'
                />
              </button>
            );
          })}
          <button
            className={`fabButton ${isActive ? 'active' : ''} sm:hidden`}
            data-tooltip='Jobs'
            onClick={handleJobClick}
          >
            <Add size='32' className='text-greenbrand sm:hidden' />
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
                    <AddCircle size='20' className='text-greenbrand' />
                  </button>
                )}
              </div>

              <div className='flex-1 py-4 overflow-y-auto'>
                {activeItem === 'todoList' && <TodoComponent />}
                {activeItem === 'appointmentList' && <AppointmentsComponent />}
                {activeItem === 'toolChecklist' && <ToolsChecklistComponent />}
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
