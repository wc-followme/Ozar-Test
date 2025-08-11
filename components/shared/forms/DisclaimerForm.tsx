'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface DisclaimerFormData {
  templateName: string;
  service: string;
  warranty: string;
  description: string;
  duration: string;
}

interface DisclaimerFormProps {
  onSubmit?: (data: DisclaimerFormData) => void;
  initialData?: Partial<DisclaimerFormData>;
}

export function DisclaimerForm({ onSubmit, initialData }: DisclaimerFormProps) {
  const [formData, setFormData] = useState<DisclaimerFormData>({
    templateName: initialData?.templateName || '',
    service: initialData?.service || '',
    warranty: initialData?.warranty || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
  });

  const handleInputChange = (
    field: keyof DisclaimerFormData,
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
      {/* Template Name, Service, and Warranty Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='space-y-2 md:col-span-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            value={formData.templateName}
            onChange={e => handleInputChange('templateName', e.target.value)}
            placeholder='Enter name'
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Service'
            value={formData.service}
            onValueChange={value => handleInputChange('service', value)}
            options={[
              { value: 'painting', label: 'Painting' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'carpentry', label: 'Carpentry' },
            ]}
            placeholder='Select Service'
          />
        </div>
      </div>

      {/* Disclaimer Text Area */}
      <div className='space-y-2 mb-6'>
        <Label htmlFor='description' className='field-label'>
          Disclaimer
        </Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          placeholder='Enter Disclaimer Here'
          rows={16}
          className='input-field md:min-h-[300px]'
        />
      </div>

      {/* Duration Field */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='space-y-2 md:col-span-2'>
          <Label htmlFor='duration' className='field-label'>
            Warranty
          </Label>
          <Input
            id='duration'
            value={formData.duration}
            onChange={e => handleInputChange('duration', e.target.value)}
            placeholder='Select Duration'
            className='input-field'
          />
        </div>
        <div className='space-y-2 w-full'>
          <SelectField
            label='Duration'
            value={formData.duration}
            onValueChange={value => handleInputChange('duration', value)}
            options={[
              { value: '1-year', label: '1 Year' },
              { value: '2-years', label: '2 Years' },
              { value: '3-years', label: '3 Years' },
              { value: '5-years', label: '5 Years' },
              { value: 'lifetime', label: 'Lifetime' },
            ]}
            placeholder='Select Duration'
            triggerClassName='w-full'
          />
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-end'>
        <Button onClick={handleSubmit} className='btn-primary'>
          Save Template
        </Button>
      </div>
    </div>
  );
}
