import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const FiveBoxSystemSkeleton: React.FC = () => {
  return (
    <section className=''>
      {/* Breadcrumbs Skeleton */}
      <div className='mb-8 mt-2'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-32 bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-4 w-4 rounded bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
        </div>
      </div>

      {/* 5-box System Grid Skeleton */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl w-full gap-3 xl:gap-6'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className='bg-[var(--card-background)] flex flex-col rounded-3xl border border-[var(--border-dark)] p-6'
          >
            {/* Header with Digit Circle and Menu */}
            <div className='flex items-start justify-between mb-4'>
              {/* Digit Circle Skeleton */}
              <Skeleton className='w-[60px] h-[60px] rounded-2xl bg-[var(--bg-skeleton)]' />

              {/* Menu Button Skeleton */}
              <Skeleton className='h-6 w-2 rounded-full bg-[var(--bg-skeleton)]' />
            </div>

            {/* Content Skeleton */}
            <div className='flex flex-col gap-2 h-auto mb-4'>
              {/* Title Skeleton */}
              <Skeleton className='h-4 w-3/4 rounded bg-[var(--bg-skeleton)]' />

              {/* Description Skeleton */}
              <div className='space-y-2'>
                <Skeleton className='h-3 w-full rounded bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-4/5 rounded bg-[var(--bg-skeleton)]' />
                <Skeleton className='h-3 w-2/3 rounded bg-[var(--bg-skeleton)]' />
              </div>
            </div>

            {/* Enable Toggle Stripe Skeleton */}
            <div className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-auto'>
              <Skeleton className='h-3 w-16 rounded bg-[var(--bg-skeleton)]' />
              <Skeleton className='h-4 w-9 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FiveBoxSystemSkeleton;
