'use client';

import { Button } from '@/components/ui/button';
import { ACTIONS, CATEGORY_MESSAGES } from '@/constants/common';
import { Edit2, TickCircle, Trash } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import Dropdown from '../common/Dropdown';
import { AppointmentForm } from '../forms/AppointmentsForm';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import SideSheet from './SideSheet';

interface Appointment {
  id: string;
  date: string;
  title: string;
  timeRange: string;
  appointmentWith: string;
  appointmentDate: string;
  address: string;
  notes: string;
}

interface AppointmentsComponentProps {
  className?: string;
}

export const AppointmentsComponent: React.FC<AppointmentsComponentProps> = ({
  className,
}) => {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(
    'appointment-2'
  );
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<
    string | null
  >(null);
  const [appointments] = useState<Appointment[]>([
    {
      id: 'appointment-1',
      date: 'Tomorrow',
      title: 'Door Fitting',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Esther Howard',
      appointmentDate: '08/12/2024',
      address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
      notes:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar dolor elementum tempus hac.',
    },
    {
      id: 'appointment-2',
      date: '01-05-2025',
      title: 'Door Fitting',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Esther Howard',
      appointmentDate: '08/12/2024',
      address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
      notes:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar dolor elementum tempus hac.',
    },
    {
      id: 'appointment-3',
      date: 'Tomorrow',
      title: 'Discuss door installation',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Jenny Wilson',
      appointmentDate: '09/12/2024',
      address: '123 Main St. Chicago, Illinois 60601',
      notes: 'Review installation requirements and timeline.',
    },
    {
      id: 'appointment-4',
      date: 'Tomorrow',
      title: 'Plan door upgrades',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'John Doe',
      appointmentDate: '10/12/2024',
      address: '456 Oak Ave. Springfield, Illinois 62701',
      notes: 'Discuss upgrade options and pricing.',
    },
    {
      id: 'appointment-5',
      date: 'Tomorrow',
      title: 'Review fitting options',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Jane Smith',
      appointmentDate: '11/12/2024',
      address: '789 Pine St. Peoria, Illinois 61601',
      notes: 'Review different fitting styles and materials.',
    },
  ]);

  const handleAppointmentClick = (appointmentId: string) => {
    setExpandedAppointment(
      expandedAppointment === appointmentId ? null : appointmentId
    );
  };

  const handleMoreOptions = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation();
    console.log('More options for appointment:', appointmentId);
  };

  // Dropdown menu options
  const menuOptions = [
    {
      id: 'completed',
      label: CATEGORY_MESSAGES.COMPLETED_MENU,
      icon: TickCircle,
      action: ACTIONS.COMPLETED,
    },
    {
      id: 'edit',
      label: CATEGORY_MESSAGES.EDIT_MENU,
      icon: Edit2,
      action: ACTIONS.EDIT,
    },
    {
      id: 'delete',
      label: CATEGORY_MESSAGES.DELETE_MENU,
      icon: Trash,
      action: ACTIONS.DELETE,
    },
  ];

  const handleMenuAction = (action: string, appointmentId: string) => {
    switch (action) {
      case ACTIONS.COMPLETED:
        console.log('Mark appointment as completed:', appointmentId);
        // TODO: Implement mark as completed functionality
        break;
      case ACTIONS.EDIT:
        setEditingAppointmentId(appointmentId);
        setIsEditSheetOpen(true);
        break;
      case ACTIONS.DELETE:
        setDeletingAppointmentId(appointmentId);
        setIsDeleteModalOpen(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleFormSubmit = (data: any) => {
    // Handle form submission for editing the appointment
    console.log('Form submitted:', data);
    console.log('Editing appointment:', editingAppointmentId);

    // Here you would typically update the appointment data
    // For now, just close the sidesheet
    setIsEditSheetOpen(false);
  };

  const handleFormCancel = () => {
    setIsEditSheetOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingAppointmentId) {
      // Remove the appointment from the state
      // For now, just log the deletion
      console.log('Deleting appointment:', deletingAppointmentId);
    }
    setIsDeleteModalOpen(false);
    setDeletingAppointmentId(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingAppointmentId(null);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {appointments.map(
        ({
          id: appointmentId,
          date,
          title,
          timeRange,
          appointmentWith,
          appointmentDate,
          address,
          notes,
        }) => {
          const isExpanded = expandedAppointment === appointmentId;

          return (
            <div
              key={appointmentId}
              className='bg-[var(--background)] p-3 rounded-[10px]'
              onClick={() => handleAppointmentClick(appointmentId)}
            >
              {/* Basic Info - Always Visible */}
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-xs font-medium text-[var(--text-secondary)]'>
                      {date}
                    </span>
                  </div>
                  <h3 className='text-base font-semibold text-[var(--text-dark)] mb-1'>
                    {title}
                  </h3>
                  <p className='text-sm text-[var(--text-dark)]'>{timeRange}</p>
                </div>
                <Dropdown
                  menuOptions={menuOptions}
                  onAction={action => handleMenuAction(action, appointmentId)}
                  trigger={
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 p-0 mt-auto mb-auto'
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreVertical
                        size={24}
                        className='text-[var(--text-dark)] !w-5 !h-5'
                      />
                    </Button>
                  }
                  align='end'
                />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className='mt-4 space-y-2'>
                  {/* Appointment Details */}
                  <div className='border-t border-[var(--border-dark)] pt-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-[12px] font-medium text-[var()] leading-[100%] tracking-[0%] mb-1'>
                          Appointment with
                        </p>
                        <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                          {appointmentWith}
                        </p>
                      </div>
                      <div>
                        <p className='text-[12px] font-medium text-[var()] leading-[100%] tracking-[0%] mb-1'>
                          Date
                        </p>
                        <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                          {appointmentDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className='border-t border-[var(--border-dark)] pt-2'>
                    <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                      Address
                    </p>
                    <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                      {address}
                    </p>
                  </div>

                  {/* Notes */}
                  <div className='border-t border-[var(--border-dark)] pt-2'>
                    <p className='text-[12px] font-medium text-[var()] leading-[100%] tracking-[0%] mb-1'>
                      Notes
                    </p>
                    <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                      {notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        }
      )}

      {/* Edit Appointment SideSheet */}
      <SideSheet
        title='Edit Appointment'
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        size='600px'
      >
        <div className='space-y-4'>
          <AppointmentForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={false}
          />
        </div>
      </SideSheet>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        title='Archive Appointment'
        subtitle={`Are you sure you want to Archive this appointment? This action cannot be undone.`}
        onCancel={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};
