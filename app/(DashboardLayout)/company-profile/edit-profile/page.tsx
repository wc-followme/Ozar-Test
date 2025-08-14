'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { CompanyProfileForm } from '@/components/shared/forms/CompanyProfileForm';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const breadcrumbData: BreadcrumbItem[] = [
  {
    name: 'Profile',
    href: '/company-profile',
  },
  { name: 'Edit Profile' }, // current page
];

const EditProfilePage = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log('Submitting profile data:', data);
      // Add your API call here to update the profile

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccessToast('Profile updated successfully');
      router.push('/company-profile');
    } catch (error) {
      showErrorToast('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/company-profile');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Breadcrumb items={breadcrumbData} className='mb-2' />
        </div>
      </div>

      {/* Main Content */}
      <CompanyProfileForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default EditProfilePage;
