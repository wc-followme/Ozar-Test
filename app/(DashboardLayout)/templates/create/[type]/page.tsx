'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { DisclaimerForm } from '@/components/shared/forms/DisclaimerForm';
import { EstimationTemplateForm } from '@/components/shared/forms/EstimationTemplateForm';
import { TemplateToolForm } from '@/components/shared/forms/TemplateToolForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { TemplateData } from '../../template-types';

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
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
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

  // Mock template data based on type
  const getMockTemplates = (): TemplateData[] => {
    switch (type) {
      case 'estimate':
        return [
          {
            id: '1',
            type: 'estimate',
            templateName: 'Interior Design Template',
            createdDate: '30/12/2024',
            propertyType: 'Residential',
            category: 'Interior',
            categoryColor: '#24338C26',
          },
          {
            id: '2',
            type: 'estimate',
            templateName: 'Full Home Build Template',
            createdDate: '29/12/2024',
            propertyType: 'Residential',
            category: 'Full Home Build/Addition',
            categoryColor: '#34AD4426',
          },
          {
            id: '3',
            type: 'estimate',
            templateName: 'Kitchen Renovation',
            createdDate: '28/12/2024',
            propertyType: 'Residential',
            category: 'Interior',
            categoryColor: '#24338C26',
          },
          {
            id: '4',
            type: 'estimate',
            templateName: 'Bathroom Remodel',
            createdDate: '27/12/2024',
            propertyType: 'Residential',
            category: 'Full Home Build/Addition',
            categoryColor: '#34AD4426',
          },
        ];
      case 'tools':
        return [
          {
            id: '1',
            type: 'tools',
            templateName: 'Basic Tool Set',
            createdDate: '30/12/2024',
            service: 'Carpentry',
            material: 'Wood',
          },
          {
            id: '2',
            type: 'tools',
            templateName: 'Electrical Tools',
            createdDate: '29/12/2024',
            service: 'Electrical',
            material: 'Copper',
          },
          {
            id: '3',
            type: 'tools',
            templateName: 'Plumbing Tools',
            createdDate: '28/12/2024',
            service: 'Plumbing',
            material: 'PVC',
          },
        ];
      case 'disclaimers':
        return [
          {
            id: '1',
            type: 'disclaimer',
            templateName: 'Standard Disclaimer',
            createdDate: '30/12/2024',
            service: 'General',
            material: 'N/A',
          },
          {
            id: '2',
            type: 'disclaimer',
            templateName: 'Warranty Disclaimer',
            createdDate: '29/12/2024',
            service: 'Warranty',
            material: 'N/A',
          },
        ];
      case 'option-bid':
        return [
          {
            id: '1',
            type: 'option-bid',
            templateName: 'Basic Option Bid',
            createdDate: '30/12/2024',
            service: 'General',
            material: 'Standard',
          },
          {
            id: '2',
            type: 'option-bid',
            templateName: 'Premium Option Bid',
            createdDate: '29/12/2024',
            service: 'Premium',
            material: 'High-end',
          },
        ];
      default:
        return [];
    }
  };

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

  // Template selection handlers
  const handleTemplateSelectionChange = (
    templateId: string,
    selected: boolean
  ) => {
    setSelectedTemplates(prev =>
      selected ? [...prev, templateId] : prev.filter(id => id !== templateId)
    );
  };

  const handleAddSelectedTemplates = () => {
    console.log('Adding selected templates:', selectedTemplates);
    // TODO: Implement logic to add selected templates to the form
    setIsTemplateSheetOpen(false);
    setSelectedTemplates([]);
  };

  const handleTemplateSelect = (template: TemplateData) => {
    // TODO: Implement logic to populate form with template data
    console.log('Template selected:', template);
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
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Estimate Templates' },
                ]}
                className='mb-6'
              />
              <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button>
            </div>
            {/* Breadcrumb */}

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <EstimationTemplateForm
                onSubmit={data => {
                  console.log('Estimate form submitted:', data);
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  category: formData.category,
                }}
              />
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
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Tools Template' },
                ]}
              />
              <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button>
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <TemplateToolForm
                onSubmit={data => {
                  console.log('Tools form submitted:', data);
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  tools: selectedToolIds,
                }}
              />
            </div>
          </div>
        );

      case 'disclaimers':
        return (
          <div className='w-full'>
            {/* Header with Breadcrumb and Add From Templates Button */}
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Disclaimer' },
                ]}
              />
              <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button>
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <DisclaimerForm
                onSubmit={data => {
                  console.log('Disclaimer form submitted:', data);
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  warranty: formData.warranty,
                  description: formData.description,
                  duration: formData.duration,
                }}
              />
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

  return (
    <div className='w-full'>
      {renderFormFields()}

      <SideSheet
        open={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        title={`${getTemplateTypeName(type)}s`}
        size='718px'
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto'>
            {getMockTemplates().map(template => (
              <TemplateListCard
                key={template.id}
                template={template}
                isSelectionMode={true}
                isSelected={selectedTemplates.includes(template.id)}
                onSelectionChange={handleTemplateSelectionChange}
                onEdit={() => handleTemplateSelect(template)}
                className='hover:shadow-md transition-shadow'
              />
            ))}
          </div>

          <div className='flex gap-3 items-center pt-4'>
            <Button
              variant='outline'
              onClick={() => setIsTemplateSheetOpen(false)}
              className='btn-secondary'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSelectedTemplates}
              disabled={selectedTemplates.length === 0}
              className='btn-primary'
            >
              Add Selected ({selectedTemplates.length})
            </Button>
          </div>
        </div>
      </SideSheet>
    </div>
  );
}
