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
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar, Clock } from 'iconsax-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

// Validation schema
const appointmentFormSchema = yup.object({
  agenda: yup.string().required('Agenda is required'),
  appointmentWith: yup.string().required('Appointment with is required'),
  date: yup.date().required('Date is required'),
  starts: yup.string().required('Start time is required'),
  ends: yup.string().required('End time is required'),
  address: yup.string().required('Address is required'),
  notes: yup.string().optional(),
  employees: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one employee is required'),
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
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Mock employees data
const mockEmployees = [
  {
    value: '1',
    label: 'John Doe',
    image: '/images/profile.jpg',
  },
  {
    value: '2',
    label: 'Jane Smith',
    image: '/images/profile.jpg',
  },
  {
    value: '3',
    label: 'Mike Johnson',
    image: '/images/profile.jpg',
  },
  {
    value: '4',
    label: 'Sarah Wilson',
    image: '/images/profile.jpg',
  },
  {
    value: '5',
    label: 'David Brown',
    image: '/images/profile.jpg',
  },
];

// Mock time options
const timeOptions = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startsTimeOpen, setStartsTimeOpen] = useState(false);
  const [endsTimeOpen, setEndsTimeOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
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

  const selectedEmployees = watch('employees');

  const handleEmployeeChange = (value: string[]) => {
    setValue('employees', value);
  };

  const handleFormSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
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
            Agenda
          </Label>
          <Controller
            name='agenda'
            control={control}
            render={({ field }) => (
              <Input
                id='agenda'
                placeholder='Enter Title'
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
            Select Employees
          </Label>
          <MultiSelect
            options={mockEmployees}
            value={selectedEmployees}
            onChange={handleEmployeeChange}
            placeholder='Select employees'
            error={errors.employees?.message || ''}
          />
        </div>
        {/* Appointment with & Date */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Appointment with */}
          <div className='space-y-2'>
            <Label htmlFor='appointmentWith' className='field-label'>
              Appointment with
            </Label>
            <Controller
              name='appointmentWith'
              control={control}
              render={({ field }) => (
                <Input
                  id='appointmentWith'
                  placeholder='Enter Name'
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
              Date
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
                        <span>Select Date</span>
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
              Starts
            </Label>
            <Controller
              name='starts'
              control={control}
              render={({ field }) => (
                <Popover open={startsTimeOpen} onOpenChange={setStartsTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                        !field.value && 'text-muted-foreground',
                        errors.starts
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      {field.value || <span>Select Time</span>}
                      <Clock className='ml-auto !h-6 !w-6' color='#24338C' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-[200px] p-0 bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60'
                    align='start'
                  >
                    <div
                      className='p-2 max-h-60 overflow-y-auto'
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db #f3f4f6',
                      }}
                    >
                      {timeOptions.map(time => (
                        <button
                          key={time}
                          type='button'
                          className='w-full text-left px-3 py-2 text-sm hover:bg-[var(--select-option)] rounded-[5px] transition-colors'
                          onClick={() => {
                            field.onChange(time);
                            setStartsTimeOpen(false);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
            <FormErrorMessage message={errors.starts?.message || ''} />
          </div>

          {/* Ends */}
          <div className='space-y-2'>
            <Label htmlFor='ends' className='field-label'>
              Ends
            </Label>
            <Controller
              name='ends'
              control={control}
              render={({ field }) => (
                <Popover open={endsTimeOpen} onOpenChange={setEndsTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                        !field.value && 'text-muted-foreground',
                        errors.ends
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      {field.value || <span>Select Time</span>}
                      <Clock className='ml-auto !h-6 !w-6' color='#24338C' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-[200px] p-0 bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60'
                    align='start'
                  >
                    <div
                      className='p-2 max-h-60 overflow-y-auto'
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db #f3f4f6',
                      }}
                    >
                      {timeOptions.map(time => (
                        <button
                          key={time}
                          type='button'
                          className='w-full text-left px-3 py-2 text-sm hover:bg-[var(--select-option)] rounded-[5px] transition-colors'
                          onClick={() => {
                            field.onChange(time);
                            setEndsTimeOpen(false);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
            <FormErrorMessage message={errors.ends?.message || ''} />
          </div>
        </div>

        {/* Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='field-label'>
            Address
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                id='address'
                placeholder='Enter Address'
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
            Notes
          </Label>
          <Controller
            name='notes'
            control={control}
            render={({ field }) => (
              <Textarea
                id='notes'
                placeholder='Enter Notes'
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
            Cancel
          </Button>
          <Button
            type='submit'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};
