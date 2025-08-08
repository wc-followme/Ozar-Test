'use client';

import EstimationItemsAccordion from '@/components/shared/common/EstimationItemsAccordion';
import SelectField from '@/components/shared/common/SelectField';
import ToolsAccordion from '@/components/shared/common/ToolsAccordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EstimationItem, Service, Tool } from './estimation-types';

// Service options for the dropdown
const SERVICE_OPTIONS = [
  { value: 'Install Shower', label: 'Install Shower' },
  { value: 'Install Bathtub', label: 'Install Bathtub' },
  { value: 'Install Toilet', label: 'Install Toilet' },
  { value: 'Install Sink', label: 'Install Sink' },
  { value: 'Install Faucet', label: 'Install Faucet' },
  { value: 'Install Vanity', label: 'Install Vanity' },
  { value: 'Install Mirror', label: 'Install Mirror' },
  { value: 'Install Lighting', label: 'Install Lighting' },
  { value: 'Install Tile', label: 'Install Tile' },
  { value: 'Install Flooring', label: 'Install Flooring' },
  { value: 'Install Paint', label: 'Install Paint' },
  { value: 'Install Drywall', label: 'Install Drywall' },
  { value: 'Install Electrical', label: 'Install Electrical' },
  { value: 'Install Plumbing', label: 'Install Plumbing' },
  { value: 'Install HVAC', label: 'Install HVAC' },
];

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
  roomName?: string;
  tradeName?: string;
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
  roomName = 'Room',
  tradeName = 'Trade',
}: EstimationServiceFormProps) {
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
                value={service.name}
                onValueChange={newName => {
                  if (onServiceNameChange) {
                    onServiceNameChange(newName);
                  }
                  if (onServiceUpdate) {
                    onServiceUpdate({
                      ...service,
                      name: newName,
                    });
                  }
                }}
                options={SERVICE_OPTIONS}
                placeholder='Select a service'
                className='mb-0'
              />
            </div>
            <div className='space-y-2 w-[100px]'>
              <Label className='field-label'>Qty</Label>
              <Input
                type='number'
                value={service.qty}
                onChange={e => {
                  const newQty = parseInt(e.target.value) || 0;
                  if (onServiceUpdate) {
                    onServiceUpdate({
                      ...service,
                      qty: newQty,
                      lineTotal: newQty * service.rate,
                    });
                  }
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
                      lineTotal: service.qty * numericValue,
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
                  {formatCurrency(service.lineTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6'>
                <Label className='field-label text-xs'>Service Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(service.serviceTotal)}
                </p>
              </div>
              <div className='border-l border-[var(--border-dark)] px-6'>
                <Label className='field-label text-xs'>Trade Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(service.tradeTotal)}
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
              unit: 'Each',
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
              unit: 'Each',
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
      />

      {/* Tools Accordion */}
      <ToolsAccordion
        title='Tools'
        tools={tools}
        onAddTool={onAddTool || (() => {})}
        onRemoveTool={onRemoveTool || (() => {})}
        defaultExpanded={true}
        roomName={roomName}
        tradeName={tradeName}
        serviceName={service.name}
      />
    </div>
  );
}
