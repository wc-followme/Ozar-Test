'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { DisclaimerForm } from '@/components/shared/forms/DisclaimerForm';
import EstimationTemplateForm from '@/components/shared/forms/EstimationTemplateForm';
import { TemplateToolForm } from '@/components/shared/forms/TemplateToolForm';
import ServiceOptionsBox from '@/components/Templates/ServiceOptionsBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      case 'service-option':
        return [
          {
            id: '1',
            type: 'service-option',
            templateName: 'Basic Service Options',
            createdDate: '30/12/2024',
            service: 'General',
            material: 'Standard',
          },
          {
            id: '2',
            type: 'service-option',
            templateName: 'Premium Service Options',
            createdDate: '29/12/2024',
            service: 'Premium',
            material: 'High-end',
          },
        ];
      default:
        return [];
    }
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
    // TODO: Implement logic to add selected templates to the form
    setIsTemplateSheetOpen(false);
    setSelectedTemplates([]);
  };

  const handleTemplateSelect = (template: TemplateData) => {
    // TODO: Implement logic to populate form with template data
  };

  // Get template type display name
  const getTemplateTypeName = (type: string) => {
    switch (type) {
      case 'estimate':
        return 'Estimate Template';
      case 'service-option':
        return 'Service Options Template';
      case 'tools':
        return 'Tools Template';
      case 'disclaimers':
        return 'Disclaimers Template';
      default:
        return 'Template';
    }
  };

  // Get template type icon

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
                initialData={{
                  templateName: formData.templateName,
                  category: formData.category,
                }}
              />
            </div>
          </div>
        );

      case 'service-option':
        return (
          <div className='w-full'>
            {/* Header with Breadcrumb and Add From Templates Button */}
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Service Options Template' },
                ]}
              />
              <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button>
            </div>

            {/* Template Meta Fields */}

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                <div className='space-y-2 col-span-2'>
                  <label className='field-label'>Template Name</label>
                  <Input
                    placeholder='Enter name'
                    value={formData.templateName}
                    onChange={e =>
                      handleInputChange('templateName', e.target.value)
                    }
                    className='input-field'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='field-label'>Category</label>
                  <SelectField
                    value={formData.category}
                    onValueChange={val => handleInputChange('category', val)}
                    options={[
                      { value: 'Interior', label: 'Interior' },
                      { value: 'Exterior', label: 'Exterior' },
                      { value: 'Plumbing', label: 'Plumbing' },
                      { value: 'Electrical', label: 'Electrical' },
                    ]}
                    placeholder='Select Category'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='field-label'>Property Type</label>
                  <SelectField
                    value={formData.propertyType}
                    onValueChange={val =>
                      handleInputChange('propertyType', val)
                    }
                    options={[
                      { value: 'Residential', label: 'Residential' },
                      { value: 'Commercial', label: 'Commercial' },
                      { value: 'Industrial', label: 'Industrial' },
                    ]}
                    placeholder='Select Type'
                  />
                </div>
              </div>
              <ServiceOptionsBox
                _onClose={() => {}}
                templateId='new-service-option-template'
                onSaveSuccess={() => {
                  console.log('Service options template saved successfully');
                }}
                onSaveError={(error: any) => {
                  console.error(
                    'Failed to save service options template:',
                    error
                  );
                }}
              />
              <div className='mt-6'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-4'>
                    <h3 className='text-base font-semibold text-[var(--text-dark)]'>
                      Project Total:
                    </h3>
                    <div className='h-10 w-[1px] bg-[var(--border-dark)]'></div>
                    <span className='text-xl font-bold text-[var(--primary)]'>
                      $2000
                    </span>
                  </div>
                  <div className='flex gap-3'>
                    <Button className='btn-primary'>Save Template</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  tools: [],
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
            {getMockTemplates().map(({ id, ...template }) => (
              <TemplateListCard
                key={id}
                template={{ id, ...template }}
                isSelectionMode={true}
                isSelected={selectedTemplates.includes(id)}
                onSelectionChange={handleTemplateSelectionChange}
                onEdit={() => handleTemplateSelect({ id, ...template })}
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
