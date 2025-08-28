'use client';

import { Avatar } from '@/components/shared/common/Avatar';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { APP_CONFIG, ROLE_IDS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { cn, getCompanyId } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar, Scan } from 'iconsax-react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// User option interface for dropdown
interface UserOption {
  id: string | number;
  name: string;
  email?: string;
  phone_number?: string;
  profile_picture_url?: string;
  designation?: string;
}

// Job option interface for dropdown
interface JobOption {
  id: number;
  uuid: string;
  project_name: string;
  project_id: string;
  status: string;
}

// Validation schema
const assignFormSchema = z.object({
  toolName: z.string().min(1, 'Tool name is required'),
  toolId: z.string().min(1, 'Tool ID is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  condition: z.string().min(1, 'Condition is required'),
  assignDate: z
    .string()
    .min(1, 'Assign date is required')
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Assign date cannot be in the past'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Due date cannot be in the past'),
  assignee: z.string().min(1, 'Assignee is required'),
  assigneeId: z.string().min(1, 'Assignee ID is required'),
  job: z.string().min(1, 'Job is required'),
  assignedStatus: z.string().min(1, 'Assigned status is required'),
});

export type AssignFormValues = z.infer<typeof assignFormSchema>;

interface AssignFormProps {
  defaultValues: AssignFormValues & {
    isBarcodeEnabled?: boolean;
    isScanMode?: boolean;
  };
  onSubmit: (values: AssignFormValues) => void;
  onCancel: () => void;
  onBarcodeSearch?: (identifier: string) => Promise<void>;
  onScanModeToggle?: (isScanMode: boolean) => void;
  className?: string;
}

