'use client';

import { ProfileTopBlock } from '@/components/shared/common/ProfileTopBlock';
import { ProfileBottomBlock } from '../../../../components/Templates/ProfileBottomBlock';

const Profile = () => {
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
        logoImage='/images/profile.jpg'
        companyName='John Doe'
        tagline='Senior Developer'
        rating={4.5}
        reviewCount={12}
        onWriteReview={handleWriteReview}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        showReviewButton={false}
        showFiveBoxSystemButton={false}
        showRequestQuoteButton={false}
        editProfileLink='/user-management/profile/edit'
      />
      <ProfileBottomBlock />
    </div>
  );
};

export default Profile;
