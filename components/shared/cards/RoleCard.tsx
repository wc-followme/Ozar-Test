'use client';

import { ROLE_MESSAGES } from '@/app/(DashboardLayout)/role-management/role-messages';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ACTIONS } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React, { useState } from 'react';
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

export interface RoleCardProps {
  iconSrc: React.ComponentType<{ size?: number; color?: string }>;
  iconBgColor: string;
  title: string;
  description?: string;
  permissionCount?: number;
  iconColor?: string;
  menuOptions: MenuOption[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  iconSrc,
  iconBgColor,
  title,
  description = 'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
  permissionCount = 0,
  iconColor,
  menuOptions,
  onEdit,
  onDelete,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  // Get user permissions for roles
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

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  const handleMenuAction = (action: string) => {
    if (action === ACTIONS.EDIT && onEdit) onEdit();
    if (action === ACTIONS.DELETE) setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    setShowDelete(false);
    if (onDelete) onDelete();
  };

  return (
    <Card className='flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] h-full rounded-[24px] border border-[var(--border-dark)] hover:shadow-card-hover transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'>
      <div className='flex items-start justify-between w-full'>
        <div
          className={`flex items-center justify-center w-[60px] h-[60px] rounded-[16px]`}
          style={{ color: iconColor, background: iconBgColor }}
        >
          {(() => {
            // Heuristic: local icons expect className, external expect size/color
            const isLocalIcon = iconSrc && iconSrc.length === 1;
            if (isLocalIcon) {
              return React.createElement(iconSrc as any, {
                className: '!w-[32px] !h-[32px]',
                style: { color: iconColor || '#000000' },
              });
            } else {
              return React.createElement(iconSrc, {
                size: 36,
                color: iconColor || '#000000',
              });
            }
          })()}
        </div>

        {showMenu && (
          <Dropdown
            menuOptions={filteredMenuOptions}
            onAction={handleMenuAction}
            trigger={
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 flex-shrink-0'
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

      <CardContent className='flex flex-col items-start gap-4 p-0 w-full flex-1'>
        <div className='flex flex-col gap-2 w-full'>
          <h3 className='text-sm md:text-base font-bold text-[var(--text)]'>
            {title}
          </h3>

          <p className='text-sm md:text-base text-[var(--text-secondary)] leading-tight line-clamp-3'>
            {description}
          </p>
        </div>

        <div className='flex w-full items-center justify-between px-4 py-2 bg-[var(--border-light)] mt-auto rounded-[30px]'>
          <span className='text-xs font-medium text-[var(--text)]'>
            Permissions
          </span>
          <span className='text-xs font-medium text-[var(--text)]'>
            {permissionCount}
          </span>
        </div>
      </CardContent>
      <ConfirmDeleteModal
        open={showDelete}
        title={ROLE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={ROLE_MESSAGES.DELETE_CONFIRM_SUBTITLE}
        onCancel={() => setShowDelete(false)}
        onDelete={handleConfirmDelete}
      />
    </Card>
  );
};
