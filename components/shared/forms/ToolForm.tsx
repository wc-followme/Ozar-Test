'use client';

import { TOOL_MESSAGES } from '@/app/(DashboardLayout)/tools-management/tool-messages';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import MultiSelect from '@/components/shared/common/MultiSelect';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { QRCodeSection } from '@/components/shared/common/QRCodeSection';
import { VideoTutorialSection } from '@/components/shared/common/VideoTutorialSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_CONFIG, UPLOAD_PURPOSES } from '@/constants/common';
import { apiService, Service } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { cn, getCompanyId } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

// Validation schema
const toolFormSchema = yup.object({
  name: yup.string().required(TOOL_MESSAGES.NAME_REQUIRED),
  brandName: yup.string().required('Brand name is required.'),
  services: yup.array().min(1, TOOL_MESSAGES.SERVICES_REQUIRED),
});

interface ToolFormProps {
  photo: File | null;
  setPhoto: (file: File | null) => void;
  handleDeletePhoto: () => void;
  uploading?: boolean;
  onSubmit: (data: {
    name: string;
    brandName: string;
    image_url: string;
    service_ids: string;
    video_tutorial_urls?: string[];
    video_tutorial_links?: string[];
    barcodes?: string[];
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  setUploading?: (uploading: boolean) => void;
  setFileKey?: (fileKey: string) => void;
  existingImageUrl?: string | undefined;
  initialValues?: {
    name?: string;
    brandName?: string;
    services?: (string | number)[];
    videos?: File[];
    videoLinks?: string[];
    toolIds?: Array<{ id: string; toolId: string; barcode: string }>;
    image_url?: string;
  };
  isEdit?: boolean;
}

const ToolForm: React.FC<ToolFormProps> = ({
  photo,
  setPhoto,
  handleDeletePhoto,
  uploading = false,
  onSubmit,
  loading = false,
  onCancel,
  setUploading,
  setFileKey,
  existingImageUrl,
  initialValues,
  isEdit = false,
}) => {
  // Service dropdown states
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const { handleAuthError } = useAuth();

  // Destructure initialValues for form default values
  const {
    name: initialName,
    brandName: initialBrandName,
    services: initialServices,
    image_url: initialImageUrl,
  } = initialValues || {};

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(toolFormSchema),
    defaultValues: {
      name: initialName || '',
      brandName: initialBrandName || '',
      services: initialServices?.map(s => s.toString()).filter(Boolean) || [],
    },
  });

  // Destructure initialValues for cleaner state initialization
  const {
    videoLinks: initialVideoLinks,
    toolIds: initialToolIds,
    videos: initialVideos,
  } = initialValues || {};
  console.log('-->', { initialValues, initialVideoLinks });

  // State for videos and QR codes
  const [videos, setVideos] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>(
    initialVideoLinks || []
  );
  const [barcodes, setBarcodes] = useState<string[]>([]);

  // State for validation error messages
  const [videoLinkError, setVideoLinkError] = useState<string>('');

  // Clear error when video links change
  useEffect(() => {
    if (videoLinkError && videoLinks.every(link => link.trim())) {
      setVideoLinkError('');
    }
  }, [videoLinks, videoLinkError]);

  // State for existing barcodes with toolId information (for edit mode)
  const [existingBarcodes, setExistingBarcodes] = useState<
    Array<{ id: string; toolId: string; barcode: string }>
  >(initialToolIds || []);

  // State for existing video URLs (for edit mode)
  const [existingVideoUrls, setExistingVideoUrls] = useState<string[]>(
    Array.isArray(initialVideos)
      ? initialVideos.filter(v => typeof v === 'string')
      : []
  );

  // Initialize form only once when component first mounts
  const initializeForm = useCallback(() => {
    if (isEdit && initialValues) {
      // Destructure initialValues for cleaner code
      const { name, brandName, services, videoLinks, toolIds, videos } =
        initialValues;

      // Edit mode - populate with existing data
      reset({
        name: name || '',
        brandName: brandName || '',
        services: services?.map(s => s.toString()).filter(Boolean) || [],
      });
      setVideos([]); // New videos to upload
      setVideoLinks(videoLinks || []); // Existing video links
      setBarcodes([]); // New barcodes to add
      setExistingBarcodes(toolIds || []); // Existing barcodes with toolId
      setExistingVideoUrls(
        Array.isArray(videos) ? videos.filter(v => typeof v === 'string') : []
      ); // Existing video URLs
      setImageUrl(initialImageUrl || ''); // Set existing image URL
    } else if (!isEdit) {
      // Create mode - reset to empty form
      reset({
        name: '',
        brandName: '',
        services: [],
      });
      setVideos([]);
      setVideoLinks([]);
      setBarcodes([]);
      setExistingBarcodes([]);
      setImageUrl(''); // Clear image URL for create mode
    }
  }, [isEdit, initialValues, reset]);

