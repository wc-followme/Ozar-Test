import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const WarrantiesTabSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Header with Search, Filter, and Add Button Skeleton */}
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
        <div className='relative flex-1 sm:flex-initial w-full'>
          {/* Search Input Skeleton */}
          <Skeleton className='w-full lg:w-[360px] h-[42px] rounded-[30px] bg-[var(--bg-skeleton)]' />
        </div>
        <div className='flex flex-col items-start lg:items-center sm:flex-row gap-3 w-full lg:w-auto'>
          {/* Filter Dropdown Skeleton */}
          <Skeleton className='w-full lg:w-48 h-10 rounded-[30px] bg-[var(--bg-skeleton)]' />

          {/* Add Button Skeleton */}
          <Skeleton className='h-10 w-32 rounded-full bg-[var(--bg-skeleton)]' />
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)]'>
        <div className='flex lg:gap-6 gap-0 lg:flex-row flex-col'>
          {/* Left Side - Category Tabs Skeleton */}
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
                      index !== 3 ? 'border-b border-[var(--border-dark)]' : ''
                    }`}
                  >
                    <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Warranties Content Skeleton */}
          <div className='flex-1 p-4 bg-[var(--background)] lg:rounded-r-[20px]'>
            <div className='space-y-4'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='bg-[var(--card-background)] rounded-lg p-4 border border-[var(--border-dark)]'
                >
                  {/* Warranty Item Skeleton */}
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex-1 space-y-3'>
                      {/* Warranty Title Skeleton */}
                      <Skeleton className='h-3 w-48 bg-[var(--bg-skeleton)]' />
                      <div className='flex-1'></div>
                      {/* Warranty Description Skeleton */}
                      <div className='space-y-2'>
                        <Skeleton className='h-3 w-full bg-[var(--bg-skeleton)]' />
                        <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
                      </div>
                    </div>
                    <Skeleton className='h-16 w-0.5 bg-[var(--bg-skeleton)]' />
                    {/* Warranty Duration Skeleton */}
                    <div className='text-right min-w-52 space-y-4'>
                      <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                      <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
                    </div>
                    <Skeleton className='h-6 w-1.5 bg-[var(--bg-skeleton)]' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantiesTabSkeleton;
