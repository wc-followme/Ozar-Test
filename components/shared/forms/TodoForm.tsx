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
import { useToast } from '@/components/ui/use-toast';
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
import SelectField from '../common/SelectField';

// Validation schema with enhanced validation
const todoFormSchema = yup.object({
  job: yup
    .string()
    .required(TODO_MESSAGES.JOB_REQUIRED)
    .trim()
    .min(1, TODO_MESSAGES.JOB_REQUIRED),
  date: yup
    .date()
    .required(TODO_MESSAGES.DATE_REQUIRED)
    .test('future-date', TODO_MESSAGES.DATE_FUTURE_REQUIRED, function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return value >= today;
    }),
  employees: yup
    .array()
    .of(yup.string().required())
    .min(1, TODO_MESSAGES.EMPLOYEES_REQUIRED)
    .default([]),
  title: yup
    .string()
    .required(TODO_MESSAGES.TITLE_REQUIRED)
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  listItems: yup
    .array()
    .of(
      yup
        .string()
        .required(TODO_MESSAGES.LIST_ITEM_REQUIRED)
        .trim()
        .min(1, TODO_MESSAGES.LIST_ITEM_REQUIRED)
        .max(500, 'List item must be less than 500 characters')
    )
    .min(1, TODO_MESSAGES.LIST_ITEMS_REQUIRED)
    .max(20, 'Maximum 20 list items allowed')
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
  editingTodoList?: any; // Add this prop for editing mode
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  editingTodoList,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
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
  const watchedJob = watch('job');
  const watchedEmployees = watch('employees');

  // Debug form values
  useEffect(() => {
    if (editingTodoList) {
      console.log('Current form values:', {
        job: watchedJob,
        employees: watchedEmployees,
        selectedEmployees,
        jobsCount: jobs.length,
        employeesCount: employees.length,
      });
    }
  }, [
    watchedJob,
    watchedEmployees,
    selectedEmployees,
    jobs.length,
    employees.length,
    editingTodoList,
  ]);

  // Debug available jobs
  useEffect(() => {
    if (jobs.length > 0) {
      console.log(
        'Available jobs:',
        jobs.map(job => ({
          uuid: job.uuid,
          project_name: job.project_name,
          project_id: job.project_id,
        }))
      );
    }
  }, [jobs]);

  // Reset form when editing mode changes
  useEffect(() => {
    if (!editingTodoList) {
      // Reset form for create mode
      reset({
        job: '',
        date: new Date(),
        employees: [],
        title: '',
        listItems: [''],
      });
      setSelectedEmployees([]);
    }
  }, [editingTodoList, reset]);

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

  // Handle prefilling the form if editing
  useEffect(() => {
    if (editingTodoList && jobs.length > 0 && employees.length > 0) {
      console.log('Setting form values for editing:', {
        job_id: editingTodoList.job_id,
        job_uuid: editingTodoList.job_uuid,
        employees: editingTodoList.employees,
        title: editingTodoList.title,
        date: editingTodoList.date,
        items: editingTodoList.items,
      });

      // Add a small delay to ensure form is properly initialized
      setTimeout(() => {
        // Try both job_id and job_uuid
        let jobUuid = editingTodoList.job_uuid || editingTodoList.job_id;

        // Ensure jobUuid is a string
        if (jobUuid !== null && jobUuid !== undefined) {
          jobUuid = String(jobUuid);
        }

        // Check if job exists in available jobs
        const jobExists = jobs.some(j => j.uuid === jobUuid);

        // If job doesn't exist, try to find by project_name or other criteria
        if (!jobExists && editingTodoList.project_name) {
          const matchingJob = jobs.find(
            j =>
              j.project_name === editingTodoList.project_name ||
              j.project_id === editingTodoList.project_id
          );
          if (matchingJob) {
            jobUuid = matchingJob.uuid;
            console.log('Found matching job by name:', matchingJob);
          }
        }

        console.log('Attempting to set job:', {
          jobUuid,
          jobUuidType: typeof jobUuid,
          availableJobUuids: jobs.map(j => j.uuid),
          availableJobUuidTypes: jobs.map(j => typeof j.uuid),
          jobExists: jobs.some(j => j.uuid === jobUuid),
          jobExistsStrict: jobs.some(
            j => j.uuid === jobUuid && typeof j.uuid === typeof jobUuid
          ),
        });

        // Handle employees - they might be in different formats
        let employeeUuids: string[] = [];
        if (editingTodoList.user_uuids) {
          employeeUuids = editingTodoList.user_uuids;
        } else if (
          editingTodoList.employees &&
          Array.isArray(editingTodoList.employees)
        ) {
          employeeUuids = editingTodoList.employees.map(
            (emp: any) => emp.user?.uuid || emp.uuid
          );
        }

        // Reset form with all values at once
        reset({
          job: jobUuid,
          date: new Date(editingTodoList.date),
          employees: employeeUuids,
          title: editingTodoList.title,
          listItems: editingTodoList.items.map((item: any) => item.description),
        });

        setSelectedEmployees(employeeUuids);

        console.log('Job value set to:', jobUuid);

        // Check the field value after a short delay
        setTimeout(() => {
          console.log('Job field value after setting:', watchedJob);
        }, 200);
      }, 100);
    }
  }, [editingTodoList, jobs, employees, setValue, reset, watchedJob]);

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

  const handleFormSubmit = async (data: TodoFormData) => {
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      let response;
      if (editingTodoList) {
        // Update existing todo list
        console.log('Updating todo list:', editingTodoList.uuid);

        // Prepare items with UUID handling
        const originalItems = editingTodoList.items || [];
        console.log('Original items:', originalItems);
        console.log('Form items:', data.listItems);

        const items = data.listItems
          .filter(item => item.trim() !== '') // Remove empty items
          .map((item, index) => {
            // Check if this position corresponds to an original item
            const originalItem = originalItems[index];

            if (originalItem && originalItem.uuid) {
              // Existing item - include UUID
              console.log(
                `Item ${index}: Existing item with UUID ${originalItem.uuid}`
              );
              return {
                uuid: originalItem.uuid,
                description: item.trim(),
              };
            } else {
              // New item - don't include UUID
              console.log(`Item ${index}: New item without UUID`);
              return {
                description: item.trim(),
              };
            }
          });

        console.log('Final items array:', items);

        // Prepare payload for update
        const payload = {
          title: data.title,
          date: format(data.date, 'yyyy-MM-dd'),
          user_uuids: selectedEmployees,
          items: items,
        };

        console.log('Update payload:', payload);
        console.log('Selected employees:', selectedEmployees);
        console.log('Original employees:', editingTodoList.employees);

        response = await apiService.updateTodoList(
          editingTodoList.uuid,
          payload
        );

        if (response.statusCode === 200 || response.statusCode === 201) {
          console.log('Todo list updated successfully:', response);
          showSuccessToast('Todo list updated successfully!');
        } else {
          console.error('Failed to update todo list:', response);
          const errorMessage = response.message || 'Failed to update todo list';
          setSubmitError(errorMessage);
          showErrorToast(errorMessage);
        }
      } else {
        // Create new todo list
        const payload = {
          job_uuid: data.job,
          title: data.title,
          date: format(data.date, 'yyyy-MM-dd'),
          user_uuids: selectedEmployees,
          items: data.listItems
            .filter(item => item.trim() !== '') // Remove empty items
            .map(item => ({ description: item.trim() })),
        };

        console.log('Create payload:', payload);
        response = await apiService.createTodoList(payload);

        if (response.statusCode === 200 || response.statusCode === 201) {
          console.log('Todo list created successfully:', response);
          showSuccessToast('Todo list created successfully!');
        } else {
          console.error('Failed to create todo list:', response);
          const errorMessage = response.message || 'Failed to create todo list';
          setSubmitError(errorMessage);
          showErrorToast(errorMessage);
        }
      }

      // Call the original onSubmit with the form data
      data.employees = selectedEmployees;
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting todo list:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setSubmitError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
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
            <Controller
              name='job'
              control={control}
              render={({ field }) => (
                <SelectField
                  label={TODO_MESSAGES.JOB_LABEL}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={
                    jobsLoading
                      ? []
                      : jobs.map(job => ({
                          value: job.uuid,
                          label: job.project_name,
                        }))
                  }
                  placeholder={
                    jobsLoading
                      ? 'Loading jobs...'
                      : jobs.length > 0
                        ? TODO_MESSAGES.JOB_PLACEHOLDER
                        : 'No jobs found'
                  }
                  error={errors.job?.message || ''}
                  triggerClassName={cn(
                    'h-12 border-2 bg-[var(--white-background)] rounded-[10px]',
                    errors.job
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                  disabled={jobsLoading}
                />
              )}
            />
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
                      disabled={date => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
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
                disabled={loading || submitLoading}
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
              className='text-greenbrand hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'
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
                      disabled={loading || submitLoading}
                    />
                  )}
                />
                {watchedListItems.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeListItem(index)}
                    className='w-[42px] h-[42px] shrink-0 flex items-center justify-center text-gray-400  border-2 border-[var(--border-dark)] rounded-[10px]'
                  >
                    <Trash color='var(--text-dark)' size={24} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <FormErrorMessage message={errors.listItems?.message || ''} />
        </div>

        {/* Error Display */}
        {submitError && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-600 text-sm'>{submitError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='pt-4 flex items-center gap-3'>
          <Button
            type='button'
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            onClick={onCancel}
            disabled={loading || submitLoading}
          >
            {TODO_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            disabled={loading || submitLoading}
          >
            {submitLoading
              ? TODO_MESSAGES.SAVING_BUTTON
              : editingTodoList
                ? 'Update Todo List'
                : TODO_MESSAGES.SAVE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};
