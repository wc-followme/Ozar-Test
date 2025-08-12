'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ACTIONS } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

export interface BoxCardProps {
  id: string;
  number: string;
  color: string;
  textColor?: string;
  title: string;
  description?: string;
  enabled: boolean;
  menuOptions: MenuOption[];
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
  onClick?: () => void; // New prop for card click
  showMenu?: boolean; // New prop to control menu visibility
}

export const BoxCard: React.FC<BoxCardProps> = ({
  number,
  color,
  textColor = '#FFFFFF',
  title,
  description = 'General information and details.',
  enabled,
  menuOptions,
  onEdit,
  onDelete,
  onToggle,
  onClick,
  showMenu: showMenuProp = true, // Default to true for backward compatibility
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Get user permissions for roles (using same permissions as roles for consistency)
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.roles?.edit;
  const canArchive = userPermissions?.roles?.archive;

  // Filter menu options based on permissions
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });

  // Only show menu if there are any visible options AND showMenu prop is true
  const showMenu = showMenuProp && filteredMenuOptions.length > 0;

  const handleToggle = async () => {
    if (!onToggle) return;
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  };

  const handleMenuAction = (action: string) => {
    if (action === ACTIONS.EDIT && onEdit) onEdit();
    if (action === ACTIONS.DELETE) setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    setShowDelete(false);
    if (onDelete) onDelete();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on menu or toggle
    if (
      (e.target as HTMLElement).closest('[data-menu-trigger]') ||
      (e.target as HTMLElement).closest('[data-toggle-area]')
    ) {
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className='bg-[var(--card-background)] flex flex-col rounded-3xl border border-[var(--border-dark)] hover:shadow-card-hover p-6 transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100 cursor-pointer'
      onClick={handleCardClick}
    >
      {/* Header with Digit Circle and Menu */}
      <div className='flex items-start justify-between mb-4'>
        {/* Digit Circle */}
        <div
          className='w-[60px] h-[60px] rounded-2xl flex items-center justify-center font-bold text-lg'
          style={{ backgroundColor: color, color: textColor }}
        >
          {number}
        </div>

        {/* Menu Button */}
        {showMenu && (
          <Dropdown
            menuOptions={filteredMenuOptions}
            onAction={handleMenuAction}
            trigger={
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 flex-shrink-0'
                data-menu-trigger='true'
              >
                <IconDotsVertical
                  className='!w-6 !h-6'
                  strokeWidth={2}
                  color='var(--text)'
                />
              </Button>
            }
            align='end'
          />
        )}
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2 h-auto mb-4'>
        {/* Title */}
        <h3 className='font-bold text-[var(--text-dark)] text-sm md:text-base'>
          {title}
        </h3>

        {/* Description */}
        <p className='text-sm md:text-base text-[var(--text-secondary)] leading-tight line-clamp-3'>
          {description}
        </p>

        {/* Enable Toggle - Using CompanyCard switch style */}
      </div>
      <div
        className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-auto'
        data-toggle-area='true'
        onClick={e => {
          e.stopPropagation(); // Prevent card click when clicking toggle
        }}
      >
        <span className='text-[12px] font-medium text-[var(--text-dark)]'>
          Enable
        </span>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className='
              h-4 w-9 
              data-[state=checked]:bg-[var(--secondary)] 
              data-[state=unchecked]:bg-gray-300
              [&>span]:h-3 
              [&>span]:w-3 
              [&>span]:bg-white 
              data-[state=checked]:[&>span]:border-green-400
              [&>span]:transition-all
              [&>span]:duration-200
            '
        />
      </div>

      <ConfirmDeleteModal
        open={showDelete}
        title='Are you sure you want to delete this box?'
        subtitle='This action cannot be undone.'
        onCancel={() => setShowDelete(false)}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};
