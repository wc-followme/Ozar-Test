'use client';

import { CompanyBottomBlock } from '@/components/Templates/CompanyBottomBlock';
import { CoverImageUploadDialog } from '@/components/shared/common/CoverImageUploadDialog';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { ProfileTopBlock } from '@/components/shared/common/ProfileTopBlock';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  JOB_MESSAGES,
  JOB_PRIVACY,
  ROLE_IDS,
  ROUTES,
  SHARE_MESSAGES,
  UPLOAD_PURPOSES,
} from '@/constants/common';
import { apiService, GetCompanyResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FIVE_BOX_DATA } from '../five-box-system/five-box-constants';

interface CompanyProfileProps {
  params: {
    companyId: string;
  };
}

const CompanyProfile = ({ params }: CompanyProfileProps) => {
  const { CDN_URL, IMAGES, BASE_URL } = APP_CONFIG;
  const {
    PUBLIC_COMPANY_PROFILE,
    EDIT_COMPANY_PROFILE,
    FIVE_BOX_SYSTEM,
    HOME_OWNER,
  } = ROUTES;
  const { URL_COPIED_SUCCESS, COPY_FAILED_ERROR } = SHARE_MESSAGES;
  const { QUOTE_CREATE_SUCCESS, QUOTE_CREATE_ERROR } = JOB_MESSAGES;
  const { PUBLIC } = JOB_PRIVACY;
  const router = useRouter();
  const { companyId } = params;
  const { handleAuthError, user, isAuthenticated } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  const [company, setCompany] = useState<GetCompanyResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverFileKey, setCoverFileKey] = useState<string>('');

  // Check if user can edit this company profile
  const canEditCompany = useCallback(() => {
    if (!isAuthenticated || !user || !company) {
      return false;
    }

    const userRoleId = user.role?.id;

    // Admin has full access to all companies
    if (userRoleId === ROLE_IDS.ADMIN) {
      return true;
    }

    // Contractor needs to belong to the same company
    if (userRoleId === ROLE_IDS.CONTRACTOR) {
      const userCompanyId = user.company?.uuid;
      const currentCompanyId = company.uuid;
      return userCompanyId === currentCompanyId;
    }

    return false;
  }, [isAuthenticated, user, company]);

  // Check if user should see the review button
  const canShowReviewButton = useCallback(() => {
    if (!isAuthenticated || !user || !company) {
      return true; // Allow reviews for non-authenticated users
    }

    const userRoleId = user.role?.id;
    const userCompanyId = user.company?.uuid;
    const currentCompanyId = company.uuid;

    // Contractors cannot review their own company
    if (
      userRoleId === ROLE_IDS.CONTRACTOR &&
      userCompanyId === currentCompanyId
    ) {
      return false;
    }

    return true;
  }, [isAuthenticated, user, company]);

  // Type guard for API response
  const isCompanyApiResponse = (obj: unknown): obj is GetCompanyResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as GetCompanyResponse).data === 'object'
    );
  };

  // Fetch company details function
  const fetchCompanyDetails = useCallback(async () => {
    setLoading(true);
    if (!companyId) {
      setError('No company ID found');
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const response = await apiService.getCompanyDetails(companyId);

      if (isCompanyApiResponse(response)) {
        const { data } = response;
        setCompany(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: unknown) {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // Initial fetch when component mounts or companyId changes
  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  // Listen for new review submissions and update local company data (no API call)
  useEffect(() => {
    const handleNewReview = (event: Event) => {
      const { detail } = event as CustomEvent<
        { rating?: number } & Record<string, any>
      >;
      const newRating =
        typeof detail?.rating === 'number' ? detail.rating : undefined;

      setCompany(prev => {
        if (!prev) return prev;

        const currentCount =
          (prev as any)?.reviewCount ?? (prev as any)?.review_count ?? 0;
        const currentAvg =
          (prev as any)?.averageRating ?? (prev as any)?.rating ?? 0;

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
        } as typeof prev;
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

  const handleEditProfile = () => {
    // Edit profile functionality
  };

  const handleRequestQuote = async () => {
    const { uuid } = company || {};
    if (!uuid) {
      return;
    }

    try {
      // Fetch box settings for the company
      const boxSettingsResponse = await apiService.getBoxSettings({
        company_id: uuid,
      });

      const { data: boxSettings } = boxSettingsResponse;
      const { default_selected_json, question_json: questionJson } =
        boxSettings || {};

      // Create job_boxes_step array based on enabled boxes
      const enabledBoxes = (default_selected_json || [])
        .filter((box: any) => box.enabled)
        .map((box: any) => {
          const fiveBoxItem = FIVE_BOX_DATA.find(item => item.id === box.id);
          return fiveBoxItem ? fiveBoxItem.step : null;
        })
        .filter(Boolean); // Remove null values

      // Create job payload
      const jobPayload = {
        job_privacy: PUBLIC,
        job_boxes_step: enabledBoxes, // Keep as array of step values
        company_id: uuid,
        question_json: questionJson,
      };

      // Create the job
      const response = await apiService.createJob(jobPayload);
      const { data: responseData } = response;

      if (responseData) {
        showSuccessToast(QUOTE_CREATE_SUCCESS);
        // Redirect to home-owner page with job UUID
        const jobUuid = responseData.uuid;

        router.push(`${HOME_OWNER}/${jobUuid}`);
      } else {
        showErrorToast(QUOTE_CREATE_ERROR);
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      showErrorToast(QUOTE_CREATE_ERROR);
    }
  };

  const handleShare = async () => {
    const { uuid } = company || {};
    if (!uuid) {
      return;
    }

    try {
      // Construct the public company profile URL
      const publicUrl = `${BASE_URL}${PUBLIC_COMPANY_PROFILE}/${uuid}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(publicUrl);

      showSuccessToast(URL_COPIED_SUCCESS);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : COPY_FAILED_ERROR;
      showErrorToast(errorMessage);
    }
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
      const { name: fileName, type: fileType, size: fileSize } = file;
      const ext = fileName.split('.').pop() || 'png';
      const timestamp = Date.now();
      const companyUuid = uuidv4();
      const generatedFileName = `company_cover_${companyUuid}_${timestamp}.${ext}`;
      const { COMPANY_COVER_IMAGE } = UPLOAD_PURPOSES;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType,
        fileSize,
        purpose: COMPANY_COVER_IMAGE,
        customPath: '',
      });
      const { data: presignedData } = presigned;
      const { uploadUrl, fileKey } = presignedData;
      await uploadFileToPresignedUrl(uploadUrl, file);
      setCoverFileKey(fileKey || '');
    } catch (_: unknown) {
      setCoverPhotoFile(null);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleDeleteCoverPhoto = () => {
    setCoverPhotoFile(null);
    setCoverFileKey('');
  };

  const handleChangeCover = () => {
    setShowCoverModal(true);
  };

  const handleSaveCover = async () => {
    const { uuid } = company || {};
    if (!coverFileKey || !uuid) {
      return;
    }

    try {
      // Update company with new cover image
      const updatePayload = {
        cover_image: coverFileKey,
      };

      const response = await apiService.updateCompany(uuid, updatePayload);
      const { statusCode } = response;

      if (statusCode === 200) {
        // Refresh company data to show updated cover image
        await fetchCompanyDetails();
        setShowCoverModal(false);
        setCoverPhotoFile(null);
        setCoverFileKey('');
      } else {
        // Handle update failure silently or show user feedback
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      // Handle error silently or show user feedback
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingComponent />
      </div>
    );
  }

  // Show error state
  if (error || !company) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            Company Not Found
          </h2>
          <p className='text-gray-600'>
            {error || 'The requested company could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    tagline,
    image,
    about,
    phone_number,
    email,
    website,
    communication,
    city,
    pincode,
    preferred_communication_method,
    projects,
    uuid,
    averageRating,
    reviewCount,
    isReviewed,
    cover_image,
    country_code,
  } = company;

  // Determine if user can edit this company
  const userCanEdit = canEditCompany();
  const userCanReview = canShowReviewButton();

  return (
    <div className=''>
      <ProfileTopBlock
        coverImage={
          cover_image ? `${CDN_URL}${cover_image}` : IMAGES.PROFILE_BLOCK_BG
        }
        logoImage={image ? `${CDN_URL}${image}` : ''}
        companyName={name}
        tagline={tagline}
        rating={averageRating || 0}
        reviewCount={reviewCount || 0}
        isReviewed={isReviewed || false}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        editProfileLink={`${EDIT_COMPANY_PROFILE}/${uuid}`}
        fiveBoxSystemLink={FIVE_BOX_SYSTEM}
        companyId={uuid}
        showEditButton={userCanEdit}
        showFiveBoxSystemButton={userCanEdit}
        showChangeCoverButton={userCanEdit}
        showReviewButton={userCanReview}
      />

      {/* Company Bottom Block with Tabs */}
      <CompanyBottomBlock
        companyData={{
          name,
          tagline,
          image,
          about,
          phone: phone_number,
          phone_number,
          email,
          website,
          communication,
          city,
          pincode,
          preferred_communication_method,
          projects,
          uuid,
          country_code,
        }}
        showViewCompanyProfileButton={false}
        canEditCompany={userCanEdit}
      />

      {/* Cover Image Upload Dialog */}
      <CoverImageUploadDialog
        open={showCoverModal}
        onOpenChange={setShowCoverModal}
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

export default CompanyProfile;
