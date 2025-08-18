'use client';

import Dropdown from '@/components/shared/common/Dropdown';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { IconDotsVertical, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Trash } from 'iconsax-react';
import Image from 'next/image';

interface VideoPreviewCardProps {
  id: string;
  thumbnail: string;
  title: string;
  duration: string;
  className?: string;
}

export const VideoPreviewCard = ({
  id,
  thumbnail,
  title,
  duration,
  className = '',
}: VideoPreviewCardProps) => {
  return (
    <div
      key={id}
      className={`rounded-2xl bg-[--card-background] border border-[var(--border-dark)] overflow-hidden shadow-sm ${className}`}
    >
      <div className='relative'>
        <AspectRatio ratio={10 / 4}>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className='object-cover'
            priority={false}
          />
        </AspectRatio>
        {/* Duration (bottom-left) */}
        <span className='absolute bottom-2 left-2 text-xs p-2 py-1 font-medium rounded-md bg-[rgba(0,0,0,0.4)] text-white'>
          {duration}
        </span>
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
            if (action === 'delete') {
              console.log('Delete video:', id);
            }
          }}
        />
      </div>
    </div>
  );
};
