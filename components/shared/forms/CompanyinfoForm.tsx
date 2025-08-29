'use client';

import { COMPANY_MESSAGES } from '@/app/(DashboardLayout)/company-management/company-messages';
import {
  CompanyCreateFormData,
  CompanyInfoFormProps,
} from '@/app/(DashboardLayout)/company-management/company-types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Textarea } from '@/components/ui/textarea';
import { COUNTRY_CODES } from '@/constants/common';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormErrorMessage from '../common/FormErrorMessage';
import PhotoUploadField from '../common/PhotoUploadField';

// Validation schema
const createCompanyFormSchema = (showExpiryDate: boolean) =>
  yup.object({
    name: yup.string().required(COMPANY_MESSAGES.NAME_REQUIRED),
    tagline: yup.string().required(COMPANY_MESSAGES.TAGLINE_REQUIRED),
    about: yup.string().required(COMPANY_MESSAGES.ABOUT_REQUIRED),
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required(COMPANY_MESSAGES.EMAIL_REQUIRED),
    phone_number: yup.string().required(COMPANY_MESSAGES.PHONE_REQUIRED),
    country_code: yup.string().required(),
    communication: yup.string().required('Address is required'),
    website: yup.string().required(COMPANY_MESSAGES.WEBSITE_REQUIRED),
    ...(showExpiryDate && {
      expiry_date: yup.date().required(COMPANY_MESSAGES.EXPIRY_DATE_REQUIRED),
    }),
    preferred_communication_method: yup
      .string()
      .required(COMPANY_MESSAGES.PREFERRED_COMMUNICATION_REQUIRED),
    city: yup.string().required(COMPANY_MESSAGES.CITY_REQUIRED),
    pincode: yup.string().required(COMPANY_MESSAGES.PINCODE_REQUIRED),
    contractor_name: yup.string().optional(),
    contractor_email: yup
      .string()
      .email('Please enter a valid email address')
      .optional(),
    contractor_phone: yup.string().optional(),
    contractor_country_code: yup.string().optional(),
  });

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = React.memo(
  ({
    imageUrl,
    onSubmit,
    loading = false,
    initialData,
    isEditMode = false,
    showExpiryDate = true,
  }) => {
    const router = useRouter();
    const [isInitialized, setIsInitialized] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    // Contractor image upload states
    const [contractorPhotoFile, setContractorPhotoFile] = useState<File | null>(
      null
    );
    const [contractorUploading, setContractorUploading] = useState(false);
    const [contractorFileKey, setContractorFileKey] = useState<string | null>(
      null
    );

    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(createCompanyFormSchema(showExpiryDate)),
      defaultValues: {
        name: '',
        tagline: '',
        about: '',
        email: '',
        phone_number: '',
        country_code: '+1',
        communication: '',
        website: '',
        expiry_date: undefined as any,
        preferred_communication_method: '',
        city: '',
        pincode: '',
        contractor_name: '',
        contractor_email: '',
        contractor_phone: '',
        contractor_country_code: '+1',
      },
    });

    // Contractor image handlers
    const handleContractorPhotoChange = (file: File | null) => {
      setContractorPhotoFile(file);
    };

    const handleDeleteContractorPhoto = () => {
      setContractorPhotoFile(null);
      setContractorFileKey(null);
    };

    // Upload contractor image function
    const uploadContractorImage = useCallback(async (): Promise<
      string | null
    > => {
      if (!contractorPhotoFile) return null;

      try {
        setContractorUploading(true);

        // Generate a unique filename for contractor image
        const ext = contractorPhotoFile.name.split('.').pop() || 'png';
        const timestamp = Date.now();
        const generatedFileName = `contractor_${timestamp}.${ext}`;

        // Get presigned URL with purpose 'profile-picture'
        const presignedResponse = await getPresignedUrl({
          fileName: generatedFileName,
          fileType: contractorPhotoFile.type,
          fileSize: contractorPhotoFile.size,
          purpose: 'profile-picture',
          customPath: '',
        });

        const { statusCode, message, data } = presignedResponse;

        if (statusCode !== 200 && statusCode !== 201) {
          throw new Error(
            `Failed to get presigned URL: ${message || 'Unknown error'}`
          );
        }

        // Upload file
        await uploadFileToPresignedUrl(data['uploadUrl'], contractorPhotoFile);

        // Use fileKey for contractor_profile_url
        const fileKey = data['fileKey'];

        setContractorFileKey(fileKey);
        return fileKey;
      } catch (error) {
        console.error('Error uploading contractor image:', error);
        throw error;
      } finally {
        setContractorUploading(false);
      }
    }, [contractorPhotoFile]);

    // Initialize form with initial data
    const initializeForm = useCallback(() => {
      if (isEditMode && initialData && !isInitialized) {
        const {
          name,
          tagline,
          about,
          email,
          country_code,
          phone_number,
          communication,
          website,
          preferred_communication_method,
          city,
          pincode,
          expiry_date,
        } = initialData;

        setValue('name', name || '');
        setValue('tagline', tagline || '');
        setValue('about', about || '');
        setValue('email', email || '');

        // Handle phone number and country code
        if (country_code && phone_number) {
          // Separate fields available
          setValue('country_code', country_code);
          setValue('phone_number', phone_number);
        } else if (phone_number) {
          // Combined phone number - extract country code
          const phoneStr = phone_number;
          const matchedCountry = COUNTRY_CODES.LIST.find(country =>
            phoneStr.startsWith(country.code)
          );
          if (matchedCountry) {
            setValue('country_code', matchedCountry.code);
            setValue(
              'phone_number',
              phoneStr.substring(matchedCountry.code.length)
            );
          } else {
            // Default to +1 if no country code found
            setValue('country_code', '+1');
            setValue('phone_number', phoneStr);
          }
        }

        setValue('communication', communication || '');
        setValue('website', website || '');

        // Set preferred communication method
        if (preferred_communication_method) {
          setValue(
            'preferred_communication_method',
            preferred_communication_method
          );
        }

        setValue('city', city || '');
        setValue('pincode', pincode || '');

        if (expiry_date) {
          setValue('expiry_date', new Date(expiry_date));
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
      async (data: any) => {
        try {
          // Upload contractor image if provided
          let contractorProfileUrl: string | null = null;
          if (contractorPhotoFile) {
            contractorProfileUrl = await uploadContractorImage();
          }

          const {
            name,
            tagline,
            about,
            email,
            country_code,
            phone_number,
            communication,
            website,
            preferred_communication_method,
            city,
            pincode,
            contractor_name,
            contractor_email,
            contractor_phone,
            contractor_country_code,
            expiry_date,
          } = data;

          const payload: CompanyCreateFormData = {
            name,
            tagline,
            about,
            email,
            country_code,
            phone_number,
            communication,
            website,
            preferred_communication_method,
            city,
            pincode,
            projects: 'N/A', // Default value since field is hidden
          };

          // Add contractor information if provided
          if (contractor_name?.trim()) {
            payload.contractor_name = contractor_name.trim();
          }
          if (contractor_email?.trim()) {
            payload.contractor_email = contractor_email.trim();
          }
          if (contractor_phone?.trim()) {
            payload.contractor_phone = `${contractor_country_code} ${contractor_phone.trim()}`;
          }
          if (contractorProfileUrl) {
            payload.contractor_profile_url = contractorProfileUrl;
          }

          // Add optional fields only if they're set
          if (expiry_date) {
            payload.expiry_date = expiry_date.toISOString().split('T')[0];
          }

          if (imageUrl) {
            payload.image = imageUrl;
          }

          onSubmit(payload);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      },
      [imageUrl, onSubmit, uploadContractorImage, contractorPhotoFile]
    );

    const handleCancel = useCallback((): void => {
      router.push('/company-management');
    }, [router]);

    // Don't render form until data is loaded in edit mode
    if (isEditMode && !isInitialized && initialData) {
      return (
        <div className='flex items-center justify-center py-8'>
          <div className='text-center text-gray-500'>
            {COMPANY_MESSAGES.LOADING}
          </div>
        </div>
      );
    }

    return (
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className='space-y-4 sm:space-y-6'
      >
        {/* Company Information */}
        <div>
          <h2 className='text-base sm:text-lg font-bold mb-3 sm:mb-4'>
            Company Information
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {/* Company Name */}
            <div className='space-y-2'>
              <Label htmlFor='company-name' className='field-label'>
                {COMPANY_MESSAGES.COMPANY_NAME_LABEL}
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    id='company-name'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_COMPANY_NAME}
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

            {/* Tagline */}
            <div className='space-y-2'>
              <Label htmlFor='tagline' className='field-label'>
                {COMPANY_MESSAGES.TAGLINE_LABEL}
              </Label>
              <Controller
                name='tagline'
                control={control}
                render={({ field }) => (
                  <Input
                    id='tagline'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_TAGLINE}
                    className={cn(
                      'input-field',
                      errors.tagline
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.tagline?.message || ''} />
            </div>
            {/* About - Full Width */}
            <div className='space-y-2 sm:col-span-2'>
              <Label htmlFor='about' className='field-label'>
                {COMPANY_MESSAGES.ABOUT_LABEL}
              </Label>
              <Controller
                name='about'
                control={control}
                render={({ field }) => (
                  <Textarea
                    id='about'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_ABOUT}
                    rows={3}
                    className={cn(
                      'border-2 focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                      errors.about
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.about?.message || ''} />
            </div>
            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='field-label'>
                {COMPANY_MESSAGES.EMAIL_LABEL}
              </Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <Input
                    id='email'
                    type='email'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_EMAIL}
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

            {/* Phone Number */}
            <div className='space-y-2'>
              <Label htmlFor='phone' className='field-label'>
                {COMPANY_MESSAGES.PHONE_LABEL}
              </Label>
              <div className='flex'>
                <Controller
                  name='country_code'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          'w-20 sm:w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                          errors.phone_number
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
                  name='phone_number'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='phone'
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={COMPANY_MESSAGES.ENTER_PHONE}
                      className={cn(
                        'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                        errors.phone_number
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    />
                  )}
                />
              </div>
              <FormErrorMessage message={errors.phone_number?.message || ''} />
            </div>
            {/* Address field - using communication state since it's not used elsewhere */}
            <div className='space-y-2 sm:col-span-2'>
              <Label htmlFor='address' className='field-label'>
                Address
              </Label>
              <Controller
                name='communication'
                control={control}
                render={({ field }) => (
                  <Input
                    id='address'
                    type='text'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Enter company address'
                    className={cn(
                      'input-field',
                      errors.communication
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.communication?.message || ''} />
            </div>

            {/* City */}
            <div className='space-y-2'>
              <Label htmlFor='city' className='field-label'>
                {COMPANY_MESSAGES.CITY_LABEL}
              </Label>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <Input
                    id='city'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_CITY}
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

            {/* Pin Code */}
            <div className='space-y-2'>
              <Label htmlFor='pincode' className='field-label'>
                {COMPANY_MESSAGES.PINCODE_LABEL}
              </Label>
              <Controller
                name='pincode'
                control={control}
                render={({ field }) => (
                  <Input
                    id='pincode'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_PINCODE}
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
            {/* Website */}
            <div className='space-y-2'>
              <Label htmlFor='website' className='field-label'>
                {COMPANY_MESSAGES.WEBSITE_LABEL}
              </Label>
              <Controller
                name='website'
                control={control}
                render={({ field }) => (
                  <Input
                    id='website'
                    type='url'
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={COMPANY_MESSAGES.ENTER_WEBSITE}
                    className={cn(
                      'input-field',
                      errors.website
                        ? '!border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.website?.message || ''} />
            </div>

            {/* Expiry Date - Only show if showExpiryDate is true */}
            {showExpiryDate && (
              <div className='space-y-2'>
                <Label className='field-label'>
                  {COMPANY_MESSAGES.EXPIRY_DATE_LABEL}
                </Label>
                <Controller
                  name='expiry_date'
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={datePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full h-12 justify-between text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px]',
                            !field.value && 'text-muted-foreground',
                            errors.expiry_date
                              ? '!border-[var(--warning)]'
                              : 'border-[var(--border-dark)]'
                          )}
                        >
                          {field.value ? (
                            format(field.value as Date, 'PPP')
                          ) : (
                            <span className='flex-1'>
                              {COMPANY_MESSAGES.SELECT_EXPIRY_DATE}
                            </span>
                          )}
                          <IconsaxCalendar
                            className='ml-2 !h-6 !w-6'
                            color='var(--primary)'
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                        align='start'
                      >
                        <Calendar
                          mode='single'
                          selected={field.value as Date}
                          onSelect={(date: Date | undefined) => {
                            field.onChange(date);
                            setDatePickerOpen(false); // Close popover after selection
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FormErrorMessage message={errors.expiry_date?.message || ''} />
              </div>
            )}

            {/* Preferred Communication */}
            <div className='space-y-2'>
              <Label className='field-label'>
                {COMPANY_MESSAGES.PREFERRED_COMMUNICATION_LABEL}
              </Label>
              <Controller
                name='preferred_communication_method'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        'h-12 border-2 text-left bg-[var(--white-background)] rounded-[10px]',
                        errors.preferred_communication_method
                          ? '!border-[var(--warning)]'
                          : 'border-[var(--border-dark)]'
                      )}
                    >
                      <SelectValue
                        placeholder={
                          COMPANY_MESSAGES.SELECT_PREFERRED_COMMUNICATION
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--white-background)] border border-[var(--border-light)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                      <SelectItem value='email'>
                        {COMPANY_MESSAGES.EMAIL_OPTION}
                      </SelectItem>
                      <SelectItem value='phone'>
                        {COMPANY_MESSAGES.PHONE_OPTION}
                      </SelectItem>
                      <SelectItem value='sms'>
                        {COMPANY_MESSAGES.SMS_OPTION}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage
                message={errors.preferred_communication_method?.message || ''}
              />
            </div>
            {!isEditMode && (
              <div className='sm:col-span-2 pt-4 sm:pt-6'>
                {/* Only show Contractor Information in create mode, not edit mode */}
                <>
                  <h2 className='text-base sm:text-lg font-bold mb-3 sm:mb-4'>
                    Contractor Information{' '}
                    <span className='font-medium text-[var(--text-secondary)]'>
                      (Optional)
                    </span>
                  </h2>
                  <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
                    <div className='h-[180px] w-[180px]'>
                      <PhotoUploadField
                        photo={contractorPhotoFile}
                        onPhotoChange={handleContractorPhotoChange}
                        onDeletePhoto={handleDeleteContractorPhoto}
                        label={COMPANY_MESSAGES.ENTER_CONTRACTOR_PHOTO}
                        uploading={contractorUploading}
                        existingImageUrl={
                          contractorFileKey && !contractorPhotoFile
                            ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') +
                              contractorFileKey
                            : ''
                        }
                        cardHeight='h-[180px]'
                      />
                      {contractorUploading && (
                        <div className='text-xs mt-2'>
                          {COMPANY_MESSAGES.UPLOADING}
                        </div>
                      )}
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 w-full'>
                      {/* Contractor Name */}
                      <div className='sm:col-span-2 space-y-2'>
                        <Label
                          htmlFor='contractor-name'
                          className='field-label'
                        >
                          {COMPANY_MESSAGES.CONTRACTOR_NAME_LABEL}
                        </Label>
                        <Controller
                          name='contractor_name'
                          control={control}
                          render={({ field }) => (
                            <Input
                              id='contractor-name'
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={
                                COMPANY_MESSAGES.ENTER_CONTRACTOR_NAME
                              }
                              className={cn(
                                'h-12 border-2 focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                                errors.contractor_name
                                  ? '!border-[var(--warning)]'
                                  : 'border-[var(--border-dark)]'
                              )}
                            />
                          )}
                        />
                        <FormErrorMessage
                          message={errors.contractor_name?.message || ''}
                        />
                      </div>

                      {/* Contractor Email */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='contractor-email'
                          className='field-label'
                        >
                          {COMPANY_MESSAGES.CONTRACTOR_EMAIL_LABEL}
                        </Label>
                        <Controller
                          name='contractor_email'
                          control={control}
                          render={({ field }) => (
                            <Input
                              id='contractor-email'
                              type='email'
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={
                                COMPANY_MESSAGES.ENTER_CONTRACTOR_EMAIL
                              }
                              className={cn(
                                'h-12 border-2 focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                                errors.contractor_email
                                  ? '!border-[var(--warning)]'
                                  : 'border-[var(--border-dark)]'
                              )}
                            />
                          )}
                        />
                        <FormErrorMessage
                          message={errors.contractor_email?.message || ''}
                        />
                      </div>

                      {/* Contractor Phone */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='contractor-phone'
                          className='field-label'
                        >
                          {COMPANY_MESSAGES.CONTRACTOR_PHONE_LABEL}
                        </Label>
                        <div className='flex'>
                          <Controller
                            name='contractor_country_code'
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value || '+1'}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={cn(
                                    'w-20 sm:w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                                    errors.contractor_phone
                                      ? '!border-[var(--warning)]'
                                      : 'border-[var(--border-dark)]'
                                  )}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                                  {COUNTRY_CODES.LIST.map(country => (
                                    <SelectItem
                                      key={country.key}
                                      value={country.code}
                                    >
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
                            name='contractor_phone'
                            control={control}
                            render={({ field }) => (
                              <Input
                                id='contractor-phone'
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={
                                  COMPANY_MESSAGES.ENTER_CONTRACTOR_PHONE
                                }
                                className={cn(
                                  'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                                  errors.contractor_phone
                                    ? '!border-[var(--warning)]'
                                    : 'border-[var(--border-dark)]'
                                )}
                              />
                            )}
                          />
                        </div>
                        <FormErrorMessage
                          message={errors.contractor_phone?.message || ''}
                        />
                      </div>
                    </div>
                  </div>
                </>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className='pt-4 flex items-center justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={loading}
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            {loading ? 'Submitting...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    );
  }
);

CompanyInfoForm.displayName = 'CompanyInfoForm';
