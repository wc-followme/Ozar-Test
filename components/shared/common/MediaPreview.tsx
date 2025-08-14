'use client';

import { CloseCircle } from 'iconsax-react';
import Image from 'next/image';
import { useState } from 'react';

interface MediaPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  className?: string;
  previewClassName?: string;
}

export const MediaPreview = ({
  files,
  onRemove,
  className = '',
  previewClassName = '',
}: MediaPreviewProps) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const isVideo = (file: File) => {
    return file.type.startsWith('video/');
  };

  const getFileUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid gap-3 ${className} grid-cols-[repeat(auto-fill,minmax(80px,1fr))]`}
    >
      {files.map((file, index) => {
        const fileUrl = getFileUrl(file);
        const isVideoFile = isVideo(file);
        const hasError = imageErrors.has(index);

        return (
          <div key={index} className='relative group h-full'>
            <div
              className={`w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 ${previewClassName}`}
            >
              {isVideoFile ? (
                <div className='w-full h-full flex items-center justify-center bg-gray-100'>
                  <div className='text-center'>
                    <div className='w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-gray-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <p className='text-xs text-gray-600'>Video</p>
                  </div>
                </div>
              ) : hasError ? (
                <div className='w-full h-full flex items-center justify-center bg-gray-100'>
                  <div className='text-center'>
                    <div className='w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-gray-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <p className='text-xs text-gray-600'>Image</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={fileUrl}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className='w-full h-full object-cover'
                  onError={() => handleImageError(index)}
                />
              )}
            </div>

            {/* Remove Button */}
            <button
              type='button'
              onClick={() => onRemove(index)}
              className='absolute top-1 right-1 p-0'
            >
              <CloseCircle
                size={16}
                color='var(--white-background)'
                variant='Bold'
                className='p-0 drop-shadow-lg'
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};
