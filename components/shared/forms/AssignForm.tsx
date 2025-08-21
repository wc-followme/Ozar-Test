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

export interface AssignFormValues {
  toolName: string;
  toolId: string;
  barcode: string;
  condition: string;
  assignDate: string;
  dueDate: string;
  assignee: string;
  job: string;
}

interface AssignFormProps {
  defaultValues: AssignFormValues;
  onSubmit: (values: AssignFormValues) => void;
  onCancel: () => void;
  className?: string;
}

export const AssignForm: React.FC<AssignFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [values, setValues] = useState<AssignFormValues>(defaultValues);
  const [assignDateOpen, setAssignDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  const conditionOptions = useMemo(
    () => [
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
      { value: 'Decent', label: 'Decent' },
      { value: 'Poor', label: 'Poor' },
    ],
    []
  );

  const assigneeOptions = useMemo(
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

  const handleChange = (field: keyof AssignFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const selectedAssignee = assigneeOptions.find(
    opt => opt.value === values.assignee
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
        <div className='space-y-2'>
          <label className='field-label'>Assign Date</label>
          <Popover open={assignDateOpen} onOpenChange={setAssignDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {values.assignDate ? (
                  format(new Date(values.assignDate), 'PPP')
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
                  values.assignDate ? new Date(values.assignDate) : undefined
                }
                onSelect={date => {
                  if (date) {
                    handleChange('assignDate', date.toISOString());
                    setAssignDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2'>
          <label className='field-label'>Due Date</label>
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {values.dueDate ? (
                  format(new Date(values.dueDate), 'PPP')
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
                selected={values.dueDate ? new Date(values.dueDate) : undefined}
                onSelect={date => {
                  if (date) {
                    handleChange('dueDate', date.toISOString());
                    setDueDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2 md:col-span-2'>
          <Label className='field-label'>Assign To</Label>
          <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {selectedAssignee ? (
                  <div className='flex items-center gap-3'>
                    <Avatar
                      name={selectedAssignee.label}
                      height={24}
                      width={24}
                      className='w-6 h-6 text-xs'
                    />
                    <span>{selectedAssignee.label}</span>
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
                {assigneeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleChange('assignee', option.value);
                      setAssigneeOpen(false);
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
            label='Assigned to Job'
            value={values.job}
            onValueChange={v => handleChange('job', v)}
            options={jobOptions}
            placeholder='Select Job'
          />
        </div>
      </div>

      <div className='flex gap-3 items-center pt-2'>
        <Button
          variant='outline'
          onClick={onCancel}
          className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(values)}
          className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AssignForm;
