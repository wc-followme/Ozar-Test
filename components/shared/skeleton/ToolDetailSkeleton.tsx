import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import TableSkeleton from './TableSkeleton';

interface ToolDetailSkeletonProps {
  showActionButtons?: boolean;
}

const ToolDetailSkeleton: React.FC<ToolDetailSkeletonProps> = ({
  showActionButtons = true,
}) => {
  return (
    <div className='w-full space-y-8'>
      {/* Breadcrumbs Skeleton */}
      <div className='flex items-start gap-2'>
        <Skeleton className='h-4 w-16 bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-4 rounded bg-[var(--bg-skeleton)]' />
        <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
      </div>

      {/* Main Tool Information Block Skeleton */}
      <div className='bg-[--card-background] rounded-xl border border-[var(--border-dark)] p-6'>
        {/* Tools Detail Top Block Skeleton */}
        <div className='flex flex-col lg:flex-row gap-4 items-start mb-6'>
          {/* Tool Image Skeleton */}
          <div className='relative'>
            <Skeleton className='w-24 h-24 rounded-xl bg-[var(--bg-skeleton)]' />
          </div>

          {/* Tool Info Skeleton */}
          <div className='flex-1 space-y-8 py-2'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-48 bg-[var(--bg-skeleton)]' />
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-3 w-16 rounded bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <Skeleton className='h-3 w-16 rounded bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          {showActionButtons && (
            <div className='flex gap-3'>
              <Skeleton className='h-10 w-36 rounded-full bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-10 w-24 rounded-full bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-10 w-32 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          )}
        </div>

        {/* Status Tabs and Search Skeleton */}
        <div className=''>
          <div className='flex flex-col lg:flex-row gap-3 flex-wrap sm:gap-4 items-start lg:items-center justify-between w-full'>
            {/* Status Tabs Skeleton */}
            <div className='flex flex-row items-center gap-2 w-fit overflow-auto max-w-[calc(100vw_-_84px)]'>
              <div className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className='px-6 lg:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 rounded-[28px] sm:rounded-[30px]'
                  >
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-20 bg-[var(--bg-skeleton)]' />
                      <Skeleton className='h-5 w-6 rounded-full bg-[var(--bg-skeleton)]' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className='relative w-full sm:w-auto lg:w-[360px] ml-auto'>
              <Skeleton className='w-full sm:w-auto lg:w-[360px] h-[42px] rounded-[30px] bg-[var(--bg-skeleton)]' />
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className='w-full mt-6'>
            <TableSkeleton
              columns={6}
              rows={5}
              showRowNumbers={false}
              showActions={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailSkeleton;
