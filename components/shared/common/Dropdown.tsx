import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import React from 'react';

export interface DropdownOption {
  label: string;
  action: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

interface DropdownProps {
  menuOptions: DropdownOption[];
  onAction: (action: string) => void;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
  itemsClass?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  menuOptions,
  onAction,
  trigger,
  align = 'end',
  className,
  itemsClass,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className='self-start'>
      {trigger}
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align={align}
      className={cn(
        'bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-xl',
        className
      )}
    >
      {menuOptions.map(({ icon: Icon, label, action, disabled }, index) => (
        <DropdownMenuItem
          key={index}
          onClick={e => {
            e.stopPropagation();
            if (!disabled) {
              onAction(action);
            }
          }}
          className={cn(
            'p-2 xl:p-[10px] font-medium text-base transition-colors rounded-none flex items-center gap-2',
            itemsClass,
            index !== menuOptions.length - 1 &&
              'border-b border-[var(--border-dark)]',
            disabled
              ? 'cursor-not-allowed opacity-50 text-[var(--text-muted)]'
              : 'cursor-pointer hover:!bg-[var(--select-option)]'
          )}
        >
          {Icon && (
            <Icon
              size='20'
              color='var(--text-dark)'
              className='!h-6 !w-6'
              variant='Outline'
            />
          )}
          <span>{label}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Dropdown;
