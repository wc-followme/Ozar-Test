'use client';

import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { CloseCircle } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  // Generate a thumbnail for a given video file
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const videoElement: HTMLVideoElement = document.createElement('video');
      const objectUrl: string = URL.createObjectURL(file);
      videoElement.preload = 'metadata';
      videoElement.src = objectUrl;
      videoElement.muted = true;
      videoElement.playsInline = true;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
      };

      const captureFrame = () => {
        try {
          const canvas: HTMLCanvasElement = document.createElement('canvas');
          const width: number = videoElement.videoWidth || 320;
          const height: number = videoElement.videoHeight || 180;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoElement, 0, 0, width, height);
            const dataUrl: string = canvas.toDataURL('image/png');
            cleanup();
            resolve(dataUrl);
            return;
          }
        } catch {
          // fall through
        }
        cleanup();
        resolve('');
      };

      videoElement.addEventListener('loadedmetadata', () => {
        try {
          // Seek a bit into the video to ensure a frame is available
          videoElement.currentTime = Math.min(
            0.1,
            videoElement.duration || 0.1
          );
        } catch {
          captureFrame();
        }
      });

      videoElement.addEventListener('seeked', captureFrame);
      videoElement.addEventListener('error', () => {
        cleanup();
        resolve('');
      });
    });
  };

  const [videoThumbnails, setVideoThumbnails] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    files.forEach((file: File, index: number) => {
      if (isVideo(file) && !videoThumbnails[index]) {
        generateVideoThumbnail(file).then((thumb: string) => {
          setVideoThumbnails(prev => ({ ...prev, [index]: thumb }));
        });
      }
    });
    // We intentionally skip videoThumbnails from deps to avoid re-generating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

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
                <div className='relative w-full h-full'>
                  <Image
                    src={
                      videoThumbnails[index] || '/images/img-placeholder-sm.png'
                    }
                    alt={`Video ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                  <span className='absolute inset-0 flex items-center justify-center'>
                    <span className='w-7 h-7 rounded-full bg-[rgba(0,0,0,0.25)] shadow-2xl flex items-center justify-center'>
                      <IconPlayerPlayFilled color='white' size={16} />
                    </span>
                  </span>
                </div>
              ) : hasError ? (
                <div className='w-full h-full bg-gray-100'>
                  <div className='relative w-full h-full'>
                    <Image
                      src='/images/img-placeholder-sm.png'
                      alt='Placeholder'
                      fill
                      className='object-cover'
                    />
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
