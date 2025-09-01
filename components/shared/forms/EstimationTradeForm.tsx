'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import SelectField from '@/components/shared/common/SelectField';
import { Service } from '@/components/shared/forms/estimation-types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sortable } from '@/components/ui/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';

interface Trade {
  id: string;
  uniqueKey: string; // Add unique generated key
  name: string;
  services: number;
  start_date?: string | null;
  end_date?: string | null;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
  serviceList: Service[];
  isExpanded: boolean;
  startDate?: Date;
  endDate?: Date;
  markup?: number;
  markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
}

interface EstimationTradeFormProps {
  trade: Trade;
  roomUniqueKey: string; // Add room unique key prop
  tradeUniqueKey: string; // Add trade unique key prop
  _onTradeUpdate?: (updatedTrade: Trade) => void;
  onServiceSelect?: (serviceId: string) => void;
  onTradeNameChange?: (newTradeName: string) => void;
  onTradeReplacement?: (
    oldTradeUniqueKey: string,
    newTradeId: string,
    newTradeName: string
  ) => void;
  onServiceReorder?: (reorderedServices: Service[]) => void;
  tradeOptions?: Array<{ value: string; label: string }>;
  onLocalStorageUpdate?: () => void; // New prop to trigger localStorage update
}

export default function EstimationTradeForm({
  trade,
  roomUniqueKey,
  tradeUniqueKey,
  _onTradeUpdate,
  onServiceSelect,
  onTradeNameChange,
  onTradeReplacement,
  onServiceReorder,
  onLocalStorageUpdate,
  tradeOptions = [],
}: Readonly<EstimationTradeFormProps>) {
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('$');
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  // Use trade-specific data instead of local state
  const startDate = useMemo(() => {
    if (trade.startDate) {
      return typeof trade.startDate === 'string'
        ? new Date(trade.startDate)
        : trade.startDate;
    }
    return new Date();
  }, [trade.startDate]);
  const endDate = useMemo(() => {
    if (trade.endDate) {
      return typeof trade.endDate === 'string'
        ? new Date(trade.endDate)
        : trade.endDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }, [trade.endDate]);

  // Use provided tradeOptions or show nothing if no trades available
  const finalTradeOptions = tradeOptions.length > 0 ? tradeOptions : [];

  // Sync selectedTrade with trade prop to avoid duplicates
  useEffect(() => {
    // Prefer matching by value (uuid); fallback to label; otherwise keep current trade id
    const matchingByValue = tradeOptions.find(
      option => option.value === trade.id
    );
    if (matchingByValue) {
      setSelectedTrade(matchingByValue.value);
      // Ensure parent trade name matches the selected option label
      if (trade.name !== matchingByValue.label) {
        onTradeReplacement?.(
          tradeUniqueKey,
          matchingByValue.value,
          matchingByValue.label
        );
        onTradeNameChange?.(matchingByValue.label);
      }
      return;
    }
    const matchingByLabel = tradeOptions.find(
      option => option.label === trade.name
    );
    if (matchingByLabel) {
      setSelectedTrade(matchingByLabel.value);
      return;
    }
    // If current trade is not in options (e.g., filtered), preserve current trade id
    if (trade.id) {
      setSelectedTrade(trade.id);
      return;
    }
    // Otherwise clear selection
    setSelectedTrade('');
  }, [
    trade.id,
    trade.name,
    tradeOptions,
    tradeUniqueKey,
    onTradeReplacement,
    onTradeNameChange,
  ]);

  // Save initial data when component mounts
  useEffect(() => {
    if (selectedTrade) {
      const updates: { start_date?: string; end_date?: string } = {};
      if (
        startDate &&
        startDate instanceof Date &&
        !isNaN(startDate.getTime())
      ) {
        updates.start_date = startDate.toISOString();
      }
      if (endDate && endDate instanceof Date && !isNaN(endDate.getTime())) {
        updates.end_date = endDate.toISOString();
      }
    }
  }, [selectedTrade, startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const currencyOptions = [
    { value: '$', label: '$' },
    { value: '%', label: '%' },
  ];

  return (
    <div className='space-y-6'>
      {/* Trade Details Card */}
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-1'>
              {/* Trade dropdown - always show, even when empty */}
              <SelectField
                label='Trade'
                value={selectedTrade}
                onValueChange={newValue => {
                  setSelectedTrade(newValue);
                  // Convert the selected value (uuid) to its display label (name)
                  const selectedOption = finalTradeOptions.find(
                    option => option.value === newValue
                  );
                  const newTradeName = selectedOption
                    ? selectedOption.label
                    : newValue;

                  // Get the current trade unique key to identify the specific trade instance
                  const currentTradeUniqueKey = tradeUniqueKey;

                  // Call the trade replacement handler to update component state
                  onTradeReplacement?.(
                    currentTradeUniqueKey,
                    newValue,
                    newTradeName
                  );

                  // Also call the trade name change handler for backward compatibility
                  onTradeNameChange?.(newTradeName);

                  // When trade changes, clear services of this trade so user reselects
                  _onTradeUpdate?.({
                    ...trade,
                    id: newValue,
                    name: newTradeName,
                    serviceList: [],
                  });
                  // Also persist empty selection to storage if needed
                  onLocalStorageUpdate?.();

                  // Save data after trade selection
                  const updates: { start_date?: string; end_date?: string } =
                    {};
                  if (
                    startDate &&
                    startDate instanceof Date &&
                    !isNaN(startDate.getTime())
                  ) {
                    updates.start_date = startDate.toISOString();
                  }
                  if (
                    endDate &&
                    endDate instanceof Date &&
                    !isNaN(endDate.getTime())
                  ) {
                    updates.end_date = endDate.toISOString();
                  }
                }}
                options={finalTradeOptions}
                placeholder='Select a trade'
                className='mb-0'
              />
            </div>
            <div className='min-w-[240px] pt-7 ml-auto'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='px-4'>
                  <Label className='field-label'>Labor Cost</Label>
                  <p className='text-base font-semibold text-[var(--primary)] mt-1'>
                    {' '}
                    {formatCurrency(trade.laborCost)}
                  </p>
                </div>
                <div className='border-l border-[var(--border-dark)] px-6'>
                  <Label className='field-label'>Material Cost</Label>
                  <p className='text-base font-semibold text-[var(--primary)] mt-1'>
                    {formatCurrency(trade.materialCost)}
                  </p>
                </div>
                <div className='border-l border-[var(--border-dark)] px-6'>
                  <Label className='field-label'>Trade Total</Label>
                  <p className='text-base font-semibold text-[var(--primary)] mt-1'>
                    {formatCurrency(trade.tradeTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='flex-1 space-y-2'>
              <Label className='field-label'>Start Date</Label>
              <Popover
                open={startDatePickerOpen}
                onOpenChange={setStartDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                      !startDate && 'text-muted-foreground',
                      'border-[var(--border-dark)]'
                    )}
                  >
                    {startDate ? (
                      format(startDate, 'PPP')
                    ) : (
                      <span>Select start date</span>
                    )}
                    <IconsaxCalendar
                      className='ml-auto !h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-[var(--card-background)]'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={startDate}
                    onSelect={date => {
                      if (date) {
                        _onTradeUpdate?.({
                          ...trade,
                          startDate: date,
                        });
                        setStartDatePickerOpen(false);
                        onLocalStorageUpdate?.();
                      }
                    }}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex-1 space-y-2'>
              <Label className='field-label'>End Date</Label>
              <Popover
                open={endDatePickerOpen}
                onOpenChange={setEndDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                      !endDate && 'text-muted-foreground',
                      'border-[var(--border-dark)]'
                    )}
                  >
                    {endDate ? (
                      format(endDate, 'PPP')
                    ) : (
                      <span>Select end date</span>
                    )}
                    <IconsaxCalendar
                      className='ml-auto !h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-[var(--card-background)]'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={endDate}
                    onSelect={date => {
                      if (date) {
                        _onTradeUpdate?.({
                          ...trade,
                          endDate: date,
                        });
                        setEndDatePickerOpen(false);
                        onLocalStorageUpdate?.();
                      }
                    }}
                    disabled={date => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const startDateOnly = startDate
                        ? new Date(startDate.getTime())
                        : null;
                      if (startDateOnly) {
                        startDateOnly.setHours(0, 0, 0, 0);
                      }
                      return (
                        date < today ||
                        (startDateOnly ? date <= startDateOnly : false)
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex-1 space-y-2 min-w-[160px]'>
              <Label className='field-label'>Total Markup</Label>
              <div className='flex border-2 border-[var(--border-dark)] focus-within:border-[var(--secondary)] rounded-xl'>
                <div className='w-[60px]'>
                  <SelectField
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                    options={currencyOptions}
                    placeholder='$'
                    className='mb-0'
                    disabled={true}
                    triggerClassName='rounded-l-[10px] font-bold !border-r-0 !rounded-r-none h-11 border-none bg-[var(--white-background)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]'
                  />
                </div>
                <Input
                  type='text'
                  value={formatCurrency(trade.markup || 0)}
                  disabled={true}
                  className='flex-1 rounded-l-none text-right !border-l-0 h-11 border-none bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)] opacity-75 cursor-not-allowed'
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Services List */}

      {trade.serviceList && trade.serviceList.length > 0 ? (
        <Sortable
          items={trade.serviceList}
          onReorder={onServiceReorder || (() => {})}
          idField='id'
        >
          <div className='space-y-4'>
            {trade.serviceList.map(service => {
              return (
                <SortableItem
                  key={`${roomUniqueKey}_${tradeUniqueKey}_${service.id}`}
                  id={service.id}
                >
                  {dragHandleProps => (
                    <TradeListCardComponent
                      service={service}
                      variant='service'
                      onClick={() => onServiceSelect?.(service.id)}
                      className='mb-4'
                      dragHandleProps={dragHandleProps}
                    />
                  )}
                </SortableItem>
              );
            })}
          </div>
        </Sortable>
      ) : (
        <div className='text-center text-gray-500 py-4'>
          <p>No services found for this trade.</p>
          <p className='text-sm'></p>
        </div>
      )}
    </div>
  );
}
