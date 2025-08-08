'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { EstimationItem } from './estimation-types';

interface EstimationItemFormProps {
  item: EstimationItem;
  onItemUpdate?: (updatedItem: EstimationItem) => void;
  onDelete?: () => void;
}

export default function EstimationItemForm({
  item,
  onItemUpdate,
  onDelete,
}: EstimationItemFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('$');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const currencyOptions = [
    { value: '$', label: '$' },
    { value: '€', label: '€' },
    { value: '£', label: '£' },
  ];

  const handleInputChange = (
    field: keyof EstimationItem,
    value: string | number
  ) => {
    if (onItemUpdate) {
      onItemUpdate({
        ...item,
        [field]: value,
      });
    }
  };

  return (
    <div className='border border-[var(--border-dark)] rounded-[10px] p-4 bg-[var(--white-background)]'>
      <div className='flex items-start gap-4 mb-2'>
        <div className='space-y-2 flex-1'>
          <Label className='field-label text-sm'>Material Name</Label>
          <SelectField
            value={item.name}
            onValueChange={value => handleInputChange('name', value)}
            options={[{ value: item.name, label: item.name }]}
            placeholder='Select material'
            className='mb-0'
          />
        </div>
        <div className='space-y-2 flex-1'>
          <Label className='field-label text-sm'>Variant</Label>
          <SelectField
            value={item.variant}
            onValueChange={value => handleInputChange('variant', value)}
            options={[{ value: item.variant, label: item.variant }]}
            placeholder='Select variant'
            className='mb-0'
          />
        </div>
        <div className='space-y-2 w-[150px]'>
          <Label className='field-label text-sm'>Qty</Label>
          <Input
            type='number'
            value={item.qty}
            onChange={e =>
              handleInputChange('qty', parseInt(e.target.value) || 0)
            }
            className='input-field'
          />
        </div>
        <div className='space-y-2 w-[150px]'>
          <Label className='field-label text-sm'>Unit</Label>
          <SelectField
            value={item.unit}
            onValueChange={value => handleInputChange('unit', value)}
            options={[{ value: item.unit, label: item.unit }]}
            placeholder='Select unit'
            className='mb-0'
          />
        </div>
        <div className='self-center pt-8'>
          <button
            onClick={onDelete}
            className='text-[var(--text-secondary)] hover:text-[var(--text-dark)] transition-colors'
            type='button'
          >
            <IconDotsVertical size={24} color='var(--text-dark)' />
          </button>
        </div>
      </div>
      <div className='flex items-start gap-4 justify-between mt-4'>
        <div className='flex-1 space-y-2'>
          <Label className='field-label text-sm'>Description</Label>
          <Textarea
            value={item.description}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={1}
            className='input-field min-h-12'
          />
        </div>
        <div className='space-y-2'>
          <Label className='field-label text-sm'>Rate</Label>
          <Input
            type='text'
            value={formatCurrency(item.rate)}
            onChange={e => {
              const numericValue =
                parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
              handleInputChange('rate', numericValue);
            }}
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <Label className='field-label text-sm'>Markup %</Label>
          <div className='flex focus-within:ring-2 focus-within:ring-[var(--secondary)] focus-within:ring-opacity-50'>
            <div className='w-[60px]'>
              <SelectField
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
                options={currencyOptions}
                placeholder='$'
                className='mb-0'
                triggerClassName='rounded-l-[10px] font-bold !border-r-0 !rounded-r-none h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] focus-within:border-[var(--secondary)]'
              />
            </div>
            <Input
              type='text'
              value={item.markup.toString()}
              onChange={e => {
                const numericValue =
                  parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                handleInputChange('markup', numericValue);
              }}
              className='flex-1 rounded-l-none text-right !border-l-0 h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] focus-within:border-[var(--secondary)]'
            />
          </div>
        </div>
        <div className='ml-4 space-y-1 pt-7'>
          <Label className='field-label font-medium text-[var(--text-dark)] text-xs'>
            Line Total
          </Label>
          <p className='text-lg font-semibold text-[var(--primary)]'>
            {formatCurrency(item.lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
