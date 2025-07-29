import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
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
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className={`sm:space-y-2 space-y-1 ${className}`}>
      {label && <Label className='field-label'>{label}</Label>}
      <Select value={internalValue} onValueChange={handleValueChange}>
        <SelectTrigger
          className={`h-12 border-2 border-[var(--border-dark)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] ${triggerClassName}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={selectContentStyle}>
          {options.map(({ value, label, disabled }) => (
            <SelectItem
              key={value}
              value={value}
              disabled={disabled ?? false}
              className={`${selectItemStyle} ${optionClassName}`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FormErrorMessage message={error} />}
    </div>
  );
};

export default SelectField;
