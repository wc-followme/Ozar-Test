'use client';

import { cn } from '@/lib/utils';
import { DocumentText1, Minus } from 'iconsax-react';

interface QRCodeListingCardProps {
  fileName: string;
  onRemove: () => void;
  className?: string;
}

export const QRCodeListingCard: React.FC<QRCodeListingCardProps> = ({
  fileName,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'w-full flex items-center justify-between rounded-[10px] border-2 border-[var(--border-dark)] bg-[var(--card-background)] px-3 py-2',
        className
      )}
    >
      <div className='flex items-center gap-2 min-w-0'>
        <DocumentText1 size={20} color='var(--text-dark)' />
        <span className='truncate text-base text-[var(--text-dark)]'>
          {fileName}
        </span>
      </div>
      <button
        type='button'
        onClick={onRemove}
        className='w-7 h-7 rounded-[10px] border-2 border-[#C0C6CD] flex items-center justify-center shrink-0'
        aria-label='Remove file'
      >
        <Minus size={16} color='var(--text-secondary)' />
      </button>
    </div>
  );
};
