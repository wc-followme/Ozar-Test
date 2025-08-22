'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DisclaimerForm } from '@/components/shared/forms/DisclaimerForm';
import EstimationTemplateForm from '@/components/shared/forms/EstimationTemplateForm';
import { TemplateToolForm } from '@/components/shared/forms/TemplateToolForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { ArrowLeft, Save2 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { TemplateApiData } from '../../template-types';

interface EditTemplatePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { uuid } = use(params);
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<TemplateApiData | null>(null);
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

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTemplateById(uuid);

        if (response.statusCode === 200 && response.data) {
          const templateData = response.data;
          setTemplate(templateData);
          setFormData({
            templateName: templateData.name || '',
            service: templateData.service?.name || '',
            material: '',
            propertyType: '',
            category: templateData.category?.uuid || '', // Use UUID for category
            description: templateData.disclaimer || '',
            tools: '',
            warranty: templateData.warranty || '',
            duration: templateData.warranty_duration || '',
          });

          // Store template rooms data in localStorage for EstimationTemplateForm
          if (
            templateData.templateRooms &&
            templateData.template_type === 'ESTIMATE_TEMPLATES'
          ) {
            const storageKey = `template_rooms_${templateData.uuid}`;

            // Transform API data to EstimationBox expected format
            console.log('Raw API templateRooms:', templateData.templateRooms);
            const transformedRooms = transformApiRoomsToEstimationBox(
              templateData.templateRooms
            );

            console.log('Transformed rooms data:', transformedRooms);
            console.log(
              'First room structure:',
              Object.keys(transformedRooms[0] || {})
            );
            console.log('First room trades:', transformedRooms[0]?.trades);
            console.log(
              'First room trades count:',
              transformedRooms[0]?.trades?.length
            );
            console.log(
              'Second room trades count:',
              transformedRooms[1]?.trades?.length
            );
            console.log(
              'Third room trades count:',
              transformedRooms[2]?.trades?.length
            );
            console.log(
              'First room trades details:',
              JSON.stringify(transformedRooms[0]?.trades, null, 2)
            );
            localStorage.setItem(storageKey, JSON.stringify(transformedRooms));
            console.log('Data stored in localStorage with key:', storageKey);

            // Verify the data was stored correctly
            const storedData = localStorage.getItem(storageKey);
            const parsedStoredData = storedData ? JSON.parse(storedData) : null;
            console.log('Verified stored data:', parsedStoredData);
            console.log(
              'Verified stored data structure:',
              parsedStoredData
                ? Object.keys(parsedStoredData[0] || {})
                : 'no data'
            );
          }
        } else {
          showErrorToast(
            extractApiErrorMessage(response, 'Failed to fetch template.')
          );
        }
      } catch (error: any) {
        showErrorToast(
          extractApiErrorMessage(error, 'Failed to fetch template.')
        );
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchTemplate();
    }
  }, [uuid, showErrorToast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Implement update API call
      showSuccessToast('Template updated successfully.');
      router.push('/templates');
    } catch (error: any) {
      showErrorToast(
        extractApiErrorMessage(error, 'Failed to update template.')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/templates');
  };

  // Transform API rooms data to EstimationBox expected format
  const transformApiRoomsToEstimationBox = (apiRooms: any[]) => {
    return apiRooms.map((apiRoom, roomIndex) => {
      // Transform trades
      const transformedTrades =
        apiRoom.templateRoomTrades?.map((apiTrade: any, tradeIndex: number) => {
          // Transform services (we'll create a default service since API doesn't have services)
          const defaultService = {
            id: String(apiTrade.id || `service_${apiTrade.uuid}_${tradeIndex}`),
            uuid: apiTrade.uuid,
            name: apiTrade.trade?.name || 'Default Service',
            description: apiTrade.trade_notes || '',
            qty: 1,
            rate: 0,
            lineTotal: 0,
            serviceTotal: 0,
            tradeTotal: 0,
            serviceOptions: [],
            materials: [],
            finishes: [],
            tools: [],
            is_hidden: false,
          };

          return {
            id: String(apiTrade.id || apiTrade.uuid || `trade_${tradeIndex}`),
            uniqueKey: `trade_${apiRoom.uuid || roomIndex}_${tradeIndex}`,
            name: apiTrade.trade?.name || 'Trade',
            services: 1,
            dateRange: `${apiTrade.start_date ? new Date(apiTrade.start_date).toLocaleDateString() : ''} - ${apiTrade.end_date ? new Date(apiTrade.end_date).toLocaleDateString() : ''}`,
            type: 'default',
            laborCost: parseFloat(apiTrade.labor_cost) || 0,
            materialCost: parseFloat(apiTrade.material_cost) || 0,
            tradeTotal: parseFloat(apiTrade.trade_total) || 0,
            serviceList: [defaultService],
            isExpanded: true,
            startDate: apiTrade.start_date
              ? new Date(apiTrade.start_date)
              : undefined,
            endDate: apiTrade.end_date
              ? new Date(apiTrade.end_date)
              : undefined,
            markup: parseFloat(apiTrade.markup) || 0,
            markup_type: apiTrade.markup_type || 'FLAT_AMOUNT',
          };
        }) || [];

      return {
        id: String(apiRoom.id || roomIndex),
        uniqueKey: `room_${apiRoom.uuid || roomIndex}`,
        name: apiRoom.room_name || `Room ${roomIndex + 1}`,
        total: 0, // Will be calculated by EstimationBox
        trades: transformedTrades,
        isExpanded: true,
      };
    });
  };

  // Get template type name for display
  const getTemplateTypeName = (type: string) => {
    switch (type) {
      case 'ESTIMATE_TEMPLATES':
        return 'Estimate Template';
      case 'OPTION_BID_TEMPLATES':
        return 'Option Bid Template';
      case 'TOOL_TEMPLATES':
        return 'Tool Template';
      case 'DISCLAIMER_TEMPLATES':
        return 'Disclaimer Template';
      default:
        return 'Template';
    }
  };

  // Render form fields based on template type
  const renderFormFields = () => {
    if (!template) return null;

    switch (template.template_type) {
      case 'ESTIMATE_TEMPLATES':
        return (
          <div className='w-full'>
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Edit Estimate Template' },
                ]}
                className='mb-6'
              />
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <EstimationTemplateForm
                templateId={template.uuid}
                initialData={{
                  templateName: formData.templateName,
                  category: formData.category,
                }}
              />
            </div>
          </div>
        );

      case 'OPTION_BID_TEMPLATES':
        return (
          <div className='w-full'>
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Edit Option Bid Template' },
                ]}
                className='mb-6'
              />
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
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
                  <Label htmlFor='service' className='field-label'>
                    Service
                  </Label>
                  <Input
                    id='service'
                    value={formData.service}
                    onChange={e => handleInputChange('service', e.target.value)}
                    placeholder='Enter service'
                    className='input-field'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='material' className='field-label'>
                    Material
                  </Label>
                  <Input
                    id='material'
                    value={formData.material}
                    onChange={e =>
                      handleInputChange('material', e.target.value)
                    }
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
            </div>
          </div>
        );

      case 'TOOL_TEMPLATES':
        return (
          <div className='w-full'>
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Edit Tool Template' },
                ]}
                className='mb-6'
              />
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <TemplateToolForm
                onSubmit={data => {
                  console.log('Tool form submitted:', data);
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

      case 'DISCLAIMER_TEMPLATES':
        return (
          <div className='w-full'>
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Edit Disclaimer Template' },
                ]}
                className='mb-6'
              />
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

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-[var(--text-dark)] mb-2'>
            Template not found
          </h2>
          <p className='text-[var(--text-secondary)] mb-4'>
            The template you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={handleBack} variant='outline'>
            <ArrowLeft size={16} className='mr-2' />
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {renderFormFields()}

      {/* Action Buttons */}
      <div className='flex items-center justify-end space-x-4 mt-6'>
        <Button onClick={handleBack} variant='outline'>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save2 size={16} className='mr-2' />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
