import { Button } from '@/components/ui/button';
import { ACTIONS } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface TradeCardProps {
  initials: string;
  initialsBg: string;
  tradeName: string;
  category: string;
  menuOptions?: MenuOption[];
  onMenuAction?: (action: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  initials,
  initialsBg,
  tradeName,
  category,
  menuOptions = [],
  onMenuAction,
}) => {
  // Get user permissions for trades
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.trades?.edit;
  const canArchive = userPermissions?.trades?.archive;

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

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  return (
    <div className='bg-white rounded-[12px] border border-[var(--border-dark)] w-full p-[10px] flex items-center gap-4 min-h-[64px] hover:shadow-2xl sm:hover:shadow-md transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'>
      {/* Initials */}
      <div
        className='w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-white font-bold text-lg flex-shrink-0'
        style={{ backgroundColor: initialsBg }}
      >
        {initials}
      </div>

      {/* Trade Info */}
      <div className='flex-1 min-w-0'>
        <h3 className='font-bold text-[var(--text)] truncate text-base'>
          {tradeName}
        </h3>
        <p className='text-sm text-[var(--text-secondary)] truncate'>
          {category}
        </p>
      </div>

      {/* Menu Button */}
      {showMenu && (
        <Dropdown
          menuOptions={
            filteredMenuOptions.filter(
              (opt): opt is Required<MenuOption> => !!opt.icon
            ) as import('../common/Dropdown').DropdownOption[]
          }
          onAction={onMenuAction ?? (() => {})}
          trigger={
            <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
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
  );
};
