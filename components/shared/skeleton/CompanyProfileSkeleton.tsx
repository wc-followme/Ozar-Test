import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import CompanyInfoSkeleton from './CompanyInfoSkeleton';

interface CompanyProfileSkeletonProps {
  isUserProfile?: boolean;
}

const CompanyProfileSkeleton: React.FC<CompanyProfileSkeletonProps> = ({
  isUserProfile = false,
}) => {
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
            <Skeleton className='h-9 w-24 bg-[var(--bg-skeleton)] rounded-full' />
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
                        {isUserProfile ? (
                          // User Profile Rating Layout
                          <div className='flex items-center gap-4'>
                            <div className='flex flex-wrap items-center gap-4'>
                              {/* Company Link Skeleton */}
                              <div className='flex items-center gap-2'>
                                <Skeleton className='w-6 h-6 rounded-full bg-[var(--bg-skeleton)]' />
                                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                              </div>
                              <div className='w-px h-6 bg-[var(--border-dark)]'></div>
                              {/* Rating Skeleton */}
                              <div className='flex items-center gap-2'>
                                <Skeleton className='h-3 w-8 bg-[var(--bg-skeleton)]' />
                                <div className='flex items-center gap-1'>
                                  {[...Array(5)].map((_, index) => (
                                    <Skeleton
                                      key={index}
                                      className='w-4 h-4 rounded-full bg-[var(--bg-skeleton)]'
                                    />
                                  ))}
                                </div>
                                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)]' />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Company Profile Rating Layout (Original)
                          <div className='flex items-center gap-2'>
                            <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)]' />
                            <div className='flex items-center gap-1'>
                              {[...Array(5)].map((_, index) => (
                                <Skeleton
                                  key={index}
                                  className='w-4 h-3 rounded bg-[var(--bg-skeleton)]'
                                />
                              ))}
                            </div>
                            <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Skeleton */}
                      <div className='flex flex-wrap gap-3 w-full md:w-auto ml-auto justify-end mt-4 lg:mt-0'>
                        {isUserProfile ? (
                          // User Profile Buttons
                          <>
                            {/* Review Button */}
                            <Skeleton className='h-9 w-9 sm:w-28 rounded-full bg-[var(--bg-skeleton)]' />
                            {/* Share Button */}
                            <Skeleton className='h-9 w-9 sm:w-24 rounded-full bg-[var(--bg-skeleton)]' />
                            {/* Edit Profile Button */}
                            <Skeleton className='h-9 w-9 sm:w-28 rounded-full bg-[var(--bg-skeleton)]' />
                            {/* Add to Network Button (User Profile Specific) */}
                            <Skeleton className='h-9 w-9 sm:w-32 rounded-full bg-[var(--bg-skeleton)]' />
                          </>
                        ) : (
                          // Company Profile Buttons (Original)
                          <>
                            <Skeleton className='h-9 w-28 rounded-full bg-[var(--bg-skeleton)]' />
                            <Skeleton className='h-9 w-32 rounded-full bg-[var(--bg-skeleton)]' />
                            <Skeleton className='h-9 w-24 rounded-full bg-[var(--bg-skeleton)]' />
                            <Skeleton className='h-9 w-28 rounded-full bg-[var(--bg-skeleton)]' />
                            <Skeleton className='h-9 w-32 rounded-full bg-[var(--bg-skeleton)]' />
                          </>
                        )}
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
            {/* Mobile Tabs Skeleton (single bar) */}
            <div className='md:hidden max-w-[calc(100vw_-_64px)] xl:max-w-full rounded-[32px] overflow-hidden'>
              <Skeleton className='h-12 w-full bg-[var(--bg-skeleton)] rounded-[32px]' />
            </div>

            {/* Desktop Tabs Skeleton (single bar) */}
            <div className='hidden md:block'>
              <Skeleton className='h-14 w-full bg-[var(--bg-skeleton)] rounded-[32px] border border-[var(--border-dark)]' />
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <CompanyInfoSkeleton isUserProfile={isUserProfile} />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileSkeleton;
