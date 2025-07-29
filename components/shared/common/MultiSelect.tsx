import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import FormErrorMessage from './FormErrorMessage';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps<OptionType = MultiSelectOption> {
  label?: string;
  options: OptionType[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  getOptionLabel?: (option: OptionType) => string;
  getOptionValue?: (option: OptionType) => string;
  maxHeight?: number;
  maxSelectedItems?: number;
}

const MultiSelect = <OptionType = MultiSelectOption,>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  error,
  name,
  getOptionLabel = (option: any) => option.label,
  getOptionValue = (option: any) => option.value,
}: MultiSelectProps<OptionType>) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Show different number of tags based on screen size
  const maxTagsToShow = isMobile ? 1 : 3;
  const displayTags = value.slice(0, maxTagsToShow);
  const moreCount =
    value.length > maxTagsToShow ? value.length - maxTagsToShow : 0;

  // Debug: log the values to see what's happening
  console.log('MultiSelect Debug:', {
    valueLength: value.length,
    isMobile,
    maxTagsToShow,
    displayTagsLength: displayTags.length,
    moreCount,
    value,
  });

  return (
    <div className='space-y-1 md:space-y-2 w-full'>
      {label && (
        <Label htmlFor={name} className='field-label'>
          {label}
        </Label>
      )}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            className={cn(
              'h-12 w-full flex items-center justify-between border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] px-3 py-2 min-h-[40px] shadow-none focus:border-green-500 focus:ring-green-500',
              error ? 'border-[var(--warning)]' : 'border-[var(--border-dark)]'
            )}
          >
            <div className='flex flex-wrap gap-2 text-left'>
              {value.length === 0 && (
                <span className='text-gray-400'>{placeholder}</span>
              )}
              {displayTags.map(tag => {
                const opt = options.find(o => getOptionValue(o) === tag);
                return (
                  <span
                    key={tag}
                    className='bg-[#00A8BF26] text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium'
                  >
                    {opt ? getOptionLabel(opt) : tag}
                  </span>
                );
              })}
              {moreCount > 0 && value.length > maxTagsToShow && (
                <span className='bg-[#00A8BF26] text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium'>
                  +{moreCount} more
                </span>
              )}
            </div>
            <ChevronDown className='ml-2 w-5 h-5 text-gray-400' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full bg-[var(--card-background)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-[12px] border border-[var(--border-dark)]'>
          <div
            className='max-h-48 overflow-y-auto'
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
            <div className='py-2'>
              {options.map(opt => {
                const optionValue = getOptionValue(opt);
                return (
                  <label
                    key={optionValue}
                    className='flex items-center gap-3 py-2 px-2 cursor-pointer text-[var(--text-dark)] text-base border-b border-[var(--border-dark)] last-of-type:border-b-0 hover:bg-[var(--select-option)]'
                  >
                    <Checkbox
                      checked={value.includes(optionValue)}
                      onCheckedChange={() => handleToggle(optionValue)}
                      className='rounded-[6px] border-2 border-[#BFBFBF] data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary] data-[state=checked]:text-white text-white w-6 h-6 flex items-base justify-center mt-0.5'
                    />
                    <span>{getOptionLabel(opt)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <FormErrorMessage message={error || ''} />
    </div>
  );
};

export default MultiSelect;
