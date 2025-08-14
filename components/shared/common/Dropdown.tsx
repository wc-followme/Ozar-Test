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
      {menuOptions.map(({ icon: Icon, label, action }, index) => (
        <DropdownMenuItem
          key={index}
          onClick={e => {
            e.stopPropagation();
            onAction(action);
          }}
          className={cn(
            'text-sm p-2 xl:p-[10px] cursor-pointer transition-colors rounded-none flex items-center gap-2 hover:!bg-[var(--select-option)]',
            itemsClass,
            index !== menuOptions.length - 1 &&
              'border-b border-[var(--border-dark)]'
          )}
        >
          {Icon && (
            <Icon
              size='20'
              color='var(--text-dark)'
              className='!h-5 !w-5'
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
