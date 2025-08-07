import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gallery } from 'iconsax-react';
import React from 'react';

const JobCardSkeleton: React.FC = () => (
  <div className='border-1 border-[var(--border-dark)] shadow-sm bg-[var(--card-background)] rounded-[16px] overflow-hidden w-full min-h-[390px] flex flex-col cursor-pointer'>
    {/* Image Skeleton */}
    <div className='relative w-full h-48'>
      <Skeleton className='w-full h-full object-cover rounded-t-lg bg-[var(--bg-skeleton)] flex items-center justify-center'>
        <Gallery
          size={60}
          color='var(--white-background)'
          className='opacity-40'
        />
      </Skeleton>
      {/* Progress Badge Skeleton */}
      <div className='absolute top-3 left-3 flex items-center gap-2'>
        <Skeleton className='h-[26px] w-[50px] rounded-[30px] bg-white' />
      </div>
      {/* Action Icons Skeleton */}
      <div className='absolute right-0 bottom-0 h-[2.5rem] w-[6rem] flex justify-center items-center bg-[var(--card-background)] rounded-none rounded-tl-[20px] gap-3'>
        <Skeleton className='h-7 w-7 rounded-2xl bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-7 w-7 rounded-2xl bg-[var(--bg-skeleton)]' />
      </div>
    </div>
    {/* Card Content Skeleton */}
    <div className='p-5 flex flex-col gap-3 flex-1'>
      {/* Title and JobId */}
      <div className='mb-1'>
        <Skeleton className='h-5 w-2/3 mb-2 bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-1/3 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Email */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-1/2 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Address */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
      </div>
      {/* Start Date and Days Left */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-5 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
        <div className='ml-auto'>
          <Skeleton className='h-6 w-24 rounded-full bg-[var(--bg-skeleton)]' />
        </div>
      </div>
    </div>
  </div>
);

const JobManagementPageSkeleton: React.FC = () => (
  <div className=''>
    {/* Stats Cards Skeleton */}
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-8'>
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className='border-[1px] border-[var(--border-dark)] bg-[var(--card-background)] shadow-0 rounded-[20px]'
        >
          <CardContent className='sm:p-6 p-4'>
            <div className='flex sm:flex-row sm:gap-4 gap-6 flex-col sm:items-center justify-between'>
              <div>
                <Skeleton className='h-4 w-16 mb-4 mt-2 rounded bg-[var(--bg-skeleton)]'>
                  &nbsp;
                </Skeleton>
                <Skeleton className='h-3 w-24 rounded bg-[var(--bg-skeleton)]' />
              </div>
              <div className='w-12 h-12 rounded-[16px] bg-[var(--bg-skeleton)] flex items-center justify-center mb-4'>
                <Skeleton className='w-5 h-5 rounded bg-[var(--bg-skeleton)]' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {/* Tabs and Create Job Button Skeleton */}
    <div className='flex flex-row items-start lg:items-center gap-2 w-full sm:mb-10 mb-6'>
      <Skeleton className='h-16 sm:h-12 rounded-full bg-[var(--bg-skeleton)] w-full sm:w-1/2' />
      <Skeleton className='w-14 h-14 sm:w-32 sm:h-12 rounded-full shrink-0 bg-[var(--bg-skeleton)] fixed sm:static bottom-6 right-6 z-50 sm:z-auto ml-auto' />
    </div>
    {/* Jobs Grid Skeleton */}
    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
      {[...Array(4)].map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default JobManagementPageSkeleton;
