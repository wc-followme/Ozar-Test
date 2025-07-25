'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { apiService, CreateUserRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Role, RoleApiResponse, UserFormData } from '../types';
import { USER_MESSAGES } from '../user-messages';

// Dynamic import for better performance
const UserInfoForm = dynamic(
  () =>
    import('@/components/shared/forms/UserinfoForm').then(mod => ({
      default: mod.UserInfoForm,
    })),
  {
    loading: () => <LoadingComponent variant='inline' />,
    ssr: false,
  }
);

export default function AddUserPage() {
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleCancel = () => {
    router.push('/user-management');
  };

  const isRoleApiResponse = (obj: unknown): obj is RoleApiResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'data' in obj &&
      typeof (obj as RoleApiResponse).data === 'object' &&
      (obj as RoleApiResponse).data !== null &&
      'data' in (obj as RoleApiResponse).data &&
      Array.isArray((obj as RoleApiResponse).data.data)
    );
  };

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const rolesRes = await apiService.fetchRoles({
          page: 1,
          limit: PAGINATION.ROLES_DROPDOWN_LIMIT,
          status: 'ACTIVE', // Only fetch active roles for dropdown
        });
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map(({ id, name, status }: Role) => ({
            id,
            name,
            status: status || 'ACTIVE',
          }))
        );
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }
        // Error fetching roles - proceed with empty array
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [handleAuthError]);

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
      const randomId = Math.random().toString(36).substring(2, 15);
      const generatedFileName = `user_${randomId}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch {
      showErrorToast(USER_MESSAGES.UPLOAD_ERROR);
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

  const handleCreateUser = async (data: UserFormData) => {
    setFormLoading(true);
    try {
      // Ensure all required fields are provided for create operation
      if (!data.date_of_joining) {
        throw new Error('Date of joining is required for user creation');
      }

      const payload: CreateUserRequest = {
        role_id: data.role_id,
        name: data.name,
        email: data.email,
        // Password will be generated on the backend
        country_code: data.country_code,
        phone_number: data.phone_number,
        date_of_joining: data.date_of_joining,
        designation: data.designation,
        preferred_communication_method: data.preferred_communication_method,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        profile_picture_url: fileKey,
      };
      const response = await apiService.createUser(payload);
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.CREATE_SUCCESS)
      );
      router.push('/user-management');
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.CREATE_ERROR);
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  const breadcrumbData: BreadcrumbItem[] = [
    {
      name: USER_MESSAGES.USER_MANAGEMENT_BREADCRUMB,
      href: '/user-management',
    },
    { name: USER_MESSAGES.ADD_USER_BREADCRUMB },
  ];
  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='mb-6 mt-2' />

        {/* Main Content */}
        <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4 md:p-6 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
          <div className=''>
            <div className='flex flex-col xl:flex-row items-start gap-3 md:gap-6'>
              {/* Left Column - Upload Photo */}
              <div className='w-full md:w-[250px] flex-shrink-0 relative'>
                <PhotoUploadField
                  photo={photoFile}
                  onPhotoChange={handlePhotoChange}
                  onDeletePhoto={handleDeletePhoto}
                  label={USER_MESSAGES.UPLOAD_PHOTO_LABEL}
                  // text={USER_MESSAGES.UPLOAD_PHOTO_TEXT}
                  className='h-[250px] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 rounded-[16px] sm:rounded-none'
                />
                {uploading && (
                  <div className='text-xs mt-2'>{USER_MESSAGES.UPLOADING}</div>
                )}
              </div>

              {/* Right Column - Form Fields */}
              <div className='w-full lg:flex-1'>
                <UserInfoForm
                  roles={roles}
                  loadingRoles={loadingRoles}
                  imageUrl={fileKey}
                  onSubmit={handleCreateUser}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
