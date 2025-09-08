'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WARRANTY_MESSAGES } from '@/constants/messages';
import { useEffect, useState } from 'react';

interface WarrantyFormProps {
  onSubmit: (data: WarrantyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: any;
}

export interface WarrantyFormData {
  type: string;
  category: string;
  description: string;
  duration: string;
}

export const WarrantyForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: WarrantyFormProps) => {
  const [formData, setFormData] = useState<WarrantyFormData>({
    type: initialData?.type || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
  });

  const [errors, setErrors] = useState<Partial<WarrantyFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset form data when initialData changes
  useEffect(() => {
    setFormData({
      type: initialData?.type || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      duration: initialData?.duration || '',
    });
    // Clear errors when form resets
    setErrors({});
    setIsSubmitted(false);
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Partial<WarrantyFormData> = {};

    if (!formData.type) {
      newErrors.type = WARRANTY_MESSAGES.VALIDATION.TYPE_REQUIRED;
    }
    if (!formData.category) {
      newErrors.category = WARRANTY_MESSAGES.VALIDATION.CATEGORY_REQUIRED;
    }
    if (!formData.description) {
      newErrors.description = WARRANTY_MESSAGES.VALIDATION.DESCRIPTION_REQUIRED;
    }
    if (!formData.duration) {
      newErrors.duration = WARRANTY_MESSAGES.VALIDATION.DURATION_REQUIRED;
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

  const handleInputChange = (field: keyof WarrantyFormData, value: string) => {
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

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Type Of Warranty */}
      <div className='space-y-2'>
        <Label htmlFor='type' className='field-label'>
          {WARRANTY_MESSAGES.LABELS.TYPE}
        </Label>
        <Input
          id='type'
          type='text'
          placeholder={WARRANTY_MESSAGES.PLACEHOLDERS.TYPE}
          value={formData.type}
          onChange={e => handleInputChange('type', e.target.value)}
          className={`w-full border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.type
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.type && <FormErrorMessage message={errors.type} />}
      </div>

      {/* Category */}
      <div className='space-y-2'>
        <Label htmlFor='category' className='field-label'>
          {WARRANTY_MESSAGES.LABELS.CATEGORY}
        </Label>
        <Input
          id='category'
          type='text'
          placeholder={WARRANTY_MESSAGES.PLACEHOLDERS.CATEGORY}
          value={formData.category}
          onChange={e => handleInputChange('category', e.target.value)}
          className={`w-full border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.category
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.category && <FormErrorMessage message={errors.category} />}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='field-label'>
          {WARRANTY_MESSAGES.LABELS.DESCRIPTION}
        </Label>
        <Textarea
          id='description'
          placeholder={WARRANTY_MESSAGES.PLACEHOLDERS.DESCRIPTION}
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          className={`min-h-[120px] resize-none border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.description
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.description && (
          <FormErrorMessage message={errors.description} />
        )}
      </div>

      {/* Duration */}
      <div className='space-y-2'>
        <Label htmlFor='duration' className='field-label'>
          {WARRANTY_MESSAGES.LABELS.DURATION}
        </Label>
        <Input
          id='duration'
          type='text'
          placeholder={WARRANTY_MESSAGES.PLACEHOLDERS.DURATION}
          value={formData.duration}
          onChange={e => handleInputChange('duration', e.target.value)}
          className={`w-full border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.duration
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.duration && <FormErrorMessage message={errors.duration} />}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={isLoading}
        >
          {WARRANTY_MESSAGES.FORM.BUTTON_CANCEL}
        </Button>
        <Button
          type='submit'
          className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={isLoading}
        >
          {WARRANTY_MESSAGES.FORM.BUTTON_SAVE}
        </Button>
      </div>
    </form>
  );
};
