'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useState } from 'react';

interface AddRespondToPollPlanningProps {
  onSave: (data: {
    room: string;
    trade: string;
    service: string;
    startDate: string;
    dueDate: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddRespondToPollPlanning({
  onSave,
  onCancel,
  isSubmitting,
}: AddRespondToPollPlanningProps) {
  const [formData, setFormData] = useState({
    room: 'bedroom-1',
    trade: 'plumbing',
    service: 'install-shower',
    startDate: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);

  // Mock data for dropdowns
  const roomOptions = [
    { value: 'bedroom-1', label: 'Bed Room 1' },
    { value: 'bedroom-2', label: 'Bed Room 2' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'living-room', label: 'Living Room' },
    { value: 'bathroom', label: 'Bathroom' },
  ];

  const tradeOptions = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
  ];

  const serviceOptions = [
    { value: 'install-shower', label: 'Install Shower' },
    { value: 'install-tub', label: 'Install Tub' },
    { value: 'install-toilet', label: 'Install Toilet' },
    { value: 'install-sink', label: 'Install Sink' },
    { value: 'install-faucet', label: 'Install Faucet' },
    { value: 'install-outlets', label: 'Install Outlets' },
    { value: 'install-lighting', label: 'Install Lighting' },
    { value: 'install-switches', label: 'Install Switches' },
    { value: 'install-panel', label: 'Install Panel' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.room) newErrors['room'] = 'Room is required';
    if (!formData.trade) newErrors['trade'] = 'Trade is required';
    if (!formData.service) newErrors['service'] = 'Service is required';
    if (!formData.startDate) newErrors['startDate'] = 'Start Date is required';
    if (!formData.dueDate) newErrors['dueDate'] = 'Due Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        {/* Room and Trade - Side by Side */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label
              htmlFor='room'
              className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
            >
              Room
            </Label>
            <SelectField
              value={formData.room}
              onValueChange={value => handleInputChange('room', value)}
              placeholder='Select room'
              options={roomOptions}
              error={errors['room'] || ''}
              disabled={true}
              triggerClassName='bg-[var(--background)]'
            />
          </div>
          <div>
            <Label
              htmlFor='trade'
              className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
            >
              Trade
            </Label>
            <SelectField
              value={formData.trade}
              onValueChange={value => handleInputChange('trade', value)}
              placeholder='Select trade'
              options={tradeOptions}
              error={errors['trade'] || ''}
              disabled={true}
              triggerClassName='bg-[var(--background)]'
            />
          </div>
        </div>

        {/* Service */}
        <div>
          <Label
            htmlFor='service'
            className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
          >
            Service
          </Label>
          <SelectField
            value={formData.service}
            onValueChange={value => handleInputChange('service', value)}
            placeholder='Select service'
            options={serviceOptions}
            error={errors['service'] || ''}
            disabled={true}
            triggerClassName='bg-[var(--background)]'
          />
        </div>

        {/* Start Date and Due Date - Side by Side */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label
              htmlFor='startDate'
              className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
            >
              Start Date
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                    !formData.startDate && 'text-muted-foreground',
                    errors['startDate']
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                >
                  {formData.startDate ? (
                    format(new Date(formData.startDate), 'PPP')
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
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  onSelect={date => {
                    if (date) {
                      handleInputChange(
                        'startDate',
                        date.toISOString().split('T')[0] || ''
                      );
                      setStartDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors['startDate'] && (
              <p className='text-red-500 text-sm mt-1'>{errors['startDate']}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor='dueDate'
              className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
            >
              Due Date
            </Label>
            <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-12 w-full pl-3 text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                    !formData.dueDate && 'text-muted-foreground',
                    errors['dueDate']
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                >
                  {formData.dueDate ? (
                    format(new Date(formData.dueDate), 'PPP')
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
                    formData.dueDate ? new Date(formData.dueDate) : undefined
                  }
                  onSelect={date => {
                    if (date) {
                      handleInputChange(
                        'dueDate',
                        date.toISOString().split('T')[0] || ''
                      );
                      setDueDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors['dueDate'] && (
              <p className='text-red-500 text-sm mt-1'>{errors['dueDate']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-start gap-3 pt-4'>
        <Button
          type='button'
          onClick={onCancel}
          className='btn-secondary'
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' className='btn-primary' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}
