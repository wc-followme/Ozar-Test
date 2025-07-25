'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { CompanyInfoForm } from '@/components/shared/forms/CompanyinfoForm';
import { useToast } from '@/components/ui/use-toast';
import { apiService, CreateCompanyRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COMPANY_MESSAGES } from '../company-messages';
import { CompanyCreateFormData } from '../company-types';

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },
  { name: 'Add Company' }, // current page
];

export default function AddCompanyPage() {
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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
    } catch (_err: unknown) {
      showErrorToast(COMPANY_MESSAGES.UPLOAD_ERROR);
      setPhotoFile(null);
      setFileKey('');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCompany = async (data: CompanyCreateFormData) => {
    console.log('Received form data in handleCreateCompany:', data);
    setFormLoading(true);
    try {
      const payload: CreateCompanyRequest = {
        name: data.name,
        tagline: data.tagline,
        about: data.about,
        email: data.email,
        country_code: data.country_code,
        phone_number: data.phone_number,
        communication: data.communication,
        website: data.website,
        preferred_communication_method: data.preferred_communication_method,
        city: data.city,
        pincode: data.pincode,
        projects: data.projects,
        is_default: false,
        status: 'ACTIVE',
        image: fileKey,
      };

      // Add contractor information if provided
      if (data.contractor_name) {
        payload.contractor_name = data.contractor_name;
      }
      if (data.contractor_email) {
        payload.contractor_email = data.contractor_email;
      }
      if (data.contractor_phone) {
        payload.contractor_phone = data.contractor_phone;
      }
      if (data.contractor_profile_url) {
        payload.contractor_profile_url = data.contractor_profile_url;
      }

      // Add expiry_date only if it's provided
      if (data.expiry_date) {
        payload.expiry_date = data.expiry_date;
      }

      console.log('Final API payload being sent:', payload);

      const response = await apiService.createCompany(payload);
      showSuccessToast(
        extractApiSuccessMessage(response, COMPANY_MESSAGES.CREATE_SUCCESS)
      );
      router.push('/company-management');
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
              <h2 className='text-lg font-bold mb-4'>Upload Logo</h2>
              <PhotoUploadField
                photo={photoFile}
                onPhotoChange={handlePhotoChange}
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
