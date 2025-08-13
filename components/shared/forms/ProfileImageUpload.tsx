'use client';

import { Button } from '@/components/ui/button';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import Image from 'next/image';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ProfileImageUploadProps {
  onImageChange: (fileKey: string) => void;
  onImageDelete: () => void;
  initialImageUrl?: string;
  placeholderImage?: string;
  title?: string;
  instructionText?: string;
  instructionSubText?: string;
  buttonText?: string;
  uploadingText?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  onImageChange,
  onImageDelete,
  initialImageUrl,
  placeholderImage = '/images/img-placeholder-md.png',
  title = 'Profile Photo',
  instructionText = '1600 x 1200 (4:3) recommended.',
  instructionSubText = 'PNG and JPG files are allowed',
  buttonText = 'Change Photo',
  uploadingText = 'Uploading...',
  width = 412,
  height = 200,
  className = '',
}) => {
  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileKey, setFileKey] = useState<string>('');

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setFileKey('');
      onImageDelete();
      return;
    }

    setPhotoFile(file);
    setUploading(true);

    try {
      const { name: fileName, type: fileType, size: fileSize } = file;
      const ext = fileName.split('.').pop() || 'png';
      const timestamp = Date.now();
      const companyUuid = uuidv4();
      const generatedFileName = `company_${companyUuid}_${timestamp}.${ext}`;

      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType,
        fileSize,
        purpose: 'company',
        customPath: '',
      });

      const { data: presignedData } = presigned;
      await uploadFileToPresignedUrl(presignedData['uploadUrl'], file);
      const newFileKey = presignedData['fileKey'] || '';
      setFileKey(newFileKey);
      onImageChange(newFileKey);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setPhotoFile(null);
      onImageDelete();
    } finally {
      setUploading(false);
    }
  };

  const getImageSrc = () => {
    if (photoFile) {
      return URL.createObjectURL(photoFile);
    }
    if (fileKey) {
      return (process.env['NEXT_PUBLIC_CDN_URL'] || '') + fileKey;
    }
    if (initialImageUrl) {
      return initialImageUrl;
    }
    return placeholderImage;
  };

  const getImageClassName = () => {
    const isPlaceholder = !photoFile && !fileKey && !initialImageUrl;
    return `w-full h-full ${isPlaceholder ? 'object-cover' : 'object-contain'}`;
  };

  return (
    <div
      className={`lg:w-[${width}px] flex-shrink-0 bg-[var(--card-background)] rounded-[10px] border border-[var(--border-dark)] p-6 ${className}`}
    >
      <h2 className='text-lg font-bold mb-4 text-[var(--text-dark)]'>
        {title}
      </h2>

      {/* Profile Photo Upload Area */}
      <div className='flex flex-col items-center'>
        {/* Profile Image */}
        <div className='w-full h-[200px] rounded-lg overflow-hidden bg-[var(--white-background)]'>
          <Image
            src={getImageSrc()}
            alt='Profile Photo'
            width={width}
            height={height}
            className={getImageClassName()}
            sizes='(max-width: 768px) 100vw, 412px'
          />
        </div>

        {/* Hidden File Input */}
        <input
          type='file'
          id='photo-upload'
          accept='image/*'
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              handlePhotoChange(file);
            }
          }}
          className='hidden'
        />

        {/* Change Photo Button */}
        <Button
          variant='outline'
          className='w-full mt-4 btn-secondary'
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? uploadingText : buttonText}
        </Button>

        {/* Instructions Text */}
        <div className='mt-4 text-center'>
          <p className='text-sm text-[var(--text-secondary)]'>
            {instructionText}
          </p>
          <p className='text-sm text-[var(--text-secondary)]'>
            {instructionSubText}
          </p>
        </div>
      </div>
    </div>
  );
};
