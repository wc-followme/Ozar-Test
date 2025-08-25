import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showRowNumbers?: boolean;
  showActions?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 6,
  rows = 5,
  showRowNumbers = false,
  showActions = false,
}) => {
  const totalColumns = showRowNumbers ? columns + 1 : columns;
  const finalColumns = showActions ? totalColumns + 1 : totalColumns;

  return (
    <div className='relative block w-full overflow-x-auto overflow-y-hidden overscroll-x-auto'>
      <div className='w-full'>
        {/* Table Header Skeleton */}
        <div className='bg-[var(--background)] border-b border-[var(--border-dark)]'>
          <div className='flex'>
            {showRowNumbers && (
              <div className='w-16 py-4 px-4'>
                <Skeleton className='h-3 w-8 bg-[var(--bg-skeleton)]' />
              </div>
            )}
            {[...Array(columns)].map((_, index) => (
              <div key={index} className='flex-1 py-4 px-4'>
                <Skeleton className='h-3 w-20 bg-[var(--bg-skeleton)]' />
              </div>
            ))}
            {showActions && (
              <div className='w-20 py-4 px-4'>
                <Skeleton className='h-3 w-12 bg-[var(--bg-skeleton)]' />
              </div>
            )}
          </div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className='border-b border-[var(--border-dark)] last:border-b-0 hover:bg-[var(--background-light)] transition-colors'
          >
            <div className='flex items-center'>
              {showRowNumbers && (
                <div className='w-16 py-5 px-4'>
                  <Skeleton className='h-3 w-6 bg-[var(--bg-skeleton)]' />
                </div>
              )}
              {[...Array(columns)].map((_, colIndex) => (
                <div key={colIndex} className='flex-1 py-5 px-4'>
                  <Skeleton className='h-3 w-24 bg-[var(--bg-skeleton)]' />
                </div>
              ))}
              {showActions && (
                <div className='w-20 py-5 px-4 flex justify-center'>
                  <Skeleton className='h-8 w-2 rounded bg-[var(--bg-skeleton)]' />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
