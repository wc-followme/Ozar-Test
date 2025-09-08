'use client';

import { ForgotPasswordForm } from '@/components/shared/forms/ForgotPasswordForm';
import { useToast } from '@/components/ui/use-toast';
import { ROUTES } from '@/constants/common';
import { FORGOT_PASSWORD_MESSAGES } from '@/constants/messages';
import { apiService } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageSlider } from '../../../components/layout/ImageSlider';

export default function ForgotPasswordPageContent() {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Call the forgot password API
      const response = await apiService.forgotPassword(email);

      if (response.statusCode === 200) {
        showSuccessToast(response.message || FORGOT_PASSWORD_MESSAGES.SUCCESS);

        // Redirect to login page after success
        setTimeout(() => {
          router.push(ROUTES.AUTH_LOGIN);
        }, 2000);

        return { success: true };
      } else {
        showErrorToast(
          response.message || FORGOT_PASSWORD_MESSAGES.ERROR.GENERIC
        );
        return {
          success: false,
          error: response.message || FORGOT_PASSWORD_MESSAGES.ERROR.GENERIC,
        };
      }
    } catch (error: any) {
      // Handle different error types
      if (error.status === 400) {
        showErrorToast(
          error.message || FORGOT_PASSWORD_MESSAGES.ERROR.EMAIL_NOT_FOUND
        );
        return {
          success: false,
          error:
            error.message || FORGOT_PASSWORD_MESSAGES.ERROR.EMAIL_NOT_FOUND,
        };
      } else if (error.status === 0) {
        showErrorToast(FORGOT_PASSWORD_MESSAGES.ERROR.NETWORK_ERROR);
        return {
          success: false,
          error: FORGOT_PASSWORD_MESSAGES.ERROR.NETWORK_ERROR,
        };
      } else {
        showErrorToast(FORGOT_PASSWORD_MESSAGES.ERROR.GENERIC);
        return {
          success: false,
          error: FORGOT_PASSWORD_MESSAGES.ERROR.GENERIC,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='h-full bg-[#FFFFFF]'>
      <div className='flex flex-col h-screen max-h-[100dvh] lg:flex-row mx-auto py-4 xl:py-[38px] px-4 md:px-[30px] gap-3 xl:gap-6'>
        <div className='flex-1 h-full xl:max-w-[676px] flex flex-col items-center justify-center bg-white gap-3 xl:gap-6'>
          <div className='w-full space-y-4 xl:space-y-8 flex flex-column items-center justify-center flex-auto bg-[#F5F7FA] rounded-[30px] shadow-lg sm:shadow-none'>
            <div className='max-w-[412px] w-full px-4'>
              {/* Logo */}
              <Image
                src='/images/logo.svg'
                height={120}
                width={120}
                alt='Company Logo'
                className='mx-auto mb-4 xl:mb-[34px] h-16 xl:h-auto'
              />

              {/* Heading */}
              <div className='text-center space-y-2 mb-4 xl:mb-[34px]'>
                <h1 className='text-lg xl:text-3xl lg:text-xl font-bold text-[#2D2D2D] mb-4 xl:mb-6 leading-tight'>
                  {FORGOT_PASSWORD_MESSAGES.FORM.TITLE}
                </h1>
                <p className='text-[var(--text-secondary)] text-sm xl:text-[18px] lg:text-base'>
                  {FORGOT_PASSWORD_MESSAGES.FORM.SUBTITLE}
                </p>
              </div>

              {/* Client-side Forgot Password Form */}
              <div className='space-y-4 xl:space-y-6'>
                <ForgotPasswordForm
                  onSubmit={handleForgotPassword}
                  isLoading={isLoading}
                />
              </div>

              {/* Login Link */}
              <div className='text-center mt-4 xl:mt-6'>
                <p className='text-sm text-[var(--text-secondary)]'>
                  {FORGOT_PASSWORD_MESSAGES.FORM.LOGIN_LINK}{' '}
                  <a
                    href={ROUTES.AUTH_LOGIN}
                    className='text-[#2d2d2d] hover:text-green-600 transition-colors font-semibold'
                  >
                    {FORGOT_PASSWORD_MESSAGES.FORM.LOGIN_LINK_TEXT}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Section */}
          {/* <CustomerSection /> */}
        </div>

        {/* Right Section - Image Slider */}
        <ImageSlider />
      </div>
    </section>
  );
}
