'use client';

import { useToast } from '@/components/ui/use-toast';
import { SIGNUP_MESSAGES } from '@/constants/messages';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageSlider } from '../../../components/layout/ImageSlider';
import { SignupForm } from '../../../components/shared/forms/SignupForm';
import { ROLE_IDS } from '../../../constants/common';

export default function SignupPageContent() {
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();

  // Get redirect param if present
  const redirectTo = searchParams.get('redirect');

  const handleSignup = async (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone_number?: string
  ) => {
    // Check if passwords match
    if (password !== confirmPassword) {
      showErrorToast(SIGNUP_MESSAGES.ERROR.PASSWORDS_MISMATCH);
      return {
        success: false,
        error: SIGNUP_MESSAGES.ERROR.PASSWORDS_MISMATCH,
      };
    }
    const roleId = String(ROLE_IDS.HOMEOWNER);
    const result = await signup(email, password, roleId, name, phone_number);
    if (result.success) {
      showSuccessToast(SIGNUP_MESSAGES.SUCCESS);

      // Small delay to show success toast before redirect
      setTimeout(() => {
        // Redirect after signup
        if (
          redirectTo &&
          redirectTo.startsWith('/') &&
          !redirectTo.startsWith('/auth/')
        ) {
          router.push(redirectTo);
        } else {
          router.push('/');
        }
      }, 500);
    } else {
      showErrorToast(result.error || SIGNUP_MESSAGES.ERROR.GENERIC);
    }
    return result;
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
                  {SIGNUP_MESSAGES.FORM.TITLE}
                </h1>
                <p className='text-[var(--text-secondary)] text-sm xl:text-[18px] lg:text-base'>
                  {SIGNUP_MESSAGES.FORM.SUBTITLE}
                </p>
                {redirectTo && (
                  <p className='text-sm text-blue-600'>
                    {SIGNUP_MESSAGES.FORM.REDIRECT_MESSAGE} {redirectTo}
                  </p>
                )}
              </div>

              {/* Client-side Signup Form */}
              <div className='space-y-4 xl:space-y-6'>
                <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
              </div>

              {/* Login Link */}
              <div className='text-center mt-4 xl:mt-6'>
                <p className='text-sm text-[var(--text-secondary)]'>
                  {SIGNUP_MESSAGES.FORM.LOGIN_LINK}{' '}
                  <a
                    href='/auth/login'
                    className='text-[#2d2d2d] hover:text-green-600 transition-colors font-semibold'
                  >
                    {SIGNUP_MESSAGES.FORM.LOGIN_LINK_TEXT}
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
