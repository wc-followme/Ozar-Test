'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { CustomerReviewBox } from '@/components/shared/common/CustomerReviewBox';
import Dropdown from '@/components/shared/common/Dropdown';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { ReviewForm } from '@/components/shared/forms/ReviewForm';
import { Button } from '@/components/ui/button';
import { customerReviews } from '@/constants/dummy-data';
import { Sort } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';

export const ReviewTab = () => {
  const [localReviews, setLocalReviews] = useState(customerReviews);
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('most-relevant');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
    { value: 'neutral', label: 'Neutral' },
  ];

  // Sort options for dropdown
  const sortOptions = [
    { label: 'Most Relevant', action: 'most-relevant' },
    { label: 'Newest', action: 'newest' },
    { label: 'Highest Rated', action: 'highest-rated' },
    { label: 'Lowest Rated', action: 'lowest-rated' },
  ];

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

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = localReviews;

    // Apply filter
    if (filterType !== 'all') {
      filtered = localReviews.filter(review => {
        if (filterType === 'positive') return review.rating >= 4;
        if (filterType === 'negative') return review.rating <= 2;
        if (filterType === 'neutral')
          return review.rating > 2 && review.rating < 4;
        return true;
      });
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return (
            new Date(b.reviewDate || 0).getTime() -
            new Date(a.reviewDate || 0).getTime()
          );
        case 'highest-rated':
          return b.rating - a.rating;
        case 'lowest-rated':
          return a.rating - b.rating;
        case 'most-relevant':
        default:
          return 0; // Keep original order for most relevant
      }
    });

    return sorted;
  }, [localReviews, filterType, sortType]);

  const handleSortAction = (action: string) => {
    setSortType(action);
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleDeleteReview = (review: any) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      setLocalReviews(prev =>
        prev.filter(review => review.id !== reviewToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleEditSubmit = (data: any) => {
    if (editingReview) {
      setLocalReviews(prev =>
        prev.map(review =>
          review.id === editingReview.id
            ? {
                ...review,
                reviewTitle: data.reviewTitle || review.reviewTitle,
                rating: parseFloat(data.rating),
                reviewText: data.review,
              }
            : review
        )
      );
      setIsEditModalOpen(false);
      setEditingReview(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingReview(null);
  };

  // Helper function to determine if review belongs to current user
  const isCurrentUserReview = (review: any) => {
    // For demo purposes, consider reviews with specific names as current user
    // In real app, this would check against actual user ID
    return (
      review.reviewerName === 'Anonymous User' ||
      review.reviewerName.includes('Anonymous')
    );
  };

  return (
    <div className='space-y-6'>
      {/* Filter and Sort Controls */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <div className='flex gap-3 w-full justify-end'>
          {/* Filter Dropdown */}
          <SelectField
            value={filterType}
            onValueChange={setFilterType}
            options={filterOptions}
            placeholder='Select filter'
            triggerClassName='!h-10 !px-6 !py-2 !text-sm !min-w-[120px] !rounded-full font-semibold'
          />

          {/* Sort Dropdown */}
          <Dropdown
            menuOptions={sortOptions}
            onAction={handleSortAction}
            trigger={
              <Button
                variant='outline'
                className='!h-10 !px-6 !py-2 !text-sm !rounded-full btn-secondary'
              >
                <Sort size={16} className='' color='currentcolor' />
                Sort
              </Button>
            }
            className='!min-w-[160px]'
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className='space-y-4'>
        {filteredAndSortedReviews.map((review, index) => (
          <CustomerReviewBox
            key={review.id}
            reviewTitle={review.reviewTitle}
            rating={review.rating}
            reviewText={review.reviewText}
            reviewerName={review.reviewerName}
            isLast={index === filteredAndSortedReviews.length - 1}
            isCurrentUser={isCurrentUserReview(review)}
            onEdit={() => handleEditReview(review)}
            onDelete={() => handleDeleteReview(review)}
          />
        ))}
      </div>

      {/* Edit Review SideSheet */}
      <SideSheet
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title='Edit Review'
        size='600px'
      >
        <ReviewForm
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
          initialData={editingReview}
        />
      </SideSheet>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        title='Delete Review'
        subtitle='Are you sure you want to delete this review? This action cannot be undone.'
        archiveButtonText='Delete'
      />
    </div>
  );
};
