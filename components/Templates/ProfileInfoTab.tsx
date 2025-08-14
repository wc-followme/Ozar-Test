'use client';

import { UserPersonalInfo } from '@/components/shared/common/UserPersonalInfo';
import { ProfileCategoryTabComponent } from '../shared/common/ProfileCategoryTabComponent';
import { ProfileOtherDetailsComponent } from '../shared/common/ProfileOtherDetailsComponent';

export const ProfileInfoTab = () => {
  return (
    <div className='space-y-6'>
      <UserPersonalInfo />
      <ProfileCategoryTabComponent />
      <ProfileOtherDetailsComponent />
    </div>
  );
};
