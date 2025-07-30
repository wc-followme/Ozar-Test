'use client';
import { AppointmentsComponent } from '@/components/shared/common/AppointmentsComponent';
import { MaterialChecklistComponent } from '@/components/shared/common/MaterialChecklistComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import { TodoChecklistComponent } from '@/components/shared/common/TodoChecklistComponent';
import { TodoComponent } from '@/components/shared/common/TodoComponent';
import { AppointmentForm } from '@/components/shared/forms/AppointmentsForm';
import { TodoForm } from '@/components/shared/forms/TodoForm';
import { cn } from '@/lib/utils';
import { AddCircle } from 'iconsax-react';
import {
  Calendar,
  Hammer,
  Headphones,
  LayoutGrid,
  Package,
  Settings,
} from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';

// Context for managing sidesheet state
interface SideToolbarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SideToolbarContext = createContext<SideToolbarContextType | undefined>(
  undefined
);

export const useSideToolbar = () => {
  const context = useContext(SideToolbarContext);
  if (!context) {
    throw new Error('useSideToolbar must be used within a SideToolbarProvider');
  }
  return context;
};

interface ToolbarItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface SideToolbarProps {
  items: ToolbarItem[];
  className?: string;
}

interface SideToolbarProviderProps {
  children: React.ReactNode;
}

export function SideToolbarProvider({ children }: SideToolbarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SideToolbarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SideToolbarContext.Provider>
  );
}

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  const { isOpen } = useSideToolbar();

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isOpen ? 'mr-[300px]' : 'mr-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SideToolbar({ items, className }: SideToolbarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const { isOpen, setIsOpen } = useSideToolbar();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsOpen(true);
  };

  const handleAddTodoClick = () => {
    setShowTodoForm(true);
  };

  const handleAddAppointmentClick = () => {
    setShowAppointmentForm(true);
  };

  const handleTodoFormSubmit = (data: any) => {
    console.log('Todo form submitted:', data);
    // Handle form submission here
    setShowTodoForm(false);
  };

  const handleTodoFormCancel = () => {
    setShowTodoForm(false);
  };

  const handleAppointmentFormSubmit = (data: any) => {
    console.log('Appointment form submitted:', data);
    // Handle form submission here
    setShowAppointmentForm(false);
  };

  const handleAppointmentFormCancel = () => {
    setShowAppointmentForm(false);
  };

  return (
    <div className={cn('sticky right-0 top-0 h-full z-50', className)}>
      {/* Vertical blue line */}

      {/* Toolbar container */}
      <div className='bg-white h-full flex flex-col justify-start'>
        <div className='flex max-h-[calc(100vh_-_85px)] overflow-auto'>
          {items.map(item => {
            return (
              <>
                <React.Fragment key={item.id}>
                  {isOpen && activeItem === item.id && (
                    <div className='h-full w-[320px] bg-white z-50'>
                      <div className='h-full flex flex-col'>
                        {/* Header */}
                        <div className='flex items-center p-4 gap-4 border-b'>
                          <h2 className='text-lg font-semibold text-gray-900 mr-auto'>
                            {item.label}
                          </h2>
                          {(activeItem === 'tasks' ||
                            activeItem === 'appointments') && (
                            <button
                              onClick={
                                activeItem === 'tasks'
                                  ? handleAddTodoClick
                                  : handleAddAppointmentClick
                              }
                              className='ml-auto p-1 hover:bg-gray-100 rounded transition-colors'
                            >
                              <AddCircle size='20' color='#34AD44' />
                            </button>
                          )}
                          <button
                            onClick={() => setIsOpen(false)}
                            className='hover:bg-gray-100 rounded-md transition-colors p-0'
                          >
                            <svg
                              className='w-5 h-5'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Content */}
                        <div className='flex-1 p-4 overflow-y-auto'>
                          {activeItem === 'tasks' && <TodoComponent />}
                          {activeItem === 'appointments' && (
                            <AppointmentsComponent />
                          )}
                          {activeItem === 'tools' && <TodoChecklistComponent />}
                          {activeItem === 'communication' && (
                            <div className='space-y-4'>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                Communication Hub
                              </h3>
                              <div className='space-y-3'>
                                <div className='p-4 bg-blue-50 rounded-lg'>
                                  <h4 className='font-medium text-blue-900'>
                                    Client Messages
                                  </h4>
                                  <p className='text-sm text-blue-700 mt-1'>
                                    Manage all client communications
                                  </p>
                                </div>
                                <div className='p-4 bg-green-50 rounded-lg'>
                                  <h4 className='font-medium text-green-900'>
                                    Team Chat
                                  </h4>
                                  <p className='text-sm text-green-700 mt-1'>
                                    Internal team discussions
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeItem === 'inventory' && (
                            <MaterialChecklistComponent />
                          )}
                          {activeItem === 'settings' && (
                            <div className='space-y-4'>
                              <h3 className='text-lg font-semibold text-gray-900'>
                                Settings
                              </h3>
                              <div className='space-y-3'>
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                  <h4 className='font-medium text-gray-900'>
                                    Preferences
                                  </h4>
                                  <p className='text-sm text-gray-600 mt-1'>
                                    Customize your workspace
                                  </p>
                                </div>
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                  <h4 className='font-medium text-gray-900'>
                                    Notifications
                                  </h4>
                                  <p className='text-sm text-gray-600 mt-1'>
                                    Manage alert settings
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              </>
            );
          })}
          <div className='flex flex-col space-y-2 p-[10px]'>
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <>
                  <React.Fragment key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        'p-5 rounded-lg transition-all duration-200 hover:bg-gray-50 group relative',
                        isActive && 'bg-green-100 text-green-600'
                      )}
                      title={item.label}
                    >
                      <Icon
                        size={24}
                        className={cn(
                          'transition-colors duration-200',
                          isActive
                            ? 'text-green-600'
                            : 'text-gray-600 group-hover:text-gray-800'
                        )}
                      />

                      {/* Active indicator */}
                      {isActive && (
                        <div className='absolute inset-0 bg-green-100 rounded-lg opacity-20'></div>
                      )}
                    </button>
                  </React.Fragment>
                </>
              );
            })}
          </div>
        </div>
      </div>

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
    </div>
  );
}

// Default toolbar items for job management
export const defaultJobToolbarItems: ToolbarItem[] = [
  {
    id: 'tasks',
    icon: LayoutGrid,
    label: 'To do Lists',
  },
  {
    id: 'appointments',
    icon: Calendar,
    label: 'Appointments',
  },
  {
    id: 'communication',
    icon: Headphones,
    label: 'Communication',
  },
  {
    id: 'tools',
    icon: Hammer,
    label: 'Checklist',
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Materials Checklist',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
  },
];
