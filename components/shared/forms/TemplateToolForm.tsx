'use client';

import MultiSelect from '@/components/shared/common/MultiSelect';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { CloseCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';

interface TemplateToolFormData {
  templateName: string;
  service: string;
  tools: string[];
}

interface TemplateToolFormProps {
  onSubmit?: (data: TemplateToolFormData) => void;
  initialData?: Partial<TemplateToolFormData>;
}

type Option = { value: string; label: string };

export function TemplateToolForm({
  onSubmit,
  initialData,
}: TemplateToolFormProps) {
  const [formData, setFormData] = useState<TemplateToolFormData>({
    templateName: initialData?.templateName || '',
    service: initialData?.service || '',
    tools: initialData?.tools || [],
  });

  // Dynamic options state
  const [serviceOptions, setServiceOptions] = useState<Option[]>([]);
  const [toolOptions, setToolOptions] = useState<Option[]>([]);

  // Tool management state
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(
    formData.tools
  );
  const [selectedTools, setSelectedTools] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const handleInputChange = (
    field: keyof TemplateToolFormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
    setSelectedToolIds(selectedIds);
    // Update selectedTools based on selected IDs
    const newSelectedTools = selectedIds.map(toolId => {
      const toolData = toolOptions.find(tool => tool.value === toolId);
      return { id: toolId, name: toolData?.label || 'Unknown Tool' };
    });
    setSelectedTools(newSelectedTools);
    handleInputChange('tools', selectedIds);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
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
    if (!companyUuid || !formData.service) {
      setToolOptions([]);
      return;
    }
    (async () => {
      try {
        const res = await apiService.fetchToolsPublic({
          page: 1,
          limit: 200,
          company_id: companyUuid,
          service_id: formData.service,
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
        setToolOptions(opts);
      } catch {
        setToolOptions([]);
      }
    })();
  }, [formData.service]);

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
            onValueChange={value => {
              // Update selected service
              handleInputChange('service', value);
              // Clear tools state when service changes to avoid stale UUID chips
              setSelectedToolIds([]);
              setSelectedTools([]);
              setToolOptions([]);
              handleInputChange('tools', []);
            }}
            options={serviceOptions}
            placeholder='Select Service'
          />
        </div>
        <div className='space-y-2'>
          <MultiSelect
            label='Tools'
            options={toolOptions}
            value={selectedToolIds}
            onChange={handleToolSelectionChange}
            placeholder='Select Tools'
          />
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
        <Button onClick={handleSubmit} className='btn-primary'>
          Save Template
        </Button>
      </div>
    </div>
  );
}
