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
import { MOCK_EMPLOYEES, MOCK_JOBS, TODO_MESSAGES } from '@/constants/common';
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
  job: yup.string().required(TODO_MESSAGES.JOB_REQUIRED),
  date: yup.date().required(TODO_MESSAGES.DATE_REQUIRED),
  employees: yup.array().min(1, TODO_MESSAGES.EMPLOYEES_REQUIRED).default([]),
  title: yup.string().required(TODO_MESSAGES.TITLE_REQUIRED),
  listItems: yup
    .array()
    .of(yup.string().required(TODO_MESSAGES.LIST_ITEM_REQUIRED))
    .min(1, TODO_MESSAGES.LIST_ITEMS_REQUIRED)
    .default(['']),
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
              {TODO_MESSAGES.JOB_LABEL}
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
                    <SelectValue placeholder={TODO_MESSAGES.JOB_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                    {MOCK_JOBS.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
                      >
                        {label}
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
              {TODO_MESSAGES.DATE_LABEL}
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
                        <span>{TODO_MESSAGES.DATE_PLACEHOLDER}</span>
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
            {TODO_MESSAGES.EMPLOYEES_LABEL}
          </Label>
          <MultiSelect
            options={MOCK_EMPLOYEES}
            value={selectedEmployees}
            onChange={handleEmployeeChange}
            placeholder={TODO_MESSAGES.EMPLOYEES_PLACEHOLDER}
            error={errors.employees?.message || ''}
          />
        </div>

        {/* Title */}
        <div className='space-y-2'>
          <Label htmlFor='title' className='field-label'>
            {TODO_MESSAGES.TITLE_LABEL}
          </Label>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <Input
                id='title'
                placeholder={TODO_MESSAGES.TITLE_PLACEHOLDER}
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
            <Label className='field-label'>
              {TODO_MESSAGES.LIST_ITEM_LABEL}
            </Label>
            <button
              type='button'
              onClick={addListItem}
              className='text-[#34AD44] hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'
            >
              {TODO_MESSAGES.ADD_ANOTHER_BUTTON}
            </button>
          </div>

          <div className='space-y-3'>
            {watchedListItems?.map((_, index) => (
              <div key={index} className='flex items-center gap-3'>
                <Controller
                  name={`listItems.${index}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={`list-item-${index}`}
                      placeholder={TODO_MESSAGES.LIST_ITEM_PLACEHOLDER}
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
            {TODO_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            disabled={loading}
          >
            {loading ? TODO_MESSAGES.SAVING_BUTTON : TODO_MESSAGES.SAVE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};
