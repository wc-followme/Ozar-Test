'use client';

import MultiSelect from '@/components/shared/common/MultiSelect';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CloseCircle } from 'iconsax-react';
import { useState } from 'react';

interface TemplateToolFormData {
  templateName: string;
  service: string;
  tools: string[];
}

interface TemplateToolFormProps {
  onSubmit?: (data: TemplateToolFormData) => void;
  initialData?: Partial<TemplateToolFormData>;
}

// Available tools for selection
const AVAILABLE_TOOLS = [
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

export function TemplateToolForm({
  onSubmit,
  initialData,
}: TemplateToolFormProps) {
  const [formData, setFormData] = useState<TemplateToolFormData>({
    templateName: initialData?.templateName || '',
    service: initialData?.service || '',
    tools: initialData?.tools || [],
  });

  // Tool management state
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(
    formData.tools
  );
  const [selectedTools, setSelectedTools] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const handleInputChange = (
    field: keyof TemplateToolFormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(prev => prev.filter(tool => tool.id !== toolId));
    setSelectedToolIds(prev => prev.filter(id => id !== toolId));
    handleInputChange(
      'tools',
      selectedToolIds.filter(id => id !== toolId)
    );
  };

  const handleToolSelectionChange = (selectedIds: string[]) => {
    setSelectedToolIds(selectedIds);
    // Update selectedTools based on selected IDs
    const newSelectedTools = selectedIds.map(toolId => {
      const toolData = AVAILABLE_TOOLS.find(tool => tool.value === toolId);
      return {
        id: toolId,
        name: toolData?.label || 'Unknown Tool',
      };
    });
    setSelectedTools(newSelectedTools);
    handleInputChange('tools', selectedIds);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Template Name, Service, and Tools Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            value={formData.templateName}
            onChange={e => handleInputChange('templateName', e.target.value)}
            placeholder='Enter name'
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Service'
            value={formData.service}
            onValueChange={value => handleInputChange('service', value)}
            options={[
              { value: 'painting', label: 'Painting' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'carpentry', label: 'Carpentry' },
            ]}
            placeholder='Select Service'
          />
        </div>
        <div className='space-y-2'>
          <MultiSelect
            label='Tools'
            options={AVAILABLE_TOOLS}
            value={selectedToolIds}
            onChange={handleToolSelectionChange}
            placeholder='Select Tools'
          />
        </div>
      </div>

      {/* Tool Tags Section */}
      <div className='mt-6'>
        <div className='flex flex-wrap gap-2'>
          {selectedTools.map(tool => (
            <div
              key={tool.id}
              className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light rounded-full'
            >
              <span className='text-base font-medium text-[var(--text-dark)]'>
                {tool.name}
              </span>
              <button
                onClick={() => handleRemoveTool(tool.id)}
                className='w-5 h-5 rounded-full flex items-center justify-center transition-colors'
              >
                <CloseCircle size={24} color='#6B7280' />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-end mt-6'>
        <Button onClick={handleSubmit} className='btn-primary'>
          Save Template
        </Button>
      </div>
    </div>
  );
}
