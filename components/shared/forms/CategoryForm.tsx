import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import IconFieldWrapper from '@/components/shared/common/IconFieldWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { Controller } from 'react-hook-form';

interface CategoryFormProps {
  control: any;
  isSubmitting: boolean;
  editingCategory: any;
  handleClose: () => void;
  CATEGORY_MESSAGES: any;
  iconOptions: any[];
  errors: {
    icon?: string;
    description?: string;
    name?: string;
  };
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  control,
  isSubmitting,
  editingCategory,
  handleClose,
  CATEGORY_MESSAGES,
  iconOptions,
  errors,
  selectedIcon,
  setSelectedIcon,
  onSubmit,
}) => {
  return (
    <div className='p-[0px] w-full'>
      <form onSubmit={onSubmit} className='space-y-4'>
        {/* Icon & Category Name */}
        <div className='space-y-2'>
          <div className='flex gap-3'>
            {/* Icon Selector */}
            <div className='w-[80px]'>
              <IconFieldWrapper
                label={CATEGORY_MESSAGES.ICON_LABEL}
                value={selectedIcon}
                onChange={setSelectedIcon}
                iconOptions={iconOptions}
                error={errors.icon || ''}
              />
            </div>
            {/* Category Name */}
            <div className='flex-1 flex flex-col gap-1'>
              <Label className='field-label mb-1'>
                {CATEGORY_MESSAGES.CATEGORY_NAME_LABEL}
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={CATEGORY_MESSAGES.ENTER_CATEGORY_NAME}
                    className={`h-12 ${errors.name ? 'border-2 !border-[var(--warning)]' : 'border-2 !border-[var(--border-dark)]'} focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]`}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
          {(errors.icon || errors.name) && (
            <div className='space-y-1'>
              {errors.icon && <FormErrorMessage message={errors.icon} />}
              {errors.name && <FormErrorMessage message={errors.name} />}
            </div>
          )}
        </div>
        {/* Description */}
        <div className='space-y-2'>
          <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
            {CATEGORY_MESSAGES.DESCRIPTION_LABEL}
          </Label>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={CATEGORY_MESSAGES.ENTER_DESCRIPTION}
                className={`min-h-[80px] ${errors.description ? 'border-2 !border-[var(--warning)]' : 'border-2 !border-[var(--border-dark)]'} focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]`}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.description && (
            <FormErrorMessage message={errors.description} />
          )}
        </div>
        {/* Actions */}
        <div className='pt-2 flex flex-row items-center gap-2 sm:gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            className='btn-secondary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            {CATEGORY_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            {isSubmitting
              ? editingCategory
                ? CATEGORY_MESSAGES.UPDATING_BUTTON
                : CATEGORY_MESSAGES.CREATING_BUTTON
              : editingCategory
                ? CATEGORY_MESSAGES.UPDATE_BUTTON
                : CATEGORY_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
