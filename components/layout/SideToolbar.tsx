'use client';
import {
  AppointmentsComponent,
  AppointmentsComponentRef,
} from '@/components/shared/common/AppointmentsComponent';
import { MaterialChecklistComponent } from '@/components/shared/common/MaterialChecklistComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import {
  TodoComponent,
  TodoComponentRef,
} from '@/components/shared/common/TodoComponent';
import { AppointmentForm } from '@/components/shared/forms/AppointmentsForm';
import { TodoForm } from '@/components/shared/forms/TodoForm';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import {
  cn,
  extractApiErrorMessage,
  extractApiSuccessMessage,
} from '@/lib/utils';
import { IconX } from '@tabler/icons-react';
import { AddCircle, Setting4 } from 'iconsax-react';
import React, { createContext, useContext, useRef, useState } from 'react';
import { MaterialCheckListIcon } from '../icons/MaterialCheckListIcon';
import { SupportIcon } from '../icons/SupportIcon';
import { TodoListIcon } from '../icons/TodoListIcon';
import { ToolListIcon } from '../icons/ToolListIcon';
import FloatingActionButtonWrapper from '../shared/common/FloatingActionButtonWrapper';
import { ToolsChecklistComponent } from '../shared/common/ToolsChecklistComponent';

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
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    color?: string;
  }>;
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
  const todoComponentRef = useRef<TodoComponentRef>(null);
  const appointmentsComponentRef = useRef<AppointmentsComponentRef>(null);
  const { isOpen, setIsOpen } = useSideToolbar();
  const { showSuccessToast, showErrorToast } = useToast();

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

  const handleTodoFormSubmit = () => {
    // Handle form submission here
    setShowTodoForm(false);
    // Refresh the todo list after successful form submission
    if (todoComponentRef.current) {
      todoComponentRef.current.refresh();
    }
  };

  const handleTodoFormCancel = () => {
    setShowTodoForm(false);
  };

  const handleAppointmentFormSubmit = async (data: any) => {
    console.log(
      'SideToolbar - handleAppointmentFormSubmit called with data:',
      data
    );

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = data.date
        ? data.date.toISOString().split('T')[0]
        : '';

      if (!formattedDate) {
        console.error('No valid date provided');
        return;
      }

      // Convert employees array to comma-separated string
      const userUuids = data.employees.join(',');

      // Convert 12-hour format to 24-hour format
      const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        if (!time || !modifier) return time12h;

        const timeParts = time.split(':');
        if (timeParts.length !== 2) return time12h;

        let hours = timeParts[0];
        const minutes = timeParts[1];

        if (!hours || !minutes) return time12h;

        if (hours === '12') {
          hours = modifier === 'PM' ? '12' : '00';
        } else if (modifier === 'PM') {
          hours = String(parseInt(hours) + 12);
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
      };

      const payload = {
        agenda: data.agenda,
        appointment_with: data.appointmentWith,
        date: formattedDate,
        start_time: convertTo24Hour(data.starts),
        end_time: convertTo24Hour(data.ends),
        address: data.address,
        notes: data.notes || '',
        user_uuids: userUuids,
      };

      // Create new appointment
      const response = await apiService.createAppointment(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(
          extractApiSuccessMessage(response, 'Appointment created successfully')
        );
        setShowAppointmentForm(false);
        // Refresh appointments list
        appointmentsComponentRef.current?.refreshAppointments();
      } else {
        showErrorToast(response.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('SideToolbar - Error creating appointment:', error);
      const message = extractApiErrorMessage(
        error,
        'Failed to create appointment'
      );
      showErrorToast(message);
    }
  };

  const handleAppointmentFormCancel = () => {
    setShowAppointmentForm(false);
  };

  return (
    <div className={cn('sticky right-0 top-0 h-full z-50', className)}>
      {/* Vertical blue line */}

      {/* Toolbar container */}
      <div className='bg-transparent h-full flex flex-col justify-start'>
        <div className='flex h-full max-h-[calc(100vh_-_85px)] overflow-auto'>
          {items.map(item => {
            return (
              <React.Fragment key={item.id}>
                {isOpen && activeItem === item.id && (
                  <div
                    className={`h-full w-[320px] bg-transparent z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
                  >
                    <div className='h-full flex flex-col'>
                      <div className='flex items-center p-4 gap-2 border-b'>
                        <h2 className='text-lg font-semibold text-[var(--text-dark)] mr-auto'>
                          {item.label}
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
                            <AddCircle
                              size='20'
                              className='text-greenbrand'
                              color='var(--secondary)'
                            />
                          </button>
                        )}
                        <button
                          onClick={() => setIsOpen(false)}
                          className='rounded-md transition-colors p-0'
                        >
                          <IconX size='20' color='var(--text-dark)' />
                        </button>
                      </div>

                      {/* Content */}
                      <div className='flex-1 p-4 overflow-y-auto'>
                        {(() => {
                          switch (activeItem) {
                            case 'todoList':
                              return <TodoComponent ref={todoComponentRef} />;
                            case 'appointmentList':
                              return (
                                <AppointmentsComponent
                                  ref={appointmentsComponentRef}
                                />
                              );
                            case 'toolChecklist':
                              return <ToolsChecklistComponent />;
                            case 'materialChecklist':
                              return <MaterialChecklistComponent />;
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <div className='hidden lg:flex flex-col space-y-2 p-[10px] h-full'>
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'h-[60px] w-[60px] text-[var(--text-dark)] flex items-center justify-center rounded-2xl transition-all duration-200 hover:bg-greenbrand-100 group relative',
                      isActive && 'bg-greenbrand-100 text-greenbrand',
                      item.id === 'settings' && 'mt-auto'
                    )}
                    title={item.label}
                  >
                    <Icon
                      size={24}
                      className={cn(
                        'transition-colors duration-200',
                        isActive
                          ? 'text-greenbrand'
                          : 'text-[var(--text-dark)] group-hover:text-greenbrand'
                      )}
                      color={
                        isActive ? 'var(--greenbrand)' : 'var(--text-dark)'
                      }
                    />
                  </button>
                </React.Fragment>
              );
            })}
            <button
              className={
                'h-[60px] w-[60px] text-[var(--text-dark)] !mt-auto flex items-center justify-center rounded-2xl transition-all duration-200 hover:bg-greenbrand-100'
              }
            >
              <Setting4
                size={24}
                className={cn('transition-colors duration-200')}
                color={'var(--text-dark)'}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Floating Action Button - Only visible on tablet and mobile */}
      <div className='block lg:hidden'>
        <FloatingActionButtonWrapper />
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
    id: 'todoList',
    icon: TodoListIcon,
    label: 'To do Lists',
  },
  {
    id: 'appointmentList',
    icon: SupportIcon,
    label: 'Appointments',
  },
  {
    id: 'toolChecklist',
    icon: ToolListIcon,
    label: 'Tools Check List',
  },
  {
    id: 'materialChecklist',
    icon: MaterialCheckListIcon,
    label: 'Materials Check List',
  },
];
