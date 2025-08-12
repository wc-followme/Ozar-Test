'use client';

import { Avatar } from '@/components/shared/common/Avatar';
import { Star1 } from 'iconsax-react';

interface CustomerReviewBoxProps {
  profileImage?: string;
  reviewTitle: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  isLast?: boolean;
}

export const CustomerReviewBox = ({
  profileImage,
  reviewTitle,
  rating,
  reviewText,
  reviewerName,
  isLast = false,
}: CustomerReviewBoxProps) => {
  return (
    <div
      className={`flex items-start gap-4 py-4  ${!isLast ? 'border-b border-[var(--border-dark)]' : ''}`}
    >
      {/* Profile Picture */}
      <div className='flex-shrink-0'>
        <Avatar
          name={reviewerName}
          {...(profileImage && { image: profileImage })}
          width={40}
          height={40}
          className='rounded-lg'
        />
      </div>

      {/* Review Content */}
      <div className='flex-1 min-w-0'>
        {/* Review Title and Stars */}
        <div className='flex items-center gap-4 mb-2'>
          <h4 className='font-bold text-[var(--text-dark)] text-lg'>
            "{reviewTitle}"
          </h4>
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, starIndex) => (
              <Star1
                key={starIndex}
                size={16}
                className={
                  starIndex < rating
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 fill-gray-300'
                }
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className='text-[var(--text-dark)] text-sm leading-relaxed font-medium mb-2'>
          {reviewText}
        </p>

        {/* Reviewer Name */}
        <p className='text-[var(--text-dark)] font-bold text-sm'>
          — {reviewerName}
        </p>
      </div>
    </div>
  );
};
