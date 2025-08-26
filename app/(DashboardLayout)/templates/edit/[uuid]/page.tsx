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
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { TemplateApiData } from '../../template-types';

// Utility function to generate unique keys (same as EstimationBox)
const generateUniqueKey = (
  prefix: string,
  _tradeUuid?: string,
  roomId?: string,
  tradeSequenceNumber?: number
): string => {
  if (
    prefix === 'trade' &&
    roomId !== undefined &&
    tradeSequenceNumber !== undefined
  ) {
    return `trade_${roomId}_${tradeSequenceNumber}`;
  }
  // Fallback for other cases (rooms, etc.)
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
};

interface EditTemplatePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { uuid } = use(params);
  const router = useRouter();
  const { showErrorToast } = useToast();
  const [loading, setLoading] = useState(true);
  // const [saving, setSaving] = useState(false);
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
            // store UUID for selects
            service:
              templateData.service?.uuid ||
              templateData.service?.id ||
              templateData.service?.name ||
              '',
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

            const transformedRooms = transformApiRoomsToEstimationBox(
              templateData.templateRooms
            );

            // Store in both template-specific and regular template_rooms keys for consistency
            localStorage.setItem(storageKey, JSON.stringify(transformedRooms));
            localStorage.setItem(
              'template_rooms',
              JSON.stringify(transformedRooms)
            );

            // Verify the data was stored correctly in both keys
            const storedData = localStorage.getItem(storageKey);
            const regularStoredData = localStorage.getItem('template_rooms');
            const parsedStoredData = storedData ? JSON.parse(storedData) : null;
            const parsedRegularData = regularStoredData
              ? JSON.parse(regularStoredData)
              : null;

            // Verify both keys have the same structure
            if (parsedStoredData && parsedRegularData) {
            }

            // Check the first room's trades and services in detail
            if (parsedStoredData && parsedStoredData[0]) {
              if (parsedStoredData[0].trades && parsedStoredData[0].trades[0]) {
                // Check the first service's materials and finishes
                if (
                  parsedStoredData[0].trades[0].serviceList &&
                  parsedStoredData[0].trades[0].serviceList[0]
                ) {
                  // First service exists; no-op in production build
                }
              }
            }
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

  // const handleSave = async () => {
  //   try {
  //     setSaving(true);
  //     // TODO: Implement update API call
  //     showSuccessToast('Template updated successfully.');
  //     router.push('/templates');
  //   } catch (error: any) {
  //     showErrorToast(
  //       extractApiErrorMessage(error, 'Failed to update template.')
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleBack = () => {
    router.push('/templates');
  };

  // Transform API rooms data to EstimationBox format (new API structure)
  const transformApiRoomsToEstimationBox = (apiRooms: any[]) => {
    return apiRooms.map((apiRoom, roomIndex) => {
      const transformedTrades = (apiRoom.trades || []).map(
        (apiTrade: any, tradeIndex: number) => {
          const transformedServices = (apiTrade.services || []).map(
            (apiService: any, serviceIndex: number) => {
              return {
                service_id: apiService.service_id,
                service_order_no:
                  apiService.service_order_no || serviceIndex + 1,
                description:
                  apiService.description || `Service ${serviceIndex + 1}`,
                qty: Number(apiService.qty) || 1,
                rate: Number(apiService.rate) || 0,
                materials: Array.isArray(apiService.materials)
                  ? apiService.materials.map((material: any) => ({
                      id: material.material_id,
                      uuid: material.material_id,
                      name: material.name || material.description || '',
                      variant: '',
                      qty: Number(material.qty) || 1,
                      unit: material.unit || 'INCH',
                      description: material.description || '',
                      rate: Number(material.rate) || 0,
                      markup: Number(material.markup) || 0,
                      markup_type: 'FLAT_AMOUNT',
                      lineTotal: 0,
                    }))
                  : [],
                finishes: Array.isArray(apiService.finishes)
                  ? apiService.finishes.map((finish: any) => ({
                      id: finish.material_id,
                      uuid: finish.material_id,
                      name: finish.name || finish.description || '',
                      variant: '',
                      qty: Number(finish.qty) || 1,
                      unit: finish.unit || 'INCH',
                      description: finish.description || '',
                      rate: Number(finish.rate) || 0,
                      markup: Number(finish.markup) || 0,
                      markup_type: 'FLAT_AMOUNT',
                      lineTotal: 0,
                    }))
                  : [],
                tools: Array.isArray(apiService.tools)
                  ? apiService.tools.map((tool: any) => ({
                      id: tool.tool_id,
                      uuid: tool.tool_id,
                      name: tool.name || tool.tool_id || 'Tool',
                      category: '',
                      description: '',
                      status: 'available',
                    }))
                  : [],
                // Extra fields for component functionality
                id: apiService.service_id,
                uuid: apiService.service_id,
                name: apiService.description || `Service ${serviceIndex + 1}`,
                lineTotal: 0,
                serviceTotal: 0,
                tradeTotal: 0,
                serviceOptions: [],
                is_hidden: false,
              };
            }
          );

          return {
            // Your desired format
            trade_id: apiTrade.trade_id,
            start_date: apiTrade.start_date || null,
            end_date: apiTrade.end_date || null,
            markup: Number(apiTrade.markup) || 0,
            services: transformedServices,
            // Extra fields for component functionality
            id: apiTrade.trade_id,
            uuid: apiTrade.trade_id,
            uniqueKey: generateUniqueKey(
              'trade',
              apiTrade.trade_id,
              String(roomIndex),
              tradeIndex
            ),
            name: apiTrade.name || `Trade ${tradeIndex + 1}`,
            type: 'default',
            laborCost: 0,
            materialCost: 0,
            tradeTotal: 0,
            serviceList: transformedServices,
            isExpanded: true,
            startDate: apiTrade.start_date
              ? new Date(apiTrade.start_date)
              : undefined,
            endDate: apiTrade.end_date
              ? new Date(apiTrade.end_date)
              : undefined,
            markup_type: 'FLAT_AMOUNT',
          };
        }
      );

      return {
        // Your desired format
        room_name: apiRoom.room_name || `Room ${roomIndex + 1}`,
        trades: transformedTrades,
        // Extra fields for component functionality
        id: String(roomIndex),
        uniqueKey: generateUniqueKey('room'),
        name: apiRoom.room_name || `Room ${roomIndex + 1}`,
        total: 0,
        isExpanded: true,
      };
    });
  };

  // Note: getTemplateTypeName helper removed as it was unused

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
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  tools: (() => {
                    // Prefer templateTools from API, fallback to tool_ids or tools
                    if (Array.isArray((template as any)?.templateTools)) {
                      return ((template as any).templateTools as any[])
                        .map(tt =>
                          String(
                            tt?.tool?.uuid ||
                              tt?.tool_uuid ||
                              tt?.uuid ||
                              tt?.tool_id ||
                              ''
                          )
                        )
                        .filter(Boolean);
                    }
                    if (Array.isArray((template as any)?.tool_ids)) {
                      return ((template as any).tool_ids as any[])
                        .map(id => String(id))
                        .filter(Boolean);
                    }
                    if (Array.isArray((template as any)?.tools)) {
                      return ((template as any).tools as any[])
                        .map(t => String(t?.uuid || t?.id || ''))
                        .filter(Boolean);
                    }
                    return [] as string[];
                  })(),
                }}
                templateId={template.uuid}
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
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  warranty: formData.warranty,
                  description: formData.description,
                  duration: formData.duration,
                }}
                templateId={template.uuid}
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

  return <div className='w-full'>{renderFormFields()}</div>;
}
