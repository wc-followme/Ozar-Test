'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { ServiceOption } from '../../Templates/service-options-types';

interface ServiceFormProps {
  service: ServiceOption;
  onServiceUpdate: (updatedService: ServiceOption) => void;
  onDelete: () => void;
}

export function ServiceForm({
  service,
  onServiceUpdate,
  onDelete,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceOption>(service);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(service);
  }, [service]);

  const handleInputChange = (
    field: keyof ServiceOption,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onServiceUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(service);
    setIsEditing(false);
  };

  const durationOptions = [
    '1 hour',
    '2 hours',
    '4 hours',
    '8 hours',
    '1 day',
    '2 days',
    '1 week',
    '2 weeks',
    '1 month',
    'Custom',
  ];

  const categoryOptions = [
    'General',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Maintenance',
    'Installation',
    'Repair',
    'Custom',
  ];

  if (!isEditing) {
    return (
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              {service.name}
            </h2>
            <p className='text-gray-600'>{service.description}</p>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => setIsEditing(true)}
              variant='outline'
              className='text-blue-600 hover:text-blue-700'
            >
              Edit
            </Button>
            <Button
              onClick={onDelete}
              variant='outline'
              className='text-red-600 hover:text-red-700'
            >
              Delete
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label className='text-sm font-medium text-gray-700'>Price</Label>
            <p className='text-lg font-semibold text-gray-900 mt-1'>
              ${service.price.toFixed(2)}
            </p>
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700'>
              Duration
            </Label>
            <p className='text-lg text-gray-900 mt-1'>{service.duration}</p>
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700'>
              Category
            </Label>
            <p className='text-lg text-gray-900 mt-1'>{service.category}</p>
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700'>Status</Label>
            <p className='text-lg text-gray-900 mt-1'>
              {service.is_hidden ? 'Hidden' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Edit Service Option
        </h2>
        <div className='flex gap-2'>
          <Button onClick={handleSave} className='btn-primary'>
            Save
          </Button>
          <Button onClick={handleCancel} variant='outline'>
            Cancel
          </Button>
        </div>
      </div>

      <div className='space-y-6'>
        <div>
          <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
            Service Name
          </Label>
          <Input
            id='name'
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            className='mt-1'
            placeholder='Enter service name'
          />
        </div>

        <div>
          <Label
            htmlFor='description'
            className='text-sm font-medium text-gray-700'
          >
            Description
          </Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            className='mt-1'
            rows={3}
            placeholder='Enter service description'
          />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label
              htmlFor='price'
              className='text-sm font-medium text-gray-700'
            >
              Price ($)
            </Label>
            <Input
              id='price'
              type='number'
              step='0.01'
              min='0'
              value={formData.price}
              onChange={e =>
                handleInputChange('price', parseFloat(e.target.value) || 0)
              }
              className='mt-1'
              placeholder='0.00'
            />
          </div>

          <div>
            <Label
              htmlFor='duration'
              className='text-sm font-medium text-gray-700'
            >
              Duration
            </Label>
            <Select
              value={formData.duration}
              onValueChange={value => handleInputChange('duration', value)}
            >
              <SelectTrigger className='mt-1'>
                <SelectValue placeholder='Select duration' />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label
            htmlFor='category'
            className='text-sm font-medium text-gray-700'
          >
            Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={value => handleInputChange('category', value)}
          >
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <input
            id='is_hidden'
            type='checkbox'
            checked={formData.is_hidden}
            onChange={e => handleInputChange('is_hidden', e.target.checked)}
            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <Label
            htmlFor='is_hidden'
            className='text-sm font-medium text-gray-700'
          >
            Hide this service option
          </Label>
        </div>
      </div>
    </div>
  );
}
