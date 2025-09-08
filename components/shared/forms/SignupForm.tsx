'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SIGNUP_MESSAGES } from '@/constants/messages';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeSlash, Lock, Sms } from 'iconsax-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface SignupFormProps {
  onSubmit: (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone_number?: string
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number?: string;
}

// Validation schema
const signupSchema = yup.object({
  name: yup.string().required(SIGNUP_MESSAGES.VALIDATION.FIRST_NAME_REQUIRED),
  email: yup
    .string()
    .required(SIGNUP_MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .email(SIGNUP_MESSAGES.VALIDATION.EMAIL_INVALID),
  password: yup
    .string()
    .required(SIGNUP_MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    .min(8, SIGNUP_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
  confirmPassword: yup
    .string()
    .required(SIGNUP_MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED)
    .oneOf(
      [yup.ref('password')],
      SIGNUP_MESSAGES.VALIDATION.PASSWORDS_MISMATCH
    ),
  phone_number: yup
    .string()
    .optional()
    .matches(/^[0-9]+$/, SIGNUP_MESSAGES.VALIDATION.PHONE_INVALID),
});

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema) as any,
    mode: 'onBlur',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onFormSubmit = async (data: SignupFormData) => {
    try {
      // Clear any previous errors
      clearErrors('root');
      setSubmitError(null);

      const result = await onSubmit(
        data.email,
        data.password,
        data.confirmPassword,
        data.name,
        data.phone_number
      );

      if (!result.success && result.error) {
        setSubmitError(result.error);
        setError('root', {
          type: 'manual',
          message: result.error,
        });
      }
    } catch (error) {
      const errorMessage = SIGNUP_MESSAGES.ERROR.UNEXPECTED;
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
        {/* Name Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='name'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {SIGNUP_MESSAGES.LABELS.FULL_NAME}
          </Label>
          <div className='relative flex items-center'>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  id='name'
                  type='text'
                  placeholder={SIGNUP_MESSAGES.PLACEHOLDERS.FULL_NAME}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  className={`h-12 border-2 focus:ring-[var(--secondary)] border-[#E8EAED] bg-white rounded-[10px] text-sm md:text-base text-[#2d2d2d] !placeholder-[#C0C6CD] ${
                    errors.name
                      ? 'border-[var(--warning)] focus:border-[var(--warning)]'
                      : 'focus:border-[var(--secondary)]'
                  }`}
                  disabled={isLoading}
                  autoComplete='name'
                  autoFocus={true}
                />
              )}
            />
          </div>
          <FormErrorMessage message={errors.name?.message || ''} />
        </div>

        {/* Email Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {SIGNUP_MESSAGES.LABELS.EMAIL}
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
                  placeholder={SIGNUP_MESSAGES.PLACEHOLDERS.EMAIL}
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
                  autoFocus={false}
                />
              )}
            />
          </div>
          <FormErrorMessage message={errors.email?.message || ''} />
        </div>

        {/* Phone Number Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='phone_number'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {SIGNUP_MESSAGES.LABELS.PHONE_NUMBER}
          </Label>
          <div className='relative flex items-center'>
            <Controller
              name='phone_number'
              control={control}
              render={({ field }) => (
                <Input
                  id='phone_number'
                  type='tel'
                  placeholder={SIGNUP_MESSAGES.PLACEHOLDERS.PHONE_NUMBER}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  className={`h-12 border-2 focus:ring-[var(--secondary)] border-[#E8EAED] bg-white rounded-[10px] text-sm md:text-base text-[#2d2d2d] !placeholder-[#C0C6CD] ${
                    errors.phone_number
                      ? 'border-[var(--warning)] focus:border-[var(--warning)]'
                      : 'focus:border-[var(--secondary)]'
                  }`}
                  disabled={isLoading}
                  autoComplete='tel'
                />
              )}
            />
          </div>
          <FormErrorMessage message={errors.phone_number?.message || ''} />
        </div>

        {/* Password Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='password'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {SIGNUP_MESSAGES.LABELS.PASSWORD}
          </Label>
          <div className='relative flex items-center'>
            <Lock
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='h-4 w-[1px] bg-[#C0C6CD] absolute left-10'></span>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder={SIGNUP_MESSAGES.PLACEHOLDERS.PASSWORD}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  className={`pl-12 pr-10 h-12 border-2 text-[#2d2d2d] text-sm md:text-base border-[#E8EAED] focus:ring-[var(--secondary)] bg-white rounded-[10px] !placeholder-[#C0C6CD] ${
                    errors.password
                      ? 'border-[var(--warning)]'
                      : 'focus:border-[var(--secondary)]'
                  }`}
                  disabled={isLoading}
                  autoComplete='new-password'
                  minLength={8}
                />
              )}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed'
            >
              {showPassword ? (
                <EyeSlash size={24} color='#818181' className='h-5 w-5' />
              ) : (
                <Eye size={24} color='#818181' className='h-5 w-5' />
              )}
            </button>
          </div>
          <FormErrorMessage message={errors.password?.message || ''} />
        </div>

        {/* Confirm Password Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='confirmPassword'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            {SIGNUP_MESSAGES.LABELS.CONFIRM_PASSWORD}
          </Label>
          <div className='relative flex items-center'>
            <Lock
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='h-4 w-[1px] bg-[#C0C6CD] absolute left-10'></span>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={SIGNUP_MESSAGES.PLACEHOLDERS.CONFIRM_PASSWORD}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                  className={`pl-12 pr-10 h-12 border-2 text-[#2d2d2d] text-sm md:text-base border-[#E8EAED] focus:ring-[var(--secondary)] bg-white rounded-[10px] !placeholder-[#C0C6CD] ${
                    errors.confirmPassword
                      ? 'border-[var(--warning)]'
                      : 'focus:border-[var(--secondary)]'
                  }`}
                  disabled={isLoading}
                  autoComplete='new-password'
                  minLength={8}
                />
              )}
            />
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              disabled={isLoading}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed'
            >
              {showConfirmPassword ? (
                <EyeSlash size={24} color='#818181' className='h-5 w-5' />
              ) : (
                <Eye size={24} color='#818181' className='h-5 w-5' />
              )}
            </button>
          </div>
          <FormErrorMessage message={errors.confirmPassword?.message || ''} />
        </div>
      </div>

      {/* Signup Button */}
      <Button
        type='submit'
        disabled={isLoading || isSubmitting}
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading || isSubmitting ? (
          <div className='flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            {SIGNUP_MESSAGES.FORM.BUTTON_LOADING}
          </div>
        ) : (
          SIGNUP_MESSAGES.FORM.BUTTON
        )}
      </Button>
    </form>
  );
}
