'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CATEGORY_MESSAGES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Edit2, TickCircle, Trash } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Dropdown from '../common/Dropdown';
import { AppointmentForm } from '../forms/AppointmentsForm';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import SideSheet from './SideSheet';

interface AppointmentEmployee {
  id: string;
  uuid: string;
  appointment_id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  status: string;
  user: {
    id: number;
    uuid: string;
    name: string;
    email: string;
    phone_number: string;
    profile_picture_url: string;
  };
}

interface AppointmentCompletion {
  id: string;
  uuid: string;
  appointment_id: string;
  user_id: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  };
}

interface Appointment {
  id: string;
  uuid: string;
  agenda: string;
  appointment_with: string;
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  notes: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  status: string;
  creator: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  };
  employees: AppointmentEmployee[];
  completions: AppointmentCompletion[];
  completionPercentage: number;
  totalEmployees: number;
  completedEmployees: number;
  currentUserCompleted: boolean;
}

interface AppointmentFormData {
  agenda: string;
  appointmentWith: string;
  date: Date;
  starts: string;
  ends: string;
  address: string;
  notes: string;
  employees: string[];
}

interface AppointmentsComponentProps {
  className?: string;
}

export const AppointmentsComponent: React.FC<AppointmentsComponentProps> = ({
  className,
}) => {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(
    null
  );
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  // Fetch appointments function
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.fetchAppointments({
        page: 1,
        limit: 50,
      });

      if (response.statusCode === 200 && response.data?.data) {
        const appointmentsData: Appointment[] = response.data.data;
        setAppointments(appointmentsData);
      } else {
        setError(response.message || 'Failed to fetch appointments');
        showErrorToast(response.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const message = extractApiErrorMessage(
        error,
        'Failed to fetch appointments'
      );
      setError(message);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointment data for editing
  const fetchAppointmentForEdit = async (appointmentUuid: string) => {
    setEditLoading(true);
    try {
      const response = await apiService.fetchAppointmentById(appointmentUuid);
      if (response.statusCode === 200 && response.data) {
        setEditingAppointment(response.data);
        setIsEditSheetOpen(true);
      } else {
        showErrorToast(
          response.message || 'Failed to fetch appointment details'
        );
      }
    } catch (error) {
      console.error('Error fetching appointment for edit:', error);
      const message = extractApiErrorMessage(
        error,
        'Failed to fetch appointment details'
      );
      showErrorToast(message);
    } finally {
      setEditLoading(false);
    }
  };

  // Helper function to format date display
  const formatDateDisplay = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to convert 24-hour format to 12-hour AM/PM format
  const formatTimeDisplay = (timeString: string) => {
    try {
      // Remove seconds if present (e.g., "09:30:00" -> "09:30")
      const timeWithoutSeconds = timeString.split(':').slice(0, 2).join(':');
      const [hours, minutes] = timeWithoutSeconds.split(':');

      if (!hours || !minutes) return timeString;

      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const handleAppointmentClick = (appointmentId: string) => {
    setExpandedAppointment(
      expandedAppointment === appointmentId ? null : appointmentId
    );
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
        // TODO: Implement mark as completed functionality
        break;
      case ACTIONS.EDIT:
        // Find the appointment by ID and get its UUID
        const appointment = appointments.find(app => app.id === appointmentId);
        if (appointment) {
          fetchAppointmentForEdit(appointment.uuid);
        } else {
          showErrorToast('Appointment not found');
        }
        break;
      case ACTIONS.DELETE:
        setDeletingAppointmentId(appointmentId);
        setIsDeleteModalOpen(true);
        break;
      default:
    }
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = data.date
        ? data.date.toISOString().split('T')[0]
        : '';

      if (!formattedDate) {
        showErrorToast('Please select a valid date');
        return;
      }

      // Convert employees array to comma-separated string
      const userUuids = data.employees.join(',');

      // Convert 12-hour format to 24-hour format
      const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        if (!time || !modifier) return time12h; // Return original if parsing fails

        const timeParts = time.split(':');
        if (timeParts.length !== 2) return time12h; // Return original if parsing fails

        let hours = timeParts[0];
        const minutes = timeParts[1];

        if (!hours || !minutes) return time12h; // Return original if parsing fails

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

      let response;
      if (editingAppointment) {
        // Update existing appointment
        response = await apiService.updateAppointment(
          editingAppointment.uuid,
          payload
        );
        if (response.statusCode === 200 || response.statusCode === 201) {
          showSuccessToast(
            extractApiSuccessMessage(
              response,
              'Appointment updated successfully'
            )
          );
        } else {
          showErrorToast(response.message || 'Failed to update appointment');
        }
      } else {
        // Create new appointment
        response = await apiService.createAppointment(payload);
        if (response.statusCode === 200 || response.statusCode === 201) {
          showSuccessToast(
            extractApiSuccessMessage(
              response,
              'Appointment created successfully'
            )
          );
        } else {
          showErrorToast(response.message || 'Failed to create appointment');
        }
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        setIsEditSheetOpen(false);
        setEditingAppointment(null);
        // Refresh appointments list
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      const message = extractApiErrorMessage(
        error,
        editingAppointment
          ? 'Failed to update appointment'
          : 'Failed to create appointment'
      );
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsEditSheetOpen(false);
    setEditingAppointment(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAppointmentId) {
      // Remove the appointment from the state
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
      {/* Add Appointment Button */}
      <div className='flex justify-end mb-4'>
        <Button
          onClick={() => {
            setEditingAppointment(null);
            setIsEditSheetOpen(true);
          }}
          className='btn-primary'
          disabled={loading}
        >
          Add New Appointment
        </Button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
            <p className='text-sm text-muted-foreground'>
              Loading appointments...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className='flex justify-center items-center py-8'>
          <div className='text-center'>
            <p className='text-sm text-destructive'>{error}</p>
            <Button
              onClick={fetchAppointments}
              variant='outline'
              size='sm'
              className='mt-2'
            >
              Retry
            </Button>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className='flex justify-center items-center py-8'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              No appointments found
            </p>
          </div>
        </div>
      ) : (
        appointments.map(
          ({
            id: appointmentId,
            agenda,
            appointment_with,
            date,
            start_time,
            end_time,
            address,
            notes,
            completionPercentage,
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
                        {formatDateDisplay(date)}
                      </span>
                      {completionPercentage > 0 && (
                        <span className='text-xs font-medium text-green-600'>
                          {completionPercentage}% Complete
                        </span>
                      )}
                    </div>
                    <h3 className='text-base font-semibold text-[var(--text-dark)] mb-1'>
                      {agenda}
                    </h3>
                    <p className='text-sm text-[var(--text-dark)]'>
                      {formatTimeDisplay(start_time)} -{' '}
                      {formatTimeDisplay(end_time)}
                    </p>
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
                          <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                            Appointment with
                          </p>
                          <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                            {appointment_with}
                          </p>
                        </div>
                        <div>
                          <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                            Date
                          </p>
                          <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                            {formatDateDisplay(date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    {/* <div className='border-t border-[var(--border-dark)] pt-2'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                          <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                            Time
                          </p>
                          <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                            {formatTimeDisplay(start_time)} -{' '}
                            {formatTimeDisplay(end_time)}
                          </p>
                        </div>
                        <div>
                          <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                            Employees ({totalEmployees})
                          </p>
                          <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                            {completedEmployees} completed
                          </p>
                        </div>
                      </div>
                    </div> */}

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
                    {notes && (
                      <div className='border-t border-[var(--border-dark)] pt-2'>
                        <p className='text-[12px] font-medium text-[var(--text-secondary)] leading-[100%] tracking-[0%] mb-1'>
                          Notes
                        </p>
                        <p className='text-[14px] font-medium text-[var(--text-dark)] leading-[22px] tracking-[0px]'>
                          {notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
        )
      )}

      {/* Add/Edit Appointment SideSheet */}
      <SideSheet
        title={editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        size='600px'
      >
        <div className='space-y-4'>
          {editLoading ? (
            <div className='flex justify-center items-center py-8'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
                <p className='text-sm text-muted-foreground'>
                  Loading appointment details...
                </p>
              </div>
            </div>
          ) : (
            <AppointmentForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={isSubmitting}
              editingAppointment={editingAppointment}
            />
          )}
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
