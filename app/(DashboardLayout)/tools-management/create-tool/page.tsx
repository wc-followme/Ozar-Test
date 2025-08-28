'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { useToast } from '@/components/ui/use-toast';
import { ROUTES, UPLOAD_PURPOSES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { apiService, CreateToolRequest } from '@/lib/api';
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
import { TOOL_MESSAGES } from '../tool-messages';

export default function CreateToolPage() {
  // Destructure constants for better readability
  const { TOOLS_MANAGEMENT } = ROUTES;

  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canCreateTool = userPermissions?.catalogue_services?.edit;

  const breadcrumbData: BreadcrumbItem[] = [
    { name: TOOL_MESSAGES.TOOL_MANAGEMENT_BREADCRUMB, href: TOOLS_MANAGEMENT },
    { name: TOOL_MESSAGES.CREATE_TOOL_BREADCRUMB }, // current page
  ];

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      return;
    }
    setPhotoFile(file);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const toolUuid = uuidv4();
      const generatedFileName = `tool_${toolUuid}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: UPLOAD_PURPOSES.TOOL,
        customPath: ``,
      });
      const { data } = presigned;
      const { uploadUrl } = data;
      await uploadFileToPresignedUrl(uploadUrl, file);
    } catch (_: unknown) {
      showErrorToast(TOOL_MESSAGES.CREATE_ERROR);
      setPhotoFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTool = async (data: {
    name: string;
    brandName: string;
    image_url: string;
    service_ids: string;
    video_tutorial_urls?: string[];
    video_tutorial_links?: string[];
    barcodes?: string[];
  }) => {
    const {
      name,
      brandName,
      service_ids,
      image_url,
      video_tutorial_urls,
      video_tutorial_links,
      barcodes,
    } = data;

    setFormLoading(true);
    try {
      const payload: CreateToolRequest = {
        name: name.trim(),
        brand_name: brandName.trim(),
        service_ids,
        ...(image_url && { image_url }),
        ...(video_tutorial_urls &&
          video_tutorial_urls.length > 0 && {
            video_tutorial_urls: video_tutorial_urls.filter(Boolean),
          }),
        ...(video_tutorial_links &&
          video_tutorial_links.length > 0 && {
            video_tutorial_link: video_tutorial_links.filter(Boolean),
          }),
        ...(barcodes &&
          barcodes.length > 0 && {
            barcodes: barcodes.filter(Boolean),
          }),
      };

      const response = await apiService.createTool(payload);
      const { statusCode, message } = response;

      if (statusCode === 200 || statusCode === 201) {
        showSuccessToast(
          extractApiSuccessMessage(message) || TOOL_MESSAGES.CREATE_SUCCESS
        );
        router.push(TOOLS_MANAGEMENT);
      } else {
        showErrorToast(
          extractApiErrorMessage(message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } catch (error: any) {
      const { status, message: errorMessage } = error;
      if (status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(errorMessage) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePhoto = () => {
    setPhotoFile(null);
  };

  // Check if user has permission to create tools
  if (userPermissions && !canCreateTool) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.TOOL_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.TOOL_CREATE_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.TOOL_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>{TOOL_MESSAGES.ADD_TOOL_TITLE}</h2>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} />

      {/* Form */}
      <div className='mt-8'>
        <ToolForm
          photo={photoFile}
          setPhoto={handlePhotoChange}
          handleDeletePhoto={handleDeletePhoto}
          uploading={uploading}
          onSubmit={handleCreateTool}
          loading={formLoading}
          onCancel={() => router.push(TOOLS_MANAGEMENT)}
        />
      </div>
    </div>
  );
}
