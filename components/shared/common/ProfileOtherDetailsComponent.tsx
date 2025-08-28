'use client';

import { PROFILE_DETAILS_MESSAGES } from '@/constants/messages';
import Link from 'next/link';
import { RedirectionIcon } from '../../icons/RedirectionIcon';

interface ProfileOtherDetailsComponentProps {
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
  companyProfileUrl?: string;
}

export const ProfileOtherDetailsComponent = ({
  companyData,
  showViewCompanyProfileButton = true,
  companyProfileUrl,
}: ProfileOtherDetailsComponentProps) => {
  // Destructure company data for better readability
  const {
    name,
    email,
    phone_number,
    phone,
    website,
    communication,
    city,
    pincode,
    preferred_communication_method,
    projects,
    country_code,
  } = companyData || {};

  return (
    <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-5 w-full'>
      <div className='flex lg:flex-row flex-col flex-wrap gap-6'>
        <div className='lg:min-w-[280px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.BUSINESS_NAME}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {name || '-'}
          </p>
        </div>
        <div className='lg:min-w-[320px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.EMAIL}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {email || '-'}
          </p>
        </div>
        <div className='lg:min-w-[200px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.PHONE_NUMBER}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {phone || phone_number
              ? `${country_code || ''} ${phone || phone_number}`
              : '-'}
          </p>
        </div>
        <div className='lg:min-w-[260px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.COMMUNICATION}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm capitalize'>
            {preferred_communication_method &&
            preferred_communication_method !== '-'
              ? preferred_communication_method
              : '-'}
          </p>
        </div>
        <div className='lg:min-w-[160px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.PROJECTS}
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            {projects || '-'}
          </p>
        </div>
        <div className='lg:min-w-[240px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            {PROFILE_DETAILS_MESSAGES.WEBSITE}
          </label>
          <div className='flex items-center gap-2 mt-1'>
            <p className='text-[var(--text-dark)] font-medium text-sm'>
              {website || '-'}
            </p>
            <RedirectionIcon className='text-[var(--text-secondary)] cursor-pointer hover:text-[var(--primary)]' />
          </div>
        </div>
        <div className='lg:min-w-[400px] min-w-full max-w-full'>
          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 w-full'>
            <div>
              <label className='text-sm text-[var(--text-secondary)] font-normal'>
                {PROFILE_DETAILS_MESSAGES.ADDRESS}
              </label>
              <p className='text-[var(--text-dark)] font-medium text-sm mt-1'>
                {communication && city && pincode
                  ? `${communication}, ${city} ${pincode}`
                  : communication || city || pincode || '-'}
              </p>
            </div>
          </div>
        </div>
        {showViewCompanyProfileButton && (
          <div className='lg:flex-shrink-0 ml-auto'>
            <Link
              href={companyProfileUrl || ''}
              className='btn-secondary text-[14px] gap-1 !px-[12px] xl:!px-[26px] !py-[10px] !h-9 rounded-full'
            >
              {PROFILE_DETAILS_MESSAGES.VIEW_COMPANY_PROFILE}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
