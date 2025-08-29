'use client';

import { cn } from '@/lib/utils'; // Optional utility for merging class names
import { GalleryAdd } from 'iconsax-react';
import React from 'react';

export interface ImageUploadProps {
  label?: React.ReactNode | string;
  text?: React.ReactNode | string;
  acceptedTypes?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  text,
  // acceptedTypes = '.png,.jpg,.jpeg',
  onClick,
  className,
  icon,
}) => {
  return (
    <div
      className={cn(
        'aspect-square w-full mx-auto lg:mx-0 rounded-2xl bg-cyanwave-light',
        className
      )}
    >
      <div
        className='w-full h-full border-2 border-dashed border-[#00A8BF] rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer text-center px-4 py-6'
        onClick={onClick}
      >
        {icon ?? <GalleryAdd size='32' color='#00A8BF' variant='Outline' />}

        <p className='text-[var(--text-dark)] mt-2 font-semibold text-xs md:text-[0.875rem]'>
          {label}
        </p>
        {text && (
          <p className='text-[var(--text-secondary)] mt-2 font-normal text-xs md:text-[0.875rem] leading-tight whitespace-pre-line'>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

{
  // example of usage
  /*   
  <ImageUpload
              onClick={handleUploadClick}
              icon={<ChevronRight className='h-4 w-4 mx-2' />}
              label='Upload Photo'
              text={'PNG and JPG files are allowed'}
              className='h-[180px]'
            /> 
            */
}
