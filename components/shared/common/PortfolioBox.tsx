'use client';

import { Dropdown, DropdownOption } from '@/components/shared/common/Dropdown';
import { Button } from '@/components/ui/button';
import { Edit2, Gallery, Trash, VideoPlay } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';

interface PortfolioBoxProps {
  id: string;
  title: string;
  image?: string;
  imageCount?: number;
  videoCount?: number;
  onEdit?: ((id: string) => void) | undefined;
  onDelete?: ((id: string) => void) | undefined;
  showEditMenu?: boolean;
}

export const PortfolioBox = ({
  id,
  title,
  image,
  imageCount = 0,
  videoCount = 0,
  onEdit,
  onDelete,
  showEditMenu = true,
}: PortfolioBoxProps) => {
  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit?.(id);
        break;
      case 'delete':
        onDelete?.(id);
        break;
    }
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
    <div className='bg-[var(--bg-dark)] rounded-2xl border-2 border-[var(--border-dark)] overflow-hidden hover:shadow-md transition-shadow'>
      {/* Image Section */}
      <div className='aspect-[298/296] flex items-center justify-center relative group bg-[var(--background)]'>
        {image ? (
          <Image
            src={image}
            alt={title}
            className='max-w-full object-cover h-auto w-auto max-h-full'
            height={296}
            width={298}
          />
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
          <div className='absolute bottom-2 right-2 bg-[var(--text-dark)]/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2'>
            {imageCount > 0 && (
              <div className='flex items-center gap-1'>
                <Gallery
                  size={16}
                  className='text-white'
                  color='var(--icon-dark)'
                />
                <span className='text-white text-sm font-medium'>
                  {imageCount}
                </span>
              </div>
            )}
            {videoCount > 0 && (
              <div className='flex items-center gap-1'>
                <VideoPlay
                  size={16}
                  className='text-white'
                  color='var(--icon-dark)'
                />
                <span className='text-white text-sm font-medium'>
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
        {showEditMenu && (
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
        )}
      </div>
    </div>
  );
};
