'use client';

import { AddCircle } from 'iconsax-react';
import Image from 'next/image';

interface DetailBoxProps {
  label: string;
  value: string;
  assignedUsers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  className?: string;
}

export function DetailBoxComponent({
  label,
  value,
  assignedUsers,
  className = '',
}: DetailBoxProps) {
  return (
    <div
      className={`rounded-[10px] p-4 border border-[var(--border-dark)] flex items-center justify-between ${className}`}
    >
      {/* Left Section - Text Content */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-[var(--text-secondary)] font-medium mb-1'>
          {label}
        </p>
        <p className='text-[var(--text-dark)] text-base font-medium truncate'>
          {value}
        </p>
      </div>

      {/* Right Section - Avatars and Add Button */}
      <div className='flex items-center gap-2'>
        {/* User Avatars */}
        <div className='flex items-center -space-x-2'>
          {assignedUsers.slice(0, 3).map((user, index) => (
            <Image
              src={'/images/img-placeholder-sm.png'}
              alt={user.name}
              width={24}
              height={24}
              className='w-[30px] h-[30px] rounded-full object-cover border-2 border-white'
            />
          ))}
          <button className='w-[30px] h-[30px] rounded-full bg-[#F5F7FA] border border-white flex items-center justify-center  transition-colors'>
            <AddCircle size='20' color='#34AD44' />
          </button>
        </div>

        {/* Add Button */}
      </div>
    </div>
  );
}
