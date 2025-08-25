import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TemplateManagementSkeleton: React.FC = () => {
  return (
    <div className='w-full'>
      {/* Header Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <Skeleton className='h-4 w-32 bg-[var(--bg-skeleton)]' />
          <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
            {/* Desktop Button Skeleton */}
            <div className='hidden sm:block'>
              <Skeleton className='h-10 w-52 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
            {/* Mobile Button Skeleton */}
            <div className='block sm:hidden'>
              <Skeleton className='w-12 h-12 rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='w-full'>
          <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] xl:max-w-full'>
            {/* Tabs List Skeleton */}
            <div className='flex h-12 w-1/2 bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] font-normal justify-start max-w-full overflow-auto shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'></div>
          </div>

          {/* Tab Content Skeleton */}
          <div className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='bg-[var(--card-background)] rounded-[10px] shadow-sm border border-[var(--border-dark)] p-4'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <Skeleton className='h-6 w-32 bg-[var(--bg-skeleton)]' />
                    <Skeleton className='h-8 w-8 rounded bg-[var(--bg-skeleton)]' />
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-start'>
                      <div className='flex-1 max-w-[60%]'>
                        <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)] mb-1' />
                        <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
                      </div>
                      <div className='ml-auto'>
                        <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)] mb-1' />
                        <Skeleton className='h-4 w-24 bg-[var(--bg-skeleton)]' />
                      </div>
                    </div>
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

export default TemplateManagementSkeleton;
