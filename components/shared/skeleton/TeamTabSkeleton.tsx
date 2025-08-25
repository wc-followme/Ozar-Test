import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TeamTabSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Team Members Grid Skeleton */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-4 sm:gap-3 xl:gap-6'>
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className='bg-[var(--card-background)] rounded-lg p-4 border border-[var(--border-dark)]'
          >
            {/* User Card Skeleton */}
            <div className='flex items-center gap-3'>
              {/* Avatar Skeleton */}
              <Skeleton className='w-12 h-12 rounded-full bg-[var(--bg-skeleton)]' />

              {/* User Info Skeleton */}
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className='mt-4 space-y-2'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-6 rounded-full w-full bg-[var(--bg-skeleton)]' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTabSkeleton;
