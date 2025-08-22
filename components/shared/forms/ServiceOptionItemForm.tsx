'use client';

import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { Input } from '@/components/ui/input';
import { TABLE_ACTION_TRIGGER_ICON } from '@/constants/tableactions';
import { Trash } from 'iconsax-react';
import { useEffect } from 'react';
import { EstimationItem } from './estimation-types';

interface ServiceOptionItemFormProps {
  items: EstimationItem[];
  onItemUpdate: (itemId: string, updatedItem: EstimationItem) => void;
  onItemDelete: (itemId: string) => void;
  onAddItem: () => void;
  serviceId?: string | undefined;
}

export default function ServiceOptionItemForm({
  items,
  onItemUpdate,
  onItemDelete,
  onAddItem,
}: ServiceOptionItemFormProps) {
  // Seed at least one row so fields are visible
  useEffect(() => {
    if (items.length === 0) {
      onAddItem();
    }
  }, [items.length, onAddItem]);

  const columns = [
    {
      key: 'name',
      label: 'Material Name',
      type: 'text' as const,
      width: 'w-[360px]',
    },
    {
      key: 'qty',
      label: 'Qty',
      type: 'text' as const,
      width: 'w-[120px]',
      align: 'center' as const,
    },
    { key: 'unit', label: 'Unit', type: 'text' as const, width: 'w-[140px]' },
    { key: 'rate', label: 'Rate', type: 'text' as const, width: 'w-[140px]' },
    {
      key: 'markup',
      label: 'Markup %',
      type: 'text' as const,
      width: 'w-[140px]',
    },
    {
      key: 'lineTotal',
      label: 'Line Total',
      type: 'text' as const,
      width: 'w-[160px]',
    },
  ];

  // Adapter to render inputs inside table
  const data = items.map(item => ({
    ...item,
    name: (
      <div className='space-y-2'>
        <Input
          value={item.name}
          onChange={e =>
            onItemUpdate(item.id, { ...item, name: e.target.value })
          }
          className='input-field !rounded-[4px]'
          placeholder='Material name'
        />
        <Input
          value={item.description}
          onChange={e =>
            onItemUpdate(item.id, { ...item, description: e.target.value })
          }
          className='input-field !rounded-[4px]'
          placeholder='Description'
        />
      </div>
    ),
    qty: (
      <Input
        value={String(item.qty).padStart(2, '0')}
        onChange={e => {
          const v = e.target.value.replace(/[^0-9]/g, '');
          onItemUpdate(item.id, { ...item, qty: v === '' ? 0 : parseInt(v) });
        }}
        className='input-field !rounded-[4px] text-center'
      />
    ),
    unit: (
      <Input
        value={item.unit}
        onChange={e => onItemUpdate(item.id, { ...item, unit: e.target.value })}
        className='input-field !rounded-[4px]'
        placeholder='Unit'
      />
    ),
    rate: (
      <Input
        value={`$${Number(item.rate || 0).toFixed(2)}`}
        onChange={e => {
          const numeric =
            parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
          onItemUpdate(item.id, { ...item, rate: numeric });
        }}
        className='input-field !rounded-[4px]'
      />
    ),
    markup: (
      <Input
        value={`$${Number(item.markup || 0).toFixed(2)}`}
        onChange={e => {
          const numeric =
            parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
          onItemUpdate(item.id, { ...item, markup: numeric });
        }}
        className='input-field !rounded-[4px]'
      />
    ),
    lineTotal: (
      <span className='text-[var(--text-dark)] font-medium'>
        {`$${Number(item.lineTotal || (item.qty || 0) * (item.rate || 0)).toFixed(2)}`}
      </span>
    ),
  }));

  return (
    <div className='py-4'>
      <DynamicTable
        columns={columns}
        data={data}
        actions={[
          {
            key: 'more',
            icon: TABLE_ACTION_TRIGGER_ICON,
            isDropdown: true,
            dropdownOptions: [
              {
                label: 'Delete',
                action: 'delete',
                icon: Trash,
              },
            ],
            onDropdownAction: (action, row) => {
              if (action === 'delete') onItemDelete(row.id);
            },
            variant: 'ghost',
            size: 'sm',
            iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
          },
        ]}
        tableConfig={{ headerBgColor: 'bg-[var(--background)]' }}
        showRowNumbers={false}
      />
    </div>
  );
}
