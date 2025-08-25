import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const PortfolioTabSkeleton: React.FC = () => {
  return (
    <div className='space-y-6 w-full'>
      {/* Add Project Button Skeleton */}
      <div className='flex justify-end'>
        <Skeleton className='h-10 w-32 rounded-full bg-[var(--bg-skeleton)]' />
      </div>

      {/* Portfolio Projects Grid Skeleton */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] overflow-hidden'
          >
            {/* Project Image Skeleton */}
            <div className='relative'>
              <Skeleton className='w-full bg-[var(--bg-skeleton)] aspect-[298/296]' />

              {/* Image Count Badge Skeleton */}
              <div className='absolute bottom-3 right-3'>
                <Skeleton className='h-6 w-24 rounded-full bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Project Info Skeleton */}
            <div className='p-4 flex items-center'>
              {/* Project Title Skeleton */}
              <Skeleton className='h-3 w-3/4 bg-[var(--bg-skeleton)]' />

              <Skeleton className='h-6 w-1 rounded-lg bg-[var(--bg-skeleton)] ml-auto' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioTabSkeleton;
