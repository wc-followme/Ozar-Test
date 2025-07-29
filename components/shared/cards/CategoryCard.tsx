'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ACTIONS } from '@/constants/common';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import React, { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
    className?: string;
  }>;
}

interface CategoryCardProps {
  name: string;
  description: string;
  iconSrc: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  iconBgColor: string;
  menuOptions: MenuOption[];
  categoryUuid: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function CategoryCard({
  name,
  description,
  iconSrc,
  iconColor,
  iconBgColor,
  menuOptions,
  categoryUuid: _categoryUuid,
  onDelete,
  onEdit,
}: CategoryCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get user permissions for categories
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.categories?.edit;
  const canArchive = userPermissions?.categories?.archive;

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
    switch (action) {
      case ACTIONS.EDIT:
        if (onEdit) {
          onEdit();
        }
        break;
      case ACTIONS.DELETE:
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className='flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] h-full rounded-[24px] border border-[var(--border-dark)] hover:shadow-2xl sm:hover:shadow-lg transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'>
        <div className='flex items-start justify-between w-full'>
          <div
            className={`flex items-center justify-center w-[60px] h-[60px] rounded-[16px] mb-2`}
            style={{ background: iconBgColor, color: iconColor }}
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
                  size: 32,
                  color: iconColor || '#000000',
                });
              }
            })()}
          </div>

          {showMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
              >
                {filteredMenuOptions.map(
                  ({ icon: IconComponent, action, label }, index) => {
                    return (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => handleMenuAction(action)}
                        className={cn(
                          'text-base p-[10px] rounded-md cursor-pointer transition-colors flex font-medium items-center gap-2 hover:!bg-[var(--select-option)]',
                          index !== filteredMenuOptions.length - 1 &&
                            'border-b border-[var(--border-dark)]'
                        )}
                      >
                        <IconComponent
                          size='24'
                          color='var(--text-dark)'
                          className='!h-6 !w-6'
                          variant='Outline'
                        />
                        <span>{label}</span>
                      </DropdownMenuItem>
                    );
                  }
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <CardContent className='flex flex-col items-start gap-4 p-0 w-full flex-1'>
          <div className='flex flex-col gap-2 w-full'>
            <h3 className='text-base font-bold text-[var(--text)]'>{name}</h3>
            <p className='text-base text-[var(--text-secondary)] leading-tight line-clamp-3'>
              {description}
            </p>
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title='Are you sure you want to archive?'
        subtitle='This action cannot be undone.'
      />
    </>
  );
}
