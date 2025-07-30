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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar, Trash } from 'iconsax-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

// Validation schema
const todoFormSchema = yup.object({
  job: yup.string().required('Job is required'),
  date: yup.date().required('Date is required'),
  employees: yup.array().min(1, 'At least one employee must be selected'),
  title: yup.string().required('Title is required'),
  listItems: yup
    .array()
    .of(yup.string().required('List item cannot be empty'))
    .min(1, 'At least one list item is required'),
});

interface TodoFormData {
  job: string;
  date: Date;
  employees: string[];
  title: string;
  listItems: string[];
}

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Mock data - replace with actual data from your API
const mockJobs = [
  { value: 'job-1', label: 'Kitchen Renovation' },
  { value: 'job-2', label: 'Bathroom Remodel' },
  { value: 'job-3', label: 'Living Room Painting' },
];

const mockEmployees = [
  { value: 'emp-1', label: 'Esther Howard' },
  { value: 'emp-2', label: 'Jenny Wilson' },
  { value: 'emp-3', label: 'John Doe' },
  { value: 'emp-4', label: 'Jane Smith' },
];

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TodoFormData>({
    resolver: yupResolver(todoFormSchema),
    defaultValues: {
      job: '',
      date: new Date(),
      employees: [],
      title: '',
      listItems: [''],
    },
  });

  const watchedListItems = watch('listItems');

  const addListItem = () => {
    const currentItems = watchedListItems || [];
    setValue('listItems', [...currentItems, '']);
  };

  const removeListItem = (index: number) => {
    const currentItems = watchedListItems || [];
    if (currentItems.length > 1) {
      const newItems = currentItems.filter((_, i) => i !== index);
      setValue('listItems', newItems);
    }
  };

  const handleFormSubmit = (data: TodoFormData) => {
    data.employees = selectedEmployees;
    onSubmit(data);
  };

  const handleEmployeeChange = (employees: string[]) => {
    setSelectedEmployees(employees);
    setValue('employees', employees);
  };

  return (
    <div className='w-full'>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='space-y-2 md:space-y-4'
        noValidate
      >
        {/* Job and Date Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Job Selection */}
          <div className='space-y-2'>
            <Label htmlFor='job' className='field-label'>
              Job
            </Label>
            <Controller
              name='job'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={cn(
                      'h-12 border-2 bg-[var(--white-background)] rounded-[10px]',
                      errors.job
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  >
                    <SelectValue placeholder='Select Job' />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                    {mockJobs.map(job => (
                      <SelectItem
                        key={job.value}
                        value={job.value}
                        className='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
                      >
                        {job.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.job?.message || ''} />
          </div>

          {/* Date Selection */}
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

        {/* Employee Selection */}
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

        {/* Title */}
        <div className='space-y-2'>
          <Label htmlFor='title' className='field-label'>
            Title
          </Label>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <Input
                id='title'
                placeholder='Enter Title'
                value={field.value}
                onChange={field.onChange}
                className={cn(
                  'input-field',
                  errors.title
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
                disabled={loading}
              />
            )}
          />
          <FormErrorMessage message={errors.title?.message || ''} />
        </div>

        {/* List Items */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='field-label'>List Item</Label>
            <button
              type='button'
              onClick={addListItem}
              className='text-[#34AD44] hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'
            >
              + Add Another
            </button>
          </div>

          <div className='space-y-3'>
            {watchedListItems?.map((item, index) => (
              <div key={index} className='flex items-center gap-3'>
                <Controller
                  name={`listItems.${index}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={`list-item-${index}`}
                      placeholder='Enter Item'
                      value={field.value}
                      onChange={field.onChange}
                      className={cn(
                        'flex-1 input-field',
                        errors.listItems?.[index]
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      disabled={loading}
                    />
                  )}
                />
                {watchedListItems.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeListItem(index)}
                    className='w-[42px] h-[42px] shrink-0 flex items-center justify-center text-gray-400  border-2 border-[var(--border-dark)] rounded-[10px]'
                  >
                    <Trash color='#2D2D2D' size={24} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <FormErrorMessage message={errors.listItems?.message || ''} />
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
