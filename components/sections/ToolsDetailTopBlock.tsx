'use client';

import { Button } from '@/components/ui/button';
import { AddSquare, UserAdd, VideoSquare } from 'iconsax-react';
import Image from 'next/image';
import React from 'react';

export interface ToolsDetailTopBlockProps {
  imageSrc: string;
  title: string;
  quantity: number | string;
  videosCount: number | string;
  videosHref: string;
  onAssign: () => void;
  onAddMore: () => void;
}

export const ToolsDetailTopBlock: React.FC<ToolsDetailTopBlockProps> = ({
  imageSrc,
  title,
  quantity,
  videosCount,
  videosHref,
  onAssign,
  onAddMore,
}) => {
  return (
    <div className='flex flex-col lg:flex-row items-start gap-6 w-full mb-6'>
      {/* Tool Image + Info */}
      <div className='flex gap-4'>
        <div className='w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
          <Image
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover'
            height={80}
            width={80}
          />
        </div>

        <div className='flex-1'>
          <h1 className='text-lg font-bold text-[var(--text-dark)] mb-4 break-words'>
            {title}
          </h1>
          <div className='flex gap-8'>
            <div>
              <span className='text-sm text-[var(--text-secondary)]'>
                Quantity
              </span>
              <p className='text-lg font-bold text-[var(--text-dark)]'>
                {quantity}
              </p>
            </div>
            <div>
              <span className='text-sm text-[var(--text-secondary)]'>
                Videos
              </span>
              <p className='text-lg font-bold text-[var(--text-dark)]'>
                {videosCount.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2 lg:gap-3 justify-end flex-wrap flex-shrink-0 lg:flex-1 w-full lg:w-auto'>
        <Button
          asChild
          variant='outline'
          className='!w-[42px] sm:!w-auto py-2 btn-secondary'
        >
          <a href={videosHref} className='flex items-center gap-2'>
            <span className='inline-flex sm:hidden'>
              <VideoSquare
                size='20'
                color='var(--text-dark)'
                className='!h-5 !w-5'
              />
            </span>
            <span className='hidden sm:inline'>Videos Tutorial</span>
          </a>
        </Button>
        <Button
          variant='outline'
          className='px-4 !w-[42px] sm:!w-auto py-2 btn-secondary'
          onClick={onAssign}
        >
          <span className='inline-flex sm:hidden'>
            <UserAdd size='20' color='var(--text-dark)' className='!h-5 !w-5' />
          </span>
          <span className='hidden sm:inline'>Assign Tool</span>
        </Button>
        <Button
          className='!w-[42px] sm:!w-auto py-2 btn-primary'
          onClick={onAddMore}
        >
          <span className='inline-flex sm:hidden'>
            <AddSquare size='20' color='currentColor' className='!h-5 !w-5' />
          </span>
          <span className='hidden sm:inline'>Add More</span>
        </Button>
      </div>
    </div>
  );
};

export default ToolsDetailTopBlock;
