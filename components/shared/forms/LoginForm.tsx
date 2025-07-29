'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeSlash, Lock, Sms } from 'iconsax-react';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

interface FormErrors {
  email?: string | undefined;
  password?: string | undefined;
  general?: string | undefined;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    {
      email: false,
      password: false,
    }
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Frontend validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'email') {
      const emailError = validateEmail(email);
      setErrors(prev => ({ ...prev, email: emailError }));
    } else if (field === 'password') {
      const passwordError = validatePassword(password);
      setErrors(prev => ({ ...prev, password: passwordError }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }

    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Clear password error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }

    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Clear any previous general errors
    setErrors(prev => ({ ...prev, general: undefined }));

    // Submit form
    const result = await onSubmit(email, password);

    if (!result.success && result.error) {
      setErrors(prev => ({ ...prev, general: result.error }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
      {/* General Error Alert */}
      {errors.general && (
        <Alert variant='destructive' className='border-red-200 bg-red-50'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='text-red-800'>
            {errors.general}
          </AlertDescription>
        </Alert>
      )}

      <div className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            Email *
          </Label>
          <div className='relative flex items-center'>
            <Sms
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='h-4 w-[1px] bg-[#C0C6CD] absolute left-10'></span>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              className={`pl-12 h-12 border-2 focus:ring-[var(--secondary)] border-[#E8EAED] bg-white rounded-[10px] text-sm md:text-base text-[#2d2d2d] !placeholder-[#C0C6CD] ${
                errors.email && touched.email
                  ? 'border-[var(--warning)] focus:border-[var(--warning)]'
                  : 'focus:border-[var(--secondary)]'
              }`}
              disabled={isLoading}
              autoComplete='email'
              autoFocus={false}
            />
          </div>
          {errors.email && touched.email && (
            <p className='text-sm text-red-600 mt-1'>{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className='space-y-1 md:space-y-2'>
          <Label
            htmlFor='password'
            className='text-[14px] font-[600] text-[#2D2D2D]'
          >
            Password *
          </Label>
          <div className='relative flex items-center'>
            <Lock
              size='32'
              color='#818181'
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            />
            <span className='h-4 w-[1px] bg-[#C0C6CD] absolute left-10'></span>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              className={`pl-12 pr-10 h-12 border-2 text-[#2d2d2d] text-sm md:text-base border-[#E8EAED] focus:ring-[var(--secondary)] bg-white rounded-[10px] !placeholder-[#C0C6CD] ${
                errors.password && touched.password
                  ? 'border-[var(--warning)]'
                  : 'focus:border-[var(--secondary)]'
              }`}
              disabled={isLoading}
              autoComplete='current-password'
              minLength={6}
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
          {errors.password && touched.password && (
            <p className='text-sm text-red-600 mt-1'>{errors.password}</p>
          )}
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className='text-right'>
        <a
          href='#'
          className='text-sm md:text-base text-[#2d2d2d] hover:text-green-600 transition-colors'
          onClick={e => e.preventDefault()}
        >
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type='submit'
        disabled={isLoading || !email || !password}
        className='w-full h-12 bg-[var(--secondary)] hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
            Logging in...
          </div>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
