'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DisclaimerFormData {
  templateName: string;
  service: string;
  warranty: string;
  description: string;
  duration: string;
}

interface DisclaimerFormProps {
  onSubmit?: (data: DisclaimerFormData) => void;
  initialData?: Partial<DisclaimerFormData>;
  templateId?: string; // when provided, use PATCH for update
}

export function DisclaimerForm({
  onSubmit,
  initialData,
  templateId,
}: DisclaimerFormProps) {
  const [formData, setFormData] = useState<DisclaimerFormData>({
    templateName: initialData?.templateName || '',
    service: initialData?.service || '',
    warranty: initialData?.warranty || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
  });

  // Dynamic service options
  const [serviceOptions, setServiceOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    field: keyof DisclaimerFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const companyUuid = getCompanyUuid();
      const payload: any = {
        name: formData.templateName,
        template_type: TEMPLATE_TYPES.DISCLAIMER_TEMPLATES,
        service_id: formData.service,
        disclaimer: formData.description,
        warranty: formData.warranty,
        warranty_duration: formData.duration,
        ...(companyUuid && { company_id: companyUuid }),
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
          description: message || 'Template created successfully.',
        });
        if (onSubmit) onSubmit(formData);
        router.push('/templates');
      } else {
        toast({
          title: 'Error',
          description: extractApiErrorMessage(
            response,
            'Failed to create template.'
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
    } finally {
      setIsSubmitting(false);
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
        setLoadingServices(true);
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
        const opts = list
          .filter(i => !!i?.name)
          .map(i => ({ value: String(i.uuid || i.id), label: String(i.name) }));
        setServiceOptions(opts);
      } catch {
        setServiceOptions([]);
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  return (
    <div className='space-y-6'>
      {/* Template Name, Service, and Warranty Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='space-y-2 md:col-span-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            value={formData.templateName}
            onChange={e => handleInputChange('templateName', e.target.value)}
            placeholder='Enter name'
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Service'
            value={formData.service}
            onValueChange={value => handleInputChange('service', value)}
            options={serviceOptions}
            placeholder={
              loadingServices ? 'Loading services...' : 'Select Service'
            }
            disabled={loadingServices}
          />
        </div>
      </div>

      {/* Disclaimer Text Area */}
      <div className='space-y-2 mb-6'>
        <Label htmlFor='description' className='field-label'>
          Disclaimer
        </Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          placeholder='Enter Disclaimer Here'
          rows={16}
          className='input-field md:min-h-[300px]'
        />
      </div>

      {/* Warranty and Duration Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='space-y-2 md:col-span-2'>
          <Label htmlFor='warranty' className='field-label'>
            Warranty
          </Label>
          <Input
            id='warranty'
            value={formData.warranty}
            onChange={e => handleInputChange('warranty', e.target.value)}
            placeholder='Enter warranty'
            className='input-field'
          />
        </div>
        <div className='space-y-2 w-full'>
          <SelectField
            label='Duration'
            value={formData.duration}
            onValueChange={value => handleInputChange('duration', value)}
            options={[
              { value: '1-year', label: '1 Year' },
              { value: '2-years', label: '2 Years' },
              { value: '3-years', label: '3 Years' },
              { value: '5-years', label: '5 Years' },
              { value: 'lifetime', label: 'Lifetime' },
            ]}
            placeholder='Select Duration'
            triggerClassName='w-full'
          />
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          className='btn-primary'
          disabled={isSubmitting || loadingServices}
        >
          Save Template
        </Button>
      </div>
    </div>
  );
}
