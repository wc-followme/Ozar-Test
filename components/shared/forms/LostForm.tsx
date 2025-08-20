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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface LostFormValues {
  toolName: string;
  dueDate: string;
  toolId: string;
  barcode: string;
  condition: string;
  acknowledgeDate: string;
  subsEmployees: string;
  job: string;
  reason: string;
}

interface LostFormProps {
  defaultValues: LostFormValues;
  onSubmit: (values: LostFormValues) => void;
  onCancel: () => void;
  className?: string;
}

export const LostForm: React.FC<LostFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [values, setValues] = useState<LostFormValues>(defaultValues);
  const [acknowledgeDateOpen, setAcknowledgeDateOpen] = useState(false);
  const [subsEmployeesOpen, setSubsEmployeesOpen] = useState(false);

  const conditionOptions = useMemo(
    () => [
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
      { value: 'Decent', label: 'Decent' },
      { value: 'Poor', label: 'Poor' },
      { value: 'Unknown', label: 'Unknown' },
    ],
    []
  );

  const subsEmployeesOptions = useMemo(
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

  const handleChange = (field: keyof LostFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const selectedSubsEmployees = subsEmployeesOptions.find(
    opt => opt.value === values.subsEmployees
  );

  return (
    <div className={cn('space-y-5', className)}>
      {/* Tool name and scan button row */}
      <div className='flex items-center justify-between'>
        <div className='text-sm flex-1'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Tool Name
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            {values.toolName}
          </span>
        </div>
        <div className='text-sm flex-1'>
          <span className='block text-[var(--text-dark)] text-sm font-semibold mb-1'>
            Due Date
          </span>
          <span className='block font-normal text-base text-[var(--text-dark)]'>
            16/08/2024
          </span>
        </div>
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
          <label className='field-label'>Acknowledge Date</label>
          <Popover
            open={acknowledgeDateOpen}
            onOpenChange={setAcknowledgeDateOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {values.acknowledgeDate ? (
                  format(new Date(values.acknowledgeDate), 'PPP')
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
                  values.acknowledgeDate
                    ? new Date(values.acknowledgeDate)
                    : undefined
                }
                onSelect={date => {
                  if (date) {
                    handleChange('acknowledgeDate', date.toISOString());
                    setAcknowledgeDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Subs/Employees</Label>
          <Popover open={subsEmployeesOpen} onOpenChange={setSubsEmployeesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {selectedSubsEmployees ? (
                  <div className='flex items-center gap-3'>
                    <Avatar
                      name={selectedSubsEmployees.label}
                      height={24}
                      width={24}
                      className='w-6 h-6 text-xs'
                    />
                    <span>{selectedSubsEmployees.label}</span>
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
                {subsEmployeesOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleChange('subsEmployees', option.value);
                      setSubsEmployeesOpen(false);
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
            label='Assigned Job'
            value={values.job}
            onValueChange={v => handleChange('job', v)}
            options={jobOptions}
            placeholder='Select Job'
          />
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Reason</Label>
          <Textarea
            placeholder='Enter Issues'
            value={values.reason}
            onChange={e => handleChange('reason', e.target.value)}
            className='min-h-[100px] resize-none border-2 bg-[var(--white-background)] rounded-[10px] border-[var(--border-dark)] placeholder-[var(--text-placeholder)]'
          />
        </div>
      </div>

      <div className='flex gap-3 items-center pt-2'>
        <Button variant='outline' onClick={onCancel} className='btn-secondary'>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(values)} className='btn-primary'>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default LostForm;
