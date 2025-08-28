'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ComingSoon from '../../components/shared/common/ComingSoon';

export default function DashboardOverview() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Helper function to check cookies directly
  const checkAuthCookie = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => 
        cookie.trim().startsWith('is_authenticated=')
      );
      return authCookie?.includes('true');
    }
    return false;
  };

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Additional check: if we're not loading but still not authenticated after a delay,
  // force redirect (this handles edge cases where auth context might not be properly initialized)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        // Double-check with direct cookie check
        const hasAuthCookie = checkAuthCookie();
        if (!hasAuthCookie) {
          router.push('/auth/login');
        }
      }
    }, 1000); // Wait 1 second for auth context to initialize

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='h-full md:h-[calc(100vh_-_220px)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-sm text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <ComingSoon />
    </div>
  );
}
