'use client';

import { CompanyBottomBlock } from '@/components/Templates/CompanyBottomBlock';
import { ProfileTopBlock } from '@/components/shared/common/ProfileTopBlock';

const CompanyProfile = () => {
  const handleWriteReview = () => {
    console.log('Write review clicked');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleRequestQuote = () => {
    console.log('Request quote clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleChangeCover = () => {
    console.log('Change cover clicked');
  };

  return (
    <div className=''>
      <ProfileTopBlock
        coverImage='/images/profile-block-bg.png'
        logoImage='/images/logo.svg'
        companyName='Envision Construction'
        tagline='Construction Company'
        rating={4.0}
        reviewCount={5}
        onWriteReview={handleWriteReview}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        editProfileLink='/company-profile/edit-profile'
        fiveBoxSystemLink='/company-profile/five-box-system'
      />

      {/* Company Bottom Block with Tabs */}
      <CompanyBottomBlock />
    </div>
  );
};

export default CompanyProfile;
