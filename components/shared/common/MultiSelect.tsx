import { Avatar } from '@/components/shared/common/Avatar';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Trash } from 'iconsax-react';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  image?: string;
}

interface MultiSelectProps<OptionType = MultiSelectOption> {
  label?: string;
  options: OptionType[];
  value?: string[]; // Make optional with default
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  getOptionLabel?: (option: OptionType) => string;
  getOptionSubLabel?: (option: OptionType) => string | undefined;
  getOptionValue?: (option: OptionType) => string;
  getOptionImage?: (option: OptionType) => string | undefined;
  maxHeight?: number;
  maxSelectedItems?: number;
  disabled?: boolean; // Add disabled prop
}

const MultiSelect = <OptionType = MultiSelectOption,>({
  label,
  options,
  value = [], // Add default empty array
  onChange,
  placeholder = 'Select',
  error,
  name,
  getOptionLabel = (option: any) => option.label || option.name || 'Unknown',
  getOptionSubLabel = (option: any) => option.subLabel,
  getOptionValue = (option: any) => option.value,
  getOptionImage = (option: any) => option.image,
  disabled = false, // Add disabled prop with default
}: MultiSelectProps<OptionType>) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const handleToggle = (optionValue: string) => {
    const currentValue = value || [];
    const newValue = currentValue.includes(optionValue)
      ? currentValue.filter(v => v !== optionValue)
      : [...currentValue, optionValue];
    onChange(newValue);
  };

  const handleClearSelection = () => {
    onChange([]);
  };

  // Handle popover open/close
  const handlePopoverChange = (open: boolean) => {
    if (disabled) return; // Prevent opening when disabled
    setPopoverOpen(open);
    if (!open) {
      setSearchTerm(''); // Reset search when popover closes
    }
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const label = getOptionLabel(option);
    return (
      label &&
      typeof label === 'string' &&
      label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Show different number of tags based on screen size
  const maxTagsToShow = isMobile ? 1 : 3;
  const displayTags = (value || []).slice(0, maxTagsToShow);
  const moreCount =
    (value || []).length > maxTagsToShow
      ? (value || []).length - maxTagsToShow
      : 0;

  return (
    <div className='space-y-1 md:space-y-2 w-full'>
      {label && (
        <Label htmlFor={name} className='field-label'>
          {label}
        </Label>
      )}
      <Popover open={popoverOpen} onOpenChange={handlePopoverChange}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            className={cn(
              'min-h-12 w-full flex items-center justify-between border-2 bg-[var(--white-background)] hover:bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] px-3 py-2 h-auto shadow-none focus:border-[var(--secondary)] focus:ring-[var(--secondary)]',
              error ? 'border-[var(--warning)]' : 'border-[var(--border-dark)]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <div className='flex flex-wrap gap-2 text-left'>
              {(value || []).length === 0 && (
                <span className='text-gray-400'>{placeholder}</span>
              )}
              {displayTags.map(tag => {
                const opt = options.find(o => getOptionValue(o) === tag);
                const imageUrl = opt ? getOptionImage(opt) : undefined;
                const label = opt ? getOptionLabel(opt) : tag;
                const hasImage = imageUrl && imageUrl !== '';

                return (
                  <span
                    key={tag}
                    className={`bg-cyanwave-light text-[var(--text-dark)] rounded-full ${hasImage ? 'pl-1' : 'pl-3'} pr-3 py-1 text-sm font-medium flex items-center gap-2`}
                  >
                    {hasImage ? (
                      <Avatar
                        name={label}
                        image={imageUrl}
                        height={20}
                        width={20}
                        className='w-5 h-5'
                      />
                    ) : null}
                    {label}
                  </span>
                );
              })}
              {moreCount > 0 && (value || []).length > maxTagsToShow && (
                <span className='bg-cyanwave-light text-[var(--text-dark)] rounded-full px-3 py-1 text-sm font-medium flex items-center gap-2'>
                  +{moreCount} more
                </span>
              )}
            </div>
            <ChevronDown className='ml-2 w-5 h-5 text-gray-400' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full bg-[var(--card-background)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-lg border border-[var(--border-dark)]'>
          {/* Search Field */}
          <div className='p-2 border-b border-[var(--border-light)]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500' />
              <Input
                type='text'
                placeholder='Search here...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-3 h-8 border-0 focus:ring-0 focus:border-0 bg-transparent !placeholder-gray-400'
              />
            </div>
          </div>
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
              {filteredOptions.map(opt => {
                const optionValue = getOptionValue(opt);
                return (
                  <label
                    key={optionValue}
                    className='flex items-center justify-between py-2 px-2 cursor-pointer text-[var(--text-dark)] text-base font-medium border-b border-[var(--border-light)] last-of-type:border-b-0 hover:bg-[var(--card-hover)]'
                    onClick={() => handleToggle(optionValue)}
                  >
                    <div className='flex items-center gap-3'>
                      {getOptionImage(opt) && getOptionImage(opt) !== '' ? (
                        <Avatar
                          name={getOptionLabel(opt)}
                          image={getOptionImage(opt) as string}
                          height={24}
                          width={24}
                          className='w-6 h-5'
                        />
                      ) : null}
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {getOptionLabel(opt)}
                        </span>
                        {getOptionSubLabel(opt) && (
                          <span className='text-sm text-gray-500'>
                            {getOptionSubLabel(opt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Checkbox
                      checked={(value || []).includes(optionValue)}
                      onCheckedChange={() => handleToggle(optionValue)}
                      className='rounded-md border-2 border-[var(--dark-border-other)] data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] data-[state=checked]:text-white text-white w-5 h-5 flex items-center justify-center'
                    />
                  </label>
                );
              })}
            </div>
          </div>
          {/* Clear Selection Button */}
          {value.length > 0 && (
            <div className='py-2 px-4 border-t border-[var(--border-light)]'>
              <button
                onClick={handleClearSelection}
                className='flex items-center gap-2 text-[var(--warning)] text-sm font-medium w-full py-2'
              >
                <Trash className='!w-5 !h-5' color='var(--warning)' size={24} />
                Clear Selection
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <FormErrorMessage message={error || ''} />
    </div>
  );
};

export default MultiSelect;
