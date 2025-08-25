import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const CompanyInfoSkeleton: React.FC = () => {
  return (
    <div className='space-y-6 w-full'>
      {/* About Section Skeleton - matches ProfileDetailsComponent */}
      <div className='space-y-8'>
        <div className='bg-[var(--card-background)] rounded-lg p-6 border border-[var(--border-dark)] w-full'>
          <div className='flex gap-6 lg:flex-row flex-col'>
            {/* Left Section - Text Content */}
            <div className='flex-1 max-w-full'>
              <Skeleton className='h-3 w-16 mb-4 bg-[var(--bg-skeleton)]' />
              <div className='space-y-3'>
                <Skeleton className='h-3 w-full bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-5/6 bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Right Section - Video Thumbnail */}
            <div className='min-w-[232px] h-[156px] relative rounded-2xl bg-[var(--border-dark)] flex items-center justify-center'>
              <Skeleton className='w-full h-full rounded-2xl bg-[var(--bg-skeleton)]' />
              <Skeleton className='absolute h-8 w-8 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section Skeleton - matches ProfileCategoryTabComponent */}
      <div className='space-y-4'>
        <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)]'>
          <div className='flex lg:gap-6 gap-0 lg:flex-row flex-col'>
            {/* Left Side - Category Tabs */}
            <div className='lg:w-[280px] w-full shrink-0 p-4'>
              {/* Mobile Select Dropdown Skeleton */}
              <div className='lg:hidden'>
                <Skeleton className='w-full h-[42px] rounded-lg bg-[var(--bg-skeleton)]' />
              </div>

              {/* Desktop Tabs Skeleton */}
              <div className='hidden lg:block'>
                <div className='flex flex-col w-full rounded-lg h-auto'>
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-full px-3 py-4 leading-none rounded-lg ${
                        index !== 3
                          ? 'border-b border-[var(--border-dark)]'
                          : ''
                      }`}
                    >
                      <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Services Content */}
            <div className='flex-1 p-4 bg-[var(--background)] lg:rounded-r-[20px]'>
              <div className='flex flex-wrap gap-3 bg-[var(--card-background)] rounded-[10px] p-5'>
                {[...Array(8)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className='h-8 w-20 rounded-[30px] bg-[var(--bg-skeleton)]'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Skeleton - matches ProfileOtherDetailsComponent */}
      <div className='space-y-4'>
        <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-5 w-full'>
          <div className='flex lg:flex-row flex-col flex-wrap gap-6'>
            {/* Business Name */}
            <div className='lg:min-w-[280px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-24 mb-2 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-32 bg-[var(--bg-skeleton)]' />
            </div>

            {/* Email */}
            <div className='lg:min-w-[320px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-16 mb-2 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-40 bg-[var(--bg-skeleton)]' />
            </div>

            {/* Phone Number */}
            <div className='lg:min-w-[200px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-28 mb-2 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-40 bg-[var(--bg-skeleton)]' />
            </div>

            {/* Communication */}
            <div className='lg:min-w-[260px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-32 mb-2 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
            </div>

            {/* Projects */}
            <div className='lg:min-w-[160px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-20 mb-2 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-16 bg-[var(--bg-skeleton)]' />
            </div>

            {/* Website */}
            <div className='lg:min-w-[240px] min-w-full max-w-full'>
              <Skeleton className='h-3 w-20 mb-2 bg-[var(--bg-skeleton)]' />
              <div className='flex items-center gap-2 mt-1'>
                <Skeleton className='h-3 w-32 bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-4 w-4 rounded bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Address and Button */}
            <div className='lg:min-w-[600px] min-w-full max-w-full w-full'>
              <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 w-full'>
                <div className='flex-1'>
                  <Skeleton className='h-3 w-20 mb-2 bg-[var(--bg-skeleton)]' />
                  <Skeleton className='h-4 w-60 bg-[var(--bg-skeleton)]' />
                </div>
                <div className='lg:flex-shrink-0 ml-auto'>
                  <Skeleton className='h-9 w-48 rounded-full bg-[var(--bg-skeleton)]' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSkeleton;
