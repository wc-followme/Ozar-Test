'use client';

import { LoginForm } from '@/components/shared/forms/LoginForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageSlider } from '../../../components/layout/ImageSlider';

export default function LoginPageContent() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();

  // Get redirect param if present
  const redirectTo = searchParams.get('redirect');
  console.log('asas', redirectTo);
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      showSuccessToast('Welcome back! You have been logged in successfully.');

      // Small delay to show success toast before redirect
      setTimeout(() => {
        // Redirect after login
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
      console.log('result', result);
      showErrorToast(
        result.error || 'Invalid email or password. Please try again.'
      );
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
                  Join us to start turning your vision into reality!
                </h1>
                <p className='text-[var(--text-secondary)] text-sm xl:text-[18px] lg:text-base'>
                  Login now to get started!
                </p>
                {redirectTo && (
                  <p className='text-sm text-blue-600'>
                    You need to login to access {redirectTo}
                  </p>
                )}
              </div>

              {/* Client-side Login Form */}
              <div className='space-y-4 xl:space-y-6'>
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
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