export const AssignForm: React.FC<AssignFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  onBarcodeSearch,
  onScanModeToggle,
  className = '',
}) => {
  const [assignDateOpen, setAssignDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState<UserOption[]>([]);
  const [assigneeLoading, setAssigneeLoading] = useState(false);
  const [jobOptions, setJobOptions] = useState<JobOption[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignFormSchema),
    defaultValues,
  });
  console.log('errors', errors);
  // Update form when defaultValues change
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchedValues = watch();

  const conditionOptions = useMemo(
    () => [
      { value: 'excellent', label: 'Excellent' },
      { value: 'good', label: 'Good' },
      { value: 'decent', label: 'Decent' },
      { value: 'poor', label: 'Poor' },
    ],
    []
  );

  const assignedStatusOptions = useMemo(
    () => [
      { value: 'temporary', label: 'Temporary' },
      { value: 'permanent', label: 'Permanent' },
    ],
    []
  );

  // Fetch assignee options on component mount
  useEffect(() => {
    const fetchAssigneeOptions = async () => {
      try {
        setAssigneeLoading(true);
        const companyId = getCompanyId();
        const response = await apiService.getUsersDropdown({
          role_id: ROLE_IDS.EMPLOYEE,
          ...(companyId && { company_id: companyId }),
          page: 1,
          limit: 50,
        });

        const { data } = response;
        let users: UserOption[] = [];

        if (data && Array.isArray(data)) {
          users = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          const { data: nestedData } = data;
          users = nestedData;
        }

        setAssigneeOptions(users);
      } catch (error) {
        console.error('Error fetching assignee options:', error);
        setAssigneeOptions([]);
      } finally {
        setAssigneeLoading(false);
      }
    };

    fetchAssigneeOptions();
  }, []);

  // Fetch job options on component mount
  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
        setJobLoading(true);
        const companyId = getCompanyId();
        const response = await apiService.fetchJobsDropdown({
          page: 1,
          limit: 50,
          type: 'ALL',
          ...(companyId && { company_id: companyId }),
        });

        if (response.statusCode === 200 && response.data?.data) {
          const jobsData = response.data.data.map((job: any) => ({
            id: job.id,
            uuid: job.uuid,
            project_name: job.project_name,
            project_id: job.project_id,
            status: job.status,
          }));
          setJobOptions(jobsData);
        }
      } catch (error) {
        console.error('Error fetching job options:', error);
        setJobOptions([]);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobOptions();
  }, []);

  const selectedAssignee = assigneeOptions.find(
    opt => opt.id.toString() === watchedValues.assigneeId
  );

  const onSubmitForm = (values: AssignFormValues) => {
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className={cn('space-y-5', className)}
    >
      {/* Tool name and scan button row */}
      <div className='flex items-center justify-between'>
        <div className='text-sm'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Tool Name
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            {watchedValues.toolName}
          </span>
        </div>
        <Button
          type='button'
          className='btn-primary'
          onClick={() => {
            if (onScanModeToggle) {
              onScanModeToggle(!defaultValues.isScanMode);
            }
          }}
        >
          <Scan size='32' color='currentcolor' className='!h-5 !w-5' />
          {defaultValues.isScanMode ? 'Cancel Scan' : 'Scan'}
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='field-label'>Tool ID / Barcode</label>
          {defaultValues.isBarcodeEnabled ? (
            <div className='relative'>
              <Controller
                name='barcode'
                control={control}
                render={({ field }) => (
                  <Input
                    ref={input => {
                      if (defaultValues.isScanMode && input) {
                        input.focus();
                      }
                    }}
                    placeholder='Enter or scan barcode'
                    className='input-field pr-12'
                    value={field.value}
                    onChange={e => {
                      const identifier = e.target.value;
                      field.onChange(identifier);

                      // Debounced search
                      if (onBarcodeSearch) {
                        // Clear previous timeout
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }

                        // Set new timeout
                        searchTimeoutRef.current = setTimeout(() => {
                          onBarcodeSearch(identifier);
                        }, 500);
                      }
                    }}
                  />
                )}
              />
            </div>
          ) : (
            <Input
              value={`${watchedValues.toolId} / ${watchedValues.barcode}`}
              readOnly
              className='input-field'
            />
          )}
        </div>
        <div className='space-y-2'>
          <Controller
            name='condition'
            control={control}
            render={({ field }) => (
              <SelectField
                label='Condition'
                value={field.value}
                onValueChange={field.onChange}
                options={conditionOptions}
                placeholder='Select'
                error={errors.condition?.message || ''}
              />
            )}
          />
        </div>
        <div className='space-y-2'>
          <label className='field-label'>Assign Date</label>
          <Controller
            name='assignDate'
            control={control}
            render={({ field }) => (
              <Popover open={assignDateOpen} onOpenChange={setAssignDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
                  >
                    {field.value && !isNaN(new Date(field.value).getTime()) ? (
                      format(new Date(field.value), 'PPP')
                    ) : (
                      <span>Select Date</span>
                    )}
                    <IconsaxCalendar
                      className='ml-auto !h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-[var(--card-background)]'
                  align='start'
                >
                  <CalendarComponent
                    mode='single'
                    selected={
                      field.value && !isNaN(new Date(field.value).getTime())
                        ? new Date(field.value)
                        : undefined
                    }
                    onSelect={date => {
                      if (date) {
                        // Set time to midnight UTC to prevent day change in ISO string
                        const utcDate = new Date(
                          Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          )
                        );
                        field.onChange(utcDate.toISOString());
                        setAssignDateOpen(false);
                      }
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
          {errors.assignDate && (
            <p className='text-sm text-red-500'>{errors.assignDate.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <label className='field-label'>Due Date</label>
          <Controller
            name='dueDate'
            control={control}
            render={({ field }) => (
              <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
                  >
                    {field.value && !isNaN(new Date(field.value).getTime()) ? (
                      format(new Date(field.value), 'PPP')
                    ) : (
                      <span>Select Date</span>
                    )}
                    <IconsaxCalendar
                      className='ml-auto !h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-[var(--card-background)]'
                  align='start'
                >
                  <CalendarComponent
                    mode='single'
                    selected={
                      field.value && !isNaN(new Date(field.value).getTime())
                        ? new Date(field.value)
                        : undefined
                    }
                    onSelect={date => {
                      if (date) {
                        // Set time to midnight UTC to prevent day change in ISO string
                        const utcDate = new Date(
                          Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          )
                        );
                        field.onChange(utcDate.toISOString());
                        setDueDateOpen(false);
                      }
                    }}
                    disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const assignDate = watchedValues.assignDate
                        ? new Date(watchedValues.assignDate)
                        : null;

                      if (assignDate) {
                        return date < assignDate;
                      }
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.dueDate && (
            <p className='text-sm text-red-500'>{errors.dueDate.message}</p>
          )}
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Assign To</Label>
          <Controller
            name='assignee'
            control={control}
            render={({ field }) => (
              <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={assigneeLoading}
                    className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
                  >
                    {assigneeLoading ? (
                      <span>Loading...</span>
                    ) : field.value ? (
                      <div className='flex items-center gap-3'>
                        <Avatar
                          name={selectedAssignee?.name || ''}
                          height={24}
                          width={24}
                          className='w-6 h-6 text-xs'
                          {...(selectedAssignee?.profile_picture_url && {
                            image: `${APP_CONFIG.CDN_URL}${selectedAssignee.profile_picture_url}`,
                          })}
                        />
                        <span>{field.value}</span>
                      </div>
                    ) : (
                      <span>Select User</span>
                    )}
                    <ChevronDown
                      className='ml-auto !h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-full bg-[var(--card-background)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-lg border border-[var(--border-dark)]'
                  align='start'
                >
                  <div className='py-2'>
                    {assigneeOptions.length === 0 && !assigneeLoading ? (
                      <div className='px-3 py-2 text-sm text-[var(--text-secondary)]'>
                        No employees found
                      </div>
                    ) : (
                      assigneeOptions.map(option => (
                        <button
                          key={option.id}
                          type='button'
                          onClick={() => {
                            field.onChange(option.name);
                            setValue('assigneeId', option.id.toString());
                            setAssigneeOpen(false);
                          }}
                          className='flex items-center gap-3 w-full py-2 px-3 text-left text-[var(--text-dark)] text-base font-medium border-b border-[var(--border-light)] last-of-type:border-b-0 hover:bg-[var(--card-hover)]'
                        >
                          <Avatar
                            name={option.name}
                            height={24}
                            width={24}
                            className='w-6 h-6 text-xs'
                            {...(option.profile_picture_url && {
                              image: `${APP_CONFIG.CDN_URL}${option.profile_picture_url}`,
                            })}
                          />
                          <div className='flex flex-col'>
                            <span>{option.name}</span>
                            {option.designation && (
                              <span className='text-xs text-[var(--text-secondary)]'>
                                {option.designation}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.assignee && (
            <p className='text-sm text-red-500'>{errors.assignee.message}</p>
          )}
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Controller
            name='job'
            control={control}
            render={({ field }) => (
              <SelectField
                label='Assigned to Job'
                value={field.value}
                onValueChange={field.onChange}
                options={
                  jobLoading
                    ? []
                    : jobOptions.map(job => ({
                        value: job.uuid,
                        label:
                          job.project_name ||
                          job.project_id ||
                          'Unnamed Project',
                      }))
                }
                placeholder='Select Job'
                error={errors.job?.message || ''}
                disabled={jobLoading}
              />
            )}
          />
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Controller
            name='assignedStatus'
            control={control}
            render={({ field }) => (
              <SelectField
                label='Assigned Status'
                value={field.value}
                onValueChange={field.onChange}
                options={assignedStatusOptions}
                placeholder='Select Status'
                error={errors.assignedStatus?.message || ''}
              />
            )}
          />
        </div>
      </div>

      <div className='flex gap-3 items-center pt-2'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default AssignForm;
