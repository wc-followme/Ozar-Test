'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import * as Iconsax from 'iconsax-react';
import Dropdown from './Dropdown';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'status'
    | 'avatar'
    | 'combined'
    | 'custom';
  align?: 'left' | 'center' | 'right';
  format?: string; // For date formatting, avatar display, etc.
  subKey?: string; // For combined fields like "toolId/barcode"
  avatarKey?: string; // For avatar display
  subtitleKey?: string; // For subtitle display
  render?: (value: any, row: any, index: number) => React.ReactNode; // Optional custom render
}

interface TableAction {
  key: string;
  label?: string;
  icon?: string; // Icon name from iconsax-react
  onClick?: (row: any, index: number) => void; // Optional for dropdown actions
  className?: string;
  variant?: 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'lg' | 'default' | 'icon';
  showCondition?: (row: any) => boolean; // Optional condition to show/hide action
  isDropdown?: boolean; // Whether this action should open a dropdown
  dropdownOptions?: {
    label: string;
    action: string;
    icon: React.ComponentType<{
      size?: string | number;
      color?: string;
      variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
    }>;
    variant?: 'default' | 'destructive';
  }[];
  onDropdownAction?: (action: string, row: any) => void; // Handler for dropdown actions
}

interface DynamicTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  className?: string;
  emptyMessage?: string;
  showRowNumbers?: boolean;
  rowNumberLabel?: string;
  tableConfig?: {
    headerBgColor?: string;
    borderColor?: string;
    hoverColor?: string;
  };
}

export const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  actions = [],
  className = '',
  emptyMessage = 'No data available',
  showRowNumbers = true,
  rowNumberLabel = 'NO.',
  tableConfig = {},
}) => {
  const allColumns = showRowNumbers
    ? [
        {
          key: 'rowNumber',
          label: rowNumberLabel,
          width: 'w-16',
          align: 'left' as const,
          render: (_: any, __: any, index: number) => (
            <span className='font-medium text-[var(--text-dark)]'>
              {(index + 1).toString().padStart(2, '0')}
            </span>
          ),
        },
        ...columns,
      ]
    : columns;

  if (actions.length > 0) {
    allColumns.push({
      key: 'actions',
      label: 'Action',
      width: 'w-20',
      align: 'center' as const,
      render: (value: any, row: any, index: number) => (
        <div className='flex items-center justify-center gap-1'>
          {actions.map(action => {
            // Check if action should be shown based on condition
            if (action.showCondition && !action.showCondition(row)) {
              return null;
            }

            // Get icon component dynamically
            const IconComponent = action.icon
              ? (Iconsax as any)[action.icon]
              : Iconsax.Trash;

            // If action is a dropdown, render dropdown component
            if (
              action.isDropdown &&
              action.dropdownOptions &&
              action.onDropdownAction
            ) {
              return (
                <Dropdown
                  key={action.key}
                  menuOptions={action.dropdownOptions}
                  onAction={dropdownAction =>
                    action.onDropdownAction!(dropdownAction, row)
                  }
                  trigger={
                    <Button
                      type='button'
                      variant={action.variant || 'ghost'}
                      size={action.size || 'sm'}
                      className={cn(
                        'text-[var(--text-secondary)] hover:text-[var(--text-dark)] p-0 h-auto',
                        action.className
                      )}
                    >
                      <IconComponent size={16} color='var(--text-dark)' />
                      {action.label && (
                        <span className='ml-1'>{action.label}</span>
                      )}
                    </Button>
                  }
                  align='end'
                />
              );
            }

            // Otherwise render as regular button
            return (
              <Button
                key={action.key}
                type='button'
                onClick={() => action.onClick?.(row, index)}
                variant={action.variant || 'ghost'}
                size={action.size || 'sm'}
                className={cn(
                  'text-[var(--text-secondary)] hover:text-[var(--text-dark)] p-0 h-auto',
                  action.className
                )}
              >
                <IconComponent size={16} color='var(--text-dark)' />
                {action.label && <span className='ml-1'>{action.label}</span>}
              </Button>
            );
          })}
        </div>
      ),
    });
  }

  const {
    headerBgColor = 'bg-[#F5F7FA]',
    borderColor = 'border-[var(--border-dark)]',
    hoverColor = 'hover:bg-[var(--background-light)]',
  } = tableConfig;

  // Function to render cell content based on column type
  const renderCellContent = (column: TableColumn, row: any) => {
    const value = row[column.key];

    switch (column.type) {
      case 'avatar':
        const avatarData = row[column.avatarKey || 'avatar'];
        const subtitleData = column.subtitleKey
          ? row[column.subtitleKey]
          : null;
        return (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center'>
              <span className='text-xs font-medium text-gray-600'>
                {avatarData?.name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('') || 'NA'}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-[var(--text-dark)] font-medium'>
                {avatarData?.name || value}
              </span>
              {subtitleData && (
                <span className='text-[var(--text-secondary)] text-sm'>
                  {subtitleData}
                </span>
              )}
            </div>
          </div>
        );

      case 'combined':
        const mainValue = row[column.key];
        const subValue = column.subKey ? row[column.subKey] : null;
        return (
          <span className='text-[var(--text-dark)]'>
            {mainValue} {subValue && `/ ${subValue}`}
          </span>
        );

      case 'date':
        return <span className='text-[var(--text-dark)]'>{value}</span>;

      case 'status':
        return <span className='text-[var(--text-dark)]'>{value}</span>;

      default:
        return <span className='text-[var(--text-dark)]'>{value}</span>;
    }
  };

  return (
    <div className={cn('overflow-hidden', className)}>
      <Table>
        <TableHeader className={headerBgColor}>
          <TableRow className='!border-b-0'>
            {allColumns.map(column => (
              <TableHead
                key={column.key}
                className={cn(
                  'text-[var(--text-dark)] font-semibold text-base py-3 px-4',
                  column.width,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                className={cn(
                  `border-b ${borderColor} last:border-b-0 ${hoverColor} transition-colors`
                )}
              >
                {allColumns.map(column => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'py-3 px-4 text-[var(--text-dark)] text-sm',
                      column.width,
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : renderCellContent(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={allColumns.length}
                className='text-center text-[var(--text-secondary)] py-8'
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
