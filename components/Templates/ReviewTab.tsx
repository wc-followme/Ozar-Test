'use client';

import { CustomerReviewBox } from '@/components/shared/common/CustomerReviewBox';
import { customerReviews } from '@/constants/dummy-data';
import { useEffect, useState } from 'react';

export const ReviewTab = () => {
  const [localReviews, setLocalReviews] = useState(customerReviews);

  // Listen for new reviews from the ReviewForm submission
  useEffect(() => {
    const handleNewReview = (event: CustomEvent) => {
      const newReview = event.detail;
      setLocalReviews(prev => [...prev, newReview]);
    };

    window.addEventListener(
      'newReviewSubmitted',
      handleNewReview as EventListener
    );

    return () => {
      window.removeEventListener(
        'newReviewSubmitted',
        handleNewReview as EventListener
      );
    };
  }, []);

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {localReviews.map((review, index) => (
          <CustomerReviewBox
            key={review.id}
            reviewTitle={review.reviewTitle}
            rating={review.rating}
            reviewText={review.reviewText}
            reviewerName={review.reviewerName}
            isLast={index === localReviews.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
