import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import CompanyInfoSkeleton from './CompanyInfoSkeleton';

const CompanyProfileSkeleton: React.FC = () => {
  return (
    <div className='w-full'>
      {/* Profile Top Block Skeleton - matches ProfileTopBlock exactly */}
      <div className='rounded-[10px]'>
        {/* Cover Image Section */}
        <div className='relative w-full lg:aspect-[5.25/1] min-h-[250px] lg:min-h-max'>
          {/* Cover Image Skeleton */}
          <div className='w-full h-full'>
            <Skeleton className='w-full h-full rounded-tl-[10px] rounded-tr-[10px] bg-[var(--bg-skeleton)]' />
          </div>

          {/* Change Cover Button Skeleton */}
          <div className='absolute top-4 right-4'>
            <Skeleton className='h-9 w-24 bg-[var(--bg-skeleton)] rounded' />
          </div>
        </div>

        {/* Profile Section */}
        <div className='relative bg-[var(--white-background)]'>
          <div className='mx-auto'>
            <div className='px-4 lg:pl-[52px] lg:pr-6 py-6'>
              <div className='flex flex-col lg:flex-row gap-4 md:gap-6 -mt-[70px]'>
                {/* Logo Skeleton */}
                <div className='relative'>
                  <Skeleton className='w-[150px] h-[150px] rounded-[10px] bg-[var(--bg-skeleton)]' />
                </div>

                {/* Company Details Skeleton */}
                <div className='flex-1 min-w-0 w-full lg:pt-[70px]'>
                  <div className='space-y-2'>
                    {/* Company Name */}
                    <Skeleton className='h-4 mb-3 w-64 bg-[var(--bg-skeleton)]' />

                    <div className='flex flex-wrap items-end gap-4'>
                      <div>
                        {/* Tagline */}
                        <Skeleton className='h-3 w-80 mb-3 bg-[var(--bg-skeleton)]' />

                        {/* Rating and Review Count Skeleton */}
                        <div className='flex items-center gap-2'>
                          <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)]' />
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, index) => (
                              <Skeleton
                                key={index}
                                className='w-4 h-4 rounded bg-[var(--bg-skeleton)]'
                              />
                            ))}
                          </div>
                          <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                        </div>
                      </div>

                      {/* Action Buttons Skeleton */}
                      <div className='flex flex-wrap gap-3 w-full md:w-auto ml-auto justify-end mt-4 lg:mt-0'>
                        <Skeleton className='h-9 w-28 rounded-full bg-[var(--bg-skeleton)]' />
                        <Skeleton className='h-9 w-32 rounded-full bg-[var(--bg-skeleton)]' />
                        <Skeleton className='h-9 w-24 rounded-full bg-[var(--bg-skeleton)]' />
                        <Skeleton className='h-9 w-28 rounded-full bg-[var(--bg-skeleton)]' />
                        <Skeleton className='h-9 w-32 rounded-full bg-[var(--bg-skeleton)]' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Bottom Block Skeleton */}
      <div className='bg-[var(--white-background)] rounded-b-[10px] border-t border-[var(--border-dark)] w-full'>
        <div className='p-4 lg:p-6 w-full'>
          {/* Tabs Skeleton */}
          <div className='mb-6'>
            {/* Mobile Tabs Skeleton */}
            <div className='md:hidden max-w-[calc(100vw_-_64px)] xl:max-w-full rounded-[32px] overflow-auto'>
              <div className='flex w-fit bg-[var(--dark-background-other)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start shadow-lg sm:shadow-none border-none'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className='px-6 sm:px-8 py-3 sm:py-2 h-10 md:h-12 w-24 md:w-28 rounded-[28px] sm:rounded-[30px] bg-[var(--bg-skeleton)]'
                  />
                ))}
              </div>
            </div>

            {/* Desktop Tabs Skeleton */}
            <div className='hidden md:block'>
              <div className='flex w-full bg-[var(--dark-background)] p-1 rounded-[32px] h-auto font-normal justify-stretch border border-[var(--border-dark)]'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className='px-6 py-[10px] flex-1 h-12 rounded-[28px] bg-[var(--bg-skeleton)]'
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <CompanyInfoSkeleton />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileSkeleton;
