'use client';

import { CoverImageUploadDialog } from '@/components/shared/common/CoverImageUploadDialog';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { ProfileTopBlock } from '@/components/shared/common/ProfileTopBlock';
import { ProfileBottomBlock } from '@/components/Templates/ProfileBottomBlock';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  ROLE_IDS,
  ROUTES,
  SHARE_MESSAGES,
} from '@/constants/common';
import { apiService, GetUserResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';

interface ProfilePageProps {
  params: Promise<{
    userUuid: string;
  }>;
}

const Profile = ({ params }: ProfilePageProps) => {
  const { CDN_URL, IMAGES, BASE_URL } = APP_CONFIG;
  const { PUBLIC_COMPANY_PROFILE, PUBLIC_USER_PROFILE, USER_PROFILE } = ROUTES;
  const { URL_COPIED_SUCCESS, COPY_FAILED_ERROR, SHARE_URL_ALERT } =
    SHARE_MESSAGES;
  const { handleAuthError, user: currentUser, isAuthenticated } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const router = useRouter();

  // Unwrap params using React.use()
  const { userUuid } = use(params);

  const [user, setUser] = useState<GetUserResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverFileKey, setCoverFileKey] = useState<string>('');
  const [coverUploading, setCoverUploading] = useState(false);
  const [showCoverImageDialog, setShowCoverImageDialog] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Type guard for API response
  const isUserApiResponse = (obj: unknown): obj is GetUserResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as GetUserResponse).data === 'object'
    );
  };

  // Fetch user details function
  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    if (!userUuid) {
      setError('No user ID found');
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const response = await apiService.getUserDetails(userUuid);

      if (isUserApiResponse(response)) {
        const { data } = response;
        setUser(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) return;
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [userUuid]);

  // Redirect logged-in users to dashboard user profile
  useEffect(() => {
    if (isAuthenticated && userUuid && !isRedirecting) {
      setIsRedirecting(true);
      // Add a small delay for smooth transition
      setTimeout(() => {
        router.push(`${USER_PROFILE}/${userUuid}`);
      }, 100);
    }
  }, [isAuthenticated, userUuid, router, isRedirecting]);

  // Initial fetch when component mounts or userUuid changes
  useEffect(() => {
    // Don't fetch if redirecting
    if (isRedirecting) {
      return;
    }
    fetchUserDetails();
  }, [fetchUserDetails, isRedirecting]);

  // Listen for new reviews and update user data
  useEffect(() => {
    const handleNewReview = (event: Event) => {
      const { detail } = event as CustomEvent<
        { rating?: number } & Record<string, any>
      >;
      const newRating =
        typeof detail?.rating === 'number' ? detail.rating : undefined;

      setUser(prev => {
        if (!prev) return prev;

        const currentCount = prev?.reviewCount ?? 0;
        const currentAvg = prev?.averageRating ?? 0;

        const nextCount = currentCount + 1;
        const nextAvg =
          typeof newRating === 'number'
            ? (currentAvg * currentCount + newRating) / nextCount
            : currentAvg;

        return {
          ...prev,
          averageRating: Number(nextAvg.toFixed(1)), // Format to 1 decimal place
          reviewCount: nextCount,
          isReviewed: true,
        };
      });
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

  // Check if user can edit this user profile
  const canEditUser = useCallback(() => {
    if (!isAuthenticated || !currentUser || !user) {
      return false;
    }

    const currentUserRoleId = currentUser.role?.id;
    const currentUserCompanyId = currentUser.company?.uuid;
    const targetUserCompanyId = user.company?.uuid;

    // Admin has full access to all users
    if (currentUserRoleId === ROLE_IDS.ADMIN) {
      return true;
    }

    // Users can edit their own profile
    if (currentUser.uuid === user.uuid) {
      return true;
    }

    // Contractors can edit users in the same company
    if (currentUserRoleId === ROLE_IDS.CONTRACTOR) {
      return currentUserCompanyId === targetUserCompanyId;
    }

    return false;
  }, [isAuthenticated, currentUser, user]);

  // Check if user should see the review button
  const canShowReviewButton = useCallback(() => {
    if (!isAuthenticated || !currentUser || !user) {
      return true; // Allow reviews for non-authenticated users
    }

    const currentUserRoleId = currentUser.role?.id;
    const currentUserCompanyId = currentUser.company?.uuid;
    const targetUserCompanyId = user.company?.uuid;

    // Users cannot review themselves
    if (currentUser.uuid === user.uuid) {
      return false;
    }

    // Contractors cannot review users in their own company
    if (
      currentUserRoleId === ROLE_IDS.CONTRACTOR &&
      currentUserCompanyId === targetUserCompanyId
    ) {
      return false;
    }

    return true;
  }, [isAuthenticated, currentUser, user]);

  const handleWriteReview = () => {
    // Write review functionality
  };

  const handleEditProfile = () => {
    // Edit profile functionality
  };

  const handleRequestQuote = () => {
    // Request quote functionality
  };

  const handleShare = async () => {
    const { uuid } = user || {};
    if (!uuid) {
      return;
    }

    try {
      const publicUrl = `${BASE_URL}${PUBLIC_USER_PROFILE}/${uuid}`;
      await navigator.clipboard.writeText(publicUrl);
      showSuccessToast(URL_COPIED_SUCCESS);
    } catch (error) {
      const publicUrl = `${BASE_URL}${PUBLIC_USER_PROFILE}/${uuid}`;
      alert(`${SHARE_URL_ALERT} ${publicUrl}`);
      showErrorToast(COPY_FAILED_ERROR);
    }
  };

  const handleChangeCover = () => {
    setShowCoverImageDialog(true);
  };

  const handleCoverPhotoChange = async (file: File | null) => {
    if (!file) {
      setCoverPhotoFile(null);
      setCoverFileKey('');
      return;
    }

    setCoverPhotoFile(file);
    setCoverUploading(true);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const generatedFileName = `user_cover_${randomId}_${timestamp}.${ext}`;

      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: '',
      });

      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      const fileKey = presigned.data['fileKey'] || '';
      setCoverFileKey(fileKey);
    } catch (err: unknown) {
      if (handleAuthError(err)) return;
      showErrorToast('Failed to upload cover image');
      setCoverPhotoFile(null);
      setCoverFileKey('');
    } finally {
      setCoverUploading(false);
    }
  };

  const handleDeleteCoverPhoto = () => {
    setCoverPhotoFile(null);
    setCoverFileKey('');
  };

  const handleSaveCover = async () => {
    if (!coverFileKey) return;

    try {
      await updateUserCoverImage(coverFileKey);
      setShowCoverImageDialog(false);
    } catch (err: unknown) {
      if (handleAuthError(err)) return;
      showErrorToast('Failed to save cover image');
    }
  };

  const updateUserCoverImage = async (coverImageUrl: string) => {
    try {
      const response = await apiService.updateUser(userUuid, {
        cover_image: coverImageUrl,
      });

      if (response.statusCode === 200) {
        // Update local user state with new cover image
        setUser(prev =>
          prev ? { ...prev, cover_image: coverImageUrl } : null
        );
        showSuccessToast('Cover image updated successfully');
      } else {
        showErrorToast('Failed to update cover image');
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) return;
      showErrorToast('Failed to update cover image');
    }
  };

  const handleAddToNetwork = () => {
    // Add to network functionality
  };

  // Show loading state
  if (loading || isRedirecting) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingComponent />
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            User Not Found
          </h2>
          <p className='text-gray-600'>
            {error || 'The requested user could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    designation,
    profile_picture_url,
    cover_image,
    company,
    averageRating,
    reviewCount,
    isReviewed,
  } = user;
  const { image: companyLogo, name: companyName } = company;

  return (
    <div className=''>
      <ProfileTopBlock
        coverImage={
          cover_image ? `${CDN_URL}${cover_image}` : IMAGES.PROFILE_BLOCK_BG
        }
        logoImage={
          profile_picture_url ? `${CDN_URL}${profile_picture_url}` : ''
        }
        companyName={name}
        tagline={designation || '-'}
        rating={averageRating || 0}
        reviewCount={reviewCount || 0}
        isReviewed={isReviewed || false}
        onWriteReview={handleWriteReview}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        onAddToNetwork={handleAddToNetwork}
        showReviewButton={canShowReviewButton()}
        showEditButton={canEditUser()}
        showFiveBoxSystemButton={false}
        showRequestQuoteButton={false}
        showChangeCoverButton={canEditUser()}
        editProfileLink={`${ROUTES.USER_MANAGEMENT}/edit-user/${userUuid}`}
        isUserProfile={true}
        companyProfileLink={`${PUBLIC_COMPANY_PROFILE}/${company?.uuid}`}
        userId={userUuid}
        userCompanyName={companyName}
        userCompanyLogo={companyLogo ? `${CDN_URL}${companyLogo}` : undefined}
      />
      <ProfileBottomBlock
        userData={user}
        isCompanyOrUserProfile={true}
        userId={userUuid}
        canEditUser={canEditUser()}
      />

      {/* Cover Image Upload Dialog */}
      <CoverImageUploadDialog
        open={showCoverImageDialog}
        onOpenChange={setShowCoverImageDialog}
        coverPhotoFile={coverPhotoFile}
        onPhotoChange={handleCoverPhotoChange}
        onDeletePhoto={handleDeleteCoverPhoto}
        uploading={coverUploading}
        coverFileKey={coverFileKey}
        onSave={handleSaveCover}
      />
    </div>
  );
};

export default Profile;
