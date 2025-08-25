import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface TemplateCardSkeletonProps {
  type: 'disclaimer' | 'service-option' | 'tools' | 'estimate';
  showActions?: boolean;
}

const TemplateCardSkeleton: React.FC<TemplateCardSkeletonProps> = ({
  type,
  showActions = true,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'disclaimer':
      case 'service-option':
        return (
          <>
            <div className='flex justify-between items-start'>
              <div className='flex-1 max-w-[60%]'>
                <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)] mb-2' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
              <div className='ml-auto'>
                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)] mb-2' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
            </div>
          </>
        );

      case 'tools':
        return (
          <>
            <div className='flex justify-between items-start mb-3'>
              <div className='max-w-[60%] flex-1'>
                <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)] mb-2' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
              <div className='ml-auto'>
                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)] mb-2' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
            </div>
            <div>
              <Skeleton className='h-3 w-16 bg-[var(--bg-skeleton)] mb-2' />
              <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)]' />
            </div>
          </>
        );

      case 'estimate':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-start'>
              <div>
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)] mb-2' />
                <Skeleton className='h-3 w-28 bg-[var(--bg-skeleton)]' />
              </div>
              <div className='ml-auto'>
                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)] mb-3' />
                <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
              </div>
            </div>
            <div className='flex justify-start mt-auto'>
              <Skeleton className='h-8 w-full rounded-full bg-[var(--bg-skeleton)]' />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='bg-[var(--card-background)] rounded-[10px] shadow-sm border border-[var(--border-dark)] p-4'>
      <div className='flex justify-between items-start mb-4'>
        <Skeleton className='h-3 w-32 bg-[var(--bg-skeleton)] mb-4' />
        {showActions && (
          <Skeleton className='h-6 w-2 rounded bg-[var(--bg-skeleton)]' />
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default TemplateCardSkeleton;
