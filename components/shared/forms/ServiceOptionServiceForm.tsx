'use client';

import { SERVICE_MESSAGES } from '@/app/(DashboardLayout)/service-management/service-messages';
import EstimationItemsAccordion from '@/components/shared/common/EstimationItemsAccordion';
import SelectField from '@/components/shared/common/SelectField';
import ToolsAccordion from '@/components/shared/common/ToolsAccordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import {
  calculateLineTotal,
  calculateServiceTotal,
  calculateServiceTotalMaterialCost,
} from '@/lib/estimation-calculations';
import { useEffect, useState } from 'react';
import { EstimationItem, Service, Tool } from './estimation-types';

interface ServiceOptionServiceFormProps {
  service: Service;
  onServiceUpdate?: (updatedService: Service) => void;
  onAddMaterial?: () => void;
  onAddFinish?: () => void;
  onMaterialUpdate?: (
    materialId: string,
    updatedMaterial: EstimationItem
  ) => void;
  onMaterialDelete?: (materialId: string) => void;
  onFinishUpdate?: (finishId: string, updatedFinish: EstimationItem) => void;
  onFinishDelete?: (finishId: string) => void;
  onServiceNameChange?: (newName: string) => void;
  onMaterialAdd?: (newMaterial: EstimationItem) => void;
  onFinishAdd?: (newFinish: EstimationItem) => void;
  tools?: Tool[];
  onAddTool?: (tool: Tool) => void;
  onRemoveTool?: (toolId: string) => void;
  onReplaceTools?: (tools: Tool[]) => void; // Add callback for replacing all tools
  roomName?: string;
  tradeName?: string;
  tradeId?: string | undefined; // Add trade ID prop
  onLocalStorageUpdate?: () => void; // Add localStorage update callback
  onTotalsChange?: (totals: {
    lineTotal: number;
    serviceTotal: number;
    tradeTotal: number;
  }) => void;
}

