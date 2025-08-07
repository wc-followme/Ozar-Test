'use client';

import SelectField from '@/components/shared/common/SelectField';
import { TimePicker } from '@/components/shared/common/TimePicker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useState } from 'react';

export interface FormFieldOption {
  value: string;
  label: string;
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  bgColor?: string;
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
    | 'timerange'
    | 'category-selector';
  placeholder: string;
  required?: boolean;
  options?: FormFieldOption[];
  className?: string;
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
  showHeader = true,
  className = '',
  enabledFields,
  titleAlignment = 'center',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [datePickerOpen, setDatePickerOpen] = useState<Record<string, boolean>>(
    {}
  );

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

  const renderField = ({
    name,
    label,
    type,
    placeholder,
    required,
    options,
    className,
    validation,
  }: FormField) => {
    const hasError = !!errors[name];

    return (
      <div
        key={name}
        className={
          className ||
          (type === 'textarea'
            ? 'md:col-span-6'
            : type === 'select'
              ? name === 'preferredContactMethod'
                ? 'md:col-span-4'
                : name === 'bhk' || name === 'floor'
                  ? 'md:col-span-6'
                  : 'md:col-span-3'
              : type === 'date' || type === 'time'
                ? 'md:col-span-3'
                : type === 'timerange'
                  ? 'md:col-span-6'
                  : type === 'category-selector'
                    ? 'md:col-span-6'
                    : name === 'projectName'
                      ? 'md:col-span-6'
                      : 'md:col-span-3')
        }
      >
        {type === 'select' ? (
          <SelectField
            label={label}
            value={formData[name] || ''}
            onValueChange={value => handleInputChange(name, value)}
            options={options || []}
            placeholder={placeholder}
            {...(hasError && { error: errors[name] })}
            className=''
          />
        ) : type === 'textarea' ? (
          <div>
            {label && (
              <Label htmlFor={name} className='text-sm font-medium'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Textarea
              id={name}
              placeholder={placeholder}
              value={formData[name] || ''}
              onChange={e => handleInputChange(name, e.target.value)}
              className={`mt-1 input-field ${hasError ? 'border-red-500' : ''}`}
              rows={3}
              required={required}
            />
          </div>
        ) : type === 'date' ? (
          <div>
            {label && (
              <Label htmlFor={name} className='text-sm font-medium'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Popover
              open={datePickerOpen[name] || false}
              onOpenChange={open =>
                setDatePickerOpen(prev => ({ ...prev, [name]: open }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full h-12 justify-between text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] mt-2 hover:!bg-[var(--white-background)]',
                    !formData[name] && 'text-muted-foreground',
                    hasError ? '!border-red-500' : 'border-[var(--border-dark)]'
                  )}
                >
                  {formData[name] ? (
                    format(new Date(formData[name]), 'PPP')
                  ) : (
                    <span className='flex-1'>{placeholder}</span>
                  )}
                  <IconsaxCalendar
                    className='ml-2 !h-6 !w-6'
                    color='var(--primary)'
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={
                    formData[name] ? new Date(formData[name]) : undefined
                  }
                  onSelect={date => {
                    handleInputChange(name, date);
                    setDatePickerOpen(prev => ({
                      ...prev,
                      [name]: false,
                    }));
                  }}
                  initialFocus
                  classNames={{
                    day_selected:
                      'bg-[var(--secondary)] text-white hover:bg-[var(--secondary)] hover:text-white focus:bg-[var(--secondary)] focus:text-white',
                    day_today:
                      'bg-[var(--secondary)]/20 text-[var(--text-dark)] hover:bg-[var(--secondary)]/30',
                  }}
                />
              </PopoverContent>
            </Popover>
            {hasError && (
              <p className='text-red-500 text-xs mt-1'>{errors[name]}</p>
            )}
          </div>
        ) : type === 'time' ? (
          <div>
            {label && (
              <Label htmlFor={name} className='text-sm font-medium'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Input
              id={name}
              type='time'
              placeholder={placeholder}
              value={formData[name] || ''}
              onChange={e => handleInputChange(name, e.target.value)}
              className={`mt-1 input-field ${hasError ? 'border-red-500' : ''}`}
              required={required}
            />
          </div>
        ) : type === 'category-selector' ? (
          <div className='w-full'>
            {label && (
              <Label className='text-sm font-medium mb-4 block'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              {options?.map(
                ({
                  id,
                  name: optionName,
                  label,
                  description,
                  bgColor,
                  color,
                }) => {
                  const isSelected = formData[name] === id;
                  return (
                    <div
                      key={id}
                      className={`flex flex-col items-start border border-[var(--border-dark)] rounded-2xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                        isSelected
                          ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                          : ''
                      }`}
                      onClick={() => handleInputChange(name, id)}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-4`}
                        style={{
                          backgroundColor: bgColor || '#EBB4021A',
                          color: color || '#EBB402',
                        }}
                      >
                        {/* Icon placeholder - you can add actual icons here */}
                        <div className='w-4 h-4 sm:w-5 sm:h-5 bg-current rounded-sm'></div>
                      </div>
                      <div className='font-bold text-sm sm:text-base mb-2 text-[var(--text-dark)]'>
                        {optionName || label}
                      </div>
                      <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-snug'>
                        {description || ''}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            {hasError && (
              <p className='text-red-500 text-xs mt-1'>{errors[name]}</p>
            )}
          </div>
        ) : type === 'timerange' ? (
          <div>
            {label && (
              <Label className='text-sm font-medium'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <div className='flex gap-3 mt-2'>
              <div className='flex-1'>
                <TimePicker
                  value={formData[validation?.startTime || ''] || ''}
                  onChange={value =>
                    handleInputChange(validation?.startTime || '', value)
                  }
                  placeholder={placeholder}
                  error={hasError}
                />
              </div>
              <div className='flex-1'>
                <TimePicker
                  value={formData[validation?.endTime || ''] || ''}
                  onChange={value =>
                    handleInputChange(validation?.endTime || '', value)
                  }
                  placeholder='End Time'
                  error={hasError}
                />
              </div>
            </div>
            {hasError && (
              <p className='text-red-500 text-xs mt-1'>{errors[name]}</p>
            )}
          </div>
        ) : (
          <div>
            {label && (
              <Label htmlFor={name} className='text-sm font-medium'>
                {label}
                {required && <span className='text-red-500 ml-1'>*</span>}
              </Label>
            )}
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              value={formData[name] || ''}
              onChange={e => handleInputChange(name, e.target.value)}
              className={`mt-2 input-field ${hasError ? 'border-red-500' : ''}`}
              required={required}
              min={validation?.min}
              max={validation?.max}
              minLength={validation?.minLength}
              maxLength={validation?.maxLength}
              pattern={validation?.pattern}
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
          className={`p-0 mb-6 lg:mb-10 ${titleAlignment === 'left' ? 'text-left' : 'text-center'}`}
        >
          <CardTitle className='text-2xl mb-2 lg:text-[30px] font-bold text-[var(--text-dark)]'>
            {config.title}
          </CardTitle>
          <p className='text-base lg:text-[18px] text-[var(--text-secondary)] mt-2'>
            {config.description}
          </p>
        </CardHeader>
      )}
      <CardContent className='space-y-6 p-0'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-6'>
          {config.fields
            .filter(
              ({ name }) => !enabledFields || enabledFields.includes(name)
            )
            .map(renderField)}
        </div>
      </CardContent>
    </Card>
  );
};
