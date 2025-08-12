'use client';

import { CustomerReviewBox } from '@/components/shared/common/CustomerReviewBox';
import { customerReviews } from '@/constants/dummy-data';

export const ReviewTab = () => {
  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {customerReviews.map((review, index) => (
          <CustomerReviewBox
            key={review.id}
            reviewTitle={review.reviewTitle}
            rating={review.rating}
            reviewText={review.reviewText}
            reviewerName={review.reviewerName}
            isLast={index === customerReviews.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