  useEffect(() => {
    // Only initialize once when component first mounts
    if (!isFormInitialized) {
      initializeForm();
      setIsFormInitialized(true);
    }
  }, [isFormInitialized, initializeForm]);

  // Handle photo change with upload
  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhoto(null);
      setFileKey?.('');
      // Clear the image URL when photo is removed
      setImageUrl('');
      return;
    }

    setPhoto(file);
    setUploading?.(true);

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
        customPath: '',
      });

      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      const fileKey = presigned.data['fileKey'] || '';
      setFileKey?.(fileKey);

      // Update the image URL with the new file key
      setImageUrl(fileKey);

      console.log('Photo uploaded successfully:', {
        fileName: generatedFileName,
        fileKey,
        imageUrl: fileKey,
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);

      // Handle different types of errors
      if (error.status === 401) {
        // Handle authentication error
        handleAuthError(error);
      } else {
        // Handle other upload errors
        const errorMessage = error.message || 'Failed to upload photo';
        console.error('Upload error:', errorMessage);

        // Reset photo state on error
        setPhoto(null);
        setFileKey?.('');
        setImageUrl('');
      }
    } finally {
      setUploading?.(false);
    }
  };

  // Load services for dropdown - using the same method as MaterialForm
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        // Get selected company ID using global utility function
        const companyId = getCompanyId();

        const response = await apiService.getServicesDropdown(
          companyId ? { company_id: companyId } : undefined
        );
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch {
        // Silently fail if services fetch fails
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Upload videos to S3 and get URLs
  const uploadVideosToS3 = async (videoFiles: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const video of videoFiles) {
      try {
        const ext = video.name.split('.').pop() || 'mp4';
        const timestamp = Date.now();
        const toolUuid = uuidv4();
        const generatedFileName = `tool_tutorial_${toolUuid}_${timestamp}.${ext}`;

        const presigned = await getPresignedUrl({
          fileName: generatedFileName,
          fileType: video.type,
          fileSize: video.size,
          purpose: UPLOAD_PURPOSES.TOOL_TUTORIAL,
          customPath: '',
        });

        await uploadFileToPresignedUrl(presigned.data['uploadUrl'], video);
        uploadedUrls.push(presigned.data['fileKey'] || '');
      } catch (error: any) {
        console.error('Error uploading video:', video.name, error);

        // Handle different types of errors
        if (error.status === 401) {
          // Handle authentication error
          handleAuthError(error);
          // Break the loop as authentication failed
          break;
        } else {
          // Handle other upload errors
          const errorMessage = error.message || 'Failed to upload video';
          console.error('Video upload error:', errorMessage);
          // Continue with other videos, don't add this video to uploadedUrls
        }
      }
    }

    return uploadedUrls;
  };

  const handleSubmitForm = async (data: {
    services?: string[] | undefined;
    name: string;
    brandName: string;
  }) => {
    console.log('=== TOOL FORM SUBMIT DATA ===');
    console.log('Form data:', data);
    console.log('Videos to upload:', videos);
    console.log('Video links:', videoLinks);
    console.log('New barcodes:', barcodes);
    console.log('Existing barcodes:', existingBarcodes);
    console.log('Image URL:', imageUrl);

    // Clear previous errors
    setVideoLinkError('');

    // Validate video links and barcodes - check for blank entries
    const blankLinks = videoLinks.filter(link => !link.trim());
    if (blankLinks.length > 0) {
      setVideoLinkError('Please remove blank video links before submitting');
      return;
    }

    // Upload videos to S3
    const videoTutorialUrls =
      videos.length > 0 ? await uploadVideosToS3(videos) : [];

    // Combine existing barcodes with new barcodes
    const allBarcodes = [
      ...existingBarcodes.map(item => item.barcode), // Existing barcodes
      ...barcodes, // New barcodes
    ];

    // Combine existing video URLs with new uploaded videos
    const allVideoTutorialUrls = [
      ...existingVideoUrls.map(url => url.replace(APP_CONFIG.CDN_URL, '')), // Remove CDN prefix from existing URLs
      ...videoTutorialUrls, // New uploaded videos
    ];

    const payload = {
      name: data.name.trim(),
      brandName: data.brandName.trim(),
      image_url: imageUrl || '',
      service_ids: (data.services || []).join(','),
      video_tutorial_urls: allVideoTutorialUrls,
      video_tutorial_links: videoLinks,
      barcodes: allBarcodes,
    };

    console.log('Final payload:', payload);
    console.log('==============================');

    onSubmit(payload);
  };

  // Store image URL in component state to prevent loss during re-renders
  const [imageUrl, setImageUrl] = useState<string>('');
  console.log('imageUrl', {
    imageUrl,
    existingImageUrl,
    initialImageUrl,
  });

  // Create a wrapper for handleDeletePhoto that also clears image URL
  const handleDeletePhotoWrapper = () => {
    setImageUrl('');
    handleDeletePhoto();
  };

  return (
    <div className='p-0 w-full'>
      <form
        className='space-y-4 md:space-y-6'
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* General Error */}
        {/* {errors.general && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{errors.general}</p>
          </div>
        )} */}

        {/* Photo Upload */}
        <div className='flex items-start gap-4 shrink-0'>
          <PhotoUploadField
            photo={photo}
            onPhotoChange={handlePhotoChange}
            onDeletePhoto={handleDeletePhotoWrapper}
            uploading={uploading}
            label={TOOL_MESSAGES.TOOL_IMAGE_LABEL}
            text={''}
            existingImageUrl={existingImageUrl}
            cardHeight='h-[120px] py-3'
            className='min-w-[120px]'
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1 md:space-y-2'>
              <Label htmlFor='tool-name' className='field-label'>
                {TOOL_MESSAGES.TOOL_NAME_LABEL}
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    id='tool-name'
                    placeholder={TOOL_MESSAGES.ENTER_TOOL_NAME}
                    {...field}
                    className={cn(
                      'input-field',
                      errors.name
                        ? 'border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.name?.message || ''} />
            </div>

            <div className='space-y-1 md:space-y-2'>
              <Label htmlFor='brand-name' className='field-label'>
                {TOOL_MESSAGES.BRAND_NAME_LABEL}
              </Label>
              <Controller
                name='brandName'
                control={control}
                render={({ field }) => (
                  <Input
                    id='brand-name'
                    placeholder={TOOL_MESSAGES.ENTER_BRAND_NAME}
                    {...field}
                    className={cn(
                      'input-field',
                      errors.brandName
                        ? 'border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  />
                )}
              />
              <FormErrorMessage message={errors.brandName?.message || ''} />
            </div>
            <div className='col-span-full'>
              <Controller
                name='services'
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label={TOOL_MESSAGES.SERVICES_LABEL}
                    options={services}
                    getOptionLabel={(option: Service) => option?.name || ''}
                    getOptionValue={(option: Service) => String(option?.id)}
                    value={
                      Array.isArray(field.value)
                        ? field.value.filter(
                            (v): v is string => typeof v === 'string'
                          )
                        : []
                    }
                    onChange={field.onChange}
                    placeholder={
                      loadingServices
                        ? TOOL_MESSAGES.LOADING_SERVICES
                        : TOOL_MESSAGES.SELECT_SERVICES
                    }
                    error={errors.services?.message || ''}
                    name='services'
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Services Select */}

        {/* Tool Name and Brand Name */}

        {/* Manufacturer */}
        {/* <div className='space-y-1 md:space-y-2'>
          <Label htmlFor='manufacturer' className='field-label'>
            {TOOL_MESSAGES.MANUFACTURER_LABEL}
          </Label>
          <Controller
            name='manufacturer'
            control={control}
            render={({ field }) => (
              <Input
                id='manufacturer'
                placeholder={TOOL_MESSAGES.ENTER_MANUFACTURER}
                {...field}
                className={cn(
                  'input-field',
                  errors.manufacturer
                    ? 'border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            )}
          />
          <FormErrorMessage message={errors.manufacturer?.message || ''} />
        </div> */}

        {/* Video Tutorial Section */}
        <VideoTutorialSection
          videos={videos}
          onVideosChange={setVideos}
          videoLinks={videoLinks}
          onVideoLinksChange={setVideoLinks}
          existingVideoUrls={existingVideoUrls}
          onExistingVideoUrlsChange={setExistingVideoUrls}
          errorMessage={videoLinkError}
        />

        {/* QR Code Section */}
        <QRCodeSection
          barcodes={barcodes}
          onBarcodesChange={setBarcodes}
          existingBarcodes={existingBarcodes}
          onExistingBarcodesChange={setExistingBarcodes}
        />

        {/* Form Actions */}
        <div className='flex items-center space-x-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            {TOOL_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            disabled={loading || uploading}
            className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            {loading
              ? isEdit
                ? TOOL_MESSAGES.UPDATING_BUTTON
                : TOOL_MESSAGES.CREATING_BUTTON
              : isEdit
                ? TOOL_MESSAGES.UPDATE_BUTTON
                : TOOL_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ToolForm };
