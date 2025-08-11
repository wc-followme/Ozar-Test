'use client';

import { ProfileCategoryTabComponent } from '../shared/common/ProfileCategoryTabComponent';
import { ProfileDetailsComponent } from '../shared/common/ProfileDetailsComponent';
import { ProfileOtherDetailsComponent } from '../shared/common/ProfileOtherDetailsComponent';

export const CompanyInfoTab = () => {
  return (
    <div className='space-y-6'>
      {/* About Section */}
      <div className='space-y-4'>
        <ProfileDetailsComponent />
      </div>

      {/* Services Section */}
      <div className='space-y-4'>
        <ProfileCategoryTabComponent />
      </div>

      {/* Company Information */}
      <div className='space-y-4'>
        <ProfileOtherDetailsComponent />
      </div>
    </div>
  );
};
