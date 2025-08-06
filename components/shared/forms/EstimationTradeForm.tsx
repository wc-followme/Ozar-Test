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
import { useEffect, useState } from 'react';

interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

interface Material {
  id: string;
  name: string;
  variant: string;
  qty: number;
  unit: string;
  description: string;
  rate: number;
  markup: number;
  lineTotal: number;
}

interface Trade {
  id: string;
  name: string;
  services: number;
  dateRange: string;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
  serviceList: Service[];
  isExpanded: boolean;
}

interface EstimationTradeFormProps {
  trade: Trade;
  onTradeUpdate?: (updatedTrade: Trade) => void;
  onServiceSelect?: (serviceId: string) => void;
  onAddService?: () => void;
  onTradeNameChange?: (newTradeName: string) => void;
  onServiceReorder?: (reorderedServices: Service[]) => void;
}

export default function EstimationTradeForm({
  trade,
  onTradeUpdate,
  onServiceSelect,
  onAddService,
  onTradeNameChange,
  onServiceReorder,
}: EstimationTradeFormProps) {
  const [selectedTrade, setSelectedTrade] = useState(trade.name || 'Plumbing');
  const [selectedCurrency, setSelectedCurrency] = useState('$');
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date('2024-03-20')
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date('2024-03-23')
  );
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  // Sync selectedTrade with trade prop to avoid duplicates
  useEffect(() => {
    if (
      trade.name &&
      tradeOptions.some(option => option.value === trade.name)
    ) {
      setSelectedTrade(trade.name);
    } else {
      setSelectedTrade('Plumbing'); // Default to first option if trade.name is not in options
    }
  }, [trade.name]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Sample options for the select fields - avoid duplicates
  const tradeOptions = [
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Carpentry', label: 'Carpentry' },
    { value: 'Roofing', label: 'Roofing' },
    { value: 'Painting', label: 'Painting' },
  ];

  const currencyOptions = [
    { value: '$', label: '$' },
    { value: '€', label: '€' },
    { value: '£', label: '£' },
  ];

  return (
    <div className='space-y-6'>
      {/* Trade Details Card */}
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-1'>
              <SelectField
                label='Trade'
                value={selectedTrade}
                onValueChange={newValue => {
                  setSelectedTrade(newValue);
                  onTradeNameChange?.(newValue);
                }}
                options={tradeOptions}
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
                      setStartDate(date);
                      setStartDatePickerOpen(false);
                    }}
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
                      setEndDate(date);
                      setEndDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex-1 space-y-2'>
              <Label className='field-label'>Total Markup</Label>
              <div className='flex '>
                <div className='w-[60px]'>
                  <SelectField
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                    options={currencyOptions}
                    placeholder='$'
                    className='mb-0'
                    triggerClassName='rounded-l-[10px] font-bold !border-r-0 !rounded-r-none h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]'
                  />
                </div>
                <Input
                  type='text'
                  value=''
                  placeholder='00.00'
                  className='flex-1 rounded-l-none text-right !border-l-0 h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]'
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Services List */}
      {trade.serviceList.length > 0 && (
        <Sortable
          items={trade.serviceList}
          onReorder={onServiceReorder || (() => {})}
          idField='id'
        >
          <div className='space-y-4'>
            {trade.serviceList.map(service => (
              <SortableItem key={service.id} id={service.id}>
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
            ))}
          </div>
        </Sortable>
      )}
    </div>
  );
}
