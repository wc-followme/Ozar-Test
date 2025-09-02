'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      newErrors.type = 'Type of warranty is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
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
          Type Of Warranty
        </Label>
        <Input
          id='type'
          type='text'
          placeholder='Enter warranty type (e.g., Workmanship, Product, Brand)'
          value={formData.type}
          onChange={e => handleInputChange('type', e.target.value)}
          disabled={!!initialData} // Disable type field when editing existing warranty
          className={`w-full border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.type
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {errors.type && <FormErrorMessage message={errors.type} />}
        {initialData && (
          <p className='text-sm text-[var(--text-secondary)] mt-1'>
            Type cannot be changed when editing an existing warranty
          </p>
        )}
      </div>

      {/* Category */}
      <div className='space-y-2'>
        <Label htmlFor='category' className='field-label'>
          Category
        </Label>
        <Input
          id='category'
          type='text'
          placeholder='Enter category (e.g., Interior, Exterior, Structural)'
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
          Description
        </Label>
        <Textarea
          id='description'
          placeholder='Enter Description'
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
          Duration
        </Label>
        <Input
          id='duration'
          type='text'
          placeholder='Enter duration (e.g., 1 Year, 2 Years, Lifetime)'
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
          Cancel
        </Button>
        <Button
          type='submit'
          className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={isLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
