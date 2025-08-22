'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { MediaPreview } from '@/components/shared/common/MediaPreview';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface AddMediaFormProps {
  onSubmit: (data: AddMediaFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: any;
}

export interface AddMediaFormData {
  projectName: string;
  media: File[];
  existingImages?: string[];
  existingVideos?: string[];
}

export const AddMediaForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: AddMediaFormProps) => {
  const [formData, setFormData] = useState<AddMediaFormData>({
    projectName: initialData?.name || '',
    media: [], // Start with empty media array for edit mode
  });
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || []
  );
  const [existingVideos, setExistingVideos] = useState<string[]>(
    initialData?.videos || []
  );
  const [errors, setErrors] = useState<{
    projectName?: string;
    media?: string;
    existingImages?: string;
    existingVideos?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: {
      projectName?: string;
      media?: string;
      existingImages?: string;
    } = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    // Allow existing images/videos or new media files
    if (
      (!formData.media || formData.media.length === 0) &&
      existingImages.length === 0 &&
      existingVideos.length === 0
    ) {
      newErrors.media = 'At least one media file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      // Pass both new media files and existing images/videos
      onSubmit({
        ...formData,
        existingImages,
        existingVideos,
      });
    }
  };

  const handleInputChange = (field: keyof AddMediaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field] && isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        media: files,
      }));

      // Clear media error when files are uploaded
      if (errors.media && isSubmitted) {
        setErrors(prev => ({
          ...prev,
          media: undefined as any,
        }));
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (index: number) => {
    setExistingVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Media Upload */}
      <div className='space-y-4'>
        <div className={`${errors.media ? '!border-[var(--warning)]' : ''}`}>
          <ImageUpload
            onClick={handleUploadClick}
            label='Upload Photos / Videos or Drag and Drop'
            className={`w-full !h-[150px] ${errors.media ? '!border-[var(--warning)]' : ''}`}
          />
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*,video/*'
            className='hidden'
            onChange={handleFileChange}
          />
        </div>

        {/* Existing Images Preview */}
        {existingImages.length > 0 && (
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-600'>
              Existing Images
            </Label>
            <div className='flex flex-wrap gap-2'>
              {existingImages.map((imageUrl, index) => (
                <div key={index} className='relative'>
                  <Image
                    src={
                      imageUrl.startsWith('http') || imageUrl.startsWith('/')
                        ? imageUrl
                        : `${process.env['NEXT_PUBLIC_CDN_URL'] || ''}${imageUrl}`
                    }
                    alt={`Existing image ${index + 1}`}
                    width={80}
                    height={80}
                    className='aspect-square h-[80px] w-[80px] object-cover rounded-lg border'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveExistingImage(index)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Videos Preview */}
        {existingVideos.length > 0 && (
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-600'>
              Existing Videos
            </Label>
            <div className='flex flex-wrap gap-2'>
              {existingVideos.map((videoUrl, index) => (
                <div key={index} className='relative'>
                  <video
                    src={
                      videoUrl.startsWith('http') || videoUrl.startsWith('/')
                        ? videoUrl
                        : `${process.env['NEXT_PUBLIC_CDN_URL'] || ''}${videoUrl}`
                    }
                    width={80}
                    height={80}
                    className='aspect-square h-[80px] w-[80px] object-cover rounded-lg border'
                    controls
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveExistingVideo(index)}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Media Preview */}
        {formData.media.length > 0 && (
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-600'>
              New Media Files
            </Label>
            <MediaPreview
              files={formData.media}
              onRemove={handleRemoveMedia}
              className='mt-2'
              previewClassName='aspect-square h-[80px] w-[80px]'
            />
          </div>
        )}

        {errors.media && <FormErrorMessage message={errors.media} />}
      </div>

      {/* Project Name */}
      <div className='space-y-2'>
        <Label htmlFor='projectName' className='field-label'>
          Project Name
        </Label>
        <Input
          id='projectName'
          placeholder='Enter project name'
          value={formData.projectName}
          onChange={e => handleInputChange('projectName', e.target.value)}
          className={`w-full input-field ${
            errors.projectName
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : ''
          }`}
        />
        {errors.projectName && (
          <FormErrorMessage message={errors.projectName} />
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary !px-8'
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='btn-primary !px-12'
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
};
