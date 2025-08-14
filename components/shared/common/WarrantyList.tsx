'use client';

import { Dropdown, DropdownOption } from '@/components/shared/common/Dropdown';
import { Button } from '@/components/ui/button';
import { Edit2, Trash } from 'iconsax-react';
import { MoreVertical } from 'lucide-react';
import { Label } from '../../ui/label';

interface WarrantyListProps {
  id: string;
  title: string;
  duration: string;
  description: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WarrantyList = ({
  id,
  title,
  duration,
  description,
  onEdit,
  onDelete,
}: WarrantyListProps) => {
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
    <div className='bg-[var(--card-background)] rounded-[10px] p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex lg:flex-row flex-col items-start lg:items-center gap-3 flex-1'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-semibold text-[var(--text-dark)] text-base'>
                {title}
              </h4>
            </div>
            <p className='text-[var(--text-dark)] text-sm leading-relaxed'>
              {description}
            </p>
          </div>
          <div className='flex flex-col gap-1 lg:items-center min-w-[120px] border-0 lg:border-l border-[var(--border-dark)] lg:pl-4'>
            <Label className='text-[var(--text-dark)] text-sm font-semibold'>
              Duration
            </Label>
            <span className='text-base font-medium text-[var(--primary)]'>
              {' '}
              {duration}
            </span>
          </div>
        </div>

        {/* 3-dots Menu */}
        <div className='flex-shrink-0 ml-2 lg:self-center'>
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
                  size={20}
                  className='text-[var(--text-dark) !h-6 !w-6'
                  color='var(--text-dark)'
                />
              </Button>
            }
            align='end'
          />
        </div>
      </div>
    </div>
  );
};
