'use client';

import { SERVICE_MESSAGES } from '@/app/(DashboardLayout)/service-management/service-messages';
import SelectField from '@/components/shared/common/SelectField';
import ServiceOptionAccordion from '@/components/shared/common/ServiceOptionAccordion';
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
}

export default function ServiceOptionServiceForm({
  service,
  onServiceUpdate,
  onAddMaterial,
  onAddFinish,
  onMaterialUpdate,
  onMaterialDelete,
  onFinishUpdate,
  onFinishDelete,
  onServiceNameChange,
  onMaterialAdd,
  onFinishAdd,
  tools = [],
  onAddTool,
  onRemoveTool,
  onReplaceTools,
  roomName = 'Room',
  tradeName = 'Trade',
  tradeId, // Add trade ID prop
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

  // Seed defaults (as per screenshot) if empty
  useEffect(() => {
    if (materials.length === 0) {
      const seed = (
        name: string,
        description: string,
        qty: number,
        unit: string,
        rate: number
      ): EstimationItem => ({
        id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        variant: 'Standard',
        qty,
        unit,
        description,
        rate,
        markup: 0,
        lineTotal: qty * rate,
      });

      setMaterials([
        seed(
          'Shut off valve',
          'Inline shut-off valve for isolation',
          4,
          'Sq. Feet',
          25
        ),
        seed('Supply line', 'Reinforced water supply line', 4, 'Sq. Feet', 20),
        seed(
          'Drain pipe',
          'Durable PVC or ABS pipe used for drainage',
          2,
          'Sq. Feet',
          25
        ),
        seed(
          'Exhaust',
          'High-efficiency ceiling or wall exhaust',
          1,
          'Sq. Feet',
          45
        ),
      ]);
    }
  }, [materials.length]);

  // Calculate current service values using backend logic
  const calculateCurrentServiceValues = () => {
    const lineTotal = calculateLineTotal(service.rate, service.qty);
    const serviceTotal = calculateServiceTotal(service.rate, service.qty);
    const totalMaterialCost = calculateServiceTotalMaterialCost(
      service.materials,
      service.finishes
    );
    const tradeTotal = serviceTotal + totalMaterialCost;

    return {
      lineTotal,
      serviceTotal,
      tradeTotal,
    };
  };

  const currentValues = calculateCurrentServiceValues();

  // Fetch services from API based on trade UUID and company UUID
  const fetchServices = async (
    tradeUuid: string | null,
    companyUuid: string | null
  ) => {
    if (!tradeUuid || !companyUuid) {
      setServiceOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.fetchServicesPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        trade_id: tradeUuid,
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

      const options = list
        .filter(s => !!s?.name)
        .map(s => ({
          value: String(s.uuid || s.id || s.name),
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

    fetchServices(tradeId || null, companyUuid);
  }, [tradeId]);

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
        <div className='flex gap-6 items-start flex-wrap min-w-fit'>
          <div className='flex-1 flex items-center gap-4 min-w-0 gap-y-4'>
            <div className='flex-1 space-y-2 min-w-[280px] overflow-hidden'>
              <Label className='field-label'>Service</Label>
              <SelectField
                value={(() => {
                  // Find the option that matches the current service name
                  const matchingOption = serviceOptions.find(
                    option => option.label === service.name
                  );
                  return matchingOption ? matchingOption.value : service.name;
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
                    const updatedService = {
                      ...service,
                      name: newName,
                    };

                    if (serviceUuid) {
                      (updatedService as any).uuid = serviceUuid;
                    } else {
                      delete (updatedService as any).uuid;
                    }

                    onServiceUpdate(updatedService);
                  }
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
            <div className='space-y-2 w-[100px] min-w-[100px] overflow-hidden'>
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
            <div className='space-y-2 w-[160px] min-w-[160px] overflow-hidden'>
              <Label className='field-label'>Rate</Label>
              <Input
                type='text'
                value={service.rate.toString()}
                onChange={e => {
                  const numericValue =
                    parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                  if (onServiceUpdate) {
                    onServiceUpdate({
                      ...service,
                      rate: numericValue,
                    });
                  }
                }}
                className='input-field'
              />
            </div>
          </div>
          <div className='pt-7 ml-auto flex-shrink-0 min-w-fit'>
            <div className='grid grid-cols-3 min-w-fit'>
              <div className='px-4 min-w-[160px]'>
                <Label className='field-label text-xs whitespace-nowrap'>
                  Line Total
                </Label>
                <p className='text-lg font-semibold text-[var(--primary)] truncate'>
                  {formatCurrency(currentValues.lineTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6 min-w-[160px]'>
                <Label className='field-label text-xs whitespace-nowrap'>
                  Service Total
                </Label>
                <p className='text-lg font-semibold text-[var(--primary)] truncate'>
                  {formatCurrency(currentValues.serviceTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6 min-w-[160px]'>
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

      {/* Service Options */}

      {/* Materials Accordion */}
      <ServiceOptionAccordion
        title='Material'
        items={materials}
        addButtonText='Material'
        onAddItem={() => {
          const newMaterial: EstimationItem = {
            id: `material-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: 'New Material',
            variant: 'Standard',
            qty: 1,
            unit: 'UNIT',
            description: 'New material description',
            rate: 0.0,
            markup: 0.0,
            lineTotal: 0.0,
          };
          setMaterials(prev => [...prev, newMaterial]);
          onMaterialAdd?.(newMaterial);
        }}
        onItemUpdate={(id, updated) => {
          setMaterials(prev => prev.map(m => (m.id === id ? updated : m)));
          onMaterialUpdate?.(id, updated);
        }}
        onItemDelete={id => {
          setMaterials(prev => prev.filter(m => m.id !== id));
          onMaterialDelete?.(id);
        }}
        defaultExpanded={true}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />

      {/* Finishes Accordion */}
      <ServiceOptionAccordion
        title='Finishes'
        items={finishes}
        addButtonText='Finishes'
        onAddItem={() => {
          const newFinish: EstimationItem = {
            id: `finish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: 'New Finish',
            variant: 'Standard',
            qty: 1,
            unit: 'UNIT',
            description: 'New finish description',
            rate: 0.0,
            markup: 0.0,
            lineTotal: 0.0,
          };
          setFinishes(prev => [...prev, newFinish]);
          onFinishAdd?.(newFinish);
        }}
        onItemUpdate={(id, updated) => {
          setFinishes(prev => prev.map(f => (f.id === id ? updated : f)));
          onFinishUpdate?.(id, updated);
        }}
        onItemDelete={id => {
          setFinishes(prev => prev.filter(f => f.id !== id));
          onFinishDelete?.(id);
        }}
        defaultExpanded={true}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />
    </div>
  );
}
