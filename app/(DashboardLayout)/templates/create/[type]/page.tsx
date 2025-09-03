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

import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { use, useEffect, useState } from 'react';
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
  const { showErrorToast, showSuccessToast } = useToast();
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    templateName: '',
    service: '',
    material: '',
    propertyType: '',
    category: '',
    trade: '',
    tools: '',
    warranty: '',
    duration: '',
  });
  const [projectTotal, setProjectTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dynamic categories
  const [categories, setCategories] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // State for dynamic trades
  const [trades, setTrades] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Fetch categories from API
  const fetchCategories = async () => {
    if (type !== 'service-option') return;

    setLoadingCategories(true);
    try {
      const selectedCompanyRaw =
        typeof window !== 'undefined'
          ? localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY)
          : null;
      const companyUuid = selectedCompanyRaw
        ? (() => {
            try {
              const parsed: { uuid?: string; id?: string | number } =
                JSON.parse(selectedCompanyRaw);
              return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
            } catch {
              return '';
            }
          })()
        : '';

      const response = await apiService.fetchCategoriesPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        status: 'ACTIVE',
      });

      const categoryOptions =
        response.data?.data?.map(category => ({
          value: category.uuid,
          label: category.name,
        })) || [];

      setCategories(categoryOptions);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { value: 'Interior', label: 'Interior' },
        { value: 'Exterior', label: 'Exterior' },
        { value: 'Plumbing', label: 'Plumbing' },
        { value: 'Electrical', label: 'Electrical' },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch trades from API based on selected category
  const fetchTrades = async (categoryId: string) => {
    if (type !== 'service-option' || !categoryId) {
      setTrades([]);
      return;
    }

    setLoadingTrades(true);
    try {
      const selectedCompanyRaw =
        typeof window !== 'undefined'
          ? localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY)
          : null;
      const companyUuid = selectedCompanyRaw
        ? (() => {
            try {
              const parsed: { uuid?: string; id?: string | number } =
                JSON.parse(selectedCompanyRaw);
              return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
            } catch {
              return '';
            }
          })()
        : '';

      const response = await apiService.fetchTradesPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        category_id: categoryId,
      });

      type TradeItem = { id?: string | number; uuid?: string; name?: string };
      const payload = response as unknown as {
        data?: TradeItem[] | { data?: TradeItem[] };
      };
      const list: TradeItem[] = Array.isArray(payload?.data)
        ? (payload.data as TradeItem[])
        : Array.isArray((payload?.data as { data?: TradeItem[] })?.data)
          ? ((payload.data as { data?: TradeItem[] }).data as TradeItem[])
          : [];

      const tradeOptions = list
        .filter(t => !!t?.name)
        .map(t => ({
          value: String(t.uuid || t.id || t.name),
          label: String(t.name),
        }));

      setTrades(tradeOptions);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
      setTrades([]);
    } finally {
      setLoadingTrades(false);
    }
  };

  // Save template function with proper UUID handling
  const handleSaveTemplate = async (formData: {
    templateName: string;
    category: string;
    trade: string;
  }) => {
    if (type !== 'service-option') return;

    setIsSubmitting(true);
    try {
      // Get selected company
      const selectedCompanyRaw = localStorage.getItem(
        STORAGE_KEYS.SELECTED_COMPANY
      );
      const companyUuid = selectedCompanyRaw
        ? (() => {
            try {
              const parsed: { uuid?: string; id?: string | number } =
                JSON.parse(selectedCompanyRaw);
              return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
            } catch {
              return '';
            }
          })()
        : '';

      if (!companyUuid) {
        throw new Error('No company selected');
      }

      // Validate required form fields
      if (!formData.templateName.trim()) {
        throw new Error('Template name is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.trade) {
        throw new Error('Trade is required');
      }

      // Get service options data from localStorage
      const serviceOptionsData = localStorage.getItem(
        'service_options_template'
      );
      if (!serviceOptionsData) {
        throw new Error('No service options data found');
      }

      const parsedServiceOptions = JSON.parse(serviceOptionsData);

      // Validate that we have service options
      if (
        !Array.isArray(parsedServiceOptions) ||
        parsedServiceOptions.length === 0
      ) {
        throw new Error(
          'No service options found. Please add at least one service option before saving.'
        );
      }

      // Extract service_id from the first service option if available
      const firstServiceOption = parsedServiceOptions[0];
      const serviceId = firstServiceOption?.service_id || null;

      // Validate UUID format for trade_id and category_id
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (formData.trade && !uuidRegex.test(formData.trade)) {
        throw new Error('Trade ID must be a valid UUID');
      }

      if (formData.category && !uuidRegex.test(formData.category)) {
        throw new Error('Category ID must be a valid UUID');
      }

      // Prepare template data with UUIDs
      const templateData = {
        name: formData.templateName,
        template_type: TEMPLATE_TYPES.OPTION_BID_TEMPLATES,
        company_id: companyUuid,
        service_id: serviceId, // This should already be a UUID from service options
        trade_id: formData.trade, // UUID from form
        category_id: formData.category, // UUID from form
        service_options_template: {
          trade_id: formData.trade, // UUID from form
          category_id: formData.category, // UUID from form
          service_options: parsedServiceOptions.map((service: any) => ({
            service_name: service.description || service.service_id,
            description: service.description || '',
            price: service.rate || 0,
            duration: 'Custom',
            materials: service.materials || [],
            finishes: service.finishes || [],
            tools: service.tools || [],
            qty: service.qty || 1,
          })),
        },
      };

      // Call API to create template
      const response = await apiService.makeGenericRequest('/templates', {
        method: 'POST',
        body: JSON.stringify(templateData),
      });

      const { statusCode, message } = response || {};

      if (statusCode === 200 || statusCode === 201) {
        showSuccessToast(message || 'Template created successfully');
        // Redirect to templates page
        window.location.href = '/templates';
      } else {
        throw new Error(message || 'Failed to create template');
      }
    } catch (error: any) {
      showErrorToast(
        error?.message || 'Failed to save template. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [type]);

  // Recompute Project Total from localStorage whenever the service options change
  useEffect(() => {
    const computeTotal = () => {
      try {
        const raw = localStorage.getItem('service_options_template');
        if (!raw) {
          setProjectTotal(0);
          return;
        }
        const data = JSON.parse(raw) as Array<{
          rate?: number;
          qty?: number;
          materials?: Array<{ qty?: number; rate?: number }>;
          finishes?: Array<{ qty?: number; rate?: number }>;
        }>;
        if (!Array.isArray(data)) {
          setProjectTotal(0);
          return;
        }
        const total = data.reduce((sum, svc) => {
          const serviceTotal = (svc.rate || 0) * (svc.qty || 1);
          const materialsTotal = (svc.materials || []).reduce(
            (m, i) => m + (i.rate || 0) * (i.qty || 0),
            0
          );
          const finishesTotal = (svc.finishes || []).reduce(
            (f, i) => f + (i.rate || 0) * (i.qty || 0),
            0
          );
          return sum + serviceTotal + materialsTotal + finishesTotal;
        }, 0);
        setProjectTotal(total);
      } catch {
        setProjectTotal(0);
      }
    };

    // Initial compute
    computeTotal();

    // Observe localStorage changes (same-tab updates are triggered by our setItem)
    const originalSetItem = localStorage.setItem;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (localStorage as any).setItem = function (...args: unknown[]) {
      // @ts-expect-error - forward to original
      originalSetItem.apply(this, args);
      if (args[0] === 'service_options_template') computeTotal();
    };

    // Cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'service_options_template') computeTotal();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
      // restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (localStorage as any).setItem = originalSetItem;
    };
  }, []);

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
    void template;
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

    // If category changes, fetch trades for that category
    if (field === 'category' && value) {
      fetchTrades(value);
      // Clear trade selection when category changes
      setFormData(prev => ({
        ...prev,
        trade: '',
      }));
    }
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
              {/* <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button> */}
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
              {/* <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button> */}
            </div>

            {/* Template Meta Fields */}
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
                    options={categories}
                    placeholder={
                      loadingCategories
                        ? 'Loading categories...'
                        : 'Select Category'
                    }
                    disabled={loadingCategories}
                  />
                </div>

                <div className='space-y-2'>
                  <label className='field-label'>Trade</label>
                  <SelectField
                    value={formData.trade}
                    onValueChange={val => handleInputChange('trade', val)}
                    options={trades}
                    placeholder={
                      loadingTrades
                        ? 'Loading trades...'
                        : formData.category
                          ? 'Select Trade'
                          : 'Select Category First'
                    }
                    disabled={loadingTrades || !formData.category}
                  />
                </div>
              </div>
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <ServiceOptionsBox
                _onClose={() => {}}
                templateId='new-service-option-template'
                tradeId={formData.trade} // Pass selected trade ID
                onSaveSuccess={() => {
                  console.log('Service options template saved successfully');
                }}
                onSaveError={(error: any) => {
                  console.error(
                    'Failed to save service options template:',
                    error
                  );
                }}
                // Listen to localStorage changes to recompute project total
              />
              <div className='mt-6'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-4'>
                    <h3 className='text-base font-semibold text-[var(--text-dark)]'>
                      Project Total:
                    </h3>
                    <div className='h-10 w-[1px] bg-[var(--border-dark)]'></div>
                    <span className='text-xl font-bold text-[var(--primary)]'>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(projectTotal)}
                    </span>
                  </div>
                  <div className='flex gap-3'>
                    <Button
                      className='btn-primary'
                      onClick={() =>
                        handleSaveTemplate({
                          templateName: formData.templateName,
                          category: formData.category,
                          trade: formData.trade,
                        })
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Template'}
                    </Button>
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
              {/* <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button> */}
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <TemplateToolForm
                onSubmit={() => {
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
              {/* <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
              >
                Add From Templates
              </Button> */}
            </div>

            {/* Template Details Section */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <DisclaimerForm
                onSubmit={() => {
                  // Handle form submission here
                }}
                initialData={{
                  templateName: formData.templateName,
                  service: formData.service,
                  warranty: formData.warranty,
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
