import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import { Contractor } from '@/app/(DashboardLayout)/job-management/types';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ROLE_IDS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const generalInfoSchema = yup.object({
  fullName: yup.string().required(STEP_MESSAGES.FULL_NAME_REQUIRED),
  projectStartDate: yup
    .mixed()
    .test(
      'is-valid-start-date',
      STEP_MESSAGES.PROJECT_START_DATE_REQUIRED,
      function (value) {
        if (value === '' || value === null || value === undefined) {
          return false; // Show error for empty values
        }
        if (value instanceof Date) {
          return !isNaN(value.getTime());
        }
        return false;
      }
    ),
  projectFinishDate: yup
    .mixed()
    .test(
      'is-valid-finish-date',
      STEP_MESSAGES.PROJECT_FINISH_DATE_REQUIRED,
      function (value) {
        if (value === '' || value === null || value === undefined) {
          return false; // Show error for empty values
        }
        if (value instanceof Date) {
          return !isNaN(value.getTime());
        }
        return false;
      }
    ),
  email: yup
    .string()
    .email(STEP_MESSAGES.EMAIL_INVALID)
    .required(STEP_MESSAGES.EMAIL_REQUIRED),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone number must contain only numbers')
    .required(STEP_MESSAGES.PHONE_REQUIRED),
  budget: yup
    .string()
    .matches(/^[0-9]+$/, 'Budget must contain only numbers')
    .required(STEP_MESSAGES.BUDGET_REQUIRED),
  contractor: yup.string(),
  address: yup.string().required(STEP_MESSAGES.ADDRESS_REQUIRED),
});

interface StepGeneralInfoProps {
  onNext: (data: any) => void;
  defaultValues?: any;
  isLastStep?: boolean;
}

export function StepGeneralInfo({
  onNext,
  defaultValues,
  isLastStep = false,
}: StepGeneralInfoProps) {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(true);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isFinishDateOpen, setIsFinishDateOpen] = useState(false);
  const form = useForm<any>({
    resolver: yupResolver(generalInfoSchema),
    defaultValues: {
      fullName: '',
      projectStartDate: null,
      projectFinishDate: null,
      email: '',
      phone: '',
      budget: '',
      contractor: 'any',
      address: '',
      ...defaultValues,
    },
  });

  // Fetch contractors from API
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setIsLoadingContractors(true);
        const response = await apiService.getUsersDropdown({
          role_id: ROLE_IDS.CONTRACTOR, // Contractor role
          page: 1,
          limit: 50,
        });

        if (response) {
          let contractorsData: Contractor[] = [];

          if (response.data && Array.isArray(response.data)) {
            contractorsData = response.data;
          } else if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            contractorsData = response.data.data;
          }
          setContractors(contractorsData);
        }
      } catch (err) {
      } finally {
        setIsLoadingContractors(false);
      }
    };

    fetchContractors();
  }, []);

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {STEP_MESSAGES.GENERAL_INFO_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {STEP_MESSAGES.GENERAL_INFO_DESCRIPTION}
      </p>
      <Form {...form}>
        <form
          className='w-full flex flex-col gap-4 sm:gap-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='h-auto md:h-[calc(100vh_-_550px)] md:-mx-4 md:px-4 overflow-y-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              {/* Your Name (full width) */}
              <div className='flex flex-col gap-1.5 sm:gap-2 col-span-1 md:col-span-2'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.YOUR_NAME_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={STEP_MESSAGES.ENTER_FULL_NAME}
                          className='input-field'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Project Start Date */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='projectStartDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PROJECT_START_DATE_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={isStartDateOpen}
                          onOpenChange={setIsStartDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className='w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] focus:border-green-500 focus:ring-green-500 justify-between font-normal'
                            >
                              {field.value
                                ? format(field.value, 'PPP')
                                : STEP_MESSAGES.SELECT_DATE}
                              <IconsaxCalendar
                                size='50'
                                className='!h-6 !w-6'
                                color='#24338C'
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                            align='start'
                          >
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={date => {
                                field.onChange(date);
                                setIsStartDateOpen(false); // Close popover when date is selected
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Project Finish Date */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='projectFinishDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PROJECT_FINISH_DATE_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={isFinishDateOpen}
                          onOpenChange={setIsFinishDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className='w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] focus:border-green-500 focus:ring-green-500 justify-between font-normal'
                            >
                              {field.value
                                ? format(field.value, 'PPP')
                                : STEP_MESSAGES.SELECT_DATE}
                              <IconsaxCalendar
                                size='50'
                                className='!h-6 !w-6'
                                color='#24338C'
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                            align='start'
                          >
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={date => {
                                field.onChange(date);
                                setIsFinishDateOpen(false); // Close popover when date is selected
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.EMAIL_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder={STEP_MESSAGES.ENTER_EMAIL}
                          className='input-field'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Phone */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PHONE_NUMBER_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={STEP_MESSAGES.ENTER_PHONE_NUMBER}
                          className='input-field'
                          {...field}
                          onKeyDown={e => {
                            // Only allow numbers, backspace, delete, tab, escape, enter
                            const allowedKeys = [
                              'Backspace',
                              'Delete',
                              'Tab',
                              'Escape',
                              'Enter',
                              'ArrowLeft',
                              'ArrowRight',
                              'ArrowUp',
                              'ArrowDown',
                              'Home',
                              'End',
                            ];

                            // Allow if it's an allowed key
                            if (allowedKeys.includes(e.key)) {
                              return;
                            }

                            // Allow if it's a number
                            if (/^[0-9]$/.test(e.key)) {
                              return;
                            }

                            // Prevent all other keys
                            e.preventDefault();
                          }}
                          onChange={e => {
                            // Remove any non-numeric characters from the input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Your Budget */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='budget'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.YOUR_BUDGET_LABEL}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={STEP_MESSAGES.ENTER_BUDGET}
                          className='input-field'
                          {...field}
                          onKeyDown={e => {
                            // Only allow numbers, backspace, delete, tab, escape, enter
                            const allowedKeys = [
                              'Backspace',
                              'Delete',
                              'Tab',
                              'Escape',
                              'Enter',
                              'ArrowLeft',
                              'ArrowRight',
                              'ArrowUp',
                              'ArrowDown',
                              'Home',
                              'End',
                            ];

                            // Allow if it's an allowed key
                            if (allowedKeys.includes(e.key)) {
                              return;
                            }

                            // Allow if it's a number
                            if (/^[0-9]$/.test(e.key)) {
                              return;
                            }

                            // Prevent all other keys
                            e.preventDefault();
                          }}
                          onChange={e => {
                            // Remove any non-numeric characters from the input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Preferred Contractor */}
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='contractor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PREFERRED_CONTRACTOR_LABEL}
                      </FormLabel>
                      <FormControl>
                        <SelectField
                          value={field.value}
                          onValueChange={field.onChange}
                          options={contractors.map((contractor: any) => ({
                            value: contractor.id.toString(),
                            label: contractor.name,
                          }))}
                          placeholder={
                            isLoadingContractors
                              ? STEP_MESSAGES.LOADING_CONTRACTORS
                              : STEP_MESSAGES.SELECT_CONTRACTOR
                          }
                          className=''
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Address */}
            <div className='flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.ADDRESS_LABEL}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={STEP_MESSAGES.ENTER_ADDRESS}
                        className='input-field'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit/Next Step Button */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 text-sm sm:text-base'
            >
              {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
