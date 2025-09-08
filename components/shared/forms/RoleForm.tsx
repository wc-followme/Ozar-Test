import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { iconOptions } from '@/constants/sidebar-items';
import { CreateRoleFormData, createRoleSchema } from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface RoleFormProps {
  initialValues?: Partial<CreateRoleFormData>;
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const defaultIconOption = iconOptions[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateRoleFormData>({
    resolver: yupResolver(createRoleSchema),
    defaultValues: {
      name: 123, // Introduced type error by assigning a number to a string property
      description: '',
      icon: defaultIconOption.value,
      status: 'ACTIVE',
      ...initialValues,
    },
  });

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        description: initialValues.description || '',
        icon: initialValues.icon || defaultIconOption.value,
        status: initialValues.status || 'ACTIVE',
      });
    }
  }, [initialValues, reset]);

  const selectedIcon = watch('icon');
  const getSelectedIconOption = () => {
    return (
      iconOptions.find(opt => opt.value === selectedIcon) ?? defaultIconOption
    );
  };

  return (
    <Card className='flex flex-col gap-8 p-6 flex-1 w-full border-1 border-[#E8EAED] rounded-[20px] bg-white'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        {/* Top row with input fields */}
        <div className='flex items-start gap-6 w-full'>
          {/* Icon selector */}
          <div className='flex flex-col items-start gap-2'>
            <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
              Icon
            </Label>
            <Controller
              name='icon'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-[100px] h-12 px-2 py-[7px] rounded-[10px] border-2 border-[#e8eaed]'>
                    <SelectValue>
                      <div
                        className='flex w-8 h-8 items-center justify-center rounded-lg'
                        style={{
                          backgroundColor: `${getSelectedIconOption().color}26`,
                        }}
                      >
                        {(() => {
                          const IconComponent = getSelectedIconOption().icon;
                          return (
                            <IconComponent
                              className='w-4 h-4'
                              style={{ color: getSelectedIconOption().color }}
                            />
                          );
                        })()}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                    {iconOptions.map(option => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className='flex items-center gap-2'>
                            <div
                              className='flex w-6 h-6 items-center justify-center rounded-md'
                              style={{ backgroundColor: `${option.color}26` }}
                            >
                              <IconComponent
                                className='w-3 h-3'
                                style={{ color: option.color }}
                              />
                            </div>
                            <span className='text-sm'>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.icon && (
              <span className='text-red-500 text-xs'>
                {errors.icon.message}
              </span>
            )}
          </div>

          {/* Role Name input */}
          <div className='flex flex-col w-[300px] items-start gap-2'>
            <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
              Role Name
            </Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
                  placeholder='Enter role name'
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.name && (
              <span className='text-red-500 text-xs'>
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description input */}
          <div className='flex flex-col items-start gap-2 flex-1'>
            <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
              Description
            </Label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
                  placeholder='Enter role description'
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.description && (
              <span className='text-red-500 text-xs'>
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Status selector */}
          <div className='flex flex-col items-start gap-2'>
            <Label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
              Status
            </Label>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-[120px] h-12 px-4 py-[7px] rounded-[10px] border-2 border-[#e8eaed]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='INACTIVE'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <span className='text-red-500 text-xs'>
                {errors.status.message}
              </span>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className='flex items-start justify-end gap-3'>
          <button
            type='submit'
            className='h-[42px] font-semibold text-white text-base bg-[#34ad44] hover:bg-[#2d9a3a] rounded-[30px] px-6'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : mode === 'edit' ? (
              'Update Role'
            ) : (
              'Create Role'
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};
