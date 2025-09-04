'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type ServiceOptionTemplateFormData = {
  templateName: string;
  category: string;
  trade: string;
  description?: string;
};

// Validation schema
const serviceOptionTemplateSchema = yup.object({
  templateName: yup
    .string()
    .required('Template name is required')
    .min(3, 'Template name must be at least 3 characters')
    .max(100, 'Template name must be less than 100 characters'),
  category: yup.string().required('Category is required'),
  trade: yup.string().required('Trade is required'),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

interface ServiceOptionTemplateFormProps {
  onSubmit: (data: ServiceOptionTemplateFormData) => void;
  initialData?: Partial<ServiceOptionTemplateFormData>;
  categories: Array<{ value: string; label: string }>;
  trades: Array<{ value: string; label: string }>;
  loadingCategories?: boolean;
  loadingTrades?: boolean;
  isSubmitting?: boolean;
}

export default function ServiceOptionTemplateForm({
  onSubmit,
  initialData = {},
  categories,
  trades,
  loadingCategories = false,
  loadingTrades = false,
  isSubmitting = false,
}: ServiceOptionTemplateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ServiceOptionTemplateFormData>({
    resolver: yupResolver(serviceOptionTemplateSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      templateName: initialData.templateName || '',
      category: initialData.category || '',
      trade: initialData.trade || '',
      description: initialData.description || '',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: ServiceOptionTemplateFormData) => {
    onSubmit(data);
  };

  const handleCategoryChange = (value: string) => {
    setValue('category', value, { shouldValidate: true });
  };

  const handleTradeChange = (value: string) => {
    setValue('trade', value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Template Name */}
      <div className='space-y-2'>
        <Label htmlFor='templateName' className='field-label'>
          Template Name *
        </Label>
        <Input
          id='templateName'
          placeholder='Enter template name'
          className={errors.templateName ? 'border-red-500' : ''}
          {...register('templateName')}
        />
        {errors.templateName && (
          <p className='text-red-500 text-sm'>{errors.templateName.message}</p>
        )}
      </div>

      {/* Category and Trade Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Category */}
        <div className='space-y-2'>
          <Label htmlFor='category' className='field-label'>
            Category *
          </Label>
          <SelectField
            value={watchedValues.category}
            onValueChange={handleCategoryChange}
            options={categories}
            placeholder='Select Category'
            disabled={loadingCategories}
          />
          {errors.category && (
            <p className='text-red-500 text-sm'>{errors.category.message}</p>
          )}
        </div>

        {/* Trade */}
        <div className='space-y-2'>
          <Label htmlFor='trade' className='field-label'>
            Trade *
          </Label>
          <SelectField
            value={watchedValues.trade}
            onValueChange={handleTradeChange}
            options={trades}
            placeholder='Select Trade'
            disabled={loadingTrades}
          />
          {errors.trade && (
            <p className='text-red-500 text-sm'>{errors.trade.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='field-label'>
          Description
        </Label>
        <textarea
          id='description'
          placeholder='Enter template description (optional)'
          className={`w-full px-3 py-2 border border-[var(--border-dark)] rounded-md bg-[var(--card-background)] text-[var(--text-dark)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none ${
            errors.description ? 'border-red-500' : ''
          }`}
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className='text-red-500 text-sm'>{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end pt-4'>
        <Button
          type='submit'
          className='btn-primary'
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </form>
  );
}
