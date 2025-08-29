'use client';

import { FIVE_BOX_DATA } from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-constants';
import { JOB_MESSAGES } from '@/app/(DashboardLayout)/job-management/job-messages';
import {
  CreateJobFormData,
  CreateJobFormProps,
  SelectBoxOption,
  UserOption,
} from '@/app/(DashboardLayout)/job-management/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { JOB_TYPE, JobType, ROLE_IDS } from '@/constants/common';
import { useDebounce } from '@/hooks/use-debounce';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showErrorToast } from '../../ui/use-toast';
import { RadioGroupStripe } from '../common/RadioStripe';
import { SelectBoxCard } from '../common/SelectBoxCard';

const createJobSchema = yup.object({
  client_name: yup.string().required(JOB_MESSAGES.NAME_REQUIRED),
  client_email: yup
    .string()
    .email(JOB_MESSAGES.EMAIL_REQUIRED)
    .required(JOB_MESSAGES.EMAIL_REQUIRED),
  client_phone_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone number must contain only numbers')
    .required(JOB_MESSAGES.PHONE_REQUIRED),
  job_privacy: yup
    .mixed<JobType>()
    .oneOf([JOB_TYPE.PUBLIC, JOB_TYPE.PRIVATE])
    .required(JOB_MESSAGES.JOB_TYPE_LABEL),
  job_boxes_step: yup.array().of(yup.string().required()).default([]),
});

