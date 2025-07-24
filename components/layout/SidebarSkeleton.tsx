'use client';
import { ScrollArea } from '../ui/scroll-area';

export function SidebarSkeleton() {
  return (
    <aside className='hidden lg:block transition-all duration-300 ease h-full bg-[var(--white-background)] sticky top-0'>
      <div className='flex flex-col h-screen max-h-[100dvh]'>
        {/* Burger Menu Skeleton */}
        <div className='w-[60px] h-[60px] flex items-center px-[18px] mx-4 mt-2'>
          <div className='w-[24px] h-[17px] flex flex-col justify-between'>
            <span className='block h-[2px] bg-gray-300 dark:bg-gray-600 rounded animate-pulse'></span>
            <span className='block h-[2px] bg-gray-300 dark:bg-gray-600 rounded animate-pulse'></span>
            <span className='block h-[2px] bg-gray-300 dark:bg-gray-600 rounded animate-pulse'></span>
          </div>
        </div>

        {/* Sidebar Links Skeleton */}
        <div className='flex-1 min-h-0'>
          <ScrollArea className='h-full w-full px-4'>
            <ul className='py-2 [&>li+li]:mt-0.5'>
              {Array.from({ length: 8 }).map((_, index) => (
                <li key={index}>
                  <div className='flex items-center flex-nowrap w-full px-[18px] rounded-[16px] h-[60px]'>
                    <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse'></div>
                    <div className='ml-2 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20'></div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
