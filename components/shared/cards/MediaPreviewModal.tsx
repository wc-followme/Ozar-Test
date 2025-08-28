'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { ArrowLeft2, ArrowRight2, CloseCircle } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Function to detect if a media item is a video
const isVideoFile = (src: string, type?: string): boolean => {
  // Check MIME type first if available
  if (type && type.startsWith('video/')) {
    return true;
  }

  // Check file extension
  const videoExtensions = [
    '.mp4',
    '.webm',
    '.ogg',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    '.mkv',
    '.m4v',
    '.3gp',
    '.ts',
    '.mts',
    '.m2ts',
    '.f4v',
    '.f4p',
    '.f4a',
    '.f4b',
  ];

  const lowerSrc = src.toLowerCase();
  return videoExtensions.some(ext => lowerSrc.endsWith(ext));
};

// Custom thumbnail component for media items
const MediaThumbnail = ({
  item,
  className = '',
}: {
  item: { id: string; type?: string; src: string; thumbnail: string };
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = item.type === 'video' || isVideoFile(item.src, item.type);

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
    if (!item.src || item.src.trim() === '') {
      return undefined;
    }
    return item.src.startsWith('http') ? item.src : item.src;
  };

  return (
    <div
      className={`w-full h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center ${className}`}
    >
      {isVideo ? (
        <div className='relative w-full h-full'>
          {isLoading && (
            <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
              <div className='text-gray-500 text-xs'>Loading...</div>
            </div>
          )}

          {hasError && (
            <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
              <IconPlayerPlayFilled color='gray' size={20} />
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
          <span className='absolute inset-0 flex items-center justify-center'>
            <span className='w-6 h-6 rounded-full bg-[rgba(0,0,0,0.25)] shadow-2xl flex items-center justify-center'>
              <IconPlayerPlayFilled color='white' size={14} />
            </span>
          </span>
        </div>
      ) : (
        <Image
          src={item.thumbnail}
          alt='Image thumbnail'
          width={96}
          height={96}
          className='w-full h-full object-cover'
          priority={false}
          onError={() => {
            // Fallback handled by Next.js Image
          }}
        />
      )}
    </div>
  );
};

// Main media preview component for the main slider
const MainMediaPreview = ({
  item,
}: {
  item: { id: string; type?: string; src: string; thumbnail: string };
}) => {
  const isVideo = item.type === 'video' || isVideoFile(item.src, item.type);

  return (
    <div className='flex items-center justify-center w-full h-full'>
      {isVideo ? (
        <div className='w-full h-full flex items-center justify-center'>
          <video
            src={item.src}
            className='max-w-full w-full max-h-full h-full object-contain'
            controls
            preload='metadata'
            poster={item.thumbnail}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <Image
          src={item.src}
          alt='Media preview'
          width={800}
          height={500}
          className='max-w-full max-h-full object-contain'
          priority
          onError={() => {
            // Fallback handled by Next.js Image
          }}
        />
      )}
    </div>
  );
};

interface MediaPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
  mediaItems?: Array<{
    id: string;
    type?: string;
    src: string;
    thumbnail: string;
  }>;
}

export default function MediaPreviewModal({
  open,
  onOpenChange,
  projectName = 'Project Name',
  mediaItems = [],
}: MediaPreviewModalProps) {
  const [_mainSwiper, setMainSwiper] = useState<any>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Always use default items if no media items provided or if media items array is empty
  const items: Array<{
    id: string;
    type?: string;
    src: string;
    thumbnail: string;
  }> = mediaItems && mediaItems.length > 0 ? mediaItems : [];

  // Ensure component is mounted on client side before rendering Swiper
  useEffect(() => {
    try {
      setIsClient(true);
    } catch (error) {
      setIsClient(false);
    }
  }, []);

  if (!open) return null;

  // Fallback rendering if Swiper fails to initialize
  if (!isClient) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-[800px] w-[800px] max-h-[90vh] p-0 overflow-hidden rounded-none'>
          <DialogHeader className='flex items-center flex-row pb-4 px-6 pt-6'>
            <DialogTitle className='text-[var(--text-dark)] text-xl md:text-2xl font-medium'>
              {projectName}
            </DialogTitle>
            <Button
              variant='ghost'
              onClick={() => onOpenChange(false)}
              className='ml-auto !mt-0 p-0 h-auto'
            >
              <CloseCircle
                size='24'
                className='!h-6 !w-6'
                color='var(--text-secondary)'
              />
            </Button>
          </DialogHeader>
          <div className='px-6 pb-6'>
            <div className='flex items-center justify-center h-[500px] bg-gray-100 rounded-lg'>
              <p className='text-gray-500'>Loading preview...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='lg:max-w-[940px] lg:w-[940px] max-w-[90%] [&>button]:hidden max-h-[90vh] p-0 overflow-hidden bg-[var(--card-background)] rounded-none'>
        <DialogHeader className='flex items-center flex-row pb-4 px-6 pt-6'>
          <DialogTitle className='text-[var(--text-dark)] text-xl md:text-2xl font-medium'>
            {projectName}
          </DialogTitle>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            className='ml-auto !mt-0 p-0 h-auto'
          >
            <CloseCircle
              size='24'
              className='!h-6 !w-6'
              color='var(--text-secondary)'
            />
          </Button>
        </DialogHeader>

        <div className='pb-6 lg:max-w-[940px] lg:w-[940px] max-w-full w-full'>
          {/* Main Media Preview Area */}
          <div className='relative mb-6 max-w-full w-full px-8'>
            <div className='max-w-full w-full xl:aspect-[16/10] aspect-[14/6] overflow-hidden'>
              {isClient && (
                <Swiper
                  onSwiper={setMainSwiper}
                  modules={[Navigation, Thumbs]}
                  thumbs={{
                    swiper:
                      thumbsSwiper && thumbsSwiper.el ? thumbsSwiper : null,
                  }}
                  navigation={{
                    nextEl: '.main-swiper-button-next',
                    prevEl: '.main-swiper-button-prev',
                  }}
                  className='h-full w-full'
                  slidesPerView={1}
                  spaceBetween={0}
                  onInit={() => {}}
                  onBeforeInit={() => {}}
                >
                  {items.map(item => (
                    <SwiperSlide
                      key={item.id}
                      className='flex items-center justify-center !w-full'
                    >
                      <MainMediaPreview item={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Main Slider Navigation Buttons */}
              <button className='main-swiper-button-prev h-8 w-8 sm:h-10 sm:w-10 absolute left-2 top-1/2 transform -translate-y-1/2 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-md z-10 hover:opacity-90 transition-opacity'>
                <ArrowLeft2 size={20} color='white' />
              </button>
              <button className='main-swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 sm:w-10 sm:h-10 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-md z-10 hover:opacity-90 transition-opacity'>
                <ArrowRight2 size={20} color='white' />
              </button>
            </div>
          </div>

          {/* Thumbnail Slider */}
          <div className='relative px-12 lg:px-16 lg:max-w-[940px] lg:w-[940px] max-w-[90vw] w-[90vw] overflow-hidden'>
            {isClient && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Navigation, Thumbs]}
                watchSlidesProgress={true}
                spaceBetween={6}
                slidesPerView={3}
                breakpoints={{
                  480: {
                    slidesPerView: 4,
                    spaceBetween: 8,
                  },
                  640: {
                    slidesPerView: 5,
                    spaceBetween: 8,
                  },
                  768: {
                    slidesPerView: 6,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 8,
                    spaceBetween: 12,
                  },
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                className='w-full'
                onInit={() => {}}
                onBeforeInit={() => {}}
              >
                {items.map(item => (
                  <SwiperSlide key={item.id} className='w-auto'>
                    <MediaThumbnail item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Custom Navigation Buttons - Hidden with CSS */}
            <button className='swiper-button-prev border !h-full rounded-[4px] border-[var(--border-dark)] absolute !bottom-0 !top-[unset] left-0 w-6 sm:w-7 md:w-8 flex items-center justify-center shadow-md z-10 [&::after]:hidden'>
              <ArrowLeft2 size={12} color='var(--text-dark)' />
            </button>
            <button className='swiper-button-next absolute !h-full rounded-[4px] !bottom-0 !top-[unset] right-0 w-6 sm:w-7 md:w-8 flex items-center justify-center shadow-md z-10 [&::after]:hidden'>
              <ArrowRight2 size={16} color='var(--text-dark)' />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
