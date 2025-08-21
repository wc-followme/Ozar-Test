'use client';

import { USER_MESSAGES } from '@/app/(DashboardLayout)/user-management/user-messages';

interface UserPersonalInfoProps {
  userData?: {
    date_of_joining?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
    preferred_communication_method?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
}

export const UserPersonalInfo = ({ userData }: UserPersonalInfoProps) => {
  const {
    date_of_joining,
    email,
    phone_number,
    country_code,
    preferred_communication_method,
    address,
    city,
    pincode,
  } = userData || {};

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '-';
  };

  const formatPhoneNumber = (phone?: string, countryCode?: string) => {
    return phone ? `${countryCode || ''} ${phone}`.trim() : '-';
  };

  const formatAddress = (
    userAddress?: string,
    userCity?: string,
    userPincode?: string
  ) => {
    if (!userAddress && !userCity && !userPincode) return '-';

    const parts = [userAddress, userCity, userPincode].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className='bg-[var(--card-background)] rounded-[10px] border border-[var(--border-dark)] p-5 w-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            {USER_MESSAGES.DATE_OF_JOINING_LABEL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {formatDate(date_of_joining)}
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            {USER_MESSAGES.EMAIL_LABEL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm break-words'>
            {email || '-'}
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            {USER_MESSAGES.PHONE_LABEL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {formatPhoneNumber(phone_number, country_code)}
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            {USER_MESSAGES.COMMUNICATION_LABEL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm capitalize'>
            {preferred_communication_method || '-'}
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            {USER_MESSAGES.ADDRESS_LABEL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {formatAddress(address, city, pincode)}
          </p>
        </div>
      </div>
    </div>
  );
};