export function CreateJobForm({
  onSubmit: onSubmitProp,
  isSubmitting = false,
  defaultValues,
  onCancel,
  generatedLink,
  boxDefaults,
}: CreateJobFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<CreateJobFormData>({
    resolver: yupResolver(createJobSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone_number: '',
      job_privacy: JOB_TYPE.PUBLIC,
      job_boxes_step: [],
      client_id: '',
      ...defaultValues,
    },
  });

  // Handle form submission with proper typing
  const handleFormSubmit = (data: CreateJobFormData) => {
    if (onSubmitProp) {
      onSubmitProp(data);
    }
  };

  // Autocomplete state
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const clientNameValue = watch('client_name');
  const debouncedName = useDebounce(clientNameValue, 400);
  // Track if a user was selected from dropdown
  const [userSelected, setUserSelected] = useState(false);
  const suppressNextSearch = useRef(false);
  const { showSuccessToast } = useToast();

  // Derive select box options from FIVE_BOX_DATA
  const jobSelectOptions = useMemo<SelectBoxOption[]>(() => {
    return FIVE_BOX_DATA.map(box => ({
      id: box.slug,
      value: box.step,
      title: box.title,
      description: box.description,
      disabled: false,
    }));
  }, []);

  // Set default selections based on boxDefaults
  useEffect(() => {
    if (boxDefaults && Array.isArray(boxDefaults)) {
      const enabledSteps = boxDefaults
        .filter(box => box.enabled)
        .map(box => box.id);

      // Map box IDs to step values
      const defaultSteps = FIVE_BOX_DATA.filter(box =>
        enabledSteps.includes(box.id)
      ).map(box => box.step);
      if (defaultSteps.length > 0) {
        setValue('job_boxes_step', defaultSteps);
      }
    }
  }, [boxDefaults, setValue]);

  useEffect(() => {
    if (suppressNextSearch.current) {
      suppressNextSearch.current = false;
      return;
    }
    if (!debouncedName || debouncedName.length < 2) {
      setUserOptions([]);
      setShowDropdown(false);
      return;
    }
    setUserLoading(true);
    (async () => {
      try {
        const response = await apiService.getUsersDropdown({
          name: debouncedName,
          role_id: ROLE_IDS.HOMEOWNER,
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

        setUserOptions(users);
        setShowDropdown(true);
      } catch (err: any) {
        setUserOptions([]);
        setShowDropdown(false);
        showErrorToast(err?.message || 'Failed to fetch users');
      } finally {
        setUserLoading(false);
      }
    })();
  }, [debouncedName]);

  // Handle selecting a user from dropdown
  const handleSelectUser = (user: UserOption) => {
    const { name, email, phone_number, id } = user;

    setValue('client_name', name || '');
    if (email) setValue('client_email', email);
    if (phone_number) setValue('client_phone_number', phone_number);
    if (id) setValue('client_id', String(id));
    setShowDropdown(false);
    setUserSelected(true);
    suppressNextSearch.current = true;
    clearErrors(['client_name', 'client_email', 'client_phone_number']);
  };

  // Close dropdown on blur
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className='w-full max-w-4xl mx-auto bg-transparent shadow-none border-0'>
      <CardContent className='p-0'>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='space-y-4 sm:space-y-6'
        >
          {/* Full Name Input with Autocomplete */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1 md:space-y-2 relative col-span-full'>
              <Label
                htmlFor='client_name'
                className='fled-label text-sm sm:text-base'
              >
                {JOB_MESSAGES.JOB_NAME_LABEL}
              </Label>
              <Controller
                name='client_name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_name'
                    placeholder={JOB_MESSAGES.ENTER_JOB_NAME}
                    className={cn(
                      'input-field',
                      userLoading ? 'pr-10' : '',
                      errors.client_name
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                    autoComplete='off'
                    ref={nameInputRef}
                    onChange={e => {
                      field.onChange(e);
                      if (e.target.value !== clientNameValue) {
                        setUserSelected(false);
                        setValue('client_id', '');
                      }
                    }}
                  />
                )}
              />
              {errors.client_name && (
                <span className='text-[var(--warning)] text-xs'>
                  {errors.client_name.message}
                </span>
              )}
              {/* Dropdown */}
              {userOptions.length > 0 && showDropdown && (
                <div className='absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-56 overflow-auto'>
                  {userLoading && (
                    <div className='p-2 text-gray-500 text-sm'>Loading...</div>
                  )}
                  {!userLoading &&
                    userOptions.map((user, idx) => (
                      <div
                        key={user.id || idx}
                        className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                        onMouseDown={() => handleSelectUser(user)}
                      >
                        {user.name}{' '}
                        {user.email ? (
                          <span className='text-gray-400'>
                            ({`${user.email},${user.phone_number}`})
                          </span>
                        ) : null}
                      </div>
                    ))}
                  {!userLoading && userOptions.length === 0 && (
                    <div className='p-2 text-gray-500 text-sm'>
                      No users found. You can use your input.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='space-y-1 md:space-y-2'>
              <Label
                htmlFor='client_email'
                className='fled-label text-sm sm:text-base'
              >
                {JOB_MESSAGES.EMAIL_LABEL}
              </Label>
              <Controller
                name='client_email'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_email'
                    placeholder={JOB_MESSAGES.ENTER_EMAIL}
                    className={cn(
                      'input-field',
                      errors.client_email
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                    disabled={userSelected}
                  />
                )}
              />
              {errors.client_email && (
                <span className='text-[var(--warning)] text-xs'>
                  {errors.client_email.message}
                </span>
              )}
            </div>
            <div className='space-y-1 md:space-y-2'>
              <Label
                htmlFor='client_phone_number'
                className='fled-label text-sm sm:text-base'
              >
                {JOB_MESSAGES.PHONE_LABEL}
              </Label>
              <Controller
                name='client_phone_number'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_phone_number'
                    placeholder={JOB_MESSAGES.ENTER_PHONE}
                    className={cn(
                      'input-field',
                      errors.client_phone_number
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                    disabled={userSelected}
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
                )}
              />
              {errors.client_phone_number && (
                <span className='text-[var(--warning)] text-xs'>
                  {errors.client_phone_number.message}
                </span>
              )}
            </div>
          </div>

          {/* Job Type Radio Group */}
          <div className={cn('space-y-3 hidden')}>
            {' '}
            {/* TODO: Remove hidden */}
            {/* <Label className='fled-label'>{JOB_MESSAGES.JOB_TYPE_LABEL}</Label> */}
            <Controller
              name='job_privacy'
              control={control}
              render={({ field }) => (
                <RadioGroupStripe
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.job_privacy && (
              <span className='text-[var(--warning)] text-xs'>
                {errors.job_privacy.message}
              </span>
            )}
          </div>

          {/* Select Boxes Section */}
          <div className='space-y-3 sm:space-y-4'>
            <Label className='fled-label text-sm sm:text-base'>
              {JOB_MESSAGES.SELECT_BOXES_LABEL}
            </Label>
            <Controller
              name='job_boxes_step'
              control={control}
              render={({ field }) => {
                const value: string[] = Array.isArray(field.value)
                  ? field.value.filter(
                      (v): v is string => typeof v === 'string'
                    )
                  : [];
                // Helper to determine if a value is selected
                const isSelected = (v: string) => value.includes(v);
                return (
                  <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                    {jobSelectOptions.map(
                      ({
                        id,
                        value: optionValue,
                        title,
                        description,
                        disabled,
                      }) => {
                        const isDisabled = disabled;
                        return (
                          <SelectBoxCard
                            key={id}
                            id={id}
                            name={field.name}
                            value={optionValue}
                            title={title}
                            description={description}
                            checked={isSelected(optionValue)}
                            disabled={isDisabled}
                            onChange={checked => {
                              let selected = [...value];
                              selected = checked
                                ? Array.from(
                                    new Set([...selected, optionValue])
                                  )
                                : selected.filter(v => v !== optionValue);
                              field.onChange(selected);
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                );
              }}
            />
            {errors.job_boxes_step && (
              <span className='text-[var(--warning)] text-xs'>
                {errors.job_boxes_step.message as string}
              </span>
            )}
          </div>

          {/* Read-only Link Display (if present) */}
          {defaultValues?.link && (
            <div className='space-y-1 md:space-y-2'>
              <Label htmlFor='link' className='fled-label text-sm sm:text-base'>
                {JOB_MESSAGES.LINK_LABEL}
              </Label>
              <Input
                id='link'
                value={defaultValues.link}
                readOnly
                className='h-10 sm:h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] opacity-60 cursor-not-allowed text-sm sm:text-base'
              />
            </div>
          )}

          {/* Generated Home Owner Link Display */}
          {generatedLink && (
            <div className='space-y-1 md:space-y-2'>
              <Label
                htmlFor='generatedLink'
                className='fled-label text-sm sm:text-base'
              >
                Link
              </Label>
              <Input
                id='generatedLink'
                value={generatedLink}
                readOnly
                className='h-10 sm:h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] opacity-60 cursor-not-allowed text-sm sm:text-base'
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className='pt-4 flex items-stretch sm:items-center gap-3'>
            {generatedLink ? (
              <>
                <Button
                  type='button'
                  className='btn-secondary !px-4 md:!px-8 text-sm sm:text-base flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                  onClick={() => {
                    if (generatedLink) {
                      window.open(generatedLink, '_blank');
                    }
                  }}
                >
                  Continue Estimate
                </Button>
                <Button
                  className='btn-primary !px-4 md:!px-8 text-sm sm:text-base flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                  type='button'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    showSuccessToast('Link copied!');
                  }}
                >
                  Copy Link
                </Button>
              </>
            ) : (
              <>
                <Button
                  type='button'
                  className='btn-secondary !px-4 md:!px-8 text-sm sm:text-base flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                  onClick={onCancel}
                >
                  {JOB_MESSAGES.CANCEL_BUTTON}
                </Button>
                {defaultValues?.link && (
                  <Button
                    className='btn-secondary !px-4 md:!px-8 text-sm sm:text-base flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                    type='button'
                  >
                    Continue Estimate
                  </Button>
                )}
                <Button
                  type='submit'
                  className='btn-primary !px-4 md:!px-8 text-sm sm:text-base flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? JOB_MESSAGES.CREATING_BUTTON
                    : JOB_MESSAGES.CREATE_BUTTON}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
