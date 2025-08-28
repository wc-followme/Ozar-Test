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
import { useEffect, useMemo, useState } from 'react';
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
const returnFormSchema = z.object({
  toolName: z.string().min(1, 'Tool name is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  toolId: z.string().min(1, 'Tool ID is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  condition: z.string().min(1, 'Condition is required'),
  returnedDate: z
    .string()
    .min(1, 'Returned date is required')
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Returned date cannot be in the past'),
  returnedById: z.string().min(1, 'Returned by ID is required'),
  job: z.string().min(1, 'Job is required'),
});

export type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
  defaultValues: ReturnFormValues;
  onSubmit: (values: ReturnFormValues) => void;
  onCancel: () => void;
  className?: string;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [returnedDateOpen, setReturnedDateOpen] = useState(false);
  const [returnedByOpen, setReturnedByOpen] = useState(false);
  const [returnedByOptions, setReturnedByOptions] = useState<UserOption[]>([]);
  const [returnedByLoading, setReturnedByLoading] = useState(false);
  const [jobOptions, setJobOptions] = useState<JobOption[]>([]);
  const [jobLoading, setJobLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues,
  });

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

  // Fetch returned by options on component mount
  useEffect(() => {
    const fetchReturnedByOptions = async () => {
      try {
        setReturnedByLoading(true);
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

        setReturnedByOptions(users);
      } catch (error) {
        console.error('Error fetching returned by options:', error);
        setReturnedByOptions([]);
      } finally {
        setReturnedByLoading(false);
      }
    };

    fetchReturnedByOptions();
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

  const selectedReturnedBy = returnedByOptions.find(
    opt => opt.id.toString() === watchedValues.returnedById
  );

  const onSubmitForm = (values: ReturnFormValues) => {
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
        <div className='text-sm'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Due Date
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            {watchedValues.dueDate}
          </span>
        </div>
        <Button type='button' className='btn-primary'>
          <Scan size='32' color='currentcolor' className='!h-5 !w-5' />
          Scan
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='field-label'>Tool ID / Barcode</label>
          <Input
            value={`${watchedValues.toolId} / ${watchedValues.barcode}`}
            readOnly
            className='input-field'
          />
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
        <div className='space-y-2 md:col-span-2'>
          <label className='field-label'>Returned Date</label>
          <Controller
            name='returnedDate'
            control={control}
            render={({ field }) => (
              <Popover
                open={returnedDateOpen}
                onOpenChange={setReturnedDateOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
                  >
                    {field.value ? (
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
                    selected={field.value ? new Date(field.value) : undefined}
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
                        setReturnedDateOpen(false);
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
          {errors.returnedDate && (
            <span className='text-red-500 text-sm'>
              {errors.returnedDate.message}
            </span>
          )}
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Return By</Label>
          <Controller
            name='returnedById'
            control={control}
            render={({ field }) => (
              <Popover open={returnedByOpen} onOpenChange={setReturnedByOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
                    disabled={returnedByLoading}
                  >
                    {selectedReturnedBy ? (
                      <div className='flex items-center gap-3'>
                        <Avatar
                          name={selectedReturnedBy.name}
                          height={24}
                          width={24}
                          className='w-6 h-6 text-xs'
                          {...(selectedReturnedBy.profile_picture_url && {
                            image: `${APP_CONFIG.CDN_URL}${selectedReturnedBy.profile_picture_url}`,
                          })}
                        />
                        <span>{selectedReturnedBy.name}</span>
                      </div>
                    ) : (
                      <span>
                        {returnedByLoading ? 'Loading users...' : 'Select User'}
                      </span>
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
                    {returnedByOptions.length === 0 && !returnedByLoading ? (
                      <div className='px-3 py-2 text-sm text-[var(--text-secondary)]'>
                        No employees found
                      </div>
                    ) : (
                      returnedByOptions.map(option => (
                        <button
                          key={option.id}
                          type='button'
                          onClick={() => {
                            field.onChange(option.id.toString());
                            setReturnedByOpen(false);
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
          {errors.returnedById && (
            <span className='text-red-500 text-sm'>
              {errors.returnedById.message}
            </span>
          )}
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Controller
            name='job'
            control={control}
            render={({ field }) => (
              <SelectField
                label='Returned from job'
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
          {isSubmitting ? 'Returning...' : 'Return'}
        </Button>
      </div>
    </form>
  );
};

export default ReturnForm;
