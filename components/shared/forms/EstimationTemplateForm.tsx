'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SelectField from '@/components/shared/common/SelectField';
import EstimationBox from '@/components/Templates/EstimationBox';
import EstimationBoxEdit from '@/components/Templates/EstimationBoxEdit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// Types
interface EstimationTemplateFormData {
  templateName: string;
  category: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface EstimationTemplateFormProps {
  templateId?: string;
  initialData?: {
    templateName?: string;
    category?: string;
  };
}

// Validation schema
const estimationTemplateSchema = yup.object({
  templateName: yup.string().required('Template name is required'),
  category: yup.string().required('Category is required'),
});

export default function EstimationTemplateForm({
  templateId,
  initialData,
}: EstimationTemplateFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EstimationTemplateFormData>({
    resolver: yupResolver(estimationTemplateSchema),
    defaultValues: {
      templateName: initialData?.templateName || '',
      category: initialData?.category || '',
    },
  });

  const watchedCategory = watch('category');

  // Get company ID from localStorage
  const getCompanyId = (): string => {
    try {
      const selectedCompany = localStorage.getItem(
        STORAGE_KEYS.SELECTED_COMPANY
      );
      if (selectedCompany) {
        const parsedCompany = JSON.parse(selectedCompany);
        return parsedCompany.id || '';
      }
    } catch (error) {
      console.error('Error parsing selected company:', error);
    }
    return '';
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    const companyId = getCompanyId();
    if (!companyId) {
      setCategoryOptions([]);
      return;
    }

    setIsLoadingCategories(true);
    try {
      const response = await apiService.fetchCategoriesPublic({
        page: 1,
        limit: 50,
        status: 'ACTIVE',
        company_id: companyId,
      });

      if (response.statusCode === 200 && response.data?.data) {
        const categories = response.data.data.map((category: any) => ({
          value: category.uuid || '',
          label: category.name || '',
        }));
        setCategoryOptions(categories);
      } else {
        setCategoryOptions([]);
      }
    } catch (_error) {
      // Gracefully handle errors - show empty dropdown
      setCategoryOptions([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set form values when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.templateName) {
        setValue('templateName', initialData.templateName);
      }
      if (initialData.category) {
        setValue('category', initialData.category);
      }
    }
  }, [initialData, setValue]);

  // Load initial template rooms data when component mounts (for edit mode)
  useEffect(() => {
    if (templateId) {
      const storageKey = `template_rooms_${templateId}`;
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        try {
          const roomsData = JSON.parse(existingData);
          // The EstimationBox component will automatically load this data
          // when it mounts and finds the data in localStorage
        } catch (error) {
          console.error('Error parsing template rooms data:', error);
        }
      }
    }
  }, [templateId]);

  // Get template rooms data from localStorage
  const getTemplateRoomsData = () => {
    try {
      const storageKey = templateId
        ? `template_rooms_${templateId}`
        : 'template_rooms';
      const templateRoomsData = localStorage.getItem(storageKey);
      return templateRoomsData ? JSON.parse(templateRoomsData) : [];
    } catch (error) {
      console.error('Error getting template rooms data:', error);
      return [];
    }
  };

