'use client';

import { TOOL_MESSAGES } from '@/app/(DashboardLayout)/tools-management/tool-messages';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { CloseCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';
import MultiSelect, { MultiSelectOption } from '../common/MultiSelect';

interface Tool {
  id: string;
  uuid?: string; // Add UUID field for database tool UUID
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

interface AddToolListFormProps {
  onSubmit: (tools: Tool[]) => void;
  onCancel: () => void;
  loading?: boolean;
  roomName?: string;
  tradeName?: string;
  serviceName?: string;
  serviceId?: string | undefined; // Add service ID prop for fetching tools
}

export default function AddToolListForm({
  onSubmit,
  onCancel,
  loading = false,
  roomName = 'Room',
  tradeName = 'Trade',
  serviceName = 'Service',
  serviceId, // Add service ID prop
}: AddToolListFormProps) {
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [toolOptions, setToolOptions] = useState<MultiSelectOption[]>([]);
  const [toolsLoading, setToolsLoading] = useState(false);

  // Fetch tools from API based on service UUID and company UUID
  const fetchTools = async (
    serviceUuid: string | null,
    companyUuid: string | null
  ) => {
    if (!serviceUuid || !companyUuid) {
      setToolOptions([]);
      return;
    }

    // Early return if service UUID is not a real UUID (e.g., generated service IDs)
    // Real UUIDs should be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceUuid)) {
      setToolOptions([]);
      return;
    }

    setToolsLoading(true);
    try {
      const response = await apiService.fetchTools({
        page: 1,
        limit: 50,
        service_uuid: serviceUuid,
        company_id: companyUuid,
        status: 'ACTIVE',
      });

      type ToolItem = { id?: string | number; uuid?: string; name?: string };
      const payload = response as unknown as {
        data?: ToolItem[] | { data?: ToolItem[] };
      };
      const list: ToolItem[] = Array.isArray(payload?.data)
        ? (payload.data as ToolItem[])
        : Array.isArray((payload?.data as { data?: ToolItem[] })?.data)
          ? ((payload.data as { data?: ToolItem[] }).data as ToolItem[])
          : [];

      const options = list
        .filter(t => !!t?.name)
        .map(t => ({
          value: String(t.uuid || t.id || t.name),
          label: String(t.name),
        }));

      setToolOptions(options);
    } catch (error) {
      // Only log meaningful errors (non-empty error objects)
      if (error && typeof error === 'object' && Object.keys(error).length > 0) {
        console.error('Error fetching tools:', error);
      }
      setToolOptions([]);
    } finally {
      setToolsLoading(false);
    }
  };

  // Load tools when component mounts or when service/company changes
  useEffect(() => {
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

    fetchTools(serviceId || null, companyUuid);
  }, [serviceId]);

  const handleSubmit = () => {
    const selectedTools: Tool[] = selectedToolIds.map(toolId => {
      const toolData = toolOptions.find(tool => tool.value === toolId);
      return {
        id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uuid: toolId, // Store the actual tool UUID from database
        name: toolData?.label || 'Unknown Tool',
        category: 'general',
        description: '',
        status: 'available',
      };
    });
    onSubmit(selectedTools);
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedToolIds(prev => prev.filter(id => id !== toolId));
  };

  const selectedTools = toolOptions.filter(tool =>
    selectedToolIds.includes(tool.value)
  );

  return (
    <div className='space-y-6'>
      {/* Context Information */}
      <div className='text-sm font-medium text-[var(--text-dark)]'>
        {roomName} / {tradeName} / {serviceName}
      </div>

      {/* Tools List Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='field-label text-base font-semibold text-white'>
            Tools List
          </Label>
          <button className='text-greenbrand hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'>
            + Add from Templates
          </button>
        </div>

        {/* Tool Selection MultiSelect */}
        <MultiSelect
          label=''
          options={toolOptions}
          value={selectedToolIds}
          onChange={setSelectedToolIds}
          placeholder={
            toolsLoading ? TOOL_MESSAGES.LOADING_TOOLS_DROPDOWN : 'Select Tools'
          }
        />

        {/* Selected Tools Display */}
        {selectedTools.length > 0 && (
          <div className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              {selectedTools.map(tool => (
                <div
                  key={tool.value}
                  className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light  rounded-full'
                >
                  <span className='text-base font-medium text-[var(--text-dark)]'>
                    {tool.label}
                  </span>
                  <button
                    onClick={() => handleRemoveTool(tool.value)}
                    className='w-5 h-5 rounded-full flex items-center justify-center transition-colors'
                  >
                    <CloseCircle size='32' color='var(--text-secondary)' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='pt-4 flex items-center gap-3'>
        <Button
          type='button'
          className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='button'
          className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={handleSubmit}
          disabled={selectedToolIds.length === 0 || loading}
        >
          Add Tools
        </Button>
      </div>
    </div>
  );
}
