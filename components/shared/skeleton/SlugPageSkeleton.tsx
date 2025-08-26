import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

interface SlugPageSkeletonProps {
  breadcrumbData: BreadcrumbItem[];
}

export const SlugPageSkeleton = ({ breadcrumbData }: SlugPageSkeletonProps) => {
  return (
    <section className=''>
      {/* Breadcrumb with button */}
      <div className='mb-6 flex flex-wrap gap-4 items-center'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        <Skeleton className='h-10 w-32 ml-auto shrink-0 bg-[var(--bg-skeleton)] rounded-full' />
      </div>

      {/* Main content area */}
      <div className='p-5 sm:p-6 lg:p-8 xl:p-10 rounded-[20px] bg-[var(--card-background)]'>
        <div className='flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-6 items-start'>
          {/* Left Column - Form */}
          <div className='flex-1 w-full'>
            <div className='space-y-6'>
              {/* Form header */}
              <div className='flex flex-col gap-2 items-center mb-10'>
                <Skeleton className='h-8 w-48 bg-[var(--bg-skeleton)] mb-4' />
                <Skeleton className='h-4 w-1/2 bg-[var(--bg-skeleton)]' />
              </div>

              {/* Form fields grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4'>
                {[...Array(8)].map((_, index) => (
                  <div key={index} className='space-y-2'>
                    <Skeleton className='h-4 w-1/3 bg-[var(--bg-skeleton)]' />
                    <Skeleton className='h-12 w-full bg-[var(--bg-skeleton)] rounded-lg' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with Manage Fields button */}
        <div className='flex justify-end mt-4 sm:mt-6'>
          <Skeleton className='h-10 w-36 bg-[var(--bg-skeleton)] rounded-full' />
        </div>
      </div>
    </section>
  );
};
