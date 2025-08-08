'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import MultiSelect from '@/components/shared/common/MultiSelect';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CloseCircle, Edit2 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import EstimationBox from '../../../../../components/Templates/EstimationBox';

interface CreateTemplatePageProps {
  params: Promise<{
    type: string;
  }>;
}

export default function CreateTemplatePage({
  params,
}: CreateTemplatePageProps) {
  const router = useRouter();
  const { type } = use(params);
  const [formData, setFormData] = useState({
    templateName: '',
    service: '',
    material: '',
    propertyType: '',
    category: '',
    description: '',
    tools: '',
    warranty: '',
    duration: '',
  });

  // Tool management state
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<
    Array<{ id: string; name: string }>
  >([
    { id: '1', name: 'Tool Name' },
    { id: '2', name: 'Tool Name' },
    { id: '3', name: 'Tool Name' },
    { id: '4', name: 'Tool Name' },
    { id: '5', name: 'Tool Name' },
    { id: '6', name: 'Tool Name' },
    { id: '7', name: 'Tool Name' },
    { id: '8', name: 'Tool Name' },
    { id: '9', name: 'Tool Name' },
    { id: '10', name: 'Tool Name' },
    { id: '11', name: 'Tool Name' },
    { id: '12', name: 'Tool Name' },
    { id: '13', name: 'Tool Name' },
  ]);

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

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(prev => prev.filter(tool => tool.id !== toolId));
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
  };

  // Get template type display name
  const getTemplateTypeName = (type: string) => {
    switch (type) {
      case 'estimate':
        return 'Estimate Template';
      case 'option-bid':
        return 'Option Bid Template';
      case 'tools':
        return 'Tools Template';
      case 'disclaimers':
        return 'Disclaimers Template';
      default:
        return 'Template';
    }
  };

  // Get template type icon
  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case 'estimate':
        return '📊';
      case 'option-bid':
        return '📄';
      case 'tools':
        return '🔧';
      case 'disclaimers':
        return '🛡️';
      default:
        return '📋';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating template:', { type, formData });
    // TODO: Implement API call to create template
    router.push('/templates');
  };

  const handleBack = () => {
    router.push('/templates');
  };

  const renderFormFields = () => {
    switch (type) {
      case 'estimate':
        return (
          <div className='w-full'>
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { name: 'Templates', href: '/templates' },
                { name: 'Estimate Templates' },
              ]}
              className='mb-6'
            />

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2 col-span-2'>
                  <Label htmlFor='templateName' className='field-label'>
                    Template Name
                  </Label>
                  <Input
                    id='templateName'
                    value={formData.templateName}
                    onChange={e =>
                      handleInputChange('templateName', e.target.value)
                    }
                    placeholder='Enter template name'
                    className='input-field'
                  />
                </div>
                <div className='space-y-2'>
                  <SelectField
                    label='Category'
                    value={formData.category}
                    onValueChange={value =>
                      handleInputChange('category', value)
                    }
                    options={[
                      { value: 'interior', label: 'Interior' },
                      { value: 'exterior', label: 'Exterior' },
                      { value: 'general', label: 'General' },
                    ]}
                    placeholder='Select Category'
                  />
                </div>
              </div>
              <div className='flex justify-end my-4'>
                <Button variant='outline' size='sm' className='btn-secondary'>
                  <Edit2 size={16} color='var(--text)' />
                  Edit
                </Button>
              </div>
              {/* EstimationBox Component */}
              <div className='mb-6'>
                <EstimationBox _onClose={() => {}} />
              </div>

              {/* Footer */}
              <div className='flex justify-between items-center '>
                <div className='flex items-center gap-2'>
                  <span className='text-base font-semibold text-[var(--text-dark)]'>
                    Project Total:
                  </span>
                  <span className='ml-2 text-xl font-bold text-[var(--primary)]'>
                    $0.00
                  </span>
                </div>
                <Button onClick={handleSubmit} className='btn-primary'>
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        );

      case 'option-bid':
        return (
          <>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='templateName' className='field-label'>
                  Template Name
                </Label>
                <Input
                  id='templateName'
                  value={formData.templateName}
                  onChange={e =>
                    handleInputChange('templateName', e.target.value)
                  }
                  placeholder='Enter template name'
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
                  placeholder='Select service'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='material' className='field-label'>
                  Material
                </Label>
                <Input
                  id='material'
                  value={formData.material}
                  onChange={e => handleInputChange('material', e.target.value)}
                  placeholder='Enter material details'
                  className='input-field'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description' className='field-label'>
                  Description
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Enter template description'
                  rows={4}
                  className='input-field'
                />
              </div>
            </div>
          </>
        );

      case 'tools':
        return (
          <div className='w-full'>
            {/* Header with Breadcrumb and Add From Templates Button */}
            <div className='flex items-center justify-between mb-6'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Tools Template' },
                ]}
              />
              <Button className='btn-primary'>Add From Templates</Button>
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='templateName' className='field-label'>
                    Template Name
                  </Label>
                  <Input
                    id='templateName'
                    value={formData.templateName}
                    onChange={e =>
                      handleInputChange('templateName', e.target.value)
                    }
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
          </div>
        );

      case 'disclaimers':
        return (
          <div className='w-full'>
            {/* Header with Breadcrumb and Add From Templates Button */}
            <div className='flex items-center justify-between mb-6'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Disclaimer' },
                ]}
              />
              <Button className='btn-primary'>Add From Templates</Button>
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='space-y-2'>
                  <Label htmlFor='templateName' className='field-label'>
                    Template Name
                  </Label>
                  <Input
                    id='templateName'
                    value={formData.templateName}
                    onChange={e =>
                      handleInputChange('templateName', e.target.value)
                    }
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
                  <Label htmlFor='warranty' className='field-label'>
                    Warranty
                  </Label>
                  <Input
                    id='warranty'
                    value={formData.warranty}
                    onChange={e =>
                      handleInputChange('warranty', e.target.value)
                    }
                    placeholder='Enter Warranty'
                    className='input-field'
                  />
                </div>
              </div>

              {/* Disclaimer Text Area */}
              <div className='space-y-2 mb-6'>
                <Label htmlFor='description' className='field-label'>
                  Disclaimer
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Enter Disclaimer Here'
                  rows={16}
                  className='input-field min-h-[300px]'
                />
              </div>

              {/* Duration Field */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2 mb-6 col-span-2'>
                  <Label htmlFor='duration' className='field-label'>
                    Warranty
                  </Label>
                  <Input
                    id='duration'
                    value={formData.duration}
                    onChange={e =>
                      handleInputChange('duration', e.target.value)
                    }
                    placeholder='Select Duration'
                    className='input-field'
                  />
                </div>
                <div className='space-y-2 mb-6'>
                  <SelectField
                    label='Duration'
                    value={formData.duration}
                    onValueChange={value =>
                      handleInputChange('duration', value)
                    }
                    options={[
                      { value: '1-year', label: '1 Year' },
                      { value: '2-years', label: '2 Years' },
                      { value: '3-years', label: '3 Years' },
                      { value: '5-years', label: '5 Years' },
                      { value: 'lifetime', label: 'Lifetime' },
                    ]}
                    placeholder='Select Duration'
                  />
                </div>
              </div>

              {/* Footer */}
              <div className='flex justify-end'>
                <Button onClick={handleSubmit} className='btn-primary'>
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className='text-center py-8'>
            <p className='text-[var(--text-secondary)]'>
              Invalid template type
            </p>
          </div>
        );
    }
  };

  return <div className='w-full'>{renderFormFields()}</div>;
}
