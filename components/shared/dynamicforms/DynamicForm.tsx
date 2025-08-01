'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'date'
    | 'url'
    | 'textarea'
    | 'select'
    | 'time'
    | 'timerange';
  placeholder: string;
  required?: boolean;
  options?: FormFieldOption[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    startTime?: string;
    endTime?: string;
  };
}

export interface FormConfig {
  id: string;
  number: string;
  color: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface DynamicFormProps {
  config: FormConfig;
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  showHeader?: boolean;
  showActions?: boolean;
  className?: string;
  enabledFields?: string[];
  titleAlignment?: 'left' | 'center';
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  initialData = {},
  onSave,
  onCancel,
  showHeader = true,
  showActions = true,
  className = '',
  enabledFields,
  titleAlignment = 'center',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.type === 'timerange') {
      const startTime = formData[field.validation?.startTime || ''];
      const endTime = formData[field.validation?.endTime || ''];

      if (field.required && (!startTime || !endTime)) {
        return `${field.label} is required`;
      }

      if (startTime && endTime && startTime >= endTime) {
        return 'End time must be after start time';
      }

      return '';
    }

    if (field.required && (!value || value.trim() === '')) {
      return `${field.label} is required`;
    }

    if (value && field.validation) {
      const { validation } = field;

      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return `${field.label} format is invalid`;
      }

      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be at most ${validation.maxLength} characters`;
      }

      if (validation.min && Number(value) < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }

      if (validation.max && Number(value) > validation.max) {
        return `${field.label} must be at most ${validation.max}`;
      }
    }

    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];

    return (
      <div
        key={field.name}
        className={
          field.type === 'textarea'
            ? 'md:col-span-6'
            : field.type === 'select'
              ? field.name === 'preferredContactMethod'
                ? 'md:col-span-4'
                : field.name === 'bhk' || field.name === 'floor'
                  ? 'md:col-span-6'
                  : 'md:col-span-3'
              : 'col-span-2'
        }
      >
        {field.type === 'select' ? (
          <SelectField
            label={field.label}
            value={formData[field.name] || ''}
            onValueChange={value => handleInputChange(field.name, value)}
            options={field.options || []}
            placeholder={field.placeholder}
            {...(hasError && { error: errors[field.name] })}
            className=''
          />
        ) : field.type === 'textarea' ? (
          <div>
            {field.label && (
              <Label htmlFor={field.name} className='text-sm font-medium'>
                {field.label}
                {field.required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={e => handleInputChange(field.name, e.target.value)}
              className={`mt-1 input-field ${hasError ? 'border-red-500' : ''}`}
              rows={3}
              required={field.required}
            />
          </div>
        ) : field.type === 'time' ? (
          <div>
            {field.label && (
              <Label htmlFor={field.name} className='text-sm font-medium'>
                {field.label}
                {field.required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Input
              id={field.name}
              type='time'
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={e => handleInputChange(field.name, e.target.value)}
              className={`mt-1 input-field ${hasError ? 'border-red-500' : ''}`}
              required={field.required}
            />
          </div>
        ) : field.type === 'timerange' ? (
          <div className='md:col-span-2'>
            {field.label && (
              <Label className='text-sm font-medium'>
                {field.label}
                {field.required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <div className='flex gap-3 mt-2'>
              <div className='flex-1 relative'>
                <Input
                  id={`${field.name}Start`}
                  type='time'
                  placeholder={field.placeholder}
                  value={formData[field.validation?.startTime || ''] || ''}
                  onChange={e =>
                    handleInputChange(
                      field.validation?.startTime || '',
                      e.target.value
                    )
                  }
                  className={`input-field ${hasError ? 'border-red-500' : ''}`}
                  required={field.required}
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-blue-600'
                  >
                    <circle cx='12' cy='12' r='10' />
                    <polyline points='12,6 12,12 16,14' />
                  </svg>
                </div>
              </div>
              <div className='flex-1 relative'>
                <Input
                  id={`${field.name}End`}
                  type='time'
                  placeholder='End Time'
                  value={formData[field.validation?.endTime || ''] || ''}
                  onChange={e =>
                    handleInputChange(
                      field.validation?.endTime || '',
                      e.target.value
                    )
                  }
                  className={`input-field ${hasError ? 'border-red-500' : ''}`}
                  required={field.required}
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-blue-600'
                  >
                    <circle cx='12' cy='12' r='10' />
                    <polyline points='12,6 12,12 16,14' />
                  </svg>
                </div>
              </div>
            </div>
            {hasError && (
              <p className='text-red-500 text-xs mt-1'>{errors[field.name]}</p>
            )}
          </div>
        ) : (
          <div>
            {field.label && (
              <Label htmlFor={field.name} className='text-sm font-medium'>
                {field.label}
                {field.required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={e => handleInputChange(field.name, e.target.value)}
              className={`mt-2 input-field ${hasError ? 'border-red-500' : ''}`}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
              pattern={field.validation?.pattern}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`border-0 ${className}`}>
      {showHeader && (
        <CardHeader
          className={`p-0 mb-10 ${titleAlignment === 'left' ? 'text-left' : 'text-center'}`}
        >
          <CardTitle className='text-[30px] font-bold text-[var(--text-dark)]'>
            {config.title}
          </CardTitle>
          <p className='text-[18px] text-[var(--text-secondary)] mt-2'>
            {config.description}
          </p>
        </CardHeader>
      )}
      <CardContent className='space-y-6 p-0'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-6'>
          {config.fields
            .filter(
              field => !enabledFields || enabledFields.includes(field.name)
            )
            .map(renderField)}
        </div>
      </CardContent>
    </Card>
  );
};
