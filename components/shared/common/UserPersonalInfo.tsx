'use client';

export const UserPersonalInfo = () => {
  return (
    <div className='bg-[var(--card-background)] rounded-[10px] border border-[var(--border-dark)] p-5 w-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            Date Of Joining
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            21/08/2024
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            Email
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm break-words'>
            alex.johnson@example.com
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            Phone Number
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            (555) 123-4567
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
            Communication
          </label>
          <p className='text-[var(--text-dark)] font-medium text-sm'>
            Email, Text, In App Messages
          </p>
        </div>

        <div className='min-w-full'>
          <label className='text-sm text-[var(--text-secondary)] font-normal block mb-2'>
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
