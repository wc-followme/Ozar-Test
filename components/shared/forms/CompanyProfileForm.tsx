'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { COUNTRY_CODES } from '@/constants/common';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ProfileImageUpload } from './ProfileImageUpload';

// Validation schema
const companyProfileSchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  tagline: yup.string().required('Tagline is required'),
  about: yup.string().required('About is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  countryCode: yup.string().required('Country code is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  pinCode: yup.string().required('Pin code is required'),
  preferredCommunication: yup
    .string()
    .required('Preferred method of communication is required'),
  website: yup.string().required('Website is required'),
});

interface CompanyProfileFormData {
  companyName: string;
  tagline: string;
  about: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  address: string;
  city: string;
  pinCode: string;
  preferredCommunication: string;
  website: string;
}

interface CompanyProfileFormProps {
  onSubmit: (data: CompanyProfileFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CompanyProfileFormData>;
  loading?: boolean;
}

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyProfileFormData>({
    resolver: yupResolver(companyProfileSchema),
    defaultValues: {
      companyName: initialData?.companyName || 'Envision Construction',
      tagline: initialData?.tagline || 'Construction Company',
      about:
        initialData?.about ||
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...',
      email: initialData?.email || 'envison.construction@example.com',
      phoneNumber: initialData?.phoneNumber || '(239) 555-0108',
      countryCode: initialData?.countryCode || '+1',
      address: initialData?.address || '3517 W. Gray St. Utica, Pennsylvania',
      city: initialData?.city || 'Utica',
      pinCode: initialData?.pinCode || '57867',
      preferredCommunication:
        initialData?.preferredCommunication || 'Email, Text, in App Messages',
      website: initialData?.website || 'envisionconstructions.com',
    },
  });

  const handleFormSubmit = async (data: CompanyProfileFormData) => {
    await onSubmit(data);
  };

  const handleImageChange = (_fileKey: string) => {
    // Not used in this component
  };

  const handleImageDelete = () => {
    // Not used in this component
  };

  return (
    <div className=''>
      <div className='flex items-start flex-col lg:flex-row gap-6'>
        {/* Left Column - Profile Photo */}
        <ProfileImageUpload
          onImageChange={handleImageChange}
          onImageDelete={handleImageDelete}
          title='Profile Photo'
          instructionText='1600 x 1200 (4:3) recommended.'
          instructionSubText='PNG and JPG files are allowed'
          buttonText='Change Photo'
          uploadingText='Uploading...'
          width={412}
          height={200}
        />

        {/* Right Column - Company Information */}
        <div className='flex-1 bg-[var(--card-background)] rounded-[10px] w-full border border-[var(--border-dark)] p-4 sm:p-6'>
          <h2 className='text-lg font-bold mb-6 text-[var(--text-dark)]'>
            Company Information
          </h2>

          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6'>
              {/* Company Name */}
              <div className='space-y-2'>
                <Label htmlFor='companyName' className='field-label'>
                  Company Name
                </Label>
                <Controller
                  name='companyName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='companyName'
                      className={cn(
                        'input-field',
                        errors.companyName
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter company name'
                    />
                  )}
                />
                <FormErrorMessage message={errors.companyName?.message || ''} />
              </div>

              {/* Tagline */}
              <div className='space-y-2'>
                <Label htmlFor='tagline' className='field-label'>
                  Tagline
                </Label>
                <Controller
                  name='tagline'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='tagline'
                      className={cn(
                        'input-field',
                        errors.tagline
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter tagline'
                    />
                  )}
                />
                <FormErrorMessage message={errors.tagline?.message || ''} />
              </div>

              {/* About */}
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='about' className='field-label'>
                  About
                </Label>
                <Controller
                  name='about'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id='about'
                      className={cn(
                        'input-field min-h-[100px] resize-none',
                        errors.about
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter company description'
                    />
                  )}
                />
                <FormErrorMessage message={errors.about?.message || ''} />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='field-label'>
                  Email
                </Label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      className={cn(
                        'input-field',
                        errors.email
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter email address'
                    />
                  )}
                />
                <FormErrorMessage message={errors.email?.message || ''} />
              </div>

              {/* Phone Number */}
              <div className='space-y-2'>
                <Label htmlFor='phone' className='field-label'>
                  Phone Number
                </Label>
                <div className='flex'>
                  <Controller
                    name='countryCode'
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-20 sm:w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                            errors.phoneNumber
                              ? '!border-[var(--warning)]'
                              : 'border-[var(--border-dark)]'
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                          {COUNTRY_CODES.LIST.map(country => (
                            <SelectItem key={country.key} value={country.code}>
                              <div className='flex items-center gap-2'>
                                <span>{country.flag}</span>
                                <span className='hidden sm:inline'>
                                  {country.code}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='phone'
                        placeholder='Enter phone number'
                        className={cn(
                          'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                          errors.phoneNumber
                            ? '!border-[var(--warning)]'
                            : 'border-[var(--border-dark)]'
                        )}
                      />
                    )}
                  />
                </div>
                <FormErrorMessage message={errors.phoneNumber?.message || ''} />
              </div>

              {/* Address */}
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address' className='field-label'>
                  Address
                </Label>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='address'
                      className={cn(
                        'input-field',
                        errors.address
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter address'
                    />
                  )}
                />
                <FormErrorMessage message={errors.address?.message || ''} />
              </div>

              {/* City */}
              <div className='space-y-2'>
                <Label htmlFor='city' className='field-label'>
                  City
                </Label>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='city'
                      className={cn(
                        'input-field',
                        errors.city
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter city'
                    />
                  )}
                />
                <FormErrorMessage message={errors.city?.message || ''} />
              </div>

              {/* Pin Code */}
              <div className='space-y-2'>
                <Label htmlFor='pinCode' className='field-label'>
                  Pin Code
                </Label>
                <Controller
                  name='pinCode'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='pinCode'
                      className={cn(
                        'input-field',
                        errors.pinCode
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter pin code'
                    />
                  )}
                />
                <FormErrorMessage message={errors.pinCode?.message || ''} />
              </div>

              {/* Preferred Method of Communication */}
              <div className='space-y-2'>
                <Controller
                  name='preferredCommunication'
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label='Preferred Method of Communication'
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[
                        {
                          value: 'Email, Text, in App Messages',
                          label: 'Email, Text, in App Messages',
                        },
                        { value: 'Email only', label: 'Email only' },
                        { value: 'Text only', label: 'Text only' },
                        {
                          value: 'In App Messages only',
                          label: 'In App Messages only',
                        },
                      ]}
                      placeholder='Select preferred communication method'
                      error={errors.preferredCommunication?.message || ''}
                      triggerClassName={
                        errors.preferredCommunication
                          ? '!border-[var(--warning)]'
                          : ''
                      }
                    />
                  )}
                />
              </div>

              {/* Website */}
              <div className='space-y-2'>
                <Label htmlFor='website' className='field-label'>
                  Website
                </Label>
                <Controller
                  name='website'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='website'
                      className={cn(
                        'input-field',
                        errors.website
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                      placeholder='Enter website URL'
                    />
                  )}
                />
                <FormErrorMessage message={errors.website?.message || ''} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4 sm:pt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
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
      </div>
    </div>
  );
};
