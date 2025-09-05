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
import { differenceInDays, format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'iconsax-react';
import { useEffect, useState } from 'react';
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
  firstDayType: string;
  lastDayType: string;
  note: string;
}

export const ApplyLeaveForm = ({ onCancel, onSubmit }: ApplyLeaveFormProps) => {
  const [formData, setFormData] = useState<ApplyLeaveData>({
    fromDate: undefined,
    toDate: undefined,
    leaveType: '',
    requestingFor: '',
    firstDayType: '',
    lastDayType: '',
    note: '',
  });

  const [fromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const [toDatePickerOpen, setToDatePickerOpen] = useState(false);

  const leaveTypeOptions = [
    { value: 'paid', label: 'Paid Leave (9 Available)' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
  ];

  // Dynamic options based on single day vs multi-day leave
  const getRequestingForOptions = () => {
    if (!formData.fromDate || !formData.toDate) {
      return [
        { value: 'full-day', label: 'Full Day' },
        { value: 'first-half', label: 'First Half' },
        { value: 'second-half', label: 'Second Half' },
        { value: 'custom', label: 'Custom' },
      ];
    }

    if (isSameDay(formData.fromDate, formData.toDate)) {
      // Single day - show full day, first half, second half
      return [
        { value: 'full-day', label: 'Full Day' },
        { value: 'first-half', label: 'First Half' },
        { value: 'second-half', label: 'Second Half' },
      ];
    } else {
      // Multi-day - show full day and custom
      return [
        { value: 'full-day', label: 'Full Day' },
        { value: 'custom', label: 'Custom' },
      ];
    }
  };

  const dayTypeOptions = [
    { value: 'full-day', label: 'Full Day' },
    { value: 'first-half', label: 'First Half' },
    { value: 'second-half', label: 'Second Half' },
  ];

  // Calculate if it's a multi-day leave
  const isMultiDayLeave =
    formData.fromDate &&
    formData.toDate &&
    !isSameDay(formData.fromDate, formData.toDate);
  const totalDays =
    formData.fromDate && formData.toDate
      ? differenceInDays(formData.toDate, formData.fromDate) + 1
      : 0;

  // Auto-set first and last day types when requesting for changes
  useEffect(() => {
    if (formData.requestingFor === 'full-day') {
      setFormData(prev => ({
        ...prev,
        firstDayType: 'full-day',
        lastDayType: 'full-day',
      }));
    } else if (formData.requestingFor === 'first-half') {
      setFormData(prev => ({
        ...prev,
        firstDayType: 'first-half',
        lastDayType: 'first-half',
      }));
    } else if (formData.requestingFor === 'second-half') {
      setFormData(prev => ({
        ...prev,
        firstDayType: 'second-half',
        lastDayType: 'second-half',
      }));
    }
  }, [formData.requestingFor]);

  // Reset requestingFor when date range changes to prevent invalid selections
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const currentOptions = getRequestingForOptions();
      const currentValueExists = currentOptions.some(
        option => option.value === formData.requestingFor
      );

      if (!currentValueExists && formData.requestingFor) {
        setFormData(prev => ({
          ...prev,
          requestingFor: '',
          firstDayType: '',
          lastDayType: '',
        }));
      }
    }
  }, [formData.fromDate, formData.toDate]);

  const handleInputChange = (field: keyof ApplyLeaveData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that first and last day types are selected for custom multi-day leaves
    if (formData.requestingFor === 'custom' && isMultiDayLeave) {
      if (!formData.firstDayType || !formData.lastDayType) {
        alert('Please select first and last day types for multi-day leave');
        return;
      }
    }

    onSubmit(formData);
  };

  const calculateLeaveDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;

    // For single day leave
    if (isSameDay(formData.fromDate, formData.toDate)) {
      if (
        formData.requestingFor === 'first-half' ||
        formData.requestingFor === 'second-half'
      ) {
        return 0.5;
      }
      return 1;
    }

    // For multi-day leave
    if (formData.requestingFor === 'custom' && isMultiDayLeave) {
      let totalLeaveDays = 0;

      // Calculate middle days (full days between first and last day)
      const middleDays = totalDays - 2; // Exclude first and last day
      totalLeaveDays += middleDays; // All middle days are full days

      // Add first day
      if (formData.firstDayType === 'full-day') {
        totalLeaveDays += 1;
      } else if (
        formData.firstDayType === 'first-half' ||
        formData.firstDayType === 'second-half'
      ) {
        totalLeaveDays += 0.5;
      }

      // Add last day (only if it's different from first day)
      if (!isSameDay(formData.fromDate, formData.toDate)) {
        if (formData.lastDayType === 'full-day') {
          totalLeaveDays += 1;
        } else if (
          formData.lastDayType === 'first-half' ||
          formData.lastDayType === 'second-half'
        ) {
          totalLeaveDays += 0.5;
        }
      }

      return totalLeaveDays;
    }

    // For standard multi-day leave (full-day, first-half, second-half)
    if (
      formData.requestingFor === 'first-half' ||
      formData.requestingFor === 'second-half'
    ) {
      return totalDays * 0.5;
    }

    return totalDays; // full-day
  };

  const getLeaveDaysText = () => {
    const leaveDays = calculateLeaveDays();
    if (leaveDays === 0) return '';

    if (leaveDays === 1) {
      return '1 day';
    } else if (leaveDays % 1 === 0) {
      return `${leaveDays} days`;
    } else {
      return `${leaveDays} days`;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
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
          options={getRequestingForOptions()}
          placeholder='Select duration'
        />

        {/* Custom Day Type Selection for Multi-day Leaves */}
        {formData.requestingFor === 'custom' && isMultiDayLeave && (
          <div className='space-y-4 p-4 border border-[var(--border-dark)] rounded-md bg-[var(--card-background)]'>
            <Label className='field-label text-sm font-medium text-gray-700'>
              Custom Day Types for Multi-day Leave
            </Label>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* First Day Type */}
              <div className='space-y-2'>
                <Label className='field-label text-xs text-gray-600'>
                  First Day (
                  {formData.fromDate
                    ? format(formData.fromDate, 'dd/MM/yyyy')
                    : 'N/A'}
                  )
                </Label>
                <SelectField
                  value={formData.firstDayType}
                  onValueChange={value =>
                    handleInputChange('firstDayType', value)
                  }
                  options={dayTypeOptions}
                  placeholder='Select first day type'
                  className='w-full'
                />
              </div>

              {/* Last Day Type */}
              <div className='space-y-2'>
                <Label className='field-label text-xs text-gray-600'>
                  Last Day (
                  {formData.toDate
                    ? format(formData.toDate, 'dd/MM/yyyy')
                    : 'N/A'}
                  )
                </Label>
                <SelectField
                  value={formData.lastDayType}
                  onValueChange={value =>
                    handleInputChange('lastDayType', value)
                  }
                  options={dayTypeOptions}
                  placeholder='Select last day type'
                  className='w-full'
                />
              </div>
            </div>

            {/* Leave Days Calculation */}
            {formData.firstDayType && formData.lastDayType && (
              <div className='mt-4 p-3 bg-[var(--card-background)] border border-[var(--border-dark)] rounded-md'>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  Total Leave Days:{' '}
                  <span className='font-bold'>{getLeaveDaysText()}</span>
                </p>
                <p className='text-xs text-[var(--text-dark)] mt-1'>
                  {formData.firstDayType === 'full-day'
                    ? 'Full day'
                    : formData.firstDayType === 'first-half'
                      ? 'First half'
                      : 'Second half'}{' '}
                  on first day,
                  {totalDays > 2
                    ? ` ${totalDays - 2} full day${totalDays - 2 > 1 ? 's' : ''} in between, `
                    : ' '}
                  {formData.lastDayType === 'full-day'
                    ? 'full day'
                    : formData.lastDayType === 'first-half'
                      ? 'first half'
                      : 'second half'}{' '}
                  on last day
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leave Days Summary for Non-Custom Selections */}
        {formData.requestingFor &&
          formData.requestingFor !== 'custom' &&
          formData.fromDate &&
          formData.toDate && (
            <div className='p-3 bg-[var(--white-background)] border border-[var(--border-dark)] rounded-md'>
              <p className='text-sm text-[var(--text-dark)] font-medium'>
                Total Leave Days:{' '}
                <span className='font-bold'>{getLeaveDaysText()}</span>
              </p>
            </div>
          )}

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
