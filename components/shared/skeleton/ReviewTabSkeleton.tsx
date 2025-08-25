import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const ReviewTabSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Filter and Sort Controls Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <div className='flex gap-3 w-full justify-end'>
          {/* Filter Dropdown Skeleton */}
          <Skeleton className='h-10 w-56 rounded-full bg-[var(--bg-skeleton)]' />

          {/* Sort Dropdown Skeleton */}
          <Skeleton className='h-10 w-32 rounded-full bg-[var(--bg-skeleton)]' />
        </div>
      </div>

      {/* Reviews List Skeleton */}
      <div className='space-y-4'>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className='bg-[var(--card-background)] rounded-lg p-5 border border-[var(--border-dark)]'
          >
            {/* Review Header Skeleton */}
            <div className='flex items-start gap-4 mb-4'>
              {/* Profile Image Skeleton */}
              <Skeleton className='w-12 h-12 rounded-full bg-[var(--bg-skeleton)]' />

              {/* Review Info Skeleton */}
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-3 w-32 bg-[var(--bg-skeleton)]' />
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, starIndex) => (
                      <Skeleton
                        key={starIndex}
                        className='w-4 h-4 rounded bg-[var(--bg-skeleton)]'
                      />
                    ))}
                  </div>
                </div>
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Review Content Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-3 w-full bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-3 w-5/6 bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTabSkeleton;
