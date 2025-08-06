'use client';

import {
  Role,
  UserFormData,
  UserInitialData,
} from '@/app/(DashboardLayout)/user-management/types';
import { USER_MESSAGES } from '@/app/(DashboardLayout)/user-management/user-messages';
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
import { COUNTRY_CODES } from '@/constants/common';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormErrorMessage from '../common/FormErrorMessage';
import LoadingComponent from '../common/LoadingComponent';
import SelectField from '../common/SelectField';

// Validation schema
const userFormSchema = yup.object({
  role_id: yup.string().required(USER_MESSAGES.ROLE_REQUIRED),
  name: yup.string().required(USER_MESSAGES.FULL_NAME_REQUIRED),
  designation: yup.string().required(USER_MESSAGES.DESIGNATION_REQUIRED),
  date_of_joining: yup.date().required(USER_MESSAGES.DATE_REQUIRED),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required(USER_MESSAGES.EMAIL_REQUIRED),
  phone: yup.string().required(USER_MESSAGES.PHONE_REQUIRED),
  country_code: yup.string().required(),
  preferred_communication_method: yup
    .string()
    .required(USER_MESSAGES.COMMUNICATION_REQUIRED),
  address: yup.string().required(USER_MESSAGES.ADDRESS_REQUIRED),
  city: yup.string().required(USER_MESSAGES.CITY_REQUIRED),
  pincode: yup.string().required(USER_MESSAGES.PIN_CODE_REQUIRED),
  password: yup.string().optional(),
});

