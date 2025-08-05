'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  CommonStatus,
  PAGINATION,
  ROLE_IDS,
  ROUTES,
  STORAGE_KEYS,
} from '@/constants/common';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Role,
  RoleApiResponse,
  UserFormData,
} from '../../user-management/types';
import { USER_MESSAGES } from '../../user-management/user-messages';

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

const breadcrumbData: BreadcrumbItem[] = [
  {
    name: USER_MESSAGES.USER_MANAGEMENT_BREADCRUMB,
    href: ROUTES.USER_MANAGEMENT,
  },
  { name: USER_MESSAGES.ADD_USER_BREADCRUMB }, // current page
];

export default function AddCompanyUserPage() {
  // Destructure constants for better readability
  const { ROLES_DROPDOWN_LIMIT } = PAGINATION;
  const { ACTIVE } = CommonStatus;
  const { COMPANY_DETAILS } = ROUTES;

  const [selectedTab, setSelectedTab] = useState('info');
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [companyNumericId, setCompanyNumericId] = useState<number | null>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);

  // Get company UUID from URL params or use default
  const companyUuid =
    searchParams.get('company_id') || '7aef8cc2-91ad-46ea-ba05-514d605eeff2';

  const handleCancel = () => {
    // Redirect back to the company details page
    router.push(`${COMPANY_DETAILS}/${companyUuid}?tab=usermanagement`);
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

  // Fetch company details to get numeric ID
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoadingCompany(true);
      try {
        const companyRes = await apiService.getCompanyDetails(companyUuid);
        const rawId = companyRes.data.id;

        // Convert string ID to number
        const numericId =
          typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;

        if (isNaN(numericId) || typeof numericId !== 'number') {
          showErrorToast(USER_MESSAGES.USER_NOT_FOUND_ERROR);
          return;
        }

        setCompanyNumericId(numericId);
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }
        showErrorToast(USER_MESSAGES.FETCH_DETAILS_ERROR);
      } finally {
        setLoadingCompany(false);
      }
    };
    fetchCompanyDetails();
  }, [companyUuid, handleAuthError, showErrorToast]);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        // Get selected company from localStorage for roles
        const selectedCompany = localStorage.getItem(
          STORAGE_KEYS.SELECTED_COMPANY
        );
        let companyId: string | undefined;
        if (selectedCompany) {
          try {
            const parsedCompany = JSON.parse(selectedCompany);
            companyId = parsedCompany.id; // UUID from localStorage
          } catch (error) {
            companyId = undefined;
          }
        }

        const rolesRes = await apiService.fetchRoles({
          page: 1,
          limit: ROLES_DROPDOWN_LIMIT,
          status: ACTIVE, // Only fetch active roles for dropdown
          ...(companyId ? { company_id: companyId } : {}),
        });
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];

        // Get current user data from localStorage to determine admin role ID
        const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
        let adminRoleId = null;
        let adminRoleUuid = null; // Default fallback
        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);
            // If current user is admin, use their role ID as reference
            if (userData.role?.id) {
              adminRoleId = userData.role.id;
              adminRoleUuid = userData.role.uuid;
            }
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
          }
        }

        setRoles(
          roleList
            .map(({ uuid, name, status }: Role) => ({
              uuid,
              name,
              status: status || 'ACTIVE',
            }))
            .filter(role => {
              if (ROLE_IDS.ADMIN === adminRoleId) {
                return role.uuid !== adminRoleUuid;
              } else {
                return true;
              }
            }) // Remove admin role using dynamic ID
        );
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }
        // Error fetching roles - proceed with empty array
        setRoles([]);
        showErrorToast(USER_MESSAGES.LOAD_ROLES_ERROR);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [handleAuthError, ROLES_DROPDOWN_LIMIT, ACTIVE]);

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
    } catch (err: unknown) {
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
    // Prevent submission if company details are not loaded yet
    if (loadingCompany || !companyNumericId) {
      showErrorToast(USER_MESSAGES.FETCH_DETAILS_ERROR);
      return;
    }

    setFormLoading(true);
    try {
      // Ensure all required fields are provided for create operation
      if (!data.date_of_joining) {
        throw new Error('Date of joining is required for user creation');
      }

      // Destructure form data for cleaner code
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
        company_id: companyNumericId!, // Pass the numeric company_id to associate user with specific company
      };

      const response = await apiService.createUser(payload);
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.CREATE_SUCCESS)
      );

      // Redirect to company details page with user management tab
      router.push(`${COMPANY_DETAILS}/${companyUuid}?tab=usermanagement`);
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

  // Get user permissions for users and companies
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

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='mb-6 mt-2' />

        {/* Main Content */}
        <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full'
          >
            <TabsList className='grid w-full max-w-[328px] grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='info'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.INFO_TAB}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='pt-8'>
              <div className='flex flex-col xl:flex-row items-start gap-4 xl:gap-6'>
                {/* Left Column - Upload Photo */}
                <div className='w-full sm:w-[250px] flex-shrink-0 relative'>
                  <PhotoUploadField
                    photo={photoFile}
                    onPhotoChange={handlePhotoChange}
                    onDeletePhoto={handleDeletePhoto}
                    label={USER_MESSAGES.UPLOAD_PHOTO_LABEL}
                    text={USER_MESSAGES.UPLOAD_PHOTO_TEXT}
                    className='shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 rounded-[16px] sm:rounded-none'
                  />
                  {uploading && (
                    <div className='text-xs mt-2'>
                      {USER_MESSAGES.UPLOADING}
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1 w-full'>
                  {loadingCompany ? (
                    <LoadingComponent variant='inline' />
                  ) : (
                    <UserInfoForm
                      roles={roles}
                      loadingRoles={loadingRoles}
                      imageUrl={fileKey}
                      onSubmit={handleCreateUser}
                      onCancel={handleCancel}
                      loading={formLoading}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
