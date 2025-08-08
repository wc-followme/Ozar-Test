import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';

interface SlugPageSkeletonProps {
  breadcrumbData: BreadcrumbItem[];
}

export const SlugPageSkeleton = ({ breadcrumbData }: SlugPageSkeletonProps) => {
  return (
    <section className=''>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbData} />
      </div>

      {/* Loading skeleton */}
      <div className='p-5 sm:p-6 lg:p-8 xl:p-10 rounded-[20px] bg-[var(--card-background)]'>
        <div className='flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-6 items-start'>
          <div className='flex-1 w-full'>
            {/* Form skeleton */}
            <div className='space-y-6'>
              <div className='h-8 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4'></div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-1/3'></div>
                    <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
