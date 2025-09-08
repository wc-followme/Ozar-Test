'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FORGOT_PASSWORD_MESSAGES } from '@/constants/messages';
import { yupResolver } from '@hookform/resolvers/yup';
import { Sms } from 'iconsax-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

interface ForgotPasswordFormData {
  email: string;
}

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required(FORGOT_PASSWORD_MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .email(FORGOT_PASSWORD_MESSAGES.VALIDATION.EMAIL_INVALID),
});

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
}: ForgotPasswordFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema) as any,
    mode: 'onBlur',
  });

  const onFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Clear any previous errors
      clearErrors('root');
      setSubmitError(null);

      const result = await onSubmit(data.email);

      if (!result.success && result.error) {
        setSubmitError(result.error);
        setError('root', {
          type: 'manual',
          message: result.error,
        });
      }
    } catch (error) {
      const errorMessage = FORGOT_PASSWORD_MESSAGES.ERROR.GENERIC;
      setSubmitError(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  // Clear submit error when user starts typing
  const handleInputChange = () => {
    if (submitError) {
      setSubmitError(null);
      clearErrors('root');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className='space-y-4 md:space-y-6'
    >
      {/* General Error */}
      {(submitError || errors.root) && (
        <FormErrorMessage message={submitError || errors.root?.message || ''} />
      )}

      <div className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {FORGOT_PASSWORD_MESSAGES.LABELS.EMAIL}
          </Label>
          <div className='relative flex items-center'>
            <Sms
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='h-4 w-[1px] bg-[#C0C6CD] absolute left-10'></span>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  id='email'
                  type='email'
                  placeholder={FORGOT_PASSWORD_MESSAGES.PLACEHOLDERS.EMAIL}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  className={`pl-12 h-12 border-2 focus:ring-[var(--secondary)] border-[#E8EAED] bg-white rounded-[10px] text-sm md:text-base text-[#2d2d2d] !placeholder-[#C0C6CD] ${
                    errors.email
                      ? 'border-[var(--warning)] focus:border-[var(--warning)]'
                      : 'focus:border-[var(--secondary)]'
                  }`}
                  disabled={isLoading}
                  autoComplete='email'
                  autoFocus={true}
                />
              )}
            />
          </div>
          <FormErrorMessage message={errors.email?.message || ''} />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={isLoading || isSubmitting}
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading || isSubmitting ? (
          <div className='flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            {FORGOT_PASSWORD_MESSAGES.FORM.BUTTON_LOADING}
          </div>
        ) : (
          FORGOT_PASSWORD_MESSAGES.FORM.BUTTON
        )}
      </Button>
    </form>
  );
}
