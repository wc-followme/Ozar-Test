'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import SelectField from '@/components/shared/common/SelectField';
import { DisclaimerForm } from '@/components/shared/forms/DisclaimerForm';
import EstimationTemplateForm from '@/components/shared/forms/EstimationTemplateForm';
import { TemplateToolForm } from '@/components/shared/forms/TemplateToolForm';
import ServiceOptionsBox, {
  getServiceOptionTradeTotal,
} from '@/components/Templates/ServiceOptionsBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
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
  const { showErrorToast, showSuccessToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<TemplateApiData | null>(null);
  const [formData, setFormData] = useState({
    templateName: '',
    service: '',
    material: '',
    propertyType: '',
    category: '',
    trade: '',
    description: '',
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

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTemplateById(uuid);

        if (response.statusCode === 200 && response.data) {
          const templateData = response.data;
          setTemplate(templateData);
          // Get category and trade from the correct locations
          const categoryId =
            templateData.category?.uuid || templateData.category_id || '';
          let tradeId = templateData.trade_id || '';

          // For service options templates, also check service_options_template for trade_id
          if (
            templateData.template_type === 'OPTION_BID_TEMPLATES' &&
            templateData.service_options_template &&
            templateData.service_options_template.trade_id
          ) {
            tradeId = templateData.service_options_template.trade_id;
          }

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
            category: categoryId, // Use UUID for category
            trade: tradeId, // Use UUID for trade
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

          // Store service options template data in localStorage for ServiceOptionsBox
          if (
            templateData.service_options_template &&
            templateData.template_type === 'OPTION_BID_TEMPLATES'
          ) {
            // Transform API data to ServiceOptionsBox expected format
            // service_options_template is an array directly, not an object with service_options property
            const serviceOptionsArray = Array.isArray(
              templateData.service_options_template
            )
              ? templateData.service_options_template
              : templateData.service_options_template.service_options || [];

            // Store in localStorage with the key that ServiceOptionsBox expects
            localStorage.setItem(
              'service_options_template_edit',
              JSON.stringify(serviceOptionsArray)
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

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    if (template?.template_type !== 'OPTION_BID_TEMPLATES') return;

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

      type CategoryItem = {
        id?: string | number;
        uuid?: string;
        name?: string;
      };
      const payload = response as unknown as {
        data?: CategoryItem[] | { data?: CategoryItem[] };
      };
      const list: CategoryItem[] = Array.isArray(payload?.data)
        ? (payload.data as CategoryItem[])
        : Array.isArray((payload?.data as { data?: CategoryItem[] })?.data)
          ? ((payload.data as { data?: CategoryItem[] }).data as CategoryItem[])
          : [];

      const options = list
        .filter(c => !!c?.name)
        .map(c => ({
          value: String(c.uuid || c.id || c.name),
          label: String(c.name),
        }));
      setCategories(options);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [template?.template_type]);

  // Fetch trades from API based on selected category
  const fetchTrades = useCallback(
    async (categoryId: string) => {
      if (template?.template_type !== 'OPTION_BID_TEMPLATES' || !categoryId) {
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

        const options = list
          .filter(t => !!t?.name)
          .map(t => ({
            value: String(t.uuid || t.id || t.name),
            label: String(t.name),
          }));
        setTrades(options);
      } catch (error) {
        console.error('Error fetching trades:', error);
        setTrades([]);
      } finally {
        setLoadingTrades(false);
      }
    },
    [template?.template_type]
  );

  // Fetch categories and trades when template is loaded
  useEffect(() => {
    if (template?.template_type === 'OPTION_BID_TEMPLATES') {
      fetchCategories();
      // If formData has a category, fetch trades for that category
      if (formData.category) {
        fetchTrades(formData.category);
      }
    }
  }, [template, formData.category, fetchCategories, fetchTrades]);

  // Project Total calculation for service options templates
  useEffect(() => {
    if (template?.template_type !== 'OPTION_BID_TEMPLATES') return;

    const computeTotal = () => {
      try {
        const raw = localStorage.getItem('service_options_template_edit');
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

        const total = data.reduce((sum, svc, index) => {
          // Use the simplified function that handles both cases
          const tradeTotal = getServiceOptionTradeTotal({
            rate: svc.rate || 0,
            qty: svc.qty || 1,
            materials: svc.materials || [],
            finishes: svc.finishes || [],
          });
          return sum + tradeTotal;
        }, 0);
        setProjectTotal(total);
      } catch {
        setProjectTotal(0);
      }
    };

    // Add a small delay to ensure data is loaded
    const initialTimeout = setTimeout(() => {
      computeTotal();
    }, 100);

    // Listen for localStorage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'service_options_template_edit') {
        computeTotal();
      }
    };
    window.addEventListener('storage', onStorage);

    // Listen for custom storage change events (same-tab updates)
    const onCustomStorageChange = () => {
      computeTotal();
    };
    window.addEventListener('customStorageChange', onCustomStorageChange);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('customStorageChange', onCustomStorageChange);
    };
  }, [template?.template_type]);

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

  const handleSaveTemplate = async () => {
    if (template?.template_type !== 'OPTION_BID_TEMPLATES') return;

    setIsSubmitting(true);
    try {
      // Get selected company
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

      if (!companyUuid) {
        throw new Error('No company selected');
      }

      // Validate required form fields
      if (!formData.templateName.trim()) {
        throw new Error('Template name is required');
      }

      // Get service options data from localStorage
      const serviceOptionsData = localStorage.getItem(
        'service_options_template_edit'
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

      // Prepare template data for update
      const templateData = {
        name: formData.templateName,
        category_id: formData.category,
        template_type: 'OPTION_BID_TEMPLATES',
        service_id: parsedServiceOptions[0]?.service_id || formData.category, // Use first service's service_id
        trade_id: formData.trade,
        company_id: companyUuid,
        service_options_template: parsedServiceOptions, // Use localStorage data directly
      };

      // Call API to update template
      const response = await apiService.makeGenericRequest(
        `/templates/${uuid}`,
        {
          method: 'PATCH',
          body: JSON.stringify(templateData),
        }
      );

      const { statusCode, message } = response || {};

      if (statusCode === 200 || statusCode === 201) {
        showSuccessToast(message || 'Template updated successfully');
        // Clear service options template from localStorage after successful update
        localStorage.removeItem('service_options_template_edit');
        // Redirect to templates page
        router.push('/templates');
      } else {
        throw new Error(message || 'Failed to update template');
      }
    } catch (error: any) {
      showErrorToast(
        error?.message || 'Failed to update template. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* Header with Breadcrumb */}
            <div className='flex items-end sm:items-center justify-between mb-6 sm:flex-row flex-col gap-3'>
              <Breadcrumb
                items={[
                  { name: 'Templates', href: '/templates' },
                  { name: 'Edit Service Options Template' },
                ]}
              />
            </div>

            {/* Template Meta Fields */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                <div className='space-y-2 col-span-2'>
                  <label htmlFor='templateName' className='field-label'>
                    Template Name
                  </label>
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
                  <label htmlFor='category' className='field-label'>
                    Category
                  </label>
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
                  <label htmlFor='trade' className='field-label'>
                    Trade
                  </label>
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

            {/* Service Options Box */}
            <div className='bg-[var(--card-background)] rounded-3xl border border-[var(--border-dark)] p-6 mb-6'>
              <ServiceOptionsBox localStorageKey='service_options_template_edit' />
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
                      onClick={handleSaveTemplate}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Template'}
                    </Button>
                  </div>
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
                onSubmit={() => {
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
                onServiceChange={serviceId => {
                  // Update form data when service changes
                  setFormData(prev => ({
                    ...prev,
                    service: serviceId || '',
                  }));
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
                onSubmit={() => {
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
