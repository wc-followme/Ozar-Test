'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { useToast } from '@/components/ui/use-toast';
import { CommonStatus, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { STATUS_CODES } from '@/constants/status-codes';
import { apiService } from '@/lib/api';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { CreateRoleFormData } from '@/lib/validations/role';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROLE_MESSAGES } from '../role-messages';
import type { ApiResponse, CreateRoleRequest } from '../types';

// Dynamic import for better performance
const RoleForm = dynamic(
  () =>
    import('@/components/shared/forms/RoleForm').then(mod => ({
      default: mod.RoleForm,
    })),
  {
    loading: () => <LoadingComponent variant='inline' />,
    ssr: false,
  }
);

const CreateRole = () => {
  // Destructure constants for better readability
  const { ACTIVE } = CommonStatus;
  const { ROLE_MANAGEMENT } = ROUTES;

  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user permissions for roles
  const userPermissions = getUserPermissionsFromStorage();
  const canCreateRole = userPermissions?.roles?.edit; // Use edit permission for create as well

  // Check if user has permission to create roles
  if (userPermissions && !canCreateRole) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.ROLE_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.ROLE_CREATE_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.ROLE_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  const breadcrumbData: BreadcrumbItem[] = [
    { name: ROLE_MESSAGES.ROLE_MANAGEMENT_BREADCRUMB, href: ROLE_MANAGEMENT },
    { name: ROLE_MESSAGES.CREATE_ROLE_BREADCRUMB }, // current page
  ];

  // Handle form submission
  const onSubmit = async (data: CreateRoleFormData) => {
    const { name, description, icon, permissions } = data;

    setIsSubmitting(true);
    try {
      // Get selected company ID using global utility function
      const company_id = getCompanyId();

      const roleData: CreateRoleRequest & { permissions?: any } = {
        name,
        description,
        icon,
        status: ACTIVE, // Default to ACTIVE when creating
        permissions,
        ...(company_id && { company_id }),
      };
      const response: ApiResponse = await apiService.createRole(roleData);
      const { statusCode, message } = response;

      if (
        statusCode === STATUS_CODES.OK ||
        statusCode === STATUS_CODES.CREATED
      ) {
        showSuccessToast(
          extractApiSuccessMessage(response, ROLE_MESSAGES.CREATE_SUCCESS)
        );
        router.push(ROLE_MANAGEMENT);
      } else {
        throw new Error(message || ROLE_MESSAGES.CREATE_ERROR);
      }
    } catch (err: unknown) {
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.CREATE_ERROR);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-7 flex-1 w-full'>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} />

      {/* Main Content */}
      <RoleForm mode='create' isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </div>
  );
};

export default CreateRole;
