'use client';

import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export interface FieldItem {
  id: string;
  label: string;
  enabled: boolean;
}

interface FieldManagementSwitchProps {
  fields: FieldItem[];
  onFieldToggle: (fieldId: string, enabled: boolean) => void;
}

export const FieldManagementSwitch: React.FC<FieldManagementSwitchProps> = ({
  fields,
  onFieldToggle,
}) => {
  const [localFields, setLocalFields] = useState<FieldItem[]>(fields);

  const handleToggle = (fieldId: string, enabled: boolean) => {
    setLocalFields(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, enabled } : field))
    );
    onFieldToggle(fieldId, enabled);
  };

  return (
    <div className='space-y-4'>
      {localFields.map(field => (
        <div
          key={field.id}
          className='flex items-center justify-between p-4 bg-[var(--background)] rounded-[10px] '
        >
          <span className='text-base font-medium text-[var(--text-dark)]'>
            {field.label}
          </span>
          <Switch
            checked={field.enabled}
            onCheckedChange={enabled => handleToggle(field.id, enabled)}
            className='
                h-4 w-9 
                data-[state=checked]:bg-[var(--secondary)] 
                data-[state=unchecked]:bg-gray-300
                [&>span]:h-3 
                [&>span]:w-3 
                [&>span]:bg-white 
                data-[state=checked]:[&>span]:border-green-400
                [&>span]:transition-all
                [&>span]:duration-200
              '
          />
        </div>
      ))}
    </div>
  );
};
