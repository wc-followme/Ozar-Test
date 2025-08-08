'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CloseCircle } from 'iconsax-react';
import { useState } from 'react';
import MultiSelect, { MultiSelectOption } from '../common/MultiSelect';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

interface AddToolListFormProps {
  onSubmit: (tools: Tool[]) => void;
  onCancel: () => void;
  loading?: boolean;
  roomName?: string;
  tradeName?: string;
  serviceName?: string;
}

// Available tools for selection
const AVAILABLE_TOOLS: MultiSelectOption[] = [
  { value: 'tool-1', label: 'Nail Master 3000' },
  { value: 'tool-2', label: 'Drill Wizard' },
  { value: 'tool-3', label: 'Saw Xpert' },
  { value: 'tool-4', label: 'Level Right' },
  { value: 'tool-5', label: 'Hammer Pro' },
  { value: 'tool-6', label: 'Safety Goggles' },
  { value: 'tool-7', label: 'Measuring Tape' },
  { value: 'tool-8', label: 'Screwdriver Set' },
  { value: 'tool-9', label: 'Circular Saw' },
  { value: 'tool-10', label: 'Impact Driver' },
  { value: 'tool-11', label: 'Angle Grinder' },
  { value: 'tool-12', label: 'Jigsaw' },
  { value: 'tool-13', label: 'Router' },
  { value: 'tool-14', label: 'Planer' },
  { value: 'tool-15', label: 'Chisel Set' },
];

export default function AddToolListForm({
  onSubmit,
  onCancel,
  loading = false,
  roomName = 'Room',
  tradeName = 'Trade',
  serviceName = 'Service',
}: AddToolListFormProps) {
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);

  const handleSubmit = () => {
    const selectedTools: Tool[] = selectedToolIds.map(toolId => {
      const toolData = AVAILABLE_TOOLS.find(tool => tool.value === toolId);
      return {
        id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: toolData?.label || 'Unknown Tool',
        category: 'general',
        description: '',
        status: 'available',
      };
    });
    onSubmit(selectedTools);
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedToolIds(prev => prev.filter(id => id !== toolId));
  };

  const selectedTools = AVAILABLE_TOOLS.filter(tool =>
    selectedToolIds.includes(tool.value)
  );

  return (
    <div className='space-y-6'>
      {/* Context Information */}
      <div className='text-sm font-medium text-[var(--text-dark)]'>
        {roomName} / {tradeName} / {serviceName}
      </div>

      {/* Tools List Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='field-label text-base font-semibold text-white'>
            Tools List
          </Label>
          <button className='text-greenbrand hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'>
            + Add from Templates
          </button>
        </div>

        {/* Tool Selection MultiSelect */}
        <MultiSelect
          label=''
          options={AVAILABLE_TOOLS}
          value={selectedToolIds}
          onChange={setSelectedToolIds}
          placeholder='Select Tools'
        />

        {/* Selected Tools Display */}
        {selectedTools.length > 0 && (
          <div className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              {selectedTools.map(tool => (
                <div
                  key={tool.value}
                  className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light  rounded-full'
                >
                  <span className='text-base font-medium text-[var(--text-dark)]'>
                    {tool.label}
                  </span>
                  <button
                    onClick={() => handleRemoveTool(tool.value)}
                    className='w-5 h-5 rounded-full flex items-center justify-center transition-colors'
                  >
                    <CloseCircle size='32' color='var(--text-secondary)' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='pt-4 flex items-center gap-3'>
        <Button
          type='button'
          className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='button'
          className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={handleSubmit}
          disabled={selectedToolIds.length === 0 || loading}
        >
          Add Tools
        </Button>
      </div>
    </div>
  );
}
