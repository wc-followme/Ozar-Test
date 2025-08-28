'use client';

import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/constants/common';
import { X } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
  isYouTubeLink?: boolean;
}

export const VideoPlayerModal = ({
  isOpen,
  onClose,
  videoUrl,
  videoTitle,
  isYouTubeLink = false,
}: VideoPlayerModalProps) => {
  if (!isOpen) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from YouTube URL
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getVideoUrl = () => {
    if (isYouTubeLink) {
      return getYouTubeEmbedUrl(videoUrl);
    }
    // For uploaded videos, add CDN prefix
    return videoUrl.startsWith('http')
      ? videoUrl
      : `${APP_CONFIG.CDN_URL}${videoUrl}`;
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
      <div className='relative w-full max-w-4xl mx-4 bg-white rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h3 className='text-lg font-semibold text-gray-900 truncate pr-4'>
            {videoTitle}
          </h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Video Player */}
        <div className='relative w-full'>
          {isYouTubeLink ? (
            <div className='aspect-video'>
              <iframe
                src={getVideoUrl()}
                title={videoTitle}
                className='w-full h-full'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={getVideoUrl()}
              controls
              className='w-full aspect-video'
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t'>
          <div className='flex justify-end'>
            <Button onClick={onClose} variant='outline'>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
