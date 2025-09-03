'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from 'iconsax-react';
import { useState } from 'react';
import MultiSelect from '../common/MultiSelect';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AddEmployeeToJobFormProps {
  onSave: (employeeData: {
    projectName: string;
    room: string;
    trade: string;
    service: string;
    startDate: string;
    dueDate: string;
    employeeIds: string[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  availableEmployees?: Employee[];
}

export const AddEmployeeToJobForm: React.FC<AddEmployeeToJobFormProps> = ({
  onSave,
  onCancel,
  isSubmitting = false,
  availableEmployees = [],
}) => {
  const [formData, setFormData] = useState<{
    projectName: string;
    room: string;
    trade: string;
    service: string;
    startDate: string;
    dueDate: string;
    employeeIds: string[];
  }>({
    projectName: '',
    room: '',
    trade: '',
    service: '',
    startDate: '',
    dueDate: '',
    employeeIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);

  // Mock data - in real app, these would come from API or constants
  const availableProjects = [
    { id: '1', name: 'Job#456 Downtown Project' },
    { id: '2', name: 'Job#789 Suburban Renovation' },
    { id: '3', name: 'Job#123 Office Complex' },
  ];

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
  ];

  const handleInputChange = (
    field:
      | 'projectName'
      | 'room'
      | 'trade'
      | 'service'
      | 'startDate'
      | 'dueDate'
      | 'employeeIds',
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

    if (!formData['projectName']) {
      newErrors['projectName'] = 'Please select a project';
    }
    if (!formData['room']) {
      newErrors['room'] = 'Please select a room';
    }
    if (!formData['trade']) {
      newErrors['trade'] = 'Please select a trade';
    }
    if (!formData['service']) {
      newErrors['service'] = 'Please select a service';
    }
    if (!formData['startDate']) {
      newErrors['startDate'] = 'Please select a start date';
    }
    if (!formData['dueDate']) {
      newErrors['dueDate'] = 'Please select a due date';
    }
    if (formData['employeeIds'].length === 0) {
      newErrors['employeeIds'] = 'Please select at least one employee';
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
          {/* Project Name */}
          <div className='space-y-2'>
            <Label htmlFor='project-name' className='field-label'>
              Project Name
            </Label>
            <Select
              value={formData.projectName}
              onValueChange={value => handleInputChange('projectName', value)}
            >
              <SelectTrigger
                className={cn(
                  'input-field',
                  errors['projectName']
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              >
                <SelectValue placeholder='Select Project' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-xl'>
                {availableProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors['projectName'] && (
              <span className='text-sm text-[var(--warning)]'>
                {errors['projectName']}
              </span>
            )}
          </div>

          {/* Room */}
          <div className='space-y-2'>
            <Label htmlFor='room' className='field-label'>
              Room
            </Label>
            <Select
              value={formData.room}
              onValueChange={value => handleInputChange('room', value)}
            >
              <SelectTrigger
                className={cn(
                  'input-field',
                  errors['room']
                    ? '!border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              >
                <SelectValue placeholder='Select Room' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-xl'>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors['room'] && (
              <span className='text-sm text-[var(--warning)]'>
                {errors['room']}
              </span>
            )}
          </div>

          {/* Trade and Service - Side by Side */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='trade' className='field-label'>
                Trade
              </Label>
              <Select
                value={formData.trade}
                onValueChange={value => handleInputChange('trade', value)}
              >
                <SelectTrigger
                  className={cn(
                    'input-field',
                    errors['trade']
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                >
                  <SelectValue placeholder='Select Trade' />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-xl'>
                  {availableTrades.map(trade => (
                    <SelectItem key={trade.id} value={trade.id}>
                      {trade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors['trade'] && (
                <span className='text-sm text-[var(--warning)]'>
                  {errors['trade']}
                </span>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='service' className='field-label'>
                Service
              </Label>
              <Select
                value={formData.service}
                onValueChange={value => handleInputChange('service', value)}
              >
                <SelectTrigger
                  className={cn(
                    'input-field',
                    errors['service']
                      ? '!border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                >
                  <SelectValue placeholder='Select Service' />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-xl'>
                  {availableServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors['service'] && (
                <span className='text-sm text-[var(--warning)]'>
                  {errors['service']}
                </span>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='start-date' className='field-label'>
                Start Date
              </Label>
              <Popover
                open={startDatePickerOpen}
                onOpenChange={setStartDatePickerOpen}
              >
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
                    <Calendar className='ml-auto !h-6 !w-6' color='#24338C' />
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
                    onSelect={() => {}}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors['startDate'] && (
                <span className='text-sm text-[var(--warning)]'>
                  {errors['startDate']}
                </span>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='due-date' className='field-label'>
                Due Date
              </Label>
              <Popover
                open={dueDatePickerOpen}
                onOpenChange={setDueDatePickerOpen}
              >
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
                    <Calendar className='ml-auto !h-6 !w-6' color='#24338C' />
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
                    onSelect={() => {}}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors['dueDate'] && (
                <span className='text-sm text-[var(--warning)]'>
                  {errors['dueDate']}
                </span>
              )}
            </div>
          </div>

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
              error={errors['employeeIds'] || ''}
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
              {isSubmitting ? 'Adding to Job...' : 'Add to Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function for conditional class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
