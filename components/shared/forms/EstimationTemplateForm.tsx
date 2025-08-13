'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2 } from 'iconsax-react';
import { useState } from 'react';
import EstimationBox from '../../Templates/EstimationBox';

interface EstimationTemplateFormData {
  templateName: string;
  category: string;
}

interface EstimationTemplateFormProps {
  onSubmit?: (data: EstimationTemplateFormData) => void;
  initialData?: Partial<EstimationTemplateFormData>;
}

export function EstimationTemplateForm({
  onSubmit,
  initialData,
}: EstimationTemplateFormProps) {
  const [formData, setFormData] = useState<EstimationTemplateFormData>({
    templateName: initialData?.templateName || '',
    category: initialData?.category || '',
  });

  const handleInputChange = (
    field: keyof EstimationTemplateFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Template Name and Category Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2 col-span-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            value={formData.templateName}
            onChange={e => handleInputChange('templateName', e.target.value)}
            placeholder='Enter template name'
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Category'
            value={formData.category}
            onValueChange={value => handleInputChange('category', value)}
            options={[
              { value: 'interior', label: 'Interior' },
              { value: 'exterior', label: 'Exterior' },
              { value: 'general', label: 'General' },
            ]}
            placeholder='Select Category'
          />
        </div>
      </div>

      {/* Edit Button */}
      <div className='flex justify-end my-4'>
        <Button variant='outline' size='sm' className='btn-secondary'>
          <Edit2 size={16} color='var(--text)' />
          Edit
        </Button>
      </div>

      {/* EstimationBox Component */}
      <div className='mb-6'>
        <EstimationBox _onClose={() => {}} />
      </div>

      {/* Footer */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <span className='text-base font-semibold text-[var(--text-dark)]'>
            Project Total:
          </span>
          <span className='ml-2 text-xl font-bold text-[var(--primary)]'>
            $0.00
          </span>
        </div>
        <Button onClick={handleSubmit} className='btn-primary'>
          Save Template
        </Button>
      </div>
    </div>
  );
}
