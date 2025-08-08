'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Props for SelectBoxCard, designed for use with react-hook-form Controller.
 */
interface SelectBoxCardProps {
  /** Unique id for the checkbox and label */
  id: string;
  /** Field name for form integration */
  name?: string;
  /** Value for the checkbox (step value) */
  value?: string;
  /** Title to display */
  title: string;
  /** Description to display */
  description: string;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** onChange handler for checkbox state */
  onChange: (checked: boolean) => void;
}

export function SelectBoxCard({
  id,
  name,
  value,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: SelectBoxCardProps) {
  return (
    <Label
      className={`relative p-4 rounded-[20px] bg-transparent border-2 border-[var(--border-dark)] transition-all duration-200 cursor-pointer hover:shadow-md [&:has(input:checked)]:border-[var(--primary)] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      // Removed onClick handler to prevent double state updates
    >
      <div className='flex items-start flex-col'>
        <div className='flex items-base pt-0.5 gap-2 mb-3'>
          <Checkbox
            id={id}
            className='
            rounded-[6px] 
            border-2 
            border-[var(--dark-border-other)]
            data-[state=checked]:bg-[--primary]
            data-[state=checked]:border-[--primary]
            data-[state=checked]:text-white
            text-white 
            w-6 h-6
            flex items-center justify-center -mt-0.4
          '
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            onCheckedChange={onChange}
          />
          <p
            className={`text-[18px] leading-[1.2] font-bold cursor-pointer block text-[var(--text-dark)] `}
          >
            {title}
          </p>
        </div>
        <div className=''>
          <p
            className={`text-sm font-normal leading-relaxed text-[var(--text-secondary)]`}
          >
            {description}
          </p>
        </div>
      </div>
    </Label>
  );
}
