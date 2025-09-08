'use client';
import {
  BarChart,
  Database,
  FileText,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

const CreateRole = () => {
  const [selectedIcon, setSelectedIcon] = React.useState('settings');

  // Icon options for the selector
  const iconOptions = [
    { value: 'settings', label: 'Settings', icon: Settings, color: '#00a8bf' },
    { value: 'users', label: 'Users', icon: Users, color: '#34ad44' },
    { value: 'shield', label: 'Shield', icon: Shield, color: '#ff6b6b' },
    { value: 'database', label: 'Database', icon: Database, color: '#4c6ef5' },
    { value: 'filetext', label: 'Documents', icon: FileText, color: '#fd7e14' },
    { value: 'barchart', label: 'Analytics', icon: BarChart, color: '#9c88ff' },
  ];

  // Module data for the sidebar
  const modules = [
    { id: 1, name: 'Module 1', selected: true },
    { id: 2, name: 'Module 2', selected: false },
    { id: 3, name: 'Module 3', selected: false },
    { id: 4, name: 'Module 4', selected: false },
    { id: 5, name: 'Module 5', selected: false },
    { id: 6, name: 'Module 6', selected: false },
  ];

  // Sub-module data for the content area
  const subModules = [
    {
      id: 1,
      name: 'Sub Module 1',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'edit',
    },
    {
      id: 2,
      name: 'Sub Module 2',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'view',
    },
    {
      id: 3,
      name: 'Sub Module 3',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'none',
    },
    {
      id: 4,
      name: 'Sub Module 4',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'view',
    },
    {
      id: 5,
      name: 'Sub Module 5',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'view',
    },
    {
      id: 6,
      name: 'Sub Module 6',
      description:
        'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper.',
      permission: 'edit',
    },
  ];

  return (
    <Card className='flex flex-col gap-8 p-6 flex-1 w-full border-1 border-[#E8EAED] rounded-[20px] bg-white'>
      {/* Top row with input fields */}
      <div className='flex items-start gap-6 w-full'>
        {/* Icon selector */}
        <div className='flex flex-col items-start gap-2'>
          <label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
            Icon
          </label>
          <Select value={selectedIcon} onValueChange={setSelectedIcon}>
            <SelectTrigger className='w-[100px] h-12 px-2 py-[7px] rounded-[10px] border-2 border-[#e8eaed]'>
              <SelectValue>
                <div
                  className='flex w-8 h-8 items-center justify-center rounded-lg'
                  style={{
                    backgroundColor: `${iconOptions.find(opt => opt.value === selectedIcon)?.color}26`,
                  }}
                >
                  {(() => {
                    const option = iconOptions.find(
                      opt => opt.value === selectedIcon
                    );
                    if (option) {
                      const IconComponent = option.icon;
                      return (
                        <IconComponent
                          className='w-4 h-4'
                          style={{ color: option.color }}
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              {iconOptions.map(option => {
                const IconComponent = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className='flex items-center gap-2'>
                      <div
                        className='flex w-6 h-6 items-center justify-center rounded-md'
                        style={{ backgroundColor: `${option.color}26` }}
                      >
                        <IconComponent
                          className='w-3 h-3'
                          style={{ color: option.color }}
                        />
                      </div>
                      <span className='text-sm'>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Role Name input */}
        <div className='flex flex-col w-[300px] items-start gap-2'>
          <label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
            Role Name
          </label>
          <Input
            className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
            placeholder='Enter name'
          />
        </div>

        {/* Description input */}
        <div className='flex flex-col items-start gap-2 flex-1'>
          <label className='font-semibold text-[#2d2d2d] text-sm leading-[18px]'>
            Description
          </label>
          <Input
            className='h-12 px-4 py-[18px] rounded-[10px] border-2 border-[#e8eaed]'
            placeholder='Enter Description'
          />
        </div>
      </div>
      {/* Footer with action buttons */}
      <div className='flex items-start justify-end gap-3'>
        <Button
          variant='outline'
          className='w-[120px] h-[42px] font-semibold text-text text-base rounded-[30px] border-2 border-[#e8eaed]'
        >
          Cancel
        </Button>
        <Button className='h-[42px] font-semibold text-white text-base bg-[#34ad44] hover:bg-[#34ad44] rounded-[30px]'>
          Create Role
        </Button>
      </div>
    </Card>
  );
};
export default CreateRole;
