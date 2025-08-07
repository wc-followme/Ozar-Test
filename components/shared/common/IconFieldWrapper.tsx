import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import FormErrorMessage from './FormErrorMessage';

export type IconOption = {
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor?: string;
};

interface IconFieldWrapperProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  iconOptions: IconOption[];
  error?: string;
}

const IconFieldWrapper: React.FC<IconFieldWrapperProps> = ({
  label,
  value,
  onChange,
  iconOptions,
  error,
}) => {
  const getSelectedIconOption = () =>
    iconOptions.find(opt => opt.value === value) || iconOptions[0];

  return (
    <div className='flex flex-col items-start gap-2'>
      <label className='field-label'>{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='input-field'>
          <SelectValue>
            <div
              className='flex w-8 h-8 items-center justify-center rounded-[10px]'
              style={{
                backgroundColor:
                  getSelectedIconOption()?.bgColor ??
                  `${getSelectedIconOption()?.color ?? ''}26`,
                color: getSelectedIconOption()?.color ?? '',
              }}
            >
              {(() => {
                const IconComponent = getSelectedIconOption()?.icon;
                return IconComponent ? (
                  <IconComponent className='w-5 h-6' />
                ) : null;
              })()}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className='bg-[var(--white-background)] min-w-fit border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
          {iconOptions.map(({ icon: IconComponent, value, color, bgColor }) => (
            <SelectItem key={value} value={value} className='cursor-pointer'>
              <div className='flex items-center gap-2'>
                <div
                  className='flex w-8 h-8 items-center justify-center rounded-md'
                  style={{ backgroundColor: bgColor ?? `${color}26`, color }}
                >
                  <IconComponent className='w-5 h-5' />
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormErrorMessage message={error || ''} />
    </div>
  );
};

export default IconFieldWrapper;
