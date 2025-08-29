'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import MultiSelect from '../common/MultiSelect';
import SelectField from '../common/SelectField';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AddEmployeeToPollPlanningProps {
  onSave: (pollData: {
    room: string;
    trade: string;
    service: string;
    employeeIds: string[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  availableEmployees?: Employee[];
}

export const AddEmployeeToPollPlanning: React.FC<
  AddEmployeeToPollPlanningProps
> = ({ onSave, onCancel, isSubmitting = false, availableEmployees = [] }) => {
  const [formData, setFormData] = useState<{
    room: string;
    trade: string;
    service: string;
    employeeIds: string[];
  }>({
    room: '',
    trade: '',
    service: '',
    employeeIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - in real app, these would come from API or constants
  const availableRooms = [
    { id: '1', name: 'Bed Room 1' },
    { id: '2', name: 'Living Room' },
    { id: '3', name: 'Kitchen' },
    { id: '4', name: 'Bathroom' },
    { id: '5', name: 'Master Bedroom' },
  ];

  const availableTrades = [
    { id: '1', name: 'Demolition' },
    { id: '2', name: 'Electrical' },
    { id: '3', name: 'Plumbing' },
    { id: '4', name: 'HVAC' },
    { id: '5', name: 'Carpentry' },
    { id: '6', name: 'Painting' },
  ];

  const availableServices = [
    { id: '1', name: 'Strip out house' },
    { id: '2', name: 'Install new wiring' },
    { id: '3', name: 'Replace plumbing' },
    { id: '4', name: 'Install new HVAC' },
    { id: '5', name: 'Build custom cabinets' },
    { id: '6', name: 'Paint interior' },
    { id: '7', name: 'Install Shower' },
  ];

  const handleInputChange = (
    field: 'room' | 'trade' | 'service' | 'employeeIds',
    value: string | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.room) {
      newErrors.room = 'Please select a room';
    }
    if (!formData.trade) {
      newErrors.trade = 'Please select a trade';
    }
    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }
    if (formData.employeeIds.length === 0) {
      newErrors.employeeIds = 'Please select at least one employee';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  // Convert employees to MultiSelect format
  const employeeOptions = availableEmployees.map(emp => ({
    value: emp.id,
    label: emp.name,
    image: emp.profilePicture || '/images/user-img-placeholder.png',
  }));

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Room and Trade - Side by Side */}
          <div className='grid grid-cols-2 gap-4'>
            <SelectField
              label='Room'
              value={formData.room}
              onValueChange={value => handleInputChange('room', value)}
              options={availableRooms.map(room => ({
                value: room.id,
                label: room.name,
              }))}
              placeholder='Select Room'
              error={errors.room || ''}
              disabled
              triggerClassName='bg-[#F5F7FA]'
            />
            <SelectField
              label='Trade'
              value={formData.trade}
              onValueChange={value => handleInputChange('trade', value)}
              options={availableTrades.map(trade => ({
                value: trade.id,
                label: trade.name,
              }))}
              placeholder='Select Trade'
              error={errors.trade || ''}
              disabled
              triggerClassName='bg-[#F5F7FA]'
            />
          </div>

          {/* Service */}
          <SelectField
            label='Service'
            value={formData.service}
            onValueChange={value => handleInputChange('service', value)}
            options={availableServices.map(service => ({
              value: service.id,
              label: service.name,
            }))}
            placeholder='Select Service'
            error={errors.service || ''}
            disabled
            triggerClassName='bg-[#F5F7FA]'
          />

          {/* Employee Selection */}
          <div className='space-y-2'>
            <Label htmlFor='employees' className='field-label'>
              Select Employees
            </Label>
            <MultiSelect
              options={employeeOptions}
              value={formData.employeeIds}
              onChange={value => handleInputChange('employeeIds', value)}
              placeholder='Choose employees'
              error={errors.employeeIds || ''}
              name='employees'
            />
          </div>

          {/* Action Buttons */}
          <div className='pt-4 flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Adding to Pole Planning...'
                : 'Add to Pole Planning'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
