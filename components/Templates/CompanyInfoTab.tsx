'use client';

import { ProfileCategoryTabComponent } from '../shared/common/ProfileCategoryTabComponent';
import { ProfileDetailsComponent } from '../shared/common/ProfileDetailsComponent';
import { ProfileOtherDetailsComponent } from '../shared/common/ProfileOtherDetailsComponent';

interface CompanyInfoTabProps {
  companyData?:
    | {
        name: string;
        tagline: string;
        image: string;
        about: string;
        phone: string;
        phone_number: string;
        email: string;
        website: string;
        communication: string;
        city: string;
        pincode: string;
        preferred_communication_method: string;
        projects: string;
        uuid: string;
        country_code: string;
      }
    | undefined;
  showViewCompanyProfileButton?: boolean;
  companyId?: string;
}

export const CompanyInfoTab = ({
  companyData,
  showViewCompanyProfileButton = true,
  companyId,
}: CompanyInfoTabProps) => {
  return (
    <div className='space-y-6 w-full'>
      {/* About Section */}
      <div className='space-y-4'>
        <ProfileDetailsComponent companyData={companyData || undefined} />
      </div>

      {/* Services Section */}
      <div className='space-y-4'>
        <ProfileCategoryTabComponent
          companyId={companyId || companyData?.uuid}
        />
      </div>

      {/* Company Information */}
      <div className='space-y-4'>
        <ProfileOtherDetailsComponent
          companyData={companyData}
          showViewCompanyProfileButton={showViewCompanyProfileButton}
        />
      </div>
    </div>
  );
};
