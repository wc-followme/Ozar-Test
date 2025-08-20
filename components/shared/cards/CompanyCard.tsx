'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ACTIONS, ROUTES } from '@/constants/common';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

interface companyCardProps {
  name: string;
  createdOn: string;
  subsEnd: string;
  image: string;
  status: boolean;
  onToggle: () => void;
  menuOptions: MenuOption[];
  isDefault?: boolean;
  companyUuid: string;
  onDelete?: () => void;
}

export function CompanyCard({
  name,
  createdOn,
  subsEnd,
  image,
  status,
  onToggle,
  menuOptions,
  isDefault = false,
  companyUuid,
  onDelete,
}: companyCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const [isPlaceholder, setIsPlaceholder] = useState(!image);

  // Generate a consistent placeholder image based on company name
  const getPlaceholderImage = () => {
    const placeholderImages = ['/images/img-placeholder-md.png'];

    // Use company name to consistently pick same placeholder for same company
    const hash = name.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const index = Math.abs(hash) % placeholderImages.length;
    return placeholderImages[index];
  };

  // Get user permissions for companies
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.companies?.assign_user;
  const canArchive = userPermissions?.companies?.archive;

  // Filter menu options based on permissions and isDefault
  const permissionFilteredOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });

  // Apply isDefault filter on top of permission filter
  const filteredMenuOptions = isDefault
    ? permissionFilteredOptions.filter(
        option => option.action !== ACTIONS.DELETE
      )
    : permissionFilteredOptions;

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  };

  const handleCardClick = () => {
    router.push(`${ROUTES.COMPANY_PROFILE}/${companyUuid}`);
  };

  const handleMenuAction = (action: string) => {
    if (action === ACTIONS.EDIT) {
      router.push(`/company-management/edit-company/${companyUuid}`);
    } else if (action === ACTIONS.DELETE) {
      setShowDelete(true);
    }
  };

  return (
    <div
      className='bg-[var(--card-background)] rounded-[12px] border border-[var(--border-dark)] hover:shadow-card-hover px-4 py-[18px] transition-all duration-300 cursor-pointer shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'
      onClick={handleCardClick}
    >
      {/* Header with Avatar, User Info and Menu */}
      <div className=''>
        <div
          className={`${
            !image || image.trim() === '' || isPlaceholder
              ? 'w-full h-[200px] rounded-[12px] overflow-hidden flex items-center justify-center'
              : 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 min-h-[200px] min-w-[240px] max-w-[240px] max-h-[240px] rounded-[12px] overflow-hidden flex items-center justify-center aspect-square mx-auto'
          }`}
        >
          <Image
            src={
              (!image || image.trim() === '' || isPlaceholder
                ? getPlaceholderImage()
                : image || getPlaceholderImage()) as string
            }
            alt={name}
            width={240}
            height={240}
            className={cn(
              'mx-auto',
              !image || image.trim() === '' || isPlaceholder
                ? 'w-full h-full object-cover'
                : 'w-auto h-auto max-h-full max-w-full object-contain'
            )}
            onError={() => {
              if (!isPlaceholder) {
                setIsPlaceholder(true);
              } else {
                setIsPlaceholder(false);
              }
            }}
          />
        </div>
        <div className='flex-1 min-w-0 pt-[18px]'>
          {/* User Info */}
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-bold text-[var(--text)] truncate text-sm md:text-base'>
              {name}
            </h3>
            {showMenu && (
              <Dropdown
                menuOptions={filteredMenuOptions}
                onAction={handleMenuAction}
                trigger={
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-7 w-6 p-0 flex-shrink-0 -mr-2 mt-0.5'
                    onClick={e => {
                      e.stopPropagation(); // Prevent card click when clicking menu
                    }}
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
          <div className='space-y-1'>
            <div className='flex items-center justify-between gap-2 text-[10px] md:text-[12px] font-medium text-[var(--text-secondary)]'>
              <p className='text-[12px] md:text-[14px] font-medium text-[var(--text-dark)] flex flex-col'>
                <span className='text-[var(--text-secondary)] '>
                  Created On
                </span>
                <span className='text-[var(--text)] '>{createdOn}</span>
              </p>
              <p className='text-[12px] md:text-[14px] font-medium text-[var(--text-dark)] flex flex-col'>
                <span className='text-[var(--text-secondary)]'>
                  Subscription End
                </span>
                <span className='text-[var(--text)]'>{subsEnd}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Status Toggle */}
        {!isDefault && canEdit && (
          <div
            className='flex items-center justify-between bg-[var(--border-light)] rounded-[30px] py-2 px-3 mt-4'
            onClick={e => {
              e.stopPropagation(); // Prevent card click when clicking toggle
            }}
          >
            <span className='text-[12px] font-medium text-[var(--text-dark)]'>
              Enable
            </span>
            <Switch
              checked={status}
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
        )}
      </div>

      <ConfirmDeleteModal
        open={showDelete}
        title='Are you sure you want to archive?'
        subtitle='This action cannot be undone.'
        onCancel={() => setShowDelete(false)}
        onDelete={async () => {
          setShowDelete(false);
          if (onDelete) await onDelete();
        }}
      />
    </div>
  );
}
