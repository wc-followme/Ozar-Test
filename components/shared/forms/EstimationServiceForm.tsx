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

interface EstimationServiceFormProps {
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

export default function EstimationServiceForm({
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
}: EstimationServiceFormProps) {
  const [serviceOptions, setServiceOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error('Error fetching services:', error);
      console.error('Trade UUID:', tradeUuid);
      console.error('Company UUID:', companyUuid);
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
    <div className='space-y-6'>
      {/* Service Details Card */}
      <Card className='p-6 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='flex gap-6 items-start'>
          <div className='flex-1 flex items-center gap-4'>
            <div className='flex-1 space-y-2'>
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
            <div className='space-y-2 w-[100px]'>
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
            <div className='space-y-2'>
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
          <div className='min-w-[240px] pt-7 ml-auto'>
            <div className='grid grid-cols-3'>
              <div className='px-4'>
                <Label className='field-label text-xs'>Line Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(currentValues.lineTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6'>
                <Label className='field-label text-xs'>Service Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(currentValues.serviceTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6'>
                <Label className='field-label text-xs'>Trade Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
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
      <EstimationItemsAccordion
        title='Material'
        items={service.materials}
        addButtonText='Material'
        onAddItem={() => {
          if (onMaterialAdd) {
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
            onMaterialAdd(newMaterial);
          } else if (onAddMaterial) {
            onAddMaterial();
          }
        }}
        onItemUpdate={onMaterialUpdate || (() => {})}
        onItemDelete={onMaterialDelete || (() => {})}
        defaultExpanded={true}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />

      {/* Finishes Accordion */}
      <EstimationItemsAccordion
        title='Finishes'
        items={service.finishes}
        addButtonText='Finishes'
        onAddItem={() => {
          if (onFinishAdd) {
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
            onFinishAdd(newFinish);
          } else if (onAddFinish) {
            onAddFinish();
          }
        }}
        onItemUpdate={onFinishUpdate || (() => {})}
        onItemDelete={onFinishDelete || (() => {})}
        defaultExpanded={true}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />

      {/* Tools Accordion */}
      <ToolsAccordion
        title='Tools'
        tools={tools}
        onAddTool={onAddTool || (() => {})}
        onRemoveTool={onRemoveTool || (() => {})}
        onReplaceTools={onReplaceTools}
        defaultExpanded={true}
        roomName={roomName}
        tradeName={tradeName}
        serviceName={service.name}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />
    </div>
  );
}
