'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

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

const warrantyTypeOptions = [
  { value: 'workmanship', label: 'Workmanship' },
  { value: 'timeframe', label: 'Timeframe' },
  { value: 'product', label: 'Product' },
  { value: 'brand', label: 'Brand' },
];

const durationOptions = [
  { value: '1-year', label: '1 Year' },
  { value: '2-years', label: '2 Years' },
  { value: '3-years', label: '3 Years' },
  { value: '5-years', label: '5 Years' },
  { value: '10-years', label: '10 Years' },
  { value: '15-years', label: '15 Years' },
  { value: 'lifetime', label: 'Lifetime' },
];

const categoryOptions = [
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'structural', label: 'Structural' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'foundation', label: 'Foundation' },
];

export const WarrantyForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: WarrantyFormProps) => {
  const [formData, setFormData] = useState<WarrantyFormData>({
    type: initialData?.type?.toLowerCase() || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    duration: initialData?.duration?.toLowerCase().replace(' ', '-') || '',
  });

  const [errors, setErrors] = useState<Partial<WarrantyFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        <SelectField
          options={warrantyTypeOptions}
          value={formData.type}
          onValueChange={value => handleInputChange('type', value)}
          placeholder='Select warranty type'
          triggerClassName={`w-full ${errors.type ? '!border-[var(--warning)]' : ''}`}
        />
        {errors.type && <FormErrorMessage message={errors.type} />}
      </div>

      {/* Category */}
      <div className='space-y-2'>
        <Label htmlFor='category' className='field-label'>
          Category
        </Label>
        <SelectField
          options={categoryOptions}
          value={formData.category}
          onValueChange={value => handleInputChange('category', value)}
          placeholder='eg. interior'
          triggerClassName={`w-full ${errors.category ? '!border-[var(--warning)]' : ''}`}
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
        <SelectField
          options={durationOptions}
          value={formData.duration}
          onValueChange={value => handleInputChange('duration', value)}
          placeholder='Select Duration'
          triggerClassName={`w-full ${errors.duration ? '!border-[var(--warning)]' : ''}`}
        />
        {errors.duration && <FormErrorMessage message={errors.duration} />}
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
          Save
        </Button>
      </div>
    </form>
  );
};