  // Transform template rooms data to API format
  // - Omit materials/finishes arrays when they contain no valid UUID-based selections
  const transformTemplateRoomsData = (roomsData: any[]) => {
    try {
      if (!Array.isArray(roomsData)) return [];

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const sanitizedRooms = roomsData.map(room => {
        const trades = Array.isArray(room?.trades) ? room.trades : [];

        const sanitizedTrades = trades.map((trade: any) => {
          const services = Array.isArray(trade?.services) ? trade.services : [];

          const sanitizedServices = services
            .map((service: any, serviceIndex: number) => {
              const sUuid = String(service?.uuid || '');
              const sIdField = String(service?.service_id || '');
              const sId = String(service?.id || '');

              const finalServiceId = uuidRegex.test(sUuid)
                ? sUuid
                : uuidRegex.test(sIdField)
                  ? sIdField
                  : uuidRegex.test(sId)
                    ? sId
                    : '';

              if (!finalServiceId) {
                // Drop non-UUID service entries entirely
                return null;
              }

              const rawMaterials = Array.isArray(service?.materials)
                ? service.materials
                : [];
              const rawFinishes = Array.isArray(service?.finishes)
                ? service.finishes
                : [];

              // Keep only items that have a valid UUID in uuid or material_id
              const validMaterials = rawMaterials.filter((m: any) => {
                const candidate = String(m?.uuid || m?.material_id || '');
                return uuidRegex.test(candidate);
              });
              const validFinishes = rawFinishes.filter((f: any) => {
                const candidate = String(f?.uuid || f?.material_id || '');
                return uuidRegex.test(candidate);
              });

              // Map to API expected shape
              const mappedMaterials = validMaterials.map((m: any) => ({
                material_id: String(m?.uuid || m?.material_id),
                description: m?.description ?? '',
                qty: Number(m?.qty) || 0,
                unit: m?.unit ?? 'INCH',
                rate: Number(m?.rate) || 0,
                markup: Number(m?.markup) || 0,
                disclaimer: m?.disclaimer ?? '',
              }));
              const mappedFinishes = validFinishes.map((f: any) => ({
                material_id: String(f?.uuid || f?.material_id),
                description: f?.description ?? '',
                qty: Number(f?.qty) || 0,
                unit: f?.unit ?? 'INCH',
                rate: Number(f?.rate) || 0,
                markup: Number(f?.markup) || 0,
                disclaimer: f?.disclaimer ?? '',
              }));

              // Map tools to minimal shape { tool_id } and UUID filter
              const mappedTools = Array.isArray(service?.tools)
                ? service.tools
                    .map((t: any) => {
                      const toolId = String(
                        t?.uuid || t?.tool_id || t?.id || ''
                      );
                      return uuidRegex.test(toolId)
                        ? { tool_id: toolId }
                        : null;
                    })
                    .filter(Boolean)
                : [];

              const nextService: any = {
                service_id: finalServiceId,
                service_order_no: service?.service_order_no ?? serviceIndex + 1,
                description: service?.description || service?.name || '',
                qty: Number(service?.qty) || 1,
                rate: Number(service?.rate) || 0,
              };

              if (mappedMaterials.length > 0)
                nextService.materials = mappedMaterials;
              if (mappedFinishes.length > 0)
                nextService.finishes = mappedFinishes;
              if (mappedTools.length > 0) nextService.tools = mappedTools;

              return nextService;
            })
            .filter(Boolean);

          return {
            trade_id: String(trade?.trade_id || trade?.id || ''),
            start_date:
              trade?.start_date ||
              (trade?.startDate instanceof Date
                ? trade.startDate.toISOString()
                : undefined) ||
              null,
            end_date:
              trade?.end_date ||
              (trade?.endDate instanceof Date
                ? trade.endDate.toISOString()
                : undefined) ||
              null,
            markup: Number(trade?.markup) || 0,
            services: sanitizedServices,
          };
        });

        return {
          room_name: String(room?.room_name || room?.name || 'Room'),
          trades: sanitizedTrades,
        };
      });

      return sanitizedRooms;
    } catch (_e) {
      // On any unexpected structure, fail gracefully and send as-is
      return roomsData;
    }
  };

