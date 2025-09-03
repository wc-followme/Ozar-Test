import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import FormErrorMessage from './FormErrorMessage';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  className?: string;
  optionClassName?: string;
  triggerClassName?: string; // New prop for SelectTrigger
  disabled?: boolean; // New prop for disabled state
}

const selectContentStyle =
  'bg-[var(--white-background)] border border-[var(--border-light)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]';
const selectItemStyle =
  'text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]';

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error,
  className = '',
  optionClassName = '',
  triggerClassName = '', // Destructure new prop
  disabled = false, // Destructure disabled prop
}) => {
  const handleValueChange = (newValue: string) => {
    if (disabled) return; // Prevent changes when disabled
    onValueChange(newValue);
  };

  return (
    <div className={`sm:space-y-2 space-y-1 ${className}`}>
      {label && <Label className='field-label'>{label}</Label>}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`h-12 border-2 border-[var(--border-dark)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] ${triggerClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={selectContentStyle}>
          {options.length > 0 ? (
            options.map(({ value, label, disabled: optionDisabled }) => (
              <SelectItem
                key={value}
                value={value}
                disabled={optionDisabled ?? false}
                className={`${selectItemStyle} ${optionClassName}`}
              >
                {label}
              </SelectItem>
            ))
          ) : (
            <SelectItem
              key={'no-data'}
              value={'no-data'}
              disabled={true}
              className={`${selectItemStyle} ${optionClassName}`}
            >
              No data available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {error && <FormErrorMessage message={error} />}
    </div>
  );
};

export default SelectField;
