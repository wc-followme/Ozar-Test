'use client';

import { UserPersonalInfo } from '@/components/shared/common/UserPersonalInfo';
import { ROUTES } from '@/constants/common';
import { useAuth } from '@/lib/auth-context';
import { ProfileCategoryTabComponent } from '../shared/common/ProfileCategoryTabComponent';
import { ProfileOtherDetailsComponent } from '../shared/common/ProfileOtherDetailsComponent';

interface ProfileInfoTabProps {
  userData?: any;
}

export const ProfileInfoTab = ({ userData }: ProfileInfoTabProps) => {
  const { company } = userData || {};
  const companyId = company?.uuid;
  const { COMPANY_PROFILE, PUBLIC_COMPANY_PROFILE } = ROUTES;
  const { isAuthenticated } = useAuth();

  // Use public company profile URL if user is not logged in
  const companyProfileUrl = isAuthenticated
    ? `${COMPANY_PROFILE}/${companyId}`
    : `${PUBLIC_COMPANY_PROFILE}/${companyId}`;

  return (
    <div className='space-y-6'>
      <UserPersonalInfo userData={userData} />
      {companyId && <ProfileCategoryTabComponent companyId={companyId} />}
      {company && (
        <ProfileOtherDetailsComponent
          companyData={company}
          companyProfileUrl={companyProfileUrl}
        />
      )}
    </div>
  );
};
