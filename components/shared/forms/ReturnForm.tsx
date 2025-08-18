'use client';

import { Avatar } from '@/components/shared/common/Avatar';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar, Scan } from 'iconsax-react';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface ReturnFormValues {
  toolName: string;
  dueDate: string;
  toolId: string;
  barcode: string;
  condition: string;
  returnedDate: string;
  returnedBy: string;
  job: string;
}

interface ReturnFormProps {
  defaultValues: ReturnFormValues;
  onSubmit: (values: ReturnFormValues) => void;
  onCancel: () => void;
  className?: string;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [values, setValues] = useState<ReturnFormValues>(defaultValues);
  const [returnedDateOpen, setReturnedDateOpen] = useState(false);
  const [returnedByOpen, setReturnedByOpen] = useState(false);

  const conditionOptions = useMemo(
    () => [
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
      { value: 'Decent', label: 'Decent' },
      { value: 'Poor', label: 'Poor' },
    ],
    []
  );

  const returnedByOptions = useMemo(
    () => [
      {
        value: 'Esther Howard',
        label: 'Esther Howard',
      },
      {
        value: 'Liam Anderson',
        label: 'Liam Anderson',
      },
      {
        value: 'Emma Thompson',
        label: 'Emma Thompson',
      },
    ],
    []
  );

  const jobOptions = useMemo(
    () => [
      { value: 'Job#456 Downtown Project', label: 'Job#456 Downtown Project' },
      { value: 'Job#123 Riverside Build', label: 'Job#123 Riverside Build' },
    ],
    []
  );

  const handleChange = (field: keyof ReturnFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const selectedReturnedBy = returnedByOptions.find(
    opt => opt.value === values.returnedBy
  );

  return (
    <div className={cn('space-y-5', className)}>
      {/* Tool name and scan button row */}
      <div className='flex items-center justify-between'>
        <div className='text-sm'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Tool Name
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            {values.toolName}
          </span>
        </div>
        <div className='text-sm'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Due Date
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            16/08/2024
          </span>
        </div>
        <Button className='btn-primary'>
          <Scan size='32' color='currentcolor' className='!h-5 !w-5' />
          Scan
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='field-label'>Tool ID / Barcode</label>
          <Input
            value={`${values.toolId} / ${values.barcode}`}
            readOnly
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Condition'
            value={values.condition}
            onValueChange={v => handleChange('condition', v)}
            options={conditionOptions}
            placeholder='Select'
          />
        </div>
        <div className='space-y-2 col-span-2'>
          <label className='field-label'>Returned Date</label>
          <Popover open={returnedDateOpen} onOpenChange={setReturnedDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {values.returnedDate ? (
                  format(new Date(values.returnedDate), 'PPP')
                ) : (
                  <span>Select Date</span>
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
              <CalendarComponent
                mode='single'
                selected={
                  values.returnedDate
                    ? new Date(values.returnedDate)
                    : undefined
                }
                onSelect={date => {
                  if (date) {
                    handleChange('returnedDate', date.toISOString());
                    setReturnedDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Return By</Label>
          <Popover open={returnedByOpen} onOpenChange={setReturnedByOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {selectedReturnedBy ? (
                  <div className='flex items-center gap-3'>
                    <Avatar
                      name={selectedReturnedBy.label}
                      height={24}
                      width={24}
                      className='w-6 h-6 text-xs'
                    />
                    <span>{selectedReturnedBy.label}</span>
                  </div>
                ) : (
                  <span>Select User</span>
                )}
                <ChevronDown className='ml-auto !h-6 !w-6' color='#24338C' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-full bg-[var(--card-background)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-lg border border-[var(--border-dark)]'
              align='start'
            >
              <div className='py-2'>
                {returnedByOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleChange('returnedBy', option.value);
                      setReturnedByOpen(false);
                    }}
                    className='flex items-center gap-3 w-full py-2 px-3 text-left text-[var(--text-dark)] text-base font-medium border-b border-[var(--border-light)] last-of-type:border-b-0 hover:bg-[var(--card-hover)]'
                  >
                    <Avatar
                      name={option.label}
                      height={24}
                      width={24}
                      className='w-6 h-6 text-xs'
                    />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2 md:col-span-2'>
          <SelectField
            label='Returned from job'
            value={values.job}
            onValueChange={v => handleChange('job', v)}
            options={jobOptions}
            placeholder='Select Job'
          />
        </div>
      </div>

      <div className='flex gap-3 items-center pt-2'>
        <Button variant='outline' onClick={onCancel} className='btn-secondary'>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(values)} className='btn-primary'>
          Return
        </Button>
      </div>
    </div>
  );
};

export default ReturnForm;