  // Helper functions for toast messages
  const showSuccessToast = (message: string) => {
    toast({
      title: 'Success',
      description: message,
      variant: 'default',
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  const onSubmitForm = async (data: EstimationTemplateFormData) => {
    const { templateName, category } = data;

    setIsSubmitting(true);
    try {
      // Get selected company ID using global utility function
      const companyId = getCompanyId();

      // Get template rooms data from localStorage
      const templateRoomsData = getTemplateRoomsData();
      const transformedRooms = transformTemplateRoomsData(templateRoomsData);

      // Prepare API payload
      const payload: any = {
        name: templateName,
        category_id: category,
        template_type: TEMPLATE_TYPES.ESTIMATE_TEMPLATES,
        template_rooms: transformedRooms,
        ...(companyId && { company_id: companyId }),
      };

      // Extract service_id and tool_ids from template data (UUID only)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (
        transformedRooms.length > 0 &&
        transformedRooms[0]?.trades?.length > 0 &&
        transformedRooms[0]?.trades[0]?.services?.length > 0
      ) {
        const firstService = transformedRooms[0].trades[0].services[0];
        if (
          firstService?.service_id &&
          uuidRegex.test(firstService.service_id)
        ) {
          payload.service_id = firstService.service_id;
        }
      }

      // Extract all tool IDs from the template data
      const allToolIds = new Set<string>();
      transformedRooms.forEach(room => {
        room.trades?.forEach((trade: any) => {
          trade.services?.forEach((service: any) => {
            service.tools?.forEach((tool: any) => {
              const toolId = tool?.tool_id;
              if (toolId && uuidRegex.test(String(toolId))) {
                allToolIds.add(String(toolId));
              }
            });
          });
        });
      });
      payload.tool_ids = Array.from(allToolIds);

      // Call API - POST for create, PATCH for edit
      const response = await apiService.makeGenericRequest(
        templateId ? `/templates/${templateId}` : '/templates',
        {
          method: templateId ? 'PATCH' : 'POST',
          body: JSON.stringify(payload),
        }
      );

      const { statusCode, message } = response;

      if (statusCode === 200 || statusCode === 201) {
        // Show API success message (not fallback)
        showSuccessToast(message || 'Template created successfully.');

        // Set redirecting state and delay redirect to show toast
        setIsRedirecting(true);
        setTimeout(() => {
          router.push('/templates');
        }, 1500);
      } else {
        showErrorToast(message || 'Failed to create template.');
      }
    } catch (error: any) {
      const { status, message: errorMessage } = error;
      if (status === 401) {
        // Handle auth error (will redirect to login)
        console.error('Authentication error:', error);
      } else {
        showErrorToast(errorMessage || 'Failed to create template.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading component during redirect
  if (isRedirecting) {
    return (
      <LoadingComponent
        variant='fullscreen'
        text='Redirecting to templates...'
      />
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
        {/* Template Name and Category Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2 col-span-2'>
            <Label htmlFor='templateName' className='field-label'>
              Template Name *
            </Label>
            <Input
              id='templateName'
              {...register('templateName')}
              placeholder='Enter template name'
              className={`input-field ${errors.templateName ? 'border-red-500' : ''}`}
            />
            {errors.templateName && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.templateName.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='category' className='field-label'>
              Category *
            </Label>
            <SelectField
              label=''
              value={watchedCategory}
              onValueChange={(value: string) => {
                setValue('category', value, { shouldValidate: true });
              }}
              options={categoryOptions}
              placeholder={
                isLoadingCategories
                  ? 'Loading categories...'
                  : 'Select Category'
              }
              disabled={isLoadingCategories}
              triggerClassName={errors.category ? 'border-red-500' : ''}
              {...(errors.category && { error: errors.category.message })}
            />
          </div>
        </div>
      </form>

      {/* EstimationBox Component - Outside Form */}
      <div className='mt-6'>
        {templateId ? (
          <EstimationBoxEdit
            _onClose={() => {}}
            templateId={templateId}
            categoryId={watchedCategory}
          />
        ) : (
          <EstimationBox
            _onClose={() => {}}
            categoryId={watchedCategory}
            templateId={templateId}
          />
        )}
      </div>

      {/* Save Template Button - At the end of page */}
      <div className='flex justify-between items-center mt-6'>
        <div className='flex items-center gap-2'></div>
        <Button
          onClick={handleSubmit(onSubmitForm)}
          className='btn-primary'
          disabled={isSubmitting || isLoadingCategories || isRedirecting}
        >
          {isSubmitting ? 'Creating Template...' : 'Save Template'}
        </Button>
      </div>
    </>
  );
}
