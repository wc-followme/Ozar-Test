'use client';

import { Avatar } from '@/components/shared/common/Avatar';
import Dropdown from '@/components/shared/common/Dropdown';
import { Button } from '@/components/ui/button';
import { Edit2, Star1, Trash } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';

interface CustomerReviewBoxProps {
  profileImage?: string;
  reviewTitle: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  isLast?: boolean;
  isCurrentUser?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CustomerReviewBox = ({
  profileImage,
  reviewTitle,
  rating,
  reviewText,
  reviewerName,
  isLast = false,
  isCurrentUser = false,
  onEdit,
  onDelete,
}: CustomerReviewBoxProps) => {
  const menuOptions = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Delete', action: 'delete', icon: Trash },
  ];

  const handleAction = (action: string) => {
    if (action === 'edit' && onEdit) {
      onEdit();
    } else if (action === 'delete' && onDelete) {
      onDelete();
    }
  };

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
        <div className='flex md:items-center md:gap-4 gap-2 mb-2'>
          <div className='flex md:items-center md:flex-row flex-col md:gap-4 gap-2'>
            <h4 className='font-bold text-[var(--text-dark)] text-lg'>
              &ldquo;{reviewTitle}&rdquo;
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

          {/* Three Dots Menu - Only show for current user */}
          {isCurrentUser && (
            <Dropdown
              menuOptions={menuOptions}
              onAction={handleAction}
              trigger={
                <Button
                  variant='ghost'
                  size='sm'
                  className='!p-1 !h-8 !w-8 hover:!bg-gray-100 ml-auto'
                >
                  <MoreVertical
                    size={16}
                    className='text-gray-500 !h-6 !w-6'
                    color='var(--text-dark)'
                  />
                </Button>
              }
              align='end'
            />
          )}
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
