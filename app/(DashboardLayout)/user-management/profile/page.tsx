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

  const handleAddToNetwork = () => {
    console.log('Add to network clicked');
  };

  return (
    <div className=''>
      <ProfileTopBlock
        coverImage='/images/profile-block-bg.png'
        logoImage='/images/profile.jpg'
        companyName='John Doe'
        tagline='Senior Developer'
        rating={4.0}
        reviewCount={5}
        onWriteReview={handleWriteReview}
        onEditProfile={handleEditProfile}
        onRequestQuote={handleRequestQuote}
        onShare={handleShare}
        onChangeCover={handleChangeCover}
        onAddToNetwork={handleAddToNetwork}
        showReviewButton={false}
        showFiveBoxSystemButton={false}
        showRequestQuoteButton={true}
        editProfileLink='/user-management/profile/edit'
        isUserProfile={true}
        companyProfileLink='/company-profile'
      />
      <ProfileBottomBlock />
    </div>
  );
};

export default Profile;
