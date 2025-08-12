'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { MediaPreview } from '@/components/shared/common/MediaPreview';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
}

export const AddMediaForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: AddMediaFormProps) => {
  const [formData, setFormData] = useState<AddMediaFormData>({
    projectName: initialData?.projectName || '',
    media: initialData?.media || [],
  });

  const [errors, setErrors] = useState<{
    projectName?: string;
    media?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: { projectName?: string; media?: string } = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.media || formData.media.length === 0) {
      newErrors.media = 'At least one media file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      onSubmit(formData);
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

        {/* Media Preview */}
        {formData.media.length > 0 && (
          <div className='space-y-2'>
            <MediaPreview
              files={formData.media}
              onRemove={handleRemoveMedia}
              className='mt-2'
              gridCols={4}
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
