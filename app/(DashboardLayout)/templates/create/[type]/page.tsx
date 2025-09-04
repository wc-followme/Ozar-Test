'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { DisclaimerForm } from '@/components/shared/forms/DisclaimerForm';
import EstimationTemplateForm from '@/components/shared/forms/EstimationTemplateForm';

import { TemplateToolForm } from '@/components/shared/forms/TemplateToolForm';
import ServiceOptionsBox, {
  getServiceOptionTradeTotal,
} from '@/components/Templates/ServiceOptionsBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { getCompanyId } from '@/lib/utils';
import { use, useCallback, useEffect, useState } from 'react';
import LoadingComponent from '../../../../../components/shared/common/LoadingComponent';
import { TemplateApiData, TemplateData } from '../../template-types';

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

  // State for tool templates from API
  const [toolTemplates, setToolTemplates] = useState<TemplateApiData[]>([]);
  const [loadingToolTemplates, setLoadingToolTemplates] = useState(false);
  const [loadingMoreTemplates, setLoadingMoreTemplates] = useState(false);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle service selection changes
  const handleServiceChange = (serviceId: string | null) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId || '',
    }));
  };

  // Fetch tool templates from API with pagination
  const fetchToolTemplates = useCallback(
    async (pageNum = 1, append = false) => {
      if (type !== 'tools') return;

      if (append) {
        setLoadingMoreTemplates(true);
      } else {
        setLoadingToolTemplates(true);
        setCurrentPage(1);
      }

      try {
        const companyId = getCompanyId();
        if (!companyId) {
          console.error('Company ID not found');
          return;
        }

        // Build API parameters
        const apiParams: any = {
          page: pageNum,
          limit: 12, // Smaller limit for better UX
          company_id: companyId,
          status: 'ACTIVE',
        };

        // Add service filter if service is selected
        if (formData.service) {
          apiParams.service_id = formData.service;
        }

        const response = await apiService.fetchTemplates(apiParams);

        if (response.statusCode === 200 && response.data) {
          const { data: templatesData, totalPages } = response.data;
          // Filter only tool templates
          const toolTemplatesData = templatesData.filter(
            (template: TemplateApiData) =>
              template.template_type === TEMPLATE_TYPES.TOOL_TEMPLATES
          );

          setToolTemplates(prev => {
            if (append) {
              // Filter out duplicates when appending
              const existingUuids = new Set(
                prev.map(template => template.uuid)
              );
              const uniqueNewTemplates = toolTemplatesData.filter(
                (template: TemplateApiData) => !existingUuids.has(template.uuid)
              );
              return [...prev, ...uniqueNewTemplates];
            } else {
              return toolTemplatesData;
            }
          });

          setHasMoreTemplates(pageNum < totalPages);
          setCurrentPage(pageNum);
        }
      } catch (error) {
        console.error('Failed to fetch tool templates:', error);
        if (!append) {
          setToolTemplates([]);
        }
        setHasMoreTemplates(false);
      } finally {
        if (append) {
          setLoadingMoreTemplates(false);
        } else {
          setLoadingToolTemplates(false);
        }
      }
    },
    [type]
  );

  // Load more templates for infinite scroll
  const loadMoreTemplates = () => {
    if (!loadingMoreTemplates && hasMoreTemplates) {
      fetchToolTemplates(currentPage + 1, true);
    }
  };

  // Handle scroll in the template sheet for infinite loading
  const handleTemplateSheetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Load more when user scrolls to bottom (with 50px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMoreTemplates();
    }
  };

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
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
  }, [type]);

  // Fetch trades from API based on selected category
  const fetchTrades = useCallback(
    async (categoryId: string) => {
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
          : Array.isArray((payload.data as { data?: TradeItem[] })?.data)
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
    },
    [type]
  );

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

        // Clear service options template from localStorage after successful submission
        localStorage.removeItem('service_options_template');

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
    if (type === 'service-option') {
      fetchCategories();
    } else if (type === 'tools') {
      fetchToolTemplates();
    }
  }, [type, fetchCategories, fetchToolTemplates]);

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
          description?: string;
          materials?: Array<{
            qty?: number;
            rate?: number;
            is_hidden?: boolean;
            markup?: number;
            markup_type?: string;
          }>;
          finishes?: Array<{
            qty?: number;
            rate?: number;
            is_hidden?: boolean;
            markup?: number;
            markup_type?: string;
          }>;
        }>;
        if (!Array.isArray(data)) {
          setProjectTotal(0);
          return;
        }
        // Use centralized calculation function to ensure consistency
        console.log('Computing Project Total from localStorage data:', data);
        console.log('Number of service options in localStorage:', data.length);

        const total = data.reduce((sum, svc, index) => {
          // Use the simplified function that handles both cases
          const tradeTotal = getServiceOptionTradeTotal({
            rate: svc.rate || 0,
            qty: svc.qty || 1,
            materials: svc.materials || [],
            finishes: svc.finishes || [],
          });
          console.log(
            `Service ${index + 1}:`,
            svc.description || 'Unknown',
            'Rate:',
            svc.rate,
            'Qty:',
            svc.qty,
            'Materials:',
            svc.materials?.length || 0,
            'Finishes:',
            svc.finishes?.length || 0,
            'Trade Total:',
            tradeTotal,
            'Running Sum:',
            sum + tradeTotal
          );
          return sum + tradeTotal;
        }, 0);
        console.log('Final Project Total:', total);
        setProjectTotal(total);
      } catch {
        setProjectTotal(0);
      }
    };

    // Initial compute
    computeTotal();

    // Monitor localStorage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'service_options_template') {
        console.log('localStorage changed, recomputing Project Total');
        computeTotal();
      }
    };
    window.addEventListener('storage', onStorage);

    // Also monitor for same-tab changes using a custom event
    const onCustomStorageChange = () => {
      console.log('Custom storage change event, recomputing Project Total');
      computeTotal();
    };
    window.addEventListener('customStorageChange', onCustomStorageChange);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('customStorageChange', onCustomStorageChange);
    };
  }, []);

  // Get templates based on type - now uses API data for tools
  const getTemplates = (): TemplateData[] => {
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
        // Transform API data to TemplateData format
        return toolTemplates.map(template => ({
          id: template.uuid,
          type: 'tools' as const,
          templateName: template.name,
          createdDate: new Date(template.created_at).toLocaleDateString(
            'en-GB'
          ),
          service: template.service?.name || 'Unknown Service',
          material: 'Default Material', // Default value since API doesn't provide this
        }));
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };

      // If category changes, clear trade selection and fetch trades
      if (field === 'category' && value) {
        next.trade = '';
        fetchTrades(value);
      }

      return next;
    });
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
              <Button
                className='btn-primary'
                onClick={() => setIsTemplateSheetOpen(true)}
                disabled={loadingToolTemplates || !formData.service}
              >
                {loadingToolTemplates ? 'Loading...' : 'Add From Templates'}
              </Button>
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
                onServiceChange={handleServiceChange}
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
          {loadingToolTemplates && type === 'tools' ? (
            <div className='flex justify-center items-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
            </div>
          ) : (
            <>
              <div
                className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto'
                onScroll={
                  type === 'tools' ? handleTemplateSheetScroll : undefined
                }
              >
                {getTemplates().map(({ id, ...template }) => (
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

                {/* Loading indicators for infinite scroll */}
                {type === 'tools' && loadingMoreTemplates && (
                  <LoadingComponent variant='inline' size='md' text='' />
                )}

                {type === 'tools' &&
                  !loadingToolTemplates &&
                  toolTemplates.length === 0 && (
                    <div className='col-span-full text-center py-4'>
                      <p className='text-sm text-[var(--text-secondary)]'>
                        {formData.service
                          ? `No tool templates found for the selected service`
                          : 'No tool templates found'}
                      </p>
                    </div>
                  )}
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
            </>
          )}
        </div>
      </SideSheet>
    </div>
  );
}
