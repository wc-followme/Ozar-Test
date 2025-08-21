'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SelectField from '@/components/shared/common/SelectField';
import EstimationBox from '@/components/Templates/EstimationBox';
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
  _initialData?: any; // Prefix with underscore to indicate unused
}

// Validation schema
const estimationTemplateSchema = yup.object({
  templateName: yup.string().required('Template name is required'),
  category: yup.string().required('Category is required'),
});

export default function EstimationTemplateForm({
  templateId,
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
      templateName: '',
      category: '',
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
  const transformTemplateRoomsData = (roomsData: any[]) => {
    // Return the data as-is from localStorage without transformation
    return roomsData;
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

      // Extract service_id and tool_ids from template data
      if (
        transformedRooms.length > 0 &&
        transformedRooms[0]?.trades?.length > 0 &&
        transformedRooms[0]?.trades[0]?.services?.length > 0
      ) {
        const firstService = transformedRooms[0].trades[0].services[0];
        if (firstService?.service_id) {
          payload.service_id = firstService.service_id;
        }
      }

      // Extract all tool IDs from the template data
      const allToolIds = new Set<string>();
      transformedRooms.forEach(room => {
        room.trades?.forEach((trade: any) => {
          trade.services?.forEach((service: any) => {
            service.tools?.forEach((tool: any) => {
              if (tool.tool_id) {
                allToolIds.add(tool.tool_id);
              }
            });
          });
        });
      });
      payload.tool_ids = Array.from(allToolIds);

      // Call API to create template
      const response = await apiService.makeGenericRequest('/templates', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

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
              onValueChange={(value: string) => setValue('category', value)}
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
        <EstimationBox
          _onClose={() => {}}
          categoryId={watchedCategory}
          templateId={templateId}
        />
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