export default function ServiceOptionServiceForm({
  service,
  onServiceUpdate,
  onAddMaterial: _onAddMaterial,
  onAddFinish: _onAddFinish,
  onMaterialUpdate: _onMaterialUpdate,
  onMaterialDelete: _onMaterialDelete,
  onFinishUpdate: _onFinishUpdate,
  onFinishDelete: _onFinishDelete,
  onServiceNameChange,
  onMaterialAdd,
  onFinishAdd,
  tools: _tools = [],
  onAddTool: _onAddTool,
  onRemoveTool: _onRemoveTool,
  onReplaceTools: _onReplaceTools,
  roomName: _roomName = 'Room',
  tradeName: _tradeName = 'Trade',
  tradeId, // Add trade ID prop
  onLocalStorageUpdate, // Add localStorage update callback
  onTotalsChange,
}: ServiceOptionServiceFormProps) {
  const [serviceOptions, setServiceOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  // Local materials/finishes state for Service Options template
  const [materials, setMaterials] = useState<EstimationItem[]>(
    service.materials || []
  );
  const [finishes, setFinishes] = useState<EstimationItem[]>(
    service.finishes || []
  );
  const [tools, setTools] = useState<Tool[]>(service.tools || []);

  // No default seed; start with empty lists until user adds items

  // Calculate current service values using current local state
  const calculateCurrentServiceValues = () => {
    const lineTotal = calculateLineTotal(service.rate, service.qty);
    const serviceTotal = calculateServiceTotal(service.rate, service.qty);
    const totalMaterialCost = calculateServiceTotalMaterialCost(
      materials,
      finishes
    );
    const tradeTotal = serviceTotal + totalMaterialCost;

    return { lineTotal, serviceTotal, tradeTotal };
  };

  const currentValues = calculateCurrentServiceValues();

  // Emit totals upward whenever inputs that affect totals change
  useEffect(() => {
    const totals = calculateCurrentServiceValues();
    onTotalsChange?.(totals);
  }, [materials, finishes, service.qty, service.rate]);

  // Fetch services from API based on trade UUID and company UUID
  const fetchServices = async (
    tradeUuid: string | null,
    companyUuid: string | null
  ) => {
    if (!companyUuid) {
      setServiceOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.fetchServicesPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        ...(tradeUuid ? { trade_id: tradeUuid } : {}),
      });

      type ServiceItem = { id?: string | number; uuid?: string; name?: string };
      const payload = response as unknown as {
        data?: ServiceItem[] | { data?: ServiceItem[] };
      };
      const list: ServiceItem[] = Array.isArray(payload?.data)
        ? (payload.data as ServiceItem[])
        : Array.isArray((payload?.data as { data?: ServiceItem[] })?.data)
          ? ((payload.data as { data?: ServiceItem[] }).data as ServiceItem[])
          : [];

      // Only surface services that have a valid UUID; dropdown stores UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const options = list
        .filter(s => !!s?.name && !!s?.uuid && uuidRegex.test(String(s.uuid)))
        .map(s => ({
          value: String(s.uuid),
          label: String(s.name),
        }));

      setServiceOptions(options);
    } catch (_error) {
      // Gracefully degrade to empty options when API fails or returns no data
      setServiceOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load services when component mounts or when trade/company changes
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
    // For Service Options page, show all services for company if no trade selected
    fetchServices(tradeId || null, companyUuid);
  }, [tradeId]);

  // Prefetch materials and tools when a valid service UUID is selected
  useEffect(() => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!service.uuid || !uuidRegex.test(service.uuid)) {
      return;
    }

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
    if (!companyUuid) return;

    // Prefetch materials and tools to warm the dropdowns
    void apiService.fetchMaterialsPublic({
      page: 1,
      limit: 50,
      company_id: companyUuid,
      service_id: service.uuid,
    });

    void apiService.fetchToolsPublic({
      page: 1,
      limit: 50,
      company_id: companyUuid,
      service_id: service.uuid,
    });
  }, [service.uuid]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className='space-y-6 w-full min-w-fit'>
      {/* Service Details Card */}
      <Card className='p-6 rounded-[10px] bg-[var(--card-background)] border-none min-w-max'>
        <div className='flex gap-4 items-start flex-wrap min-w-fit'>
          <div className='flex-1 flex items-center gap-4 min-w-0 gap-y-4'>
            <div className='flex-1 space-y-2 min-w-[160px] overflow-hidden'>
              <Label className='field-label'>Service</Label>
              <SelectField
                value={(() => {
                  if (service.uuid) {
                    const byUuid = serviceOptions.find(
                      option => option.value === service.uuid
                    );
                    if (byUuid) return byUuid.value;
                  }
                  const byName = serviceOptions.find(
                    option => option.label === service.name
                  );
                  return byName ? byName.value : '';
                })()}
                onValueChange={newValue => {
                  // Find the selected option to get the display name and UUID
                  const selectedOption = serviceOptions.find(
                    option => option.value === newValue
                  );
                  const newName = selectedOption
                    ? selectedOption.label
                    : newValue;
                  const serviceUuid = selectedOption
                    ? selectedOption.value
                    : undefined;

                  if (onServiceNameChange) {
                    onServiceNameChange(newName);
                  }
                  if (onServiceUpdate) {
                    const updatedService: Service = {
                      ...service,
                      name: newName,
                      materials: [],
                      finishes: [],
                      tools: [],
                      ...(serviceUuid ? { uuid: serviceUuid } : {}),
                    };

                    onServiceUpdate(updatedService);
                  }
                  // Update localStorage when service changes
                  onLocalStorageUpdate?.();
                }}
                options={serviceOptions}
                placeholder={
                  loading
                    ? SERVICE_MESSAGES.LOADING_SERVICES_DROPDOWN
                    : 'Select a service'
                }
                className='mb-0'
                disabled={loading}
              />
            </div>
            <div className='space-y-2 w-[80px] min-w-[80px] overflow-hidden'>
              <Label className='field-label'>Qty</Label>
              <Input
                type='text'
                value={service.qty.toString()}
                onChange={e => {
                  const value = e.target.value;
                  // Only allow numbers
                  if (/^\d*$/.test(value)) {
                    const newQty = value === '' ? 0 : parseInt(value) || 0;
                    if (onServiceUpdate) {
                      onServiceUpdate({
                        ...service,
                        qty: newQty,
                      });
                    }
                    // Update localStorage when service changes
                    onLocalStorageUpdate?.();
                  }
                }}
                onKeyDown={e => {
                  // Allow: backspace, delete, tab, escape, enter, and numbers
                  const allowedKeys = [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'Escape',
                    'Enter',
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                    'Home',
                    'End',
                  ];

                  if (allowedKeys.includes(e.key) || /^[0-9]$/.test(e.key)) {
                    return;
                  }

                  e.preventDefault();
                }}
                className='input-field'
              />
            </div>
            <div className='space-y-2 w-[120px] min-w-[120px] overflow-hidden'>
              <Label className='field-label'>Rate</Label>
              <div className='flex border-2 border-[var(--border-dark)] focus-within:border-[var(--secondary)] rounded-xl'>
                <div className='w-[40px] flex items-center justify-center font-bold text-[var(--text-dark)] select-none border-none bg-[var(--white-background)] rounded-l-[10px]'>
                  $
                </div>
                <Input
                  type='text'
                  inputMode='decimal'
                  value={service.rate.toString()}
                  onChange={e => {
                    const raw = e.target.value;
                    const cleaned = raw.replace(/[^0-9.]/g, '');
                    const parts = cleaned.split('.');
                    const next =
                      parts.length > 2
                        ? `${parts[0]}.${parts.slice(1).join('')}`
                        : cleaned;

                    (e.target as HTMLInputElement).value = next;

                    if (next !== '' && !next.endsWith('.')) {
                      const numeric = parseFloat(next);
                      if (!Number.isNaN(numeric) && onServiceUpdate) {
                        onServiceUpdate({ ...service, rate: numeric });
                      }
                      // Update localStorage when service changes
                      onLocalStorageUpdate?.();
                    }
                  }}
                  onBlur={e => {
                    const val = e.currentTarget.value;
                    const fallback = val === '' || val === '.' ? '0' : val;
                    e.currentTarget.value = fallback;
                    const numeric = parseFloat(fallback);
                    if (!Number.isNaN(numeric) && onServiceUpdate) {
                      onServiceUpdate({ ...service, rate: numeric });
                    }
                  }}
                  placeholder='0.00'
                  className='flex-1 rounded-l-none text-left !border-l-0 h-11 border-none bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)]'
                />
              </div>
            </div>
          </div>
          <div className='pt-7 ml-auto flex-shrink-0 min-w-fit'>
            <div className='grid grid-cols-3 min-w-fit'>
              <div className='px-4 min-w-[100px]'>
                <Label className='field-label text-xs whitespace-nowrap'>
                  Line Total
                </Label>
                <p className='text-lg font-semibold text-[var(--primary)] truncate'>
                  {formatCurrency(currentValues.lineTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-4 min-w-[100px]'>
                <Label className='field-label text-xs whitespace-nowrap'>
                  Service Total
                </Label>
                <p className='text-lg font-semibold text-[var(--primary)] truncate'>
                  {formatCurrency(currentValues.serviceTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] pl-4 min-w-[100px]'>
                <Label className='field-label text-xs whitespace-nowrap'>
                  Trade Total
                </Label>
                <p className='text-lg font-semibold text-[var(--primary)] truncate'>
                  {formatCurrency(currentValues.tradeTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 space-y-2'>
          <Label className='field-label'>Description</Label>
          <Textarea
            value={service.description}
            onChange={e => {
              if (onServiceUpdate) {
                onServiceUpdate({
                  ...service,
                  description: e.target.value,
                });
              }
              // Update localStorage when service changes
              onLocalStorageUpdate?.();
            }}
            rows={3}
            className='input-field'
          />
        </div>
        {/* <div className='mt-4'>
          <div className='flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-dark)]'>
            <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
              Service Options{' '}
              <span className='text-[var(--text-secondary)] font-normal'>
                - {service.serviceOptions.length} services
              </span>
            </h3>
          </div>
          <div className='space-y-2'>
            {service.serviceOptions.map(option => (
              <div
                key={option.id}
                className='flex items-center justify-between p-4 border border-[var(--border-dark)] rounded-[10px] hover:bg-[var(--white-background)] cursor-pointer transition-colors'
              >
                <span className='font-normal text-[var(--text-dark)] text-base'>
                  {option.name}
                </span>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-semibold text-[var(--text-dark)]'>
                    Trade Total{' '}
                    <span className='text-[var(--primary)]'>
                      {formatCurrency(option.tradeTotal)}
                    </span>
                  </span>
                  <span className='text-[var(--text-secondary)]'>
                    <ArrowRight2 size={16} color='var(--text-dark)' />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </Card>

      {/* Materials Accordion (match estimation design) */}
      <EstimationItemsAccordion
        title='Material'
        items={materials}
        addButtonText='Material'
        onAddItem={() => {
          const newMaterial: EstimationItem = {
            id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: 'New Material',
            variant: 'Standard',
            qty: 1,
            unit: 'INCH',
            description: 'New material description',
            rate: 0.0,
            markup: 0.0,
            lineTotal: 0.0,
          };
          setMaterials(prev => [...prev, newMaterial]);
          onMaterialAdd?.(newMaterial);
          // Update localStorage when materials change
          onLocalStorageUpdate?.();
        }}
        onItemUpdate={(id, updated) => {
          setMaterials(prev => prev.map(m => (m.id === id ? updated : m)));
          _onMaterialUpdate?.(id, updated);
          // Update localStorage when materials change
          onLocalStorageUpdate?.();
        }}
        onItemDelete={id => {
          setMaterials(prev => prev.filter(m => m.id !== id));
          _onMaterialDelete?.(id);
          // Update localStorage when materials change
          onLocalStorageUpdate?.();
        }}
        defaultExpanded={false}
        serviceId={service.uuid}
        useFixedWidths={true}
        cardWidthClass='w-full min-w-max'
        borderClass='border-none'
        disableVariant={true}
      />

      {/* Finishes Accordion (match estimation design) */}
      <EstimationItemsAccordion
        title='Finishes'
        items={finishes}
        addButtonText='Finishes'
        onAddItem={() => {
          const newFinish: EstimationItem = {
            id: `finish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: 'New Finish',
            variant: 'Standard',
            qty: 1,
            unit: 'INCH',
            description: 'New finish description',
            rate: 0.0,
            markup: 0.0,
            lineTotal: 0.0,
          };
          setFinishes(prev => [...prev, newFinish]);
          onFinishAdd?.(newFinish);
          // Update localStorage when finishes change
          onLocalStorageUpdate?.();
        }}
        onItemUpdate={(id, updated) => {
          setFinishes(prev => prev.map(f => (f.id === id ? updated : f)));
          _onFinishUpdate?.(id, updated);
          // Update localStorage when finishes change
          onLocalStorageUpdate?.();
        }}
        onItemDelete={id => {
          setFinishes(prev => prev.filter(f => f.id !== id));
          _onFinishDelete?.(id);
          // Update localStorage when finishes change
          onLocalStorageUpdate?.();
        }}
        defaultExpanded={false}
        serviceId={service.uuid}
        useFixedWidths={true}
        cardWidthClass='w-full min-w-max'
        borderClass='border-none'
        disableVariant={true}
      />

      {/* Tools Accordion (match estimation design) */}
      <ToolsAccordion
        title='Tools'
        tools={tools}
        onAddTool={tool => {
          setTools(prev => [...prev, tool]);
          // Propagate to parent so categories state persists tools
          _onAddTool?.(tool);
          // Update localStorage when tools change
          onLocalStorageUpdate?.();
        }}
        onRemoveTool={toolId => {
          setTools(prev => prev.filter(t => t.id !== toolId));
          // Propagate removal to parent
          _onRemoveTool?.(toolId);
          // Update localStorage when tools change
          onLocalStorageUpdate?.();
        }}
        onReplaceTools={newTools => {
          setTools(newTools);
          // Propagate full replace to parent
          _onReplaceTools?.(newTools);
          // Update localStorage when tools change
          onLocalStorageUpdate?.();
        }}
        defaultExpanded={false}
        roomName={'Room'}
        tradeName={'Trade'}
        serviceName={service.name}
        serviceId={service.uuid}
      />
    </div>
  );
}
