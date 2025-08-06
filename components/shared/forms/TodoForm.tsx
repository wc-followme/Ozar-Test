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
import { STORAGE_KEYS, TODO_MESSAGES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar, Trash } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
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

interface Job {
  id: number;
  uuid: string;
  project_name: string;
  project_id: string;
  status: string;
}

interface Employee {
  id: number;
  uuid: string;
  name: string;
  email: string;
  profile_picture_url: string;
  status: string;
}

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

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

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const response = await apiService.fetchJobsDropdown({
          page: 1,
          limit: 50,
          type: 'ALL',
        });

        if (response.statusCode === 200 && response.data?.data) {
          const jobsData = response.data.data.map((job: any) => ({
            id: job.id,
            uuid: job.uuid,
            project_name: job.project_name,
            project_id: job.project_id,
            status: job.status,
          }));
          setJobs(jobsData);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
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
        console.log('API Response:', response);
        if (response.data) {
          console.log('API Response:', response);
          console.log('Response data:', response.data);

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

          console.log('Mapped employees:', mappedEmployees);
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

  // Debug employees state
  useEffect(() => {
    console.log('Employees array length:', employees.length);
    console.log('Employees data:', employees);
    console.log(
      'MultiSelect options:',
      employees.map(employee => ({
        value: employee.uuid,
        label: employee.name,
        image: employee.profile_picture_url || '/images/profile.jpg',
      }))
    );
  }, [employees]);

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
                    {jobsLoading ? (
                      <div className='p-2 text-gray-500 text-sm'>
                        Loading jobs...
                      </div>
                    ) : jobs.length > 0 ? (
                      jobs.map(job => (
                        <SelectItem
                          key={job.uuid}
                          value={job.uuid}
                          className='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
                        >
                          {job.project_name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className='p-2 text-gray-500 text-sm'>
                        No jobs found
                      </div>
                    )}
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
                : TODO_MESSAGES.EMPLOYEES_PLACEHOLDER
            }
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
