'use client';

import SideSheet from '@/components/shared/common/SideSheet';
import {
  ReviewForm,
  ReviewFormData,
} from '@/components/shared/forms/ReviewForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconShare, IconStar, IconStarFilled } from '@tabler/icons-react';
import { DocumentText, Edit2, Star1 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProfileTopBlockProps {
  coverImage?: string;
  logoImage?: string;
  companyName?: string;
  tagline?: string;
  rating?: number;
  reviewCount?: number;
  onWriteReview?: () => void;
  onEditProfile?: () => void;
  onRequestQuote?: () => void;
  onShare?: () => void;
  onChangeCover?: () => void;
  onAddToNetwork?: () => void;
  showReviewButton?: boolean;
  showEditButton?: boolean;
  showRequestQuoteButton?: boolean;
  showShareButton?: boolean;
  showChangeCoverButton?: boolean;
  showFiveBoxSystemButton?: boolean;
  editProfileLink?: string;
  fiveBoxSystemLink?: string;
  isUserProfile?: boolean;
  companyProfileLink?: string;
}

export const ProfileTopBlock = ({
  coverImage = '/images/profile-block-bg.png',
  logoImage = '/images/logo.svg',
  companyName = 'Envision Construction',
  tagline = 'Construction Company',
  rating = 4.0,
  reviewCount = 5,
  onWriteReview,
  onEditProfile,
  onRequestQuote,
  onShare,
  onChangeCover,
  onAddToNetwork,
  showReviewButton = true,
  showEditButton = true,
  showRequestQuoteButton = true,
  showShareButton = true,
  showChangeCoverButton = true,
  showFiveBoxSystemButton = true,
  editProfileLink = '/company-profile/edit-profile',
  fiveBoxSystemLink = '/company-profile/five-box-system',
  isUserProfile = false,
  companyProfileLink = '/company-profile',
}: ProfileTopBlockProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWriteReview = () => {
    if (onWriteReview) {
      onWriteReview();
    } else {
      setIsReviewFormOpen(true);
    }
  };

  const handleReviewSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting review:', data);
      // Add your API call here to save the review

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new review object
      const newReview = {
        id: `review-${Date.now()}`,
        reviewTitle: `Review ${Date.now()}`,
        rating: parseFloat(data.rating),
        reviewText: data.review,
        reviewerName: 'Anonymous User', // You can get this from user context
        reviewDate: new Date().toISOString(),
      };

      // Dispatch custom event to notify ReviewTab
      const event = new CustomEvent('newReviewSubmitted', {
        detail: newReview,
      });
      window.dispatchEvent(event);

      // Close the side sheet after successful submission
      setIsReviewFormOpen(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setIsReviewFormOpen(false);
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  const handleRequestQuote = () => {
    if (onRequestQuote) {
      onRequestQuote();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  const handleChangeCover = () => {
    if (onChangeCover) {
      onChangeCover();
    }
  };

  const handleAddToNetwork = () => {
    if (onAddToNetwork) {
      onAddToNetwork();
    }
  };

  return (
    <div className='rounded-[10px]'>
      {/* Cover Image Section */}
      <div className='relative w-full lg:aspect-[5.25/1] min-h-[250px] lg:min-h-max'>
        {/* Cover Image */}
        <div className='w-full h-full'>
          <Image
            src={coverImage}
            alt='cover'
            fill
            className='object-cover rounded-tl-[10px] rounded-tr-[10px]'
            priority
          />
        </div>

        {/* Change Cover Button */}
        {showChangeCoverButton && (
          <Button
            variant='secondary'
            size='sm'
            className='absolute top-4 right-4 btn-secondary !bg-[var(--white-background)] !px-[24px] text-[14px] !py-[10px] !h-9'
            onClick={handleChangeCover}
          >
            Change Cover
          </Button>
        )}
      </div>

      {/* Profile Section */}
      <div className='relative bg-[var(--white-background)]'>
        <div className='mx-auto'>
          <Card className='px-4 lg:pl-[52px] lg:pr-6 py-6 border-0'>
            <div className='flex flex-col lg:flex-row gap-4 md:gap-6 -mt-[70px]'>
              {/* Logo */}
              <div className='relative'>
                <div className='w-[150px] h-[150px] rounded-[10px] border-2 border-transparent bg-[var(--card-background)] overflow-hidden'>
                  <Image
                    src={logoImage}
                    height={150}
                    width={150}
                    alt={`${companyName} Logo`}
                    className='w-full h-full object-contain'
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className='flex-1 min-w-0 w-full lg:pt-[70px]'>
                <div className='space-y-2'>
                  <h1 className='text-[var(--text-dark)] text-2xl font-bold leading-[18px] tracking-[0%]'>
                    {companyName}
                  </h1>
                  <div className='flex flex-wrap items-end gap-4'>
                    <div>
                      <p className='text-[var(--text-secondary)] text-base font-normal leading-[18px] tracking-[0%] mb-2'>
                        {tagline}
                      </p>

                      {/* Rating */}
                      {isUserProfile ? (
                        <div className='flex items-center gap-4'>
                          <div className='flex flex-wrap items-center gap-4'>
                            <Link
                              href={companyProfileLink}
                              className='text-[var(--text-dark)] flex items-center gap-2 text-base font-bold leading-[18px] tracking-[0%] hover:text-[var(--primary)] transition-colors'
                            >
                              <Image
                                src={'/images/logo.svg'}
                                width={24}
                                height={24}
                                className='object-contain'
                                alt='logo'
                              />
                              Envision Construction
                            </Link>
                            <div className='w-px h-6 bg-[var(--border-dark)]'></div>
                            <div className='flex items-center gap-2'>
                              <span className='text-[var(--text-dark)] text-base font-bold leading-[18px] tracking-[0%]'>
                                {rating}
                              </span>
                              <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, index) => (
                                  <IconStarFilled
                                    key={index}
                                    size='18'
                                    className={
                                      index < Math.floor(rating)
                                        ? 'text-yellowbrand fill-yellowbrand'
                                        : 'text-placeholdergray fill-placeholdergray'
                                    }
                                  />
                                ))}
                              </div>
                              <span className='text-[var(--text-dark)] text-sm'>
                                {reviewCount} Reviews
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <span className='text-[var(--text-dark)] text-base font-bold leading-[18px] tracking-[0%]'>
                            {rating}
                          </span>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, index) => (
                              <Star1
                                key={index}
                                size='16'
                                className={
                                  index < Math.floor(rating)
                                    ? 'text-yellowbrand fill-yellowbrand'
                                    : 'text-placeholdergray fill-placeholdergray'
                                }
                              />
                            ))}
                          </div>
                          <span className='text-gray-500 text-sm'>
                            {reviewCount} Reviews
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-3 w-full md:w-auto ml-auto justify-end mt-4 lg:mt-0'>
                      {showReviewButton && (
                        <Button
                          variant='secondary'
                          className='btn-secondary text-[14px] gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                          onClick={handleWriteReview}
                        >
                          <IconStar size='32' color='currentcolor' />
                          <span className='hidden sm:inline'>
                            Write a Review
                          </span>
                        </Button>
                      )}

                      {showFiveBoxSystemButton && (
                        <Link
                          href={fiveBoxSystemLink}
                          className='btn-secondary text-[14px] gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                        >
                          <DocumentText
                            size='18'
                            color='var(--text-dark)'
                            className='[&_path]:!stroke-[2px]'
                          />
                          <span className='hidden sm:inline'>5-box system</span>
                        </Link>
                      )}

                      {showShareButton && (
                        <Button
                          variant='secondary'
                          className='btn-secondary gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                          onClick={handleShare}
                        >
                          <IconShare
                            size='18'
                            color='var(--text-dark)'
                            className='[&_path]:!stroke-[2px]'
                          />
                          <span className='hidden sm:inline'>Share</span>
                        </Button>
                      )}

                      {showEditButton && (
                        <Link
                          href={editProfileLink}
                          className='btn-secondary gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !text-sm !w-9 sm:!w-auto !h-9 rounded-full'
                          onClick={handleEditProfile}
                        >
                          <Edit2
                            size='18'
                            color='var(--text-dark)'
                            className='[&_path]:!stroke-[2px]'
                          />
                          <span className='hidden sm:inline'>Edit Profile</span>
                        </Link>
                      )}

                      {showRequestQuoteButton && (
                        <Button
                          variant='secondary'
                          className='btn-primary gap-1 !py-[10px] sm:!w-auto !h-9 rounded-full'
                          onClick={handleRequestQuote}
                        >
                          Request Quote
                        </Button>
                      )}

                      {isUserProfile && (
                        <Button
                          variant='secondary'
                          className='btn-primary gap-1 !py-[10px] sm:!w-auto !h-9 rounded-full'
                          onClick={handleAddToNetwork}
                        >
                          Add to Network
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Review Form SideSheet */}
      <SideSheet
        open={isReviewFormOpen}
        onOpenChange={setIsReviewFormOpen}
        title='Write a Review'
        size='600px'
      >
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={handleCancelReview}
          isLoading={isSubmitting}
        />
      </SideSheet>
    </div>
  );
};
