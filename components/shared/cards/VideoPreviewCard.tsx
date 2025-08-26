'use client';

import Dropdown from '@/components/shared/common/Dropdown';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { APP_CONFIG } from '@/constants/common';
import { getVideoThumbnail, isYouTubeUrl } from '@/utils/video';
import { IconDotsVertical, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Trash } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VideoPreviewCardProps {
  id: string;
  videoUrl: string;
  title: string;
  duration?: string;
  className?: string;
  onDelete?: (videoUrl: string, videoType: 'uploaded' | 'youtube') => void;
  videoType?: 'uploaded' | 'youtube';
}

export const VideoPreviewCard = ({
  id,
  videoUrl,
  title,
  duration = '',
  className = '',
  onDelete,
  videoType = 'uploaded',
}: VideoPreviewCardProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isYouTubeUrl(videoUrl)) {
      // For YouTube videos, use the utility function
      setThumbnailUrl(getVideoThumbnail(videoUrl, APP_CONFIG.CDN_URL));
      setIsLoading(false);
    } else {
      // For uploaded videos, we'll use the video element to generate thumbnail
      setIsLoading(true);
      setHasError(false);
    }
  }, [videoUrl]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const getVideoSrc = () => {
    if (!videoUrl || videoUrl.trim() === '') {
      return undefined;
    }
    return videoUrl.startsWith('http')
      ? videoUrl
      : `${APP_CONFIG.CDN_URL}${videoUrl}`;
  };

  const renderThumbnail = () => {
    if (isYouTubeUrl(videoUrl)) {
      // For YouTube videos, use Image component with the thumbnail URL
      return (
        <Image
          src={thumbnailUrl || '/images/video-placeholder.png'}
          alt={title}
          fill
          className='object-cover'
          priority={false}
          onError={() => setHasError(true)}
        />
      );
    }

    // For uploaded videos, use video element
    return (
      <>
        {isLoading && (
          <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
            <div className='text-gray-500 text-sm'>Loading...</div>
          </div>
        )}

        {hasError && (
          <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
            <div className='text-gray-500 text-sm'>Video not available</div>
          </div>
        )}

        {getVideoSrc() && (
          <video
            ref={videoRef}
            src={getVideoSrc()}
            className='w-full h-full object-cover'
            preload='metadata'
            muted
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            style={{ display: isLoading || hasError ? 'none' : 'block' }}
          />
        )}
      </>
    );
  };

  // Don't render if videoUrl is empty
  if (!videoUrl || videoUrl.trim() === '') {
    return null;
  }

  return (
    <div
      key={id}
      className={`rounded-2xl bg-[--card-background] border border-[var(--border-dark)] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
    >
      <div className='relative'>
        <AspectRatio ratio={10 / 4}>{renderThumbnail()}</AspectRatio>
        {/* Duration (bottom-left) */}
        {duration && (
          <span className='absolute bottom-2 left-2 text-xs p-2 py-1 font-medium rounded-md bg-[rgba(0,0,0,0.4)] text-white'>
            {duration}
          </span>
        )}
        {/* Play button (center) */}
        <span className='absolute inset-0 flex items-center justify-center'>
          <span className='w-11 h-11 rounded-full bg-[rgba(0,0,0,0.55)] flex items-center justify-center'>
            <IconPlayerPlayFilled color='white' />
          </span>
        </span>
      </div>
      <div className='flex items-center justify-between p-4'>
        <p className='text-[var(--text-dark)] font-semibold leading-tight truncate pr-3'>
          {title}
        </p>
        <Dropdown
          align='end'
          trigger={
            <button
              type='button'
              className='p-1 text-[var(--text-secondary)] hover:text-[var(--text-dark)]'
            >
              <IconDotsVertical className='w-5 h-5' />
            </button>
          }
          menuOptions={[{ label: 'Delete', action: 'delete', icon: Trash }]}
          onAction={action => {
            if (action === 'delete' && onDelete) {
              onDelete(videoUrl, videoType);
            }
          }}
        />
      </div>
    </div>
  );
};
