'use client';

import { SERVICE_MESSAGES } from '@/app/(DashboardLayout)/service-management/service-messages';
import EstimationItemsAccordion from '@/components/shared/common/EstimationItemsAccordion';
import SelectField from '@/components/shared/common/SelectField';
import ServiceOptionListCard from '@/components/shared/common/ServiceOptionListCard';
import SideSheet from '@/components/shared/common/SideSheet';
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
import ServiceOptionForm from './ServiceOptionForm';

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
  const [isServiceOptionSheetOpen, setIsServiceOptionSheetOpen] =
    useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState<any>(null);

  // Sample service options data
  const sampleServiceOptions = [
    {
      id: '1',
      name: 'Basic Service Package',
      tradeTotal: 1500.0,
    },
    {
      id: '2',
      name: 'Premium Service Package',
      tradeTotal: 2500.0,
    },
  ];

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
    console.log(
      'EstimationServiceForm: fetchServices called with tradeUuid:',
      tradeUuid
    );
    console.log(
      'EstimationServiceForm: fetchServices called with companyUuid:',
      companyUuid
    );

    if (!tradeUuid || !companyUuid) {
      console.log(
        'EstimationServiceForm: Missing tradeUuid or companyUuid, setting empty options'
      );
      setServiceOptions([]);
      return;
    }

    // Ensure we only call the API with a real UUID; newly added default trades
    // in the editor use generated ids like "default-trade-<timestamp>".
    // Backend expects a UUID v4 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tradeUuid)) {
      console.log(
        'EstimationServiceForm: Invalid UUID format, setting empty options'
      );
      setServiceOptions([]);
      return;
    }

    setLoading(true);
    try {
      console.log(
        'EstimationServiceForm: Making API call to fetchServicesPublic with:',
        {
          page: 1,
          limit: 50,
          company_id: companyUuid,
          trade_id: tradeUuid,
        }
      );

      const response = await apiService.fetchServicesPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        trade_id: tradeUuid,
      });

      console.log('EstimationServiceForm: API response received:', response);

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

      console.log('EstimationServiceForm: Processed service options:', options);
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
    console.log('EstimationServiceForm: tradeId received:', tradeId);
    console.log('EstimationServiceForm: tradeId type:', typeof tradeId);
    console.log(
      'EstimationServiceForm: tradeId UUID validation:',
      tradeId
        ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            tradeId
          )
        : 'undefined'
    );

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
        <div className='flex gap-4 items-start flex-wrap min-w-fit'>
          <div className='flex-1 flex items-center gap-4 min-w-0 gap-y-4'>
            <div className='flex-1 space-y-2 min-w-[160px] overflow-hidden'>
              <Label className='field-label'>Service</Label>
              <SelectField
                value={(() => {
                  // Prefer UUID-based matching (edit mode)
                  if (service.uuid) {
                    const byUuid = serviceOptions.find(
                      option => option.value === service.uuid
                    );
                    if (byUuid) return byUuid.value;
                  }
                  // Fallback to name-based matching (create mode or legacy)
                  const byName = serviceOptions.find(
                    option => option.label === service.name
                  );
                  // If still no match, return empty string so placeholder shows and options list is usable
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
                      // Reset dependent selections when service changes
                      materials: [],
                      finishes: [],
                      tools: [],
                    };

                    if (serviceUuid) {
                      updatedService.uuid = serviceUuid;
                    } else {
                      // Ensure no stale uuid remains
                      delete (updatedService as unknown as { uuid?: string })
                        .uuid;
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
            <div className='space-y-2 w-[100px] min-w-[100px] overflow-hidden'>
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
            }}
            rows={3}
            className='input-field'
          />
        </div>
        <div className='mt-4'>
          <div className='flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-dark)]'>
            <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
              Service Options{' '}
              <span className='text-[var(--text-secondary)] font-normal'>
                - {service.serviceOptions.length} services
              </span>
            </h3>
          </div>
          <div className='space-y-2'>
            <ServiceOptionListCard
              serviceOptions={sampleServiceOptions}
              onServiceOptionSelect={option => {
                setSelectedServiceOption(option);
                setIsServiceOptionSheetOpen(true);
              }}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
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
        onReplaceTools={onReplaceTools || (() => {})}
        defaultExpanded={true}
        roomName={roomName}
        tradeName={tradeName}
        serviceName={service.name}
        serviceId={
          service.name ? service.uuid || service.id || undefined : undefined
        }
      />

      {/* Service Options SideSheet */}
      <SideSheet
        open={isServiceOptionSheetOpen}
        onOpenChange={setIsServiceOptionSheetOpen}
        title='Service Option'
        size='1200px'
      >
        <ServiceOptionForm
          serviceOption={selectedServiceOption}
          onClose={() => setIsServiceOptionSheetOpen(false)}
          onApprove={() => {
            console.log('Service option approved:', selectedServiceOption);
            setIsServiceOptionSheetOpen(false);
          }}
          onDecline={() => {
            console.log('Service option declined:', selectedServiceOption);
            setIsServiceOptionSheetOpen(false);
          }}
        />
      </SideSheet>
    </div>
  );
}
