'use client';

import { Button } from '@/components/ui/button';
import { CUSTOMER_AVATARS } from '@/constants/auth-data';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';

export function CustomerSection() {
  return (
    <div className='bg-[#F5F7FA] rounded-[30px] p-5 w-full shrink-0'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex -space-x-2'>
            {CUSTOMER_AVATARS.map((avatar, index) => (
              <Image
                key={index}
                src={avatar || '/placeholder.svg'}
                alt={`Customer ${index + 1}`}
                className='w-12 h-12 rounded-full border-2 border-white object-cover'
                height={48}
                width={48}
              />
            ))}
          </div>
          <div>
            <p className='font-semibold text-[var(--text-dark)] text-[18px]'>
              Join with 20k+ Users!
            </p>
            <p className='text-[var(--text-secondary)] text-[18px]'>
              Let&apos;s see our happy customers
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          size='icon'
          className='border border-black h-[54px] rounded-[30px] w-[72px] flex items-center justify-center text-black hover:text-black bg-transparent'
        >
          <IconArrowRight className='-rotate-45' size={60} />
        </Button>
      </div>
    </div>
  );
}
