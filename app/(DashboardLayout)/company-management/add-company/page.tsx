'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { CompanyInfoForm } from '@/components/shared/forms/CompanyinfoForm';
import { useToast } from '@/components/ui/use-toast';
import { CommonStatus, CUSTOM_EVENTS, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { apiService, CreateCompanyRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COMPANY_MESSAGES } from '../company-messages';
import { CompanyCreateFormData } from '../company-types';

const breadcrumbData: BreadcrumbItem[] = [
  {
    name: COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE,
    href: ROUTES.COMPANY_MANAGEMENT,
  },
  { name: COMPANY_MESSAGES.ADD_COMPANY_TITLE }, // current page
];

export default function AddCompanyPage() {
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Destructure constants for cleaner code
  const { ACTIVE } = CommonStatus;

  // Get user permissions for companies
  const userPermissions = getUserPermissionsFromStorage();
  const canCreateCompany = userPermissions?.companies?.assign_user;

  // Check if user has permission to create companies
  if (userPermissions && !canCreateCompany) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.COMPANY_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.COMPANY_CREATE_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.COMPANY_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setFileKey('');
      return;
    }
    setPhotoFile(file);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const companyUuid = uuidv4();
      const generatedFileName = `company_${companyUuid}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'company',
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch (_) {
      showErrorToast(COMPANY_MESSAGES.UPLOAD_ERROR);
      setPhotoFile(null);
      setFileKey('');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = () => {
    setPhotoFile(null);
    setFileKey('');
  };

  const handleCreateCompany = async (data: CompanyCreateFormData) => {
    setFormLoading(true);
    try {
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
        projects,
        contractor_name,
        contractor_email,
        contractor_phone,
        contractor_profile_url,
        expiry_date,
      } = data;

      const payload: CreateCompanyRequest = {
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
        projects,
        is_default: false,
        status: ACTIVE,
        image: fileKey,
      };

      // Add contractor information if provided
      if (contractor_name) {
        payload.contractor_name = contractor_name;
      }
      if (contractor_email) {
        payload.contractor_email = contractor_email;
      }
      if (contractor_phone) {
        payload.contractor_phone = contractor_phone;
      }
      if (contractor_profile_url) {
        payload.contractor_profile_url = contractor_profile_url;
      }

      // Add expiry_date only if it's provided
      if (expiry_date) {
        payload.expiry_date = expiry_date;
      }

      const response = await apiService.createCompany(payload);
      showSuccessToast(
        extractApiSuccessMessage(response, COMPANY_MESSAGES.CREATE_SUCCESS)
      );

      // Dispatch custom event to refresh companies list in Header
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.COMPANY_CREATED));

      router.push(ROUTES.COMPANY_MANAGEMENT);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.CREATE_ERROR
      );
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='mb-6 mt-2' />

        {/* Main Content */}
        <div className=''>
          <div className='flex items-start flex-col xl:flex-row gap-4 md:gap-6'>
            {/* Left Column - Upload Photo */}
            <div className='w-full md:w-[412px] flex-shrink-0 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4 relative shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
              <h2 className='text-lg font-bold mb-4'>
                {' '}
                {COMPANY_MESSAGES.UPLOAD_PHOTO_LABEL}
              </h2>
              <PhotoUploadField
                photo={photoFile}
                onPhotoChange={handlePhotoChange}
                onDeletePhoto={handleDeletePhoto}
                label={COMPANY_MESSAGES.UPLOAD_PHOTO_LABEL}
                text={COMPANY_MESSAGES.UPLOAD_PHOTO_TEXT}
                cardHeight='h-[265px]'
                className='shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 rounded-[16px] sm:rounded-none'
              />
              {uploading && (
                <div className='text-xs mt-2'>{COMPANY_MESSAGES.UPLOADING}</div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className='flex-1 w-full bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4 md:p-6 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
              <CompanyInfoForm
                imageUrl={fileKey}
                onSubmit={handleCreateCompany}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
