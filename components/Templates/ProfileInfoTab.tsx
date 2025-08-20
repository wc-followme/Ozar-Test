'use client';

import { UserPersonalInfo } from '@/components/shared/common/UserPersonalInfo';
import { ROUTES } from '@/constants/common';
import { ProfileCategoryTabComponent } from '../shared/common/ProfileCategoryTabComponent';
import { ProfileOtherDetailsComponent } from '../shared/common/ProfileOtherDetailsComponent';

interface ProfileInfoTabProps {
  userData?: any;
}

export const ProfileInfoTab = ({ userData }: ProfileInfoTabProps) => {
  const { company } = userData;
  const { uuid: companyId } = company;
  const { COMPANY_PROFILE } = ROUTES;

  return (
    <div className='space-y-6'>
      <UserPersonalInfo userData={userData} />
      <ProfileCategoryTabComponent companyId={companyId} />
      <ProfileOtherDetailsComponent
        companyData={company}
        companyProfileUrl={`${COMPANY_PROFILE}/${companyId}`}
      />
    </div>
  );
};
