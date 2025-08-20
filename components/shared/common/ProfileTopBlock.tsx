'use client';

import SideSheet from '@/components/shared/common/SideSheet';
import {
  ReviewForm,
  ReviewFormData,
} from '@/components/shared/forms/ReviewForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { IconShare, IconStar, IconStarFilled } from '@tabler/icons-react';
import { DocumentText, Edit2, Star1 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  APP_CONFIG,
  PROFILE_BUTTON_LABELS,
  PROFILE_DEFAULTS,
  ROUTES,
} from '../../../constants/common';

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
  companyId?: string;
  userId?: string;
  isReviewed?: boolean;
  userCompanyName?: string;
  userCompanyLogo?: string | undefined;
}

export const ProfileTopBlock = ({
  coverImage = APP_CONFIG.IMAGES.PROFILE_BLOCK_BG,
  logoImage = APP_CONFIG.IMAGES.LOGO,
  companyName = PROFILE_DEFAULTS.COMPANY_NAME,
  tagline = PROFILE_DEFAULTS.TAGLINE,
  rating = PROFILE_DEFAULTS.RATING,
  reviewCount = PROFILE_DEFAULTS.REVIEW_COUNT,
  onEditProfile,
  onRequestQuote,
  onShare,
  onChangeCover,
  onAddToNetwork,
  showReviewButton = PROFILE_DEFAULTS.SHOW_REVIEW_BUTTON,
  showEditButton = PROFILE_DEFAULTS.SHOW_EDIT_BUTTON,
  showRequestQuoteButton = PROFILE_DEFAULTS.SHOW_REQUEST_QUOTE_BUTTON,
  showShareButton = PROFILE_DEFAULTS.SHOW_SHARE_BUTTON,
  showChangeCoverButton = PROFILE_DEFAULTS.SHOW_CHANGE_COVER_BUTTON,
  showFiveBoxSystemButton = PROFILE_DEFAULTS.SHOW_FIVE_BOX_SYSTEM_BUTTON,
  editProfileLink = PROFILE_DEFAULTS.EDIT_PROFILE_LINK,
  fiveBoxSystemLink = PROFILE_DEFAULTS.FIVE_BOX_SYSTEM_LINK,
  isUserProfile = PROFILE_DEFAULTS.IS_USER_PROFILE,
  companyProfileLink = PROFILE_DEFAULTS.COMPANY_PROFILE_LINK,
  companyId,
  userId,
  isReviewed = PROFILE_DEFAULTS.IS_REVIEWED,
  userCompanyName,
  userCompanyLogo,
}: ProfileTopBlockProps) => {
  const { IMAGES, CDN_URL } = APP_CONFIG;
  const { AUTH_LOGIN } = ROUTES;
  const {
    WRITE_REVIEW,
    FIVE_BOX_SYSTEM,
    SHARE,
    EDIT_PROFILE,
    REQUEST_QUOTE,
    ADD_TO_NETWORK,
    CHANGE_COVER,
  } = PROFILE_BUTTON_LABELS;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      // Redirect to login page if user is not authenticated
      router.push(AUTH_LOGIN);
      return;
    } else {
      setIsReviewFormOpen(true);
    }
  };

  const handleReviewSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      // Check if we have the required ID based on profile type
      const targetId = isUserProfile ? userId : companyId;
      if (!targetId) {
        setIsSubmitting(false);
        return;
      }

      // Destructure form data
      const { title, rating, review } = data;

      // Call the appropriate API based on profile type
      let response;
      if (isUserProfile) {
        // Create user review
        const reviewData = {
          user_id: targetId,
          title,
          rating: parseFloat(rating),
          review,
        };
        response = await apiService.createUserReview(reviewData);
      } else {
        // Create company review
        const reviewData = {
          company_id: targetId,
          title,
          rating: parseFloat(rating),
          review,
        };
        response = await apiService.createCompanyReview(reviewData);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Use actual API response data for UI update
        const {
          uuid,
          reviewer_name,
          rating: reviewRating,
          review,
          created_at,
          reviewer_images,
        } = response.data;

        const newReview = {
          id: uuid,
          reviewTitle: title || `Review by ${reviewer_name}`,
          rating: parseFloat(reviewRating),
          reviewText: review,
          reviewerName: reviewer_name,
          reviewDate: created_at,
          profileImage: reviewer_images
            ? `${CDN_URL}${reviewer_images}`
            : undefined,
        };

        // Dispatch custom event to notify ReviewTab and profile
        const event = new CustomEvent('newReviewSubmitted', {
          detail: {
            ...newReview,
            rating: parseFloat(reviewRating), // Ensure rating is passed for average calculation
          },
        });
        window.dispatchEvent(event);

        // Close the side sheet after successful submission
        setIsReviewFormOpen(false);
      } else {
      }
    } catch (error) {
    } finally {
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
            {CHANGE_COVER}
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
                                src={userCompanyLogo || IMAGES.LOGO}
                                width={24}
                                height={24}
                                className='object-contain'
                                alt='logo'
                              />
                              {userCompanyName || 'Envision Construction'}
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
                          {isReviewed ? (
                            <IconStarFilled
                              size='32'
                              className='text-yellow-500 fill-yellow-500'
                            />
                          ) : (
                            <IconStar size='32' color='currentcolor' />
                          )}
                          <span className='hidden sm:inline'>
                            {WRITE_REVIEW}
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
                          <span className='hidden sm:inline'>
                            {FIVE_BOX_SYSTEM}
                          </span>
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
                          <span className='hidden sm:inline'>{SHARE}</span>
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
                          <span className='hidden sm:inline'>
                            {EDIT_PROFILE}
                          </span>
                        </Link>
                      )}

                      {showRequestQuoteButton && (
                        <Button
                          variant='secondary'
                          className='btn-primary gap-1 !py-[10px] sm:!w-auto !h-9 rounded-full'
                          onClick={handleRequestQuote}
                        >
                          {REQUEST_QUOTE}
                        </Button>
                      )}

                      {isUserProfile && (
                        <Button
                          variant='secondary'
                          className='btn-primary gap-1 !py-[10px] sm:!w-auto !h-9 rounded-full'
                          onClick={handleAddToNetwork}
                        >
                          {ADD_TO_NETWORK}
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
