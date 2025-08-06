'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { APPOINTMENT_MESSAGES, STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar } from 'iconsax-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';
import { TimePicker } from '../common/TimePicker';

interface Employee {
  id: number;
  uuid: string;
  name: string;
  email: string;
  profile_picture_url: string;
  status: string;
}

// Validation schema
const appointmentFormSchema = yup.object({
  agenda: yup.string().required(APPOINTMENT_MESSAGES.AGENDA_REQUIRED),
  appointmentWith: yup
    .string()
    .required(APPOINTMENT_MESSAGES.APPOINTMENT_WITH_REQUIRED),
  date: yup.date().required(APPOINTMENT_MESSAGES.DATE_REQUIRED),
  starts: yup.string().required(APPOINTMENT_MESSAGES.STARTS_REQUIRED),
  ends: yup.string().required(APPOINTMENT_MESSAGES.ENDS_REQUIRED),
  address: yup.string().required(APPOINTMENT_MESSAGES.ADDRESS_REQUIRED),
  notes: yup.string().optional().default(''),
  employees: yup
    .array()
    .of(yup.string().required())
    .min(1, APPOINTMENT_MESSAGES.EMPLOYEES_REQUIRED)
    .default([]),
});

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

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentFormSchema),
    defaultValues: {
      agenda: '',
      appointmentWith: '',
      date: new Date(),
      starts: '',
      ends: '',
      address: '',
      notes: '',
      employees: [],
    },
  });

  // Debug employees state
  React.useEffect(() => {
    console.log('AppointmentsForm - Employees array length:', employees.length);
    console.log('AppointmentsForm - Employees data:', employees);
    console.log(
      'AppointmentsForm - MultiSelect options:',
      employees.map(employee => ({
        value: employee.uuid,
        label: employee.name,
        image: employee.profile_picture_url || '/images/profile.jpg',
      }))
    );
  }, [employees]);

  // Fetch employees on component mount
  React.useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      try {
        // Get company ID from localStorage
        const selectedCompany = localStorage.getItem(
          STORAGE_KEYS.SELECTED_COMPANY
        );
        const companyId = selectedCompany
          ? JSON.parse(selectedCompany)?.id
          : null;

        if (!companyId) {
          console.warn(
            'No company ID found in localStorage - employees will not be loaded'
          );
          setEmployees([]);
          return;
        }

        const response = await apiService.fetchUsersDropdown({
          company_id: companyId,
          page: 1,
          limit: 50,
        });

        if (response.data) {
          console.log('AppointmentsForm API Response:', response);
          console.log('AppointmentsForm Response data:', response.data);

          // The response structure is: { data: [...], total: 1, page: 1, limit: 50, totalPages: 1 }
          let employeesData = [];
          if (response.data && Array.isArray(response.data)) {
            employeesData = response.data;
          } else if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            employeesData = response.data.data;
          }

          const mappedEmployees = employeesData.map((employee: any) => ({
            id: employee.id,
            uuid: employee.uuid,
            name: employee.name,
            email: employee.email,
            profile_picture_url:
              employee.profile_picture_url || '/images/profile.jpg',
            status: employee.status || 'ACTIVE',
          }));

          console.log('AppointmentsForm Mapped employees:', mappedEmployees);
          setEmployees(mappedEmployees);
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setEmployees([]);
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeChange = (employees: string[]) => {
    setSelectedEmployees(employees);
    setValue('employees', employees);
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Ensure employees data is included in the submission
    data.employees = selectedEmployees;

    try {
      await onSubmit(data);
    } catch (error) {
      console.error('AppointmentsForm - Error calling onSubmit:', error);
    }
  };

  return (
    <div className='w-full'>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='space-y-2 md:space-y-4'
        noValidate
      >
        {/* Agenda */}
        <div className='space-y-2'>
          <Label htmlFor='agenda' className='field-label'>
            {APPOINTMENT_MESSAGES.AGENDA_LABEL}
          </Label>
          <Controller
            name='agenda'
            control={control}
            render={({ field }) => (
              <Input
                id='agenda'
                placeholder={APPOINTMENT_MESSAGES.AGENDA_PLACEHOLDER}
                value={field.value}
                onChange={field.onChange}
                className={cn(
                  'input-field',
                  errors.agenda
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
                disabled={loading}
              />
            )}
          />
          <FormErrorMessage message={errors.agenda?.message || ''} />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='employees' className='field-label'>
            {APPOINTMENT_MESSAGES.EMPLOYEES_LABEL}
          </Label>
          <MultiSelect
            options={employees.map(employee => ({
              value: employee.uuid,
              label: employee.name,
              image: employee.profile_picture_url || '/images/profile.jpg',
            }))}
            value={selectedEmployees}
            onChange={handleEmployeeChange}
            placeholder={
              employeesLoading
                ? 'Loading employees...'
                : APPOINTMENT_MESSAGES.EMPLOYEES_PLACEHOLDER
            }
            error={errors.employees?.message || ''}
          />
        </div>
        {/* Appointment with & Date */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Appointment with */}
          <div className='space-y-2'>
            <Label htmlFor='appointmentWith' className='field-label'>
              {APPOINTMENT_MESSAGES.APPOINTMENT_WITH_LABEL}
            </Label>
            <Controller
              name='appointmentWith'
              control={control}
              render={({ field }) => (
                <Input
                  id='appointmentWith'
                  placeholder={
                    APPOINTMENT_MESSAGES.APPOINTMENT_WITH_PLACEHOLDER
                  }
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.appointmentWith
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                  disabled={loading}
                />
              )}
            />
            <FormErrorMessage message={errors.appointmentWith?.message || ''} />
          </div>

          {/* Date */}
          <div className='space-y-2'>
            <Label htmlFor='date' className='field-label'>
              {APPOINTMENT_MESSAGES.DATE_LABEL}
            </Label>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                        !field.value && 'text-muted-foreground',
                        errors.date
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>{APPOINTMENT_MESSAGES.DATE_PLACEHOLDER}</span>
                      )}
                      <Calendar className='ml-auto !h-6 !w-6' color='#24338C' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0 bg-[var(--card-background)]'
                    align='start'
                  >
                    <CalendarComponent
                      mode='single'
                      selected={field.value}
                      onSelect={date => {
                        field.onChange(date);
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FormErrorMessage message={errors.date?.message || ''} />
          </div>
        </div>

        {/* Starts & Ends */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Starts */}
          <div className='space-y-2'>
            <Label htmlFor='starts' className='field-label'>
              {APPOINTMENT_MESSAGES.STARTS_LABEL}
            </Label>
            <Controller
              name='starts'
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={APPOINTMENT_MESSAGES.STARTS_PLACEHOLDER}
                  error={!!errors.starts}
                  disabled={loading}
                />
              )}
            />
            <FormErrorMessage message={errors.starts?.message || ''} />
          </div>

          {/* Ends */}
          <div className='space-y-2'>
            <Label htmlFor='ends' className='field-label'>
              {APPOINTMENT_MESSAGES.ENDS_LABEL}
            </Label>
            <Controller
              name='ends'
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={APPOINTMENT_MESSAGES.ENDS_PLACEHOLDER}
                  error={!!errors.ends}
                  disabled={loading}
                />
              )}
            />
            <FormErrorMessage message={errors.ends?.message || ''} />
          </div>
        </div>

        {/* Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='field-label'>
            {APPOINTMENT_MESSAGES.ADDRESS_LABEL}
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                id='address'
                placeholder={APPOINTMENT_MESSAGES.ADDRESS_PLACEHOLDER}
                value={field.value}
                onChange={field.onChange}
                className={cn(
                  'input-field',
                  errors.address
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
                disabled={loading}
              />
            )}
          />
          <FormErrorMessage message={errors.address?.message || ''} />
        </div>

        {/* Notes */}
        <div className='space-y-2'>
          <Label htmlFor='notes' className='field-label'>
            {APPOINTMENT_MESSAGES.NOTES_LABEL}
          </Label>
          <Controller
            name='notes'
            control={control}
            render={({ field }) => (
              <Textarea
                id='notes'
                placeholder={APPOINTMENT_MESSAGES.NOTES_PLACEHOLDER}
                value={field.value}
                onChange={field.onChange}
                className={cn(
                  'min-h-[100px] resize-none border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                  errors.notes
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
                disabled={loading}
              />
            )}
          />
          <FormErrorMessage message={errors.notes?.message || ''} />
        </div>

        {/* Action Buttons */}
        <div className='pt-4 flex items-center gap-3'>
          <Button
            type='button'
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            onClick={onCancel}
            disabled={loading}
          >
            {APPOINTMENT_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            disabled={loading}
          >
            {loading
              ? APPOINTMENT_MESSAGES.SAVING_BUTTON
              : APPOINTMENT_MESSAGES.SAVE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};
