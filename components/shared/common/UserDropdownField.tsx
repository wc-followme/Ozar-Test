import Dropdown from '@/components/shared/common/Dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowDown2, Trash } from 'iconsax-react';
import React from 'react';
import { Avatar as CustomAvatar } from './Avatar';

interface User {
  id: string;
  name: string;
  image?: string;
  initials?: string;
}

interface MenuOption {
  label: string;
  action: string;
  icon?: React.ComponentType<any>;
}

interface UserDropdownFieldProps {
  users: User[];
  maxVisible?: number;
  className?: string;
  menuOptions?: MenuOption[];
  onAction?: (action: string) => void;
  align?: 'start' | 'end' | 'center';
}

const UserDropdownField: React.FC<UserDropdownFieldProps> = ({
  users,
  maxVisible = 3,
  className = '',
  menuOptions = [],
  onAction,
  align = 'end',
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  // Create dropdown menu options with user information
  const dropdownMenuOptions = users.map(user => ({
    label: '', // Empty label since we're showing name in the icon
    action: `user_${user.id}`,
    icon: () => (
      <div className='flex items-center justify-between w-full gap-2'>
        <div className='flex items-center gap-3'>
          <CustomAvatar
            name={user.name}
            {...(user.image && { image: user.image })}
            height={32}
            width={32}
            className='flex-shrink-0 rounded-full'
          />
          <span className='text-base font-medium text-[var(--text-dark)]'>
            {user.name}
          </span>
        </div>
        <Trash
          size={24}
          className='text-[var(--text-secondary)] ml-auto !h-5 !w-5'
          color='var(--text-dark)'
          variant='Outline'
        />
      </div>
    ),
  }));

  const triggerContent = (
    <button
      type='button'
      className={`flex items-center gap-2 rounded-full border border-[var(--border-dark)] bg-[var(--white-background)] py-[6px] px-2 ${className}`}
    >
      <div className='flex -space-x-2'>
        {visibleUsers.map((user, index) => (
          <Avatar
            key={user.id}
            className='w-8 h-8 border-1 border-white ring-2 ring-[var(--background)]'
          >
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className='bg-[var(--primary)] text-white text-xs font-medium'>
              {user.initials ||
                user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {remainingCount > 0 && (
        <span className='text-lg text-[var(--text-dark)]'>
          {remainingCount.toString().padStart(2, '0')}
        </span>
      )}
      <ArrowDown2
        size={16}
        className='text-[var(--text-secondary)] [&>path]:!stroke-2'
        color='var(--text-dark)'
        strokeWidth={3}
      />
    </button>
  );

  return (
    <Dropdown
      align={align}
      trigger={triggerContent}
      menuOptions={dropdownMenuOptions}
      onAction={action => {
        if (action.startsWith('user_')) {
          const userId = action.replace('user_', '');
          onAction && onAction(userId);
        } else {
          onAction && onAction(action);
        }
      }}
    />
  );
};

export default UserDropdownField;
