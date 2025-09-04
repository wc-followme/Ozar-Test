'use client';

import { TimePicker } from '@/components/shared/common/TimePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ManageHoursFormProps {
  onCancel: () => void;
  onSubmit: (data: ManageHoursData) => void;
}

interface ManageHoursData {
  selectedDate: string;
  punchIn: string;
  punchOut: string;
  note: string;
}

export const ManageHoursForm = ({
  onCancel,
  onSubmit,
}: ManageHoursFormProps) => {
  const [formData, setFormData] = useState<ManageHoursData>({
    selectedDate: '15/09/2024',
    punchIn: '',
    punchOut: '',
    note: '',
  });

  const handleInputChange = (field: keyof ManageHoursData, value: string) => {
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
      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Selected Date */}
        <div className='space-y-2'>
          <label className='field-label'>Selected Date</label>
          <Input
            type='text'
            value={formData.selectedDate}
            onChange={e => handleInputChange('selectedDate', e.target.value)}
            className='input-field disabled:bg-[#E8EAED] disabled:text-[var(--text-dark)]'
            placeholder='Select date'
            disabled
          />
        </div>

        {/* Punch In & Punch Out */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Punch In */}
          <div className='space-y-2'>
            <label className='field-label'>Punch In</label>
            <TimePicker
              value={formData.punchIn}
              onChange={value => handleInputChange('punchIn', value)}
              placeholder='Start time'
            />
          </div>

          {/* Punch Out */}
          <div className='space-y-2'>
            <label className='field-label'>Punch Out</label>
            <TimePicker
              value={formData.punchOut}
              onChange={value => handleInputChange('punchOut', value)}
              placeholder='Start time'
            />
          </div>
        </div>

        {/* Note */}
        <div className='space-y-2'>
          <label className='field-label'>Note</label>
          <Textarea
            value={formData.note}
            onChange={e => handleInputChange('note', e.target.value)}
            className='input-field'
            placeholder='Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalar dolor elementum tempus hac.'
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
