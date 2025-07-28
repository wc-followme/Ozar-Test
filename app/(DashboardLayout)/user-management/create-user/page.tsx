'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { useToast } from '@/components/ui/use-toast';
import { CommonStatus, PAGINATION, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { apiService, CreateUserRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
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
    router.push(ROUTES.USER_MANAGEMENT);
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
          status: CommonStatus.ACTIVE, // Only fetch active roles for dropdown
        });
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map(({ id, name, status }: Role) => ({
            id,
            name,
            status: status || CommonStatus.ACTIVE,
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

  // Get user permissions for users
  const userPermissions = getUserPermissionsFromStorage();
  const canCreateUser = userPermissions?.users?.create;

  // Check if user has permission to create users
  if (userPermissions && !canCreateUser) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.USER_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.USER_CREATE_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.USER_DETAILS_REDIRECT_TEXT}
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
      const randomId = Math.random().toString(36).substring(2, 15);
      const generatedFileName = `user_${randomId}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: ``,
      });
      const { data } = presigned;
      await uploadFileToPresignedUrl(data['uploadUrl'], file);
      setFileKey(data['fileKey'] || '');
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
    const {
      role_id,
      name,
      email,
      country_code,
      phone_number,
      date_of_joining,
      designation,
      preferred_communication_method,
      address,
      city,
      pincode,
    } = data;

    setFormLoading(true);
    try {
      // Ensure all required fields are provided for create operation
      if (!date_of_joining) {
        throw new Error('Date of joining is required for user creation');
      }

      const payload: CreateUserRequest = {
        role_id,
        name,
        email,
        // Password will be generated on the backend
        country_code,
        phone_number,
        date_of_joining,
        designation,
        preferred_communication_method,
        address,
        city,
        pincode,
        profile_picture_url: fileKey,
      };
      const response = await apiService.createUser(payload);
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.CREATE_SUCCESS)
      );
      router.push(ROUTES.USER_MANAGEMENT);
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
      href: ROUTES.USER_MANAGEMENT,
    },
    { name: USER_MESSAGES.ADD_USER_BREADCRUMB },
  ];
  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='mb-6 mt-2' />

        {/* Main Content */}
        <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4 md:p-6'>
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
                  className='h-[250px]'
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
