'use client';

import { GalleryAdd } from 'iconsax-react';
import { useRef } from 'react';

interface PhotoUploadProps {
  onFileUpload?: (file: File) => void;
}

export function PhotoUpload({ onFileUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className='aspect-square w-full mx-auto lg:mx-0 rounded-lg overflow-hidden bg-cyanwave-light'>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
      <div
        className='w-full h-full border-image-custom rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer'
        onClick={handleClick}
      >
        <GalleryAdd size='32' color='#00A8BF' variant='Outline' />
        <p className='text-[var(--text-dark)] mt-2 font-semibold text-[14px]'>
          Upload Photo
        </p>
      </div>
    </div>
  );
}