interface UserInfoFormProps {
  roles: Role[];
  loadingRoles?: boolean;
  imageUrl?: string;
  onSubmit: (data: UserFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  initialData?: UserInitialData;
  isEditMode?: boolean;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = React.memo(
  ({
    roles,
    loadingRoles,
    imageUrl,
    onSubmit,
    onCancel,
    loading,
    initialData,
    isEditMode,
  }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(userFormSchema),
      defaultValues: {
        role_id: '',
        name: '',
        designation: '',
        date_of_joining: undefined as any,
        email: '',
        phone: '',
        country_code: 'us',
        preferred_communication_method: '',
        address: '',
        city: '',
        pincode: '',
        password: '',
      },
    });
    // Initialize form with initial data
    const initializeForm = useCallback(() => {
      if (isEditMode && initialData && !isInitialized) {
        const {
          name,
          designation,
          email,
          country_code,
          phone_number,
          preferred_communication_method,
          address,
          city,
          pincode,
          date_of_joining,
          role,
        } = initialData;
        console.log('initialData', { initialData, roles });
        // Set role ID
        if (role) {
          setValue('role_id', role.uuid);
        }

        // Set other fields
        setValue('name', name || '');
        setValue('designation', designation || '');
        setValue('email', email || '');

        // Handle phone number and country code
        if (country_code && phone_number) {
          // Separate fields available
          const countryKey = COUNTRY_CODES.getCountryFromCode(country_code);
          setValue('country_code', countryKey);
          setValue('phone', phone_number);
        } else if (phone_number) {
          // Combined phone number - extract country code
          const phoneStr = phone_number;
          const matchedEntry = Object.entries(COUNTRY_CODES.MAP).find(
            ([, code]) => phoneStr.startsWith(code)
          );
          if (matchedEntry) {
            const [countryKey, code] = matchedEntry;
            setValue('country_code', countryKey);
            setValue('phone', phoneStr.substring(code.length));
          } else {
            // Default to US if no country code found
            setValue('country_code', 'us');
            setValue('phone', phoneStr);
          }
        }

        // Set communication method
        if (preferred_communication_method) {
          setValue(
            'preferred_communication_method',
            preferred_communication_method
          );
        }

        setValue('address', address || '');
        setValue('city', city || '');
        setValue('pincode', pincode || '');

        if (date_of_joining) {
          setValue('date_of_joining', new Date(date_of_joining));
        }

        setIsInitialized(true);
      }
    }, [isEditMode, initialData, isInitialized, setValue]);

    // Initialize form when component mounts or when initialData changes
    useEffect(() => {
      initializeForm();
    }, [initializeForm]);

    // Re-initialize form when initialData becomes available
    useEffect(() => {
      if (initialData && !isInitialized) {
        initializeForm();
      }
    }, [initialData, isInitialized, initializeForm]);

    // Fallback initialization - if data is available but form not initialized after 1 second
    useEffect(() => {
      if (isEditMode && initialData && !isInitialized) {
        const timer = setTimeout(() => {
          if (!isInitialized) {
            initializeForm();
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isEditMode, initialData, isInitialized, initializeForm]);

    const onFormSubmit = useCallback(
      (data: any) => {
        const {
          role_id,
          name,
          email,
          country_code,
          phone,
          designation,
          preferred_communication_method,
          address,
          city,
          pincode,
          date_of_joining,
          password,
        } = data;
        const payload: UserFormData = {
          role_id,
          name,
          email,
          country_code: COUNTRY_CODES.getCodeFromCountry(country_code),
          phone_number: phone,
          designation,
          preferred_communication_method,
          address,
          city,
          pincode,
        };

        // Add profile picture URL only if provided
        if (imageUrl) {
          payload.profile_picture_url = imageUrl;
        }

        // Add date only if it's provided
        if (date_of_joining) {
          payload.date_of_joining = date_of_joining.toISOString().split('T')[0];
        }

        // Add password only if provided (edit mode only)
        if (isEditMode && password) {
          payload.password = password;
        }

        onSubmit(payload);
      },
      [imageUrl, isEditMode, onSubmit]
    );

    const handleCancel = useCallback((): void => {
      if (onCancel) {
        onCancel();
      } else {
        // Fallback: reset form fields if no onCancel provided
        reset();
      }
    }, [onCancel, reset]);

    // Don't render form until data is loaded in edit mode
    if (isEditMode && !isInitialized && initialData) {
      return <LoadingComponent variant='fullscreen' size='sm' />;
    }

    return (
      <form
        className='space-y-2 md:space-y-6'
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
      >
        {/* Role Dropdown */}
        <div className='space-y-2'>
          <Controller
            name='role_id'
            control={control}
            render={({ field }) => (
              <SelectField
                label={USER_MESSAGES.ROLE_LABEL}
                value={field.value}
                onValueChange={field.onChange}
                options={roles?.map(({ uuid, name, status }) => ({
                  value: uuid,
                  label: status === 'INACTIVE' ? `${name} (Deactivated)` : name,
                  disabled: status === 'INACTIVE',
                }))}
                placeholder={
                  loadingRoles
                    ? USER_MESSAGES.LOADING_ROLES
                    : USER_MESSAGES.SELECT_ROLE
                }
                error={errors.role_id?.message || ''}
                triggerClassName={
                  errors.role_id ? '!border-[var(--warning)]' : ''
                }
                disabled={isEditMode || false}
              />
            )}
          />
        </div>
        {/* First Row - Full Name, Designation, Date of Joining */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='full-name' className='field-label'>
              {USER_MESSAGES.FULL_NAME_LABEL}
            </Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  id='full-name'
                  placeholder={USER_MESSAGES.ENTER_FULL_NAME}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.name
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              )}
            />
            <FormErrorMessage message={errors.name?.message || ''} />
          </div>
          <div className='sm:space-y-2 space-y-1'>
            <Label htmlFor='designation' className='field-label'>
              {USER_MESSAGES.DESIGNATION_LABEL}
            </Label>
            <Controller
              name='designation'
              control={control}
              render={({ field }) => (
                <Input
                  id='designation'
                  placeholder={USER_MESSAGES.ENTER_JOB_TITLE}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.designation
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              )}
            />
            <FormErrorMessage message={errors.designation?.message || ''} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='date' className='field-label'>
              {USER_MESSAGES.DATE_OF_JOINING_LABEL}
            </Label>
            <Controller
              name='date_of_joining'
              control={control}
              render={({ field }) => (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                        !field.value && 'text-muted-foreground',
                        errors.date_of_joining
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>{USER_MESSAGES.SELECT_DATE}</span>
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
                        setDatePickerOpen(false); // Close popover after selection
                      }}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FormErrorMessage message={errors.date_of_joining?.message || ''} />
          </div>
        </div>
        {/* Second Row - Email, Phone, Communication, Password (edit mode only) */}
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-4',
            isEditMode ? 'xl:grid-cols-3' : 'xl:grid-cols-3'
          )}
        >
          <div className='space-y-2'>
            <Label htmlFor='email' className='field-label'>
              {USER_MESSAGES.EMAIL_LABEL}
            </Label>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  id='email'
                  type='email'
                  placeholder={USER_MESSAGES.ENTER_EMAIL}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.email
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              )}
            />
            <FormErrorMessage message={errors.email?.message || ''} />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-xs md:text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {USER_MESSAGES.PHONE_LABEL}
            </Label>
            <div className='flex'>
              <Controller
                name='country_code'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        'w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                        errors.phone
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                      {COUNTRY_CODES.LIST.map(country => (
                        <SelectItem key={country.key} value={country.key}>
                          <div className='flex items-center gap-2'>
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <Input
                    id='phone'
                    placeholder={USER_MESSAGES.ENTER_NUMBER}
                    value={field.value}
                    onChange={field.onChange}
                    className={cn(
                      'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                      errors.phone
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
            </div>
            <FormErrorMessage message={errors.phone?.message || ''} />
          </div>
          <div className='space-y-2'>
            <Controller
              name='preferred_communication_method'
              control={control}
              render={({ field }) => {
                const communicationOptions = [
                  { value: 'email', label: USER_MESSAGES.EMAIL_OPTION },
                  { value: 'phone', label: USER_MESSAGES.PHONE_OPTION },
                  { value: 'sms', label: USER_MESSAGES.SMS_OPTION },
                ];

                return (
                  <SelectField
                    label={USER_MESSAGES.COMMUNICATION_LABEL}
                    value={field.value}
                    onValueChange={field.onChange}
                    options={communicationOptions}
                    placeholder={USER_MESSAGES.SELECT_COMMUNICATION}
                    error={errors.preferred_communication_method?.message || ''}
                    triggerClassName={
                      errors.preferred_communication_method
                        ? '!border-[var(--warning)]'
                        : ''
                    }
                  />
                );
              }}
            />
          </div>
          {/* Password field - only shown in edit mode */}
          {isEditMode && (
            <div className='space-y-2'>
              <Label htmlFor='password' className='field-label'>
                {USER_MESSAGES.PASSWORD_LABEL}{' '}
                <span className='text-sm text-gray-500'>
                  {USER_MESSAGES.PASSWORD_OPTIONAL_HINT}
                </span>
              </Label>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <Input
                    id='password'
                    type='password'
                    placeholder={USER_MESSAGES.ENTER_PASSWORD_OPTIONAL}
                    value={field.value}
                    onChange={field.onChange}
                    className={cn(
                      'input-field',
                      errors.password
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.password?.message || ''} />
            </div>
          )}
        </div>
        {/* Third Row - Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='field-label'>
            {USER_MESSAGES.ADDRESS_LABEL}
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                id='address'
                placeholder={USER_MESSAGES.ENTER_ADDRESS}
                value={field.value}
                onChange={field.onChange}
                className={cn(
                  'input-field',
                  errors.address
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            )}
          />
          <FormErrorMessage message={errors.address?.message || ''} />
        </div>
        {/* Fourth Row - City, Pin Code */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='city' className='field-label'>
              {USER_MESSAGES.CITY_LABEL}
            </Label>
            <Controller
              name='city'
              control={control}
              render={({ field }) => (
                <Input
                  id='city'
                  placeholder={USER_MESSAGES.ENTER_CITY}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.city
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              )}
            />
            <FormErrorMessage message={errors.city?.message || ''} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='pin-code' className='field-label'>
              {USER_MESSAGES.PIN_CODE_LABEL}
            </Label>
            <Controller
              name='pincode'
              control={control}
              render={({ field }) => (
                <Input
                  id='pin-code'
                  placeholder={USER_MESSAGES.ENTER_PIN_CODE}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'input-field',
                    errors.pincode
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              )}
            />
            <FormErrorMessage message={errors.pincode?.message || ''} />
          </div>
        </div>
        <div className='pt-4 flex items-center justify-end gap-3'>
          <Button
            type='button'
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            onClick={handleCancel}
          >
            {USER_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            disabled={loading}
          >
            {isEditMode
              ? USER_MESSAGES.UPDATE_BUTTON
              : USER_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    );
  }
);

UserInfoForm.displayName = 'UserInfoForm';
