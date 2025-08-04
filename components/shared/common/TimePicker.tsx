'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Clock } from 'iconsax-react';
import React, { useState } from 'react';

export interface TimeOption {
  value: string;
  label: string;
}

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  timeOptions?: TimeOption[];
  maxHeight?: string;
}

// Default time options
const defaultTimeOptions: TimeOption[] = [
  { value: '09:00 AM', label: '09:00 AM' },
  { value: '09:30 AM', label: '09:30 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '10:30 AM', label: '10:30 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '11:30 AM', label: '11:30 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '12:30 PM', label: '12:30 PM' },
  { value: '01:00 PM', label: '01:00 PM' },
  { value: '01:30 PM', label: '01:30 PM' },
  { value: '02:00 PM', label: '02:00 PM' },
  { value: '02:30 PM', label: '02:30 PM' },
  { value: '03:00 PM', label: '03:00 PM' },
  { value: '03:30 PM', label: '03:30 PM' },
  { value: '04:00 PM', label: '04:00 PM' },
  { value: '04:30 PM', label: '04:30 PM' },
  { value: '05:00 PM', label: '05:00 PM' },
  { value: '05:30 PM', label: '05:30 PM' },
  { value: '06:00 PM', label: '06:00 PM' },
  { value: '06:30 PM', label: '06:30 PM' },
  { value: '07:00 PM', label: '07:00 PM' },
  { value: '07:30 PM', label: '07:30 PM' },
  { value: '08:00 PM', label: '08:00 PM' },
  { value: '08:30 PM', label: '08:30 PM' },
  { value: '09:00 PM', label: '09:00 PM' },
  { value: '09:30 PM', label: '09:30 PM' },
  { value: '10:00 PM', label: '10:00 PM' },
  { value: '10:30 PM', label: '10:30 PM' },
  { value: '11:00 PM', label: '11:00 PM' },
  { value: '11:30 PM', label: '11:30 PM' },
];

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select Time',
  className,
  error = false,
  disabled = false,
  timeOptions = defaultTimeOptions,
  maxHeight = 'max-h-60',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] hover:!bg-[var(--white-background)]',
            !value && 'text-muted-foreground',
            error ? '!border-[var(--warning)]' : 'border-[var(--border-dark)]',
            className
          )}
          disabled={disabled}
        >
          {value || <span>{placeholder}</span>}
          <Clock className='ml-auto !h-6 !w-6' color='#24338C' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[200px] p-0 bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]',
          maxHeight
        )}
        align='start'
      >
        <div
          className={cn('overflow-y-auto', maxHeight)}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
          }}
          onWheel={e => {
            // Handle mouse wheel scrolling for desktop
            e.currentTarget.scrollTop += e.deltaY;
          }}
          onTouchStart={e => {
            // Allow touch events to propagate
            e.stopPropagation();
          }}
          onTouchMove={e => {
            // Allow touch scrolling
            e.stopPropagation();
          }}
        >
          <div className='p-2'>
            {timeOptions.map(timeOption => (
              <button
                key={timeOption.value}
                type='button'
                className='w-full text-left px-3 py-2 text-sm hover:bg-[var(--select-option)] rounded-[5px] transition-colors'
                onClick={() => handleTimeSelect(timeOption.value)}
              >
                {timeOption.label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
