'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'iconsax-react';
import { useState } from 'react';
import SelectField from '../common/SelectField';

interface ApplyLeaveFormProps {
  onCancel: () => void;
  onSubmit: (data: ApplyLeaveData) => void;
}

interface ApplyLeaveData {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  leaveType: string;
  requestingFor: string;
  note: string;
}

export const ApplyLeaveForm = ({ onCancel, onSubmit }: ApplyLeaveFormProps) => {
  const [formData, setFormData] = useState<ApplyLeaveData>({
    fromDate: undefined,
    toDate: undefined,
    leaveType: '',
    requestingFor: '',
    note: '',
  });

  const leaveTypeOptions = [
    { value: 'paid', label: 'Paid Leave (9 Available)' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ];

  const requestingForOptions = [
    { value: 'full-day', label: 'Full Day' },
    { value: 'first-half', label: 'First Half' },
    { value: 'second-half', label: 'Second Half' },
  ];

  const [fromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const [toDatePickerOpen, setToDatePickerOpen] = useState(false);

  const handleInputChange = (field: keyof ApplyLeaveData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='space-y-6'>
      {/* Date Range - From and To in one row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {/* From Date */}
        <div className='space-y-2'>
          <Label className='field-label'>From</Label>
          <Popover
            open={fromDatePickerOpen}
            onOpenChange={setFromDatePickerOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                  !formData.fromDate && 'text-muted-foreground',
                  'border-[var(--border-dark)]'
                )}
              >
                {formData.fromDate ? (
                  format(formData.fromDate, 'dd/MM/yyyy')
                ) : (
                  <span>Select date</span>
                )}
                <CalendarIcon className='ml-auto !h-6 !w-6' color='#24338C' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 bg-[var(--card-background)]'
              align='start'
            >
              <Calendar
                mode='single'
                selected={formData.fromDate}
                onSelect={date => {
                  handleInputChange('fromDate', date);
                  setFromDatePickerOpen(false);
                }}
                disabled={(date: Date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className='space-y-2'>
          <Label className='field-label'>To</Label>
          <Popover open={toDatePickerOpen} onOpenChange={setToDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                  !formData.toDate && 'text-muted-foreground',
                  'border-[var(--border-dark)]'
                )}
              >
                {formData.toDate ? (
                  format(formData.toDate, 'dd/MM/yyyy')
                ) : (
                  <span>Select date</span>
                )}
                <CalendarIcon className='ml-auto !h-6 !w-6' color='#24338C' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 bg-[var(--card-background)]'
              align='start'
            >
              <Calendar
                mode='single'
                selected={formData.toDate}
                onSelect={date => {
                  handleInputChange('toDate', date);
                  setToDatePickerOpen(false);
                }}
                disabled={(date: Date) =>
                  date < new Date() ||
                  (formData.fromDate ? date < formData.fromDate : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Type of Leave */}
        <SelectField
          label='Type of Leave'
          value={formData.leaveType}
          onValueChange={value => handleInputChange('leaveType', value)}
          options={leaveTypeOptions}
          placeholder='Select leave type'
        />

        {/* Requesting for */}
        <SelectField
          label='Requesting for'
          value={formData.requestingFor}
          onValueChange={value => handleInputChange('requestingFor', value)}
          options={requestingForOptions}
          placeholder='Select duration'
        />

        {/* Note */}
        <div className='space-y-2'>
          <Label className='field-label'>Note</Label>
          <Textarea
            value={formData.note}
            onChange={e => handleInputChange('note', e.target.value)}
            className='input-field'
            placeholder='Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalar dolor elementum tempus hac.'
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='btn-secondary'
          >
            Cancel
          </Button>
          <Button type='submit' className='btn-primary'>
            Request
          </Button>
        </div>
      </form>
    </div>
  );
};
