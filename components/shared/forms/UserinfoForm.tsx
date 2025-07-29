'use client';

import {
  FormErrors,
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
import { format } from 'date-fns';
import { Calendar } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';
import LoadingComponent from '../common/LoadingComponent';
import SelectField from '../common/SelectField';

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
    const [date, setDate] = useState<Date>();
    const [roleId, setRoleId] = useState('');
    const [fullName, setFullName] = useState('');
    const [designation, setDesignation] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('us');
    const [communication, setCommunication] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize form with initial data
    const initializeForm = useCallback(() => {
      if (isEditMode && initialData && !isInitialized) {
        // Set role ID
        if (initialData.role_id) {
          setRoleId(String(initialData.role_id));
        }

        // Set other fields
        setFullName(initialData.name || '');
        setDesignation(initialData.designation || '');
        setEmail(initialData.email || '');

        // Handle phone number and country code
        if (initialData.country_code && initialData.phone_number) {
          // Separate fields available
          const countryKey = COUNTRY_CODES.getCountryFromCode(
            initialData.country_code
          );
          setCountry(countryKey);
          setPhone(initialData.phone_number);
        } else if (initialData.phone_number) {
          // Combined phone number - extract country code
          const phoneStr = initialData.phone_number;
          const matchedEntry = Object.entries(COUNTRY_CODES.MAP).find(
            ([, code]) => phoneStr.startsWith(code)
          );
          if (matchedEntry) {
            const [countryKey, code] = matchedEntry;
            setCountry(countryKey);
            setPhone(phoneStr.substring(code.length));
          } else {
            // Default to US if no country code found
            setCountry('us');
            setPhone(phoneStr);
          }
        }

        // Set communication method
        if (initialData.preferred_communication_method) {
          setCommunication(initialData.preferred_communication_method);
        }

        setAddress(initialData.address || '');
        setCity(initialData.city || '');
        setPinCode(initialData.pincode || '');

        if (initialData.date_of_joining) {
          setDate(new Date(initialData.date_of_joining));
        }

        setIsInitialized(true);
      }
    }, [isEditMode, initialData, isInitialized]);

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

    const validate = (): boolean => {
      const newErrors: FormErrors = {};
      if (!roleId) newErrors.roleCategory = USER_MESSAGES.ROLE_REQUIRED;
      if (!fullName) newErrors.fullName = USER_MESSAGES.FULL_NAME_REQUIRED;
      if (!designation)
        newErrors.designation = USER_MESSAGES.DESIGNATION_REQUIRED;
      if (!date) newErrors.date = USER_MESSAGES.DATE_REQUIRED;
      if (!email) newErrors.email = USER_MESSAGES.EMAIL_REQUIRED;
      if (!phone) newErrors.phone = USER_MESSAGES.PHONE_REQUIRED;
      // Password validation - only in edit mode and only if it's provided
      if (isEditMode && password && password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      if (!communication)
        newErrors.communication = USER_MESSAGES.COMMUNICATION_REQUIRED;
      if (!address) newErrors.address = USER_MESSAGES.ADDRESS_REQUIRED;
      if (!city) newErrors.city = USER_MESSAGES.CITY_REQUIRED;
      if (!pinCode) newErrors.pinCode = USER_MESSAGES.PIN_CODE_REQUIRED;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
          const payload: UserFormData = {
            role_id: Number(roleId),
            name: fullName,
            email,
            country_code: COUNTRY_CODES.getCodeFromCountry(country),
            phone_number: phone,
            designation,
            preferred_communication_method: communication,
            address,
            city,
            pincode: pinCode,
          };

          // Add profile picture URL only if provided
          if (imageUrl) {
            payload.profile_picture_url = imageUrl;
          }

          // Add date only if it's provided
          if (date) {
            payload.date_of_joining = date.toISOString().split('T')[0];
          }

          // Add password only if provided (edit mode only)
          if (isEditMode && password) {
            payload.password = password;
          }

          onSubmit(payload);
        }
      },
      [
        validate,
        roleId,
        fullName,
        email,
        country,
        phone,
        designation,
        communication,
        address,
        city,
        pinCode,
        imageUrl,
        date,
        isEditMode,
        password,
        onSubmit,
      ]
    );

    const handleCancel = useCallback((): void => {
      if (onCancel) {
        onCancel();
      } else {
        // Fallback: reset form fields if no onCancel provided
        setRoleId('');
        setFullName('');
        setDesignation('');
        setDate(undefined);
        setEmail('');
        setPhone('');
        setCountry('us');
        setCommunication('');
        setAddress('');
        setCity('');
        setPinCode('');
        setPassword('');
        setErrors({});
      }
    }, [onCancel]);

    // Don't render form until data is loaded in edit mode
    if (isEditMode && !isInitialized && initialData) {
      return <LoadingComponent variant='fullscreen' size='sm' />;
    }

    return (
      <form
        className='space-y-2 md:space-y-6'
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Role Dropdown */}
        <div className='space-y-2'>
          <SelectField
            label={USER_MESSAGES.ROLE_LABEL}
            value={roleId}
            onValueChange={setRoleId}
            options={roles.map(({ id, name, status }) => ({
              value: String(id),
              label: status === 'INACTIVE' ? `${name} (Deactivated)` : name,
              disabled: status === 'INACTIVE',
            }))}
            placeholder={
              loadingRoles
                ? USER_MESSAGES.LOADING_ROLES
                : USER_MESSAGES.SELECT_ROLE
            }
            error={errors.roleCategory || ''}
            className=''
          />
        </div>
        {/* First Row - Full Name, Designation, Date of Joining */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='full-name' className='field-label'>
              {USER_MESSAGES.FULL_NAME_LABEL}
            </Label>
            <Input
              id='full-name'
              placeholder={USER_MESSAGES.ENTER_FULL_NAME}
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className={cn(
                'input-field',
                errors.fullName
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
            <FormErrorMessage message={errors.fullName || ''} />
          </div>
          <div className='sm:space-y-2 space-y-1'>
            <Label htmlFor='designation' className='field-label'>
              {USER_MESSAGES.DESIGNATION_LABEL}
            </Label>
            <Input
              id='designation'
              placeholder={USER_MESSAGES.ENTER_JOB_TITLE}
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className={cn(
                'input-field',
                errors.designation
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
            <FormErrorMessage message={errors.designation || ''} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='date' className='field-label'>
              {USER_MESSAGES.DATE_OF_JOINING_LABEL}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                    !date && 'text-muted-foreground',
                    errors.date
                      ? 'border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                >
                  {date ? (
                    format(date, 'PPP')
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
                  selected={date}
                  onSelect={setDate}
                  disabled={(date: Date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormErrorMessage message={errors.date || ''} />
          </div>
        </div>
        {/* Second Row - Email, Phone, Communication, Password (edit mode only) */}
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-4',
            isEditMode ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
          )}
        >
          <div className='space-y-2'>
            <Label htmlFor='email' className='field-label'>
              {USER_MESSAGES.EMAIL_LABEL}
            </Label>
            <Input
              id='email'
              type='email'
              placeholder={USER_MESSAGES.ENTER_EMAIL}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={cn(
                'input-field',
                errors.email
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
            <FormErrorMessage message={errors.email || ''} />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-xs md:text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {USER_MESSAGES.PHONE_LABEL}
            </Label>
            <div className='flex'>
              <Select
                value={country}
                onValueChange={value => {
                  setCountry(value);
                }}
              >
                <SelectTrigger
                  className={cn(
                    'w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                    errors.phone
                      ? 'border-[var(--warning)]'
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
              <Input
                id='phone'
                placeholder={USER_MESSAGES.ENTER_NUMBER}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={cn(
                  'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                  errors.phone
                    ? 'border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            </div>
            <FormErrorMessage message={errors.phone || ''} />
          </div>
          <div className='space-y-2'>
            <SelectField
              label={USER_MESSAGES.COMMUNICATION_LABEL}
              value={communication}
              onValueChange={setCommunication}
              options={[
                { value: 'email', label: USER_MESSAGES.EMAIL_OPTION },
                { value: 'phone', label: USER_MESSAGES.PHONE_OPTION },
                { value: 'sms', label: USER_MESSAGES.SMS_OPTION },
              ]}
              placeholder={USER_MESSAGES.SELECT_COMMUNICATION}
              error={errors.communication || ''}
              className=''
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
              <Input
                id='password'
                type='password'
                placeholder={USER_MESSAGES.ENTER_PASSWORD_OPTIONAL}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={cn(
                  'input-field',
                  errors.password
                    ? '!border-[var(--warning)]'
                    : '!border-[var(--border-dark)]'
                )}
              />
              <FormErrorMessage message={errors.password || ''} />
            </div>
          )}
        </div>
        {/* Third Row - Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='field-label'>
            {USER_MESSAGES.ADDRESS_LABEL}
          </Label>
          <Input
            id='address'
            placeholder={USER_MESSAGES.ENTER_ADDRESS}
            value={address}
            onChange={e => setAddress(e.target.value)}
            className={cn(
              'input-field',
              errors.address
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.address || ''} />
        </div>
        {/* Fourth Row - City, Pin Code */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='city' className='field-label'>
              {USER_MESSAGES.CITY_LABEL}
            </Label>
            <Input
              id='city'
              placeholder={USER_MESSAGES.ENTER_CITY}
              value={city}
              onChange={e => setCity(e.target.value)}
              className={cn(
                'input-field',
                errors.city
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
            <FormErrorMessage message={errors.city || ''} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='pin-code' className='field-label'>
              {USER_MESSAGES.PIN_CODE_LABEL}
            </Label>
            <Input
              id='pin-code'
              placeholder={USER_MESSAGES.ENTER_PIN_CODE}
              value={pinCode}
              onChange={e => setPinCode(e.target.value)}
              className={cn(
                'input-field',
                errors.pinCode
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
            <FormErrorMessage message={errors.pinCode || ''} />
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
