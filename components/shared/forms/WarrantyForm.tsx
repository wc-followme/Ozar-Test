'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface WarrantyFormProps {
  onSubmit: (data: WarrantyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
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
}: WarrantyFormProps) => {
  const [formData, setFormData] = useState<WarrantyFormData>({
    type: '',
    category: '',
    description: '',
    duration: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.type &&
      formData.category &&
      formData.description &&
      formData.duration
    ) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof WarrantyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    formData.type &&
    formData.category &&
    formData.description &&
    formData.duration;

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
          className='w-full'
        />
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
          className='w-full'
        />
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
          className='min-h-[120px] resize-none border-2 border-[var(--border-dark)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px]'
        />
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
          className='w-full'
        />
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary'
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='btn-primary'
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
