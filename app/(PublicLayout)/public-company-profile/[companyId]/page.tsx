'use client';

import { FIVE_BOX_DATA } from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-constants';
import { CompanyBottomBlock } from '@/components/Templates/CompanyBottomBlock';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { ProfileTopBlock } from '@/components/shared/common/ProfileTopBlock';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  JOB_MESSAGES,
  JOB_PRIVACY,
  ROUTES,
  SHARE_MESSAGES,
} from '@/constants/common';
import { apiService, GetCompanyResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ companyId: string }>;
}

const CompanyProfile = ({ params }: PageProps) => {
  const { companyId } = use(params);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Destructure constants
  const { CDN_URL, IMAGES, BASE_URL } = APP_CONFIG;
  const {
    PUBLIC_COMPANY_PROFILE,
    EDIT_COMPANY_PROFILE,
    FIVE_BOX_SYSTEM,
    HOME_OWNER,
  } = ROUTES;
  const { URL_COPIED_SUCCESS, COPY_FAILED_ERROR, SHARE_URL_ALERT } =
    SHARE_MESSAGES;
  const { QUOTE_CREATE_SUCCESS, QUOTE_CREATE_ERROR } = JOB_MESSAGES;
  const { PRIVATE } = JOB_PRIVACY;
  const { showSuccessToast, showErrorToast } = useToast();
  const [company, setCompany] = useState<GetCompanyResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // First check: Redirect logged-in users to dashboard company profile
  useEffect(() => {
    if (isAuthenticated && companyId && !isRedirecting) {
      setIsRedirecting(true);
      // Add a small delay for smooth transition
      setTimeout(() => {
        router.push(`${ROUTES.COMPANY_PROFILE}/${companyId}`);
      }, 100);
    }
  }, [isAuthenticated, companyId, router, isRedirecting]);

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

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) {
        setError('No company ID found');
        setLoading(false);
        return;
      }

      // Don't fetch if redirecting
      if (isRedirecting) {
        return;
      }

      try {
        setLoading(true);
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
    };

    fetchCompanyDetails();
  }, [companyId, isRedirecting]);

  const handleWriteReview = () => {
    // Write review functionality
  };

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
        .filter(Boolean);

      // Create job payload
      const jobPayload = {
        job_privacy: PRIVATE,
        job_boxes_step: enabledBoxes,
        company_id: uuid,
        question_json: questionJson,
      };

      // Create the job
      const response = await apiService.createJob(jobPayload);
      const { data: responseData } = response;

      if (responseData) {
        showSuccessToast(QUOTE_CREATE_SUCCESS);
        const jobUuid = responseData.uuid;
        router.push(`${HOME_OWNER}/${jobUuid}`);
      } else {
        showErrorToast(QUOTE_CREATE_ERROR);
      }
    } catch (error) {
      showErrorToast(QUOTE_CREATE_ERROR);
    }
  };

  const handleShare = async () => {
    const { uuid } = company || {};
    if (!uuid) {
      return;
    }

    try {
      const publicUrl = `${BASE_URL}${PUBLIC_COMPANY_PROFILE}/${uuid}`;
      await navigator.clipboard.writeText(publicUrl);
      showSuccessToast(URL_COPIED_SUCCESS);
    } catch (error) {
      const publicUrl = `${BASE_URL}${PUBLIC_COMPANY_PROFILE}/${uuid}`;
      alert(`${SHARE_URL_ALERT} ${publicUrl}`);
      showErrorToast(COPY_FAILED_ERROR);
    }
  };

  const handleChangeCover = () => {
    // Change cover functionality
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

  // Destructure company data
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
  } = company;

  return (
    <div className=''>
      <ProfileTopBlock
        coverImage={
          cover_image ? `${CDN_URL}${cover_image}` : IMAGES.PROFILE_BLOCK_BG
        }
        logoImage={image ? `${CDN_URL}${image}` : IMAGES.LOGO}
        companyName={name}
        tagline={tagline}
        rating={averageRating || 0}
        reviewCount={reviewCount || 0}
        isReviewed={isReviewed || false}
        onWriteReview={handleWriteReview}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        editProfileLink={`${EDIT_COMPANY_PROFILE}/${uuid}`}
        fiveBoxSystemLink={FIVE_BOX_SYSTEM}
        companyId={uuid}
        showEditButton={false}
        showFiveBoxSystemButton={false}
        showChangeCoverButton={false}
        showReviewButton={true}
      />

      {/* Company Bottom Block with Tabs */}
      <CompanyBottomBlock
        companyData={{
          name,
          tagline,
          image,
          about,
          phone: phone_number,
          email,
          website,
          communication,
          city,
          pincode,
          preferred_communication_method,
          projects,
          uuid,
        }}
        showViewCompanyProfileButton={false}
        canEditCompany={false}
      />
    </div>
  );
};

export default CompanyProfile;
