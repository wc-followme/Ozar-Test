'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import EstimationBox from '../../Templates/EstimationBox';

interface EstimationTemplateFormData {
  templateName: string;
  category: string;
}

interface EstimationTemplateFormProps {
  initialData?: Partial<EstimationTemplateFormData>;
  templateId?: string; // Add template ID prop for existing templates
}

// Validation schema
const templateFormSchema = yup.object({
  templateName: yup.string().required('Template name is required'),
  category: yup.string().required('Category is required'),
});

export function EstimationTemplateForm({
  initialData,
  templateId,
}: EstimationTemplateFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category dropdown state
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EstimationTemplateFormData>({
    resolver: yupResolver(templateFormSchema),
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

  // Handle form submission
  const onSubmitForm = async (data: EstimationTemplateFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Get template rooms data from localStorage
      const templateRoomsData = getTemplateRoomsData();
      const transformedRooms = transformTemplateRoomsData(templateRoomsData);

      // Prepare API payload
      const payload: any = {
        name: data.templateName,
        category_id: data.category,
        template_type: 'ESTIMATE_TEMPLATES',
        service_id: '', // This will be set from the first service if available
        disclaimer: 'This is a standard disclaimer for the template',
        warranty: '1 year warranty',
        warranty_duration: '12 months',
        tool_ids: [], // This will be populated from the template data
        template_rooms: transformedRooms,
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

      // Make API call
      const response = await apiService.makeGenericRequest('/templates', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Show success message
      const successMessage = extractApiSuccessMessage(
        response,
        'Template created successfully!'
      );
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'default',
      });

      // Redirect to templates listing page
      router.push('/templates');
    } catch (error) {
      console.error('Error creating template:', error);
      const errorMessage = extractApiErrorMessage(
        error,
        'Failed to create template. Please try again.'
      );
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onValueChange={value => setValue('category', value)}
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
          disabled={isSubmitting || isLoadingCategories}
        >
          {isSubmitting ? 'Creating Template...' : 'Save Template'}
        </Button>
      </div>
    </>
  );
}
