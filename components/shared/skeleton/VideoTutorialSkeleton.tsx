import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const VideoTutorialSkeleton: React.FC = () => {
  return (
    <div className='space-y-4'>
      {/* Header: Breadcrumb + Add Videos button */}
      <div className='flex md:flex-row flex-col md:items-center gap-4'>
        {/* Breadcrumb skeleton */}
        <div className='flex items-center gap-2 w-full md:w-auto'>
          <Skeleton className='h-4 w-20 bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-4 w-3 bg-[var(--bg-skeleton)] rounded-full' />
          <Skeleton className='h-4 w-28 bg-[var(--bg-skeleton)]' />
          <Skeleton className='h-4 w-3 bg-[var(--bg-skeleton)] rounded-full' />
          <Skeleton className='h-4 w-32 bg-[var(--bg-skeleton)]' />
        </div>

        {/* Add Videos button skeleton */}
        <Skeleton className='h-9 w-28 ml-auto rounded-full bg-[var(--bg-skeleton)]' />
      </div>

      {/* Grid of video preview cards */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className='rounded-2xl bg-[--card-background] border border-[var(--border-dark)] overflow-hidden shadow-sm'
          >
            <div className='relative'>
              <AspectRatio ratio={10 / 4} className='rounded-t'>
                <Skeleton className='w-full h-full bg-[var(--bg-skeleton)] !rounded-none' />
              </AspectRatio>
              {/* Duration badge */}
              <span className='absolute bottom-2 left-2'>
                <Skeleton className='h-5 w-12 rounded-t bg-[var(--bg-skeleton)] ' />
              </span>
              {/* Center play button */}
              <span className='absolute inset-0 flex items-center justify-center'>
                <Skeleton className='w-11 h-11 rounded-full bg-[var(--bg-skeleton)]' />
              </span>
            </div>
            <div className='flex items-center justify-between p-4'>
              <Skeleton className='h-3 w-3/5 bg-[var(--bg-skeleton)]' />
              <Skeleton className='w-2 h-5 rounded bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTutorialSkeleton;
