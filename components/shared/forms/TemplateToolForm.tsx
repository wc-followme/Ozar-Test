'use client';

import MultiSelect from '@/components/shared/common/MultiSelect';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { CloseCircle } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface TemplateToolFormData {
  templateName: string;
  service: string;
  tools: string[];
}

interface TemplateToolFormProps {
  onSubmit?: (data: TemplateToolFormData) => void;
  initialData?: Partial<TemplateToolFormData>;
  templateId?: string; // when provided, use PATCH /templates/:id
  onServiceChange?: (serviceId: string | null) => void; // New callback for service changes
}

type Option = { value: string; label: string };

export function TemplateToolForm({
  onSubmit,
  initialData,
  templateId,
  onServiceChange,
}: TemplateToolFormProps) {
  // Validation schema (match estimate form style)
  const toolTemplateSchema = yup.object({
    templateName: yup.string().required('Template name is required'),
    service: yup
      .string()
      .uuid('Service is required')
      .required('Service is required'),
    tools: yup
      .array()
      .of(yup.string().uuid('Invalid tool id').required())
      .min(1, 'Select at least one tool')
      .required('Select at least one tool'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TemplateToolFormData>({
    resolver: yupResolver(toolTemplateSchema) as any,
    defaultValues: {
      templateName: initialData?.templateName || '',
      service: initialData?.service || '',
      tools: initialData?.tools || [],
    },
  });

  const serviceValue = watch('service');
  const toolsValue = watch('tools');
  const { toast } = useToast();
  const router = useRouter();
  // Dynamic options state
  const [serviceOptions, setServiceOptions] = useState<Option[]>([]);
  const [toolOptions, setToolOptions] = useState<Option[]>([]);

  // Tool management state
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(toolsValue);
  const [selectedTools, setSelectedTools] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const handleInputChange = (
    field: keyof TemplateToolFormData,
    value: string | string[]
  ) => {
    setValue(field, value as any, { shouldDirty: true, shouldValidate: true });
    clearErrors(field);
    // Extra safeguard to re-run validation for dependent behaviors
    trigger(field);
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(prev => prev.filter(tool => tool.id !== toolId));
    setSelectedToolIds(prev => prev.filter(id => id !== toolId));
    handleInputChange(
      'tools',
      selectedToolIds.filter(id => id !== toolId)
    );
  };

  const handleToolSelectionChange = (selectedIds: string[]) => {
    // Prevent tool selection if no service is selected
    if (!serviceValue) {
      return;
    }

    setSelectedToolIds(selectedIds);
    // Update selectedTools based on selected IDs
    const newSelectedTools = selectedIds.map(toolId => {
      const toolData = toolOptions.find(tool => tool.value === toolId);
      return { id: toolId, name: toolData?.label || 'Unknown Tool' };
    });
    setSelectedTools(newSelectedTools);
    handleInputChange('tools', selectedIds);
  };

  const onSave = async (data: TemplateToolFormData) => {
    try {
      const companyUuid = getCompanyUuid();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const toolIds = Array.isArray(data.tools)
        ? data.tools.filter(id => uuidRegex.test(String(id)))
        : [];
      const serviceId = uuidRegex.test(String(data.service))
        ? String(data.service)
        : undefined;

      const payload: any = {
        name: data.templateName,
        template_type: TEMPLATE_TYPES.TOOL_TEMPLATES,
        ...(companyUuid && { company_id: companyUuid }),
        ...(serviceId && { service_id: serviceId }),
        tool_ids: toolIds,
      };

      const endpoint = templateId ? `/templates/${templateId}` : '/templates';
      const method = templateId ? 'PATCH' : 'POST';
      const response = await apiService.makeGenericRequest(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      const { statusCode, message } = (response || {}) as {
        statusCode?: number;
        message?: string;
      };

      if (statusCode === 200 || statusCode === 201) {
        toast({
          title: 'Success',
          description: message || 'Template saved successfully.',
        });
        if (onSubmit) onSubmit(data);
        // Redirect to listing
        router.push('/templates');
      } else {
        toast({
          title: 'Error',
          description: extractApiErrorMessage(
            response,
            'Failed to save template.'
          ),
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: extractApiErrorMessage(
          error,
          'Failed to create template.'
        ),
        variant: 'destructive',
      });
    }
  };

  // Helpers
  const getCompanyUuid = (): string => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
      if (!raw) return '';
      const parsed: { uuid?: string; id?: string | number } = JSON.parse(raw);
      return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
    } catch {
      return '';
    }
  };

  // Fetch services by company
  useEffect(() => {
    const companyUuid = getCompanyUuid();
    if (!companyUuid) {
      setServiceOptions([]);
      return;
    }
    (async () => {
      try {
        const res = await apiService.fetchServicesPublic({
          page: 1,
          limit: 100,
          company_id: companyUuid,
        });
        type Item = { id?: string | number; uuid?: string; name?: string };
        const payload = res as unknown as { data?: Item[] | { data?: Item[] } };
        const list: Item[] = Array.isArray(payload?.data)
          ? (payload.data as Item[])
          : Array.isArray((payload?.data as { data?: Item[] })?.data)
            ? ((payload.data as { data?: Item[] }).data as Item[])
            : [];
        const opts: Option[] = list
          .filter(i => !!i?.name)
          .map(i => ({ value: String(i.uuid || i.id), label: String(i.name) }));
        setServiceOptions(opts);
      } catch {
        setServiceOptions([]);
      }
    })();
  }, []);

  // Fetch tools by service and company
  useEffect(() => {
    const companyUuid = getCompanyUuid();
    if (!companyUuid || !serviceValue) {
      setToolOptions([]);
      return;
    }
    (async () => {
      try {
        const res = await apiService.fetchToolsPublic({
          page: 1,
          limit: 200,
          company_id: companyUuid,
          service_id: serviceValue,
        });
        type Item = { id?: string | number; uuid?: string; name?: string };
        const payload = res as unknown as {
          data?: Item[] | { tools?: Item[] };
        };
        const list: Item[] = Array.isArray(payload?.data)
          ? (payload.data as Item[])
          : Array.isArray((payload?.data as { tools?: Item[] })?.tools)
            ? ((payload.data as { tools?: Item[] }).tools as Item[])
            : [];
        const opts: Option[] = list
          .filter(i => !!i?.name)
          .map(i => ({ value: String(i.uuid || i.id), label: String(i.name) }));
        setToolOptions(opts);
        // If we have initial tool ids (from edit), make sure state reflects them and chips show labels
        if (
          Array.isArray(toolsValue) &&
          toolsValue.length > 0 &&
          selectedToolIds.length === 0
        ) {
          setSelectedToolIds(toolsValue as string[]);
        }
        // Build selectedTools from options whenever options or selected ids change
        const mapped = (
          selectedToolIds.length > 0
            ? selectedToolIds
            : (toolsValue as string[] | undefined) || []
        ).map(id => {
          const match = opts.find(o => o.value === id);
          return { id, name: match?.label || id };
        });
        setSelectedTools(mapped);
      } catch {
        setToolOptions([]);
      }
    })();
  }, [serviceValue]);

  // Keep selectedToolIds in sync with default form tools when provided
  useEffect(() => {
    if (
      Array.isArray(toolsValue) &&
      toolsValue.length > 0 &&
      selectedToolIds.length === 0
    ) {
      setSelectedToolIds(toolsValue as string[]);
    }
  }, [toolsValue, selectedToolIds.length]);

  return (
    <div className='space-y-6'>
      {/* Template Name, Service, and Tools Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            placeholder='Enter name'
            className='input-field'
            {...register('templateName')}
          />
          {errors.templateName && (
            <p className='text-red-500 text-sm'>
              {errors.templateName.message}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Service'
            value={serviceValue}
            onValueChange={value => {
              // Update selected service
              handleInputChange('service', value);
              // Clear tools state when service changes to avoid stale UUID chips
              setSelectedToolIds([]);
              setSelectedTools([]);
              setToolOptions([]);
              handleInputChange('tools', []);
              if (onServiceChange) {
                onServiceChange(value);
              }
            }}
            options={serviceOptions}
            placeholder='Select Service'
            triggerClassName={errors.service ? 'border-red-500' : ''}
          />
          {errors.service && (
            <p className='text-red-500 text-sm'>{errors.service.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <MultiSelect
            label='Tools'
            options={toolOptions}
            value={selectedToolIds}
            onChange={handleToolSelectionChange}
            placeholder={serviceValue ? 'Select Tools' : 'Select Service First'}
            disabled={!serviceValue}
          />
          {!serviceValue && (
            <p className='text-sm text-[var(--text-secondary)]'>
              Please select a service first to choose tools
            </p>
          )}
          {errors.tools && serviceValue && (
            <p className='text-red-500 text-sm'>
              {Array.isArray(errors.tools)
                ? 'Select at least one tool'
                : (errors.tools as unknown as { message?: string }).message ||
                  'Select at least one tool'}
            </p>
          )}
        </div>
      </div>

      {/* Tool Tags Section */}
      <div className='mt-6'>
        <div className='flex flex-wrap gap-2'>
          {selectedTools.map(tool => (
            <div
              key={tool.id}
              className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light rounded-full'
            >
              <span className='text-base font-medium text-[var(--text-dark)]'>
                {tool.name}
              </span>
              <button
                onClick={() => handleRemoveTool(tool.id)}
                className='w-5 h-5 rounded-full flex items-center justify-center transition-colors'
              >
                <CloseCircle size={24} color='#6B7280' />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-end mt-6'>
        <Button
          onClick={handleSubmit(onSave)}
          className='btn-primary'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </div>
  );
}
