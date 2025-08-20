'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ACTIONS, ROUTES } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { Call, Icon, Sms } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar } from '../common/Avatar';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { ConfirmRetrieveModal } from '../common/ConfirmRetrieveModal';
import Dropdown from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: Icon;
}

interface UserCardProps {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  status: boolean;
  onToggle: () => void;
  menuOptions: MenuOption[];
  onDelete?: () => void;
  onRetrieve?: (() => void) | undefined;
  disableActions?: boolean;
  userUuid: string;
  avatarColor?: { bg: string; color: string };
  hideMenu?: boolean;
  hideToggle?: boolean;
}

export function UserCard({
  name,
  role,
  phone,
  email,
  image,
  status,
  onToggle,
  menuOptions,
  onDelete,
  onRetrieve,
  disableActions,
  userUuid,
  avatarColor,
  hideMenu = false,
  hideToggle = false,
}: UserCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRetrieve, setShowRetrieve] = useState(false);
  const router = useRouter();

  // Get user permissions for users
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.users?.create;
  const canArchive = userPermissions?.users?.archive;

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

  // Only show menu if there are any visible options and hideMenu is false
  const showMenu = filteredMenuOptions.length > 0 && !hideMenu;

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  };

  const handleMenuAction = (action: string) => {
    if (action === ACTIONS.EDIT) {
      router.push(`${ROUTES.USER_MANAGEMENT}/edit-user/${userUuid}`);
    } else if (action === ACTIONS.DELETE) {
      setShowDelete(true);
    } else if (action === ACTIONS.RETRIEVE) {
      setShowRetrieve(true);
    }
  };

  const handleCardClick = () => {
    router.push(`${ROUTES.USER_PROFILE}/${userUuid}`);
  };

  return (
    <div
      className='flex flex-col gap-2 bg-[var(--card-background)] rounded-[16px] sm:rounded-[12px] border border-[var(--border-dark)] p-4 sm:p-[10px] hover:shadow-card-hover transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100 cursor-pointer'
      onClick={handleCardClick}
    >
      {/* Header with Avatar, User Info and Menu */}
      <div className='flex items-start gap-4'>
        <Avatar
          name={name}
          image={image}
          avatarColor={avatarColor}
          height={80}
          width={80}
          className='rounded-[12px] sm:rounded-[10px] shadow-lg sm:shadow-none transition-transform duration-300 hover:scale-105 sm:hover:scale-100'
        />

        <div className='flex-1 min-w-0'>
          {/* User Info */}
          <div className='flex items-start'>
            <div className='mb-1.5 flex-1 truncate'>
              <h3 className='font-bold text-[var(--text)] truncate text-base'>
                {name}
              </h3>
              <p className='text-xs font-medium text-[var(--text-dark)]'>
                {role}
              </p>
            </div>
            {showMenu && (
              <Dropdown
                menuOptions={filteredMenuOptions}
                onAction={handleMenuAction}
                trigger={
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-fit p-0 flex-shrink-0 shadow-sm sm:shadow-none hover:shadow-md sm:hover:shadow-none transition-all duration-200'
                    disabled={disableActions}
                    onClick={e => e.stopPropagation()}
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

          {/* Contact Info */}
          <div className='space-y-0.5'>
            <div className='flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]'>
              <Call
                size='13'
                color='var(--text-dark)'
                className='flex-shrink-0'
              />
              <span className='truncate'>{phone}</span>
            </div>
            <div className='flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]'>
              <Sms
                size='13'
                color='var(--text-dark)'
                variant='Outline'
                className='flex-shrink-0'
              />
              <span className='truncate'>{email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Toggle */}
      {canEdit && !hideToggle && (
        <div
          className='flex items-center mt-auto justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 shadow-sm sm:shadow-none'
          onClick={e => e.stopPropagation()}
        >
          <span className='text-xs font-medium text-[var(--text-dark)]'>
            Enable
          </span>
          <Switch
            checked={status}
            onCheckedChange={handleToggle}
            disabled={isToggling || disableActions}
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
      )}
      <ConfirmDeleteModal
        open={showDelete}
        title={`Are you sure you want to archive?`}
        subtitle={`This action cannot be undone.`}
        onCancel={() => setShowDelete(false)}
        onDelete={async () => {
          setShowDelete(false);
          if (onDelete) await onDelete();
        }}
      />
      <ConfirmRetrieveModal
        open={showRetrieve}
        title={`Are you sure you want to retrieve?`}
        subtitle={`This will restore the user to active status.`}
        onCancel={() => setShowRetrieve(false)}
        onRetrieve={async () => {
          setShowRetrieve(false);
          if (onRetrieve) await onRetrieve();
        }}
      />
    </div>
  );
}
