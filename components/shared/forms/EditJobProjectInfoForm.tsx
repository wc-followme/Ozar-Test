'use client';

import SelectField from '@/components/shared/common/SelectField';
import { TimePicker } from '@/components/shared/common/TimePicker';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useMemo, useState } from 'react';

export interface EditJobProjectInfoData {
  projectName: string;
  projectStartDate: string;
  projectEndDate: string;
  ownerPresence: string;
  weekendWork: string;
  dailyWorkStart: string;
  dailyWorkEnd: string;
  budget: string;
  preferredContractor: string;
}

interface EditJobProjectInfoFormProps {
  data: EditJobProjectInfoData;
  onChange: (field: keyof EditJobProjectInfoData, value: string) => void;
}

const ownerPresenceOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'sometimes', label: 'Sometimes' },
];

const weekendWorkOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'limited', label: 'Limited' },
];

export const EditJobProjectInfoForm: React.FC<EditJobProjectInfoFormProps> = ({
  data,
  onChange,
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const startDateObj = useMemo(
    () => (data.projectStartDate ? new Date(data.projectStartDate) : undefined),
    [data.projectStartDate]
  );
  const endDateObj = useMemo(
    () => (data.projectEndDate ? new Date(data.projectEndDate) : undefined),
    [data.projectEndDate]
  );

  return (
    <div className='space-y-5'>
      {/* Project Name */}
      <div className='space-y-2'>
        <Label htmlFor='projectName' className='field-label'>
          Project Name
        </Label>
        <Input
          id='projectName'
          value={data.projectName}
          onChange={e => onChange('projectName', e.target.value)}
          className='input-field'
          placeholder='Enter project name'
        />
      </div>

      {/* Project Dates */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='projectStartDate' className='field-label'>
            Project Start Date
          </Label>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {startDateObj ? (
                  format(startDateObj, 'PPP')
                ) : (
                  <span>Select Date</span>
                )}
                <IconsaxCalendar
                  className='ml-auto !h-5 !w-5'
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
                selected={startDateObj}
                onSelect={date => {
                  if (date) {
                    const iso = format(date, 'yyyy-MM-dd');
                    onChange('projectStartDate', iso);
                    setStartOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='projectEndDate' className='field-label'>
            Project End Date
          </Label>
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] border-[var(--border-dark)]'
              >
                {endDateObj ? (
                  format(endDateObj, 'PPP')
                ) : (
                  <span>Select Date</span>
                )}
                <IconsaxCalendar
                  className='ml-auto !h-5 !w-5'
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
                selected={endDateObj}
                onSelect={date => {
                  if (date) {
                    const iso = format(date, 'yyyy-MM-dd');
                    onChange('projectEndDate', iso);
                    setEndOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Owner Presence | Weekend Work */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SelectField
          label='Owner Presence During Work'
          value={data.ownerPresence}
          onValueChange={val => onChange('ownerPresence', val)}
          options={ownerPresenceOptions}
          placeholder='Select option'
        />
        <SelectField
          label='Weekend Work Allowed'
          value={data.weekendWork}
          onValueChange={val => onChange('weekendWork', val)}
          options={weekendWorkOptions}
          placeholder='Select option'
        />
      </div>

      {/* Daily Work Timing */}
      <div className='space-y-2'>
        <Label className='field-label'>Daily Work Timing</Label>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <TimePicker
              value={data.dailyWorkStart}
              onChange={val => onChange('dailyWorkStart', val)}
              placeholder='Start time'
            />
          </div>
          <div className='space-y-2'>
            <TimePicker
              value={data.dailyWorkEnd}
              onChange={val => onChange('dailyWorkEnd', val)}
              placeholder='End time'
            />
          </div>
        </div>
      </div>

      {/* Budget | Preferred Contractor */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='budget' className='field-label'>
            Budget
          </Label>
          <Input
            id='budget'
            type='number'
            value={data.budget}
            onChange={e => onChange('budget', e.target.value)}
            className='input-field'
            placeholder='Enter budget amount'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='preferredContractor' className='field-label'>
            Preferred Contractor
          </Label>
          <Input
            id='preferredContractor'
            value={data.preferredContractor}
            onChange={e => onChange('preferredContractor', e.target.value)}
            className='input-field'
            placeholder='Enter preferred contractor name'
          />
        </div>
      </div>
    </div>
  );
};

export default EditJobProjectInfoForm;
