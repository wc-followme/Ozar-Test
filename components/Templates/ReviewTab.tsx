'use client';

import { CustomerReviewBox } from '@/components/shared/common/CustomerReviewBox';
import Dropdown from '@/components/shared/common/Dropdown';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/constants/common';
import { apiService } from '@/lib/api';
import { getCompanyId } from '@/lib/utils';
import { Sort } from 'iconsax-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Rating filter constants with range values
const RATING_FILTERS = {
  POSITIVE: { min: 4, max: 5, range: '4-5' },
  NEGATIVE: { min: 1, max: 2.5, range: '1-2.5' },
  NEUTRAL: { min: 3, max: 3.5, range: '3-3.5' },
} as const;

interface ReviewTabProps {
  companyId?: string;
}

export const ReviewTab = ({ companyId }: ReviewTabProps) => {
  // Destructure APP_CONFIG
  const { CDN_URL } = APP_CONFIG;

  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'positive', label: 'Positive (4-5 stars)' },
    { value: 'negative', label: 'Negative (1-2.5 stars)' },
    { value: 'neutral', label: 'Neutral (3-3.5 stars)' },
  ];

  // Sort options for dropdown
  const sortOptions = [
    { label: 'Newest', action: 'newest' },
    { label: 'Oldest', action: 'oldest' },
    { label: 'Highest Rated', action: 'highest-rated' },
    { label: 'Lowest Rated', action: 'lowest-rated' },
  ];

  // Fetch reviews from API
  const fetchReviews = useCallback(
    async (targetPage = 1, append = false) => {
      try {
        if (targetPage === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const currentCompanyId = companyId || getCompanyId();

        if (!currentCompanyId) {
          setError('No company ID available');
          setLoading(false);
          return;
        }

        // Map sort type to API parameters
        let sortBy = 'created_at';
        let sortOrder: 'ASC' | 'DESC' = 'DESC';

        switch (sortType) {
          case 'newest':
            sortBy = 'created_at';
            sortOrder = 'DESC';
            break;
          case 'oldest':
            sortBy = 'created_at';
            sortOrder = 'ASC';
            break;
          case 'highest-rated':
            sortBy = 'rating';
            sortOrder = 'DESC';
            break;
          case 'lowest-rated':
            sortBy = 'rating';
            sortOrder = 'ASC';
            break;
        }

        // Handle rating range filtering (e.g., "1-2.5", "3-3.5", "4-5")
        let ratingFilter: string | undefined;
        if (filterType !== 'all') {
          const filterRange =
            filterType === 'positive'
              ? RATING_FILTERS.POSITIVE
              : filterType === 'negative'
                ? RATING_FILTERS.NEGATIVE
                : filterType === 'neutral'
                  ? RATING_FILTERS.NEUTRAL
                  : null;

          if (filterRange) {
            ratingFilter = filterRange.range;
          }
        }

        const response = await apiService.fetchCompanyReviews({
          page: targetPage,
          limit: 10,
          company_id: currentCompanyId,
          ...(ratingFilter && { rating: ratingFilter }),
          sortBy,
          sortOrder,
        });

        if (response.statusCode === 200 && response.data) {
          const { data: responseData } = response;
          const { data: reviewsData, totalPages } = responseData;

          const newReviews = reviewsData.map((review: any) => {
            const {
              uuid,
              title,
              rating,
              review: reviewText,
              reviewer_name,
              reviewer_uuid,
              reviewer_images,
              created_at,
            } = review;
            return {
              id: uuid,
              reviewTitle: title || `Review by ${reviewer_name}`,
              rating,
              reviewText,
              reviewerName: reviewer_name,
              reviewDate: created_at,
              reviewerId: reviewer_uuid,
              profileImage: reviewer_images
                ? `${CDN_URL}${reviewer_images}`
                : undefined,
            };
          });

          setLocalReviews(prev =>
            append ? [...prev, ...newReviews] : newReviews
          );

          // Check if there are more pages based on totalPages from API response
          const hasMorePages = totalPages > targetPage;
          setHasMore(hasMorePages);
          setPage(targetPage);
        } else {
          throw new Error(response.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [companyId, filterType, sortType]
  );

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  // Listen for new reviews from the ReviewForm submission
  useEffect(() => {
    const handleNewReview = (event: CustomEvent) => {
      const { detail: newReview } = event;
      setLocalReviews(prev => [newReview, ...prev]);
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

  // Load more reviews
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchReviews(page + 1, true);
    }
  }, [fetchReviews, page, hasMore, isLoadingMore]);

  // Set up intersection observer for infinite scrolling (same as TeamTab)
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    // Add a small timeout to ensure the DOM element is rendered
    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleSortAction = (action: string) => {
    setSortType(action);
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

      {/* Loading State */}
      {loading && (
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>{error}</p>
            <Button onClick={() => fetchReviews(1, false)} variant='outline'>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <div className='space-y-4'>
          {localReviews.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-600'>No reviews found.</p>
            </div>
          ) : (
            <>
              {localReviews.map((review: any, index: number) => {
                const {
                  id,
                  profileImage,
                  reviewTitle,
                  rating,
                  reviewText,
                  reviewerName,
                } = review;

                return (
                  <CustomerReviewBox
                    key={id}
                    profileImage={profileImage}
                    reviewTitle={reviewTitle}
                    rating={rating}
                    reviewText={reviewText}
                    reviewerName={reviewerName}
                    isLast={index === localReviews.length - 1}
                    isCurrentUser={false}
                  />
                );
              })}

              {/* Infinite scroll trigger element (same as TeamTab) */}
              {hasMore && (
                <div ref={loadMoreRef} className='flex justify-center pt-4'>
                  {isLoadingMore && (
                    <div className='text-center py-4'>
                      <LoadingComponent variant='inline' size='md' text='' />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
