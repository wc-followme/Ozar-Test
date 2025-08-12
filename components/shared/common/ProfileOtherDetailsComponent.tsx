'use client';

import { RedirectionIcon } from '../../icons/RedirectionIcon';

export const ProfileOtherDetailsComponent = () => {
  return (
    <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-5 w-full'>
      <div className='flex lg:flex-row flex-col flex-wrap gap-6'>
        <div className='lg:min-w-[280px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Business Name
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            Envision Construction
          </p>
        </div>
        <div className='lg:min-w-[320px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Email
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            envison.construction@example.com
          </p>
        </div>
        <div className='lg:min-w-[200px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Phone Number
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            +1(239) 555-0108
          </p>
        </div>
        <div className='lg:min-w-[260px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Communication
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            Email, Text, In App Messages
          </p>
        </div>
        <div className='lg:min-w-[160px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Projects
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>100+</p>
        </div>
        <div className='lg:min-w-[240px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Website
          </label>
          <div className='flex items-center gap-2 mt-1'>
            <p className='text-[var(--text-dark)] font-medium text-sm'>
              99Pillarsconstructions.com
            </p>
            <RedirectionIcon className='text-[var(--text-secondary)] cursor-pointer hover:text-[var(--primary)]' />
          </div>
        </div>
        <div className='lg:min-w-[600px] min-w-full max-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal'>
            Address
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            3517 W. Gray St. Utica, Pennsylvania 57867
          </p>
        </div>
      </div>
    </div>
  );
};
