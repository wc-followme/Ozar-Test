'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { Dropdown, DropdownOption } from '@/components/shared/common/Dropdown';
import { Button } from '@/components/ui/button';
import { Edit2, Gallery, Trash, VideoPlay } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface PortfolioBoxProps {
  id: string;
  title: string;
  image?: string;
  /** Indicates if the image prop contains a video file URL */
  isVideo?: boolean;
  imageCount?: number;
  videoCount?: number;
  /** Show only delete button instead of three dots menu */
  showDeleteOnly?: boolean;
  onEdit?: ((id: string) => void) | undefined;
  onDelete?: ((id: string) => void) | undefined;
  onView?: () => void;
  showEditMenu?: boolean;
}

export const PortfolioBox = ({
  id,
  title,
  image,
  isVideo = false,
  imageCount = 0,
  videoCount = 0,
  showDeleteOnly = false,
  onEdit,
  onDelete,
  onView,
  showEditMenu = true,
}: PortfolioBoxProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (!image || image.trim() === '') {
      return undefined;
    }
    return image.startsWith('http') ? image : image;
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'view':
        onView?.();
        break;
      case 'edit':
        onEdit?.(id);
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        break;
    }
  };

  const handleDeleteConfirm = () => {
    onDelete?.(id);
    setShowDeleteConfirm(false);
  };

  const menuOptions: DropdownOption[] = [
    {
      label: 'Edit',
      action: 'edit',
      icon: Edit2,
    },
    {
      label: 'Delete',
      action: 'delete',
      icon: Trash,
    },
  ];

  return (
    <>
      <div
        className='bg-[var(--bg-dark)] rounded-2xl border-2 border-[var(--border-dark)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
        onClick={onView}
      >
        {/* Media Section */}
        <div className='aspect-[298/296] flex items-center justify-center relative group bg-[var(--background)]'>
          {image ? (
            isVideo ? (
              // Render video player for video files
              <div className='w-full h-full relative'>
                {isLoading && (
                  <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
                    <div className='text-gray-500 text-sm'>Loading...</div>
                  </div>
                )}

                {hasError && (
                  <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
                    <div className='text-gray-500 text-sm'>
                      Video not available
                    </div>
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
                    style={{
                      display: isLoading || hasError ? 'none' : 'block',
                    }}
                  />
                )}
              </div>
            ) : (
              <Image
                src={image}
                alt={title}
                className='max-w-full object-cover h-auto w-auto max-h-full'
                height={296}
                width={298}
              />
            )
          ) : (
            <div className='flex flex-col items-center h-full justify-center text-[var(--text-secondary)]'>
              <Gallery
                size={48}
                className='mb-2 opacity-30'
                color='var(--text-dark)'
              />
            </div>
          )}
          {/* Media Count Badge */}
          {(imageCount > 0 || videoCount > 0) && (
            <div className='absolute bottom-2 right-2 bg-[var(--white-background)] backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2'>
              {imageCount > 0 && (
                <div className='flex items-center gap-1'>
                  <Gallery
                    size={16}
                    className='text-[var(--text-dark)]'
                    color='var(--text-dark)'
                  />
                  <span className='text-[var(--text-dark)] text-sm font-medium'>
                    {imageCount}
                  </span>
                </div>
              )}
              {videoCount > 0 && (
                <div className='flex items-center gap-1'>
                  <VideoPlay
                    size={16}
                    className='text-[var(--text-dark)]'
                    color='var(--text-dark)'
                  />
                  <span className='text-[var(--text-dark)] text-sm font-medium'>
                    {videoCount}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='p-4 flex justify-between items-center bg-[var(--card-background)] border-t border-[var(--border-dark)]'>
          <h4 className='font-semibold text-[var(--text-dark)] truncate text-base'>
            {title}
          </h4>
          {showEditMenu &&
            (showDeleteOnly ? (
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 p-0'
                onClick={e => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
              >
                <Trash
                  size={20}
                  color='var(--text-dark)'
                  className='!h-5 !w-5'
                />
              </Button>
            ) : (
              <Dropdown
                menuOptions={menuOptions}
                onAction={handleMenuAction}
                trigger={
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 p-0'
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreVertical
                      size={30}
                      color='var(--text-dark)'
                      className='!h-6 !w-6'
                    />
                  </Button>
                }
                align='end'
              />
            ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteConfirm}
        title='Delete Document'
        subtitle={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={handleDeleteConfirm}
        archiveButtonText='Delete'
      />
    </>
  );
};
