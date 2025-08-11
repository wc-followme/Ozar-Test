'use client';

import { Star1 } from 'iconsax-react';

export const ReviewTab = () => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
        Customer Reviews
      </h3>
      <div className='space-y-4'>
        {[
          {
            name: 'Alice Johnson',
            rating: 5,
            date: '2024-01-15',
            comment:
              'Excellent work! The team was professional and completed the project on time.',
          },
          {
            name: 'Bob Smith',
            rating: 4,
            date: '2024-01-10',
            comment: 'Great quality work. Very satisfied with the results.',
          },
          {
            name: 'Carol Davis',
            rating: 5,
            date: '2024-01-05',
            comment: 'Outstanding service and attention to detail.',
          },
          {
            name: 'David Wilson',
            rating: 4,
            date: '2024-01-01',
            comment: 'Good communication throughout the project.',
          },
        ].map((review, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-[var(--border-dark)] p-4'
          >
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-semibold text-[var(--text-dark)]'>
                {review.name}
              </h4>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, starIndex) => (
                  <Star1
                    key={starIndex}
                    size='16'
                    className={
                      starIndex < review.rating
                        ? 'text-yellowbrand fill-yellowbrand'
                        : 'text-placeholdergray fill-placeholdergray'
                    }
                  />
                ))}
              </div>
            </div>
            <p className='text-[var(--text-secondary)] text-sm mb-2'>
              {review.comment}
            </p>
            <p className='text-[var(--text-secondary)] text-xs'>
              {review.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
