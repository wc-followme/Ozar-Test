'use client';

import { APP_CONFIG } from '@/constants/common';
import { getVideoThumbnail, isYouTubeUrl } from '@/utils/video';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
  videoUrl: string;
  title: string;
  className?: string;
  onClick?: () => void;
  showPlayButton?: boolean;
}

export const VideoThumbnail = ({
  videoUrl,
  title,
  className = '',
  onClick,
  showPlayButton = true,
}: VideoThumbnailProps) => {
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
    return videoUrl.startsWith('http')
      ? videoUrl
      : `${APP_CONFIG.CDN_URL}${videoUrl}`;
  };

  if (isYouTubeUrl(videoUrl)) {
    // For YouTube videos, use Image component with the thumbnail URL
    return (
      <div
        className={`relative overflow-hidden rounded-lg cursor-pointer ${className}`}
        onClick={onClick}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          width={200}
          height={150}
          className='w-full h-full object-cover'
          onError={() => setHasError(true)}
        />
        {showPlayButton && (
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
            <div className='w-8 h-8 bg-white/80 rounded-full flex items-center justify-center'>
              <div className='w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1'></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For uploaded videos, use video element
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
          <div className='text-gray-500 text-sm'>Loading...</div>
        </div>
      )}

      {hasError && (
        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
          <div className='text-gray-500 text-sm'>Video not available</div>
        </div>
      )}

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

      {showPlayButton && !isLoading && !hasError && (
        <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
          <div className='w-8 h-8 bg-white/80 rounded-full flex items-center justify-center'>
            <div className='w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1'></div>
          </div>
        </div>
      )}
    </div>
  );
};
