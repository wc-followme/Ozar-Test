'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Material {
  id: string;
  name: string;
  variant: string;
  qty: number;
  unit: string;
  description: string;
  rate: number;
  markup: number;
  lineTotal: number;
}

interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  qty: number;
  rate: number;
  lineTotal: number;
  serviceTotal: number;
  tradeTotal: number;
  serviceOptions: ServiceOption[];
  materials: Material[];
  finishes: Material[];
}

interface EstimationServiceFormProps {
  service: Service;
  onServiceUpdate?: (updatedService: Service) => void;
  onAddMaterial?: () => void;
  onAddFinish?: () => void;
}

export default function EstimationServiceForm({
  service,
  onServiceUpdate,
  onAddMaterial,
  onAddFinish,
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
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label className='field-label'>Service</Label>
            <SelectField
              value={service.name}
              onValueChange={() => {}}
              options={[{ value: service.name, label: service.name }]}
              placeholder='Select a service'
              className='mb-0'
            />
          </div>
          <div>
            <Label className='field-label'>Qty</Label>
            <Input type='number' value={service.qty} className='input-field' />
          </div>
          <div>
            <Label className='field-label'>Rate</Label>
            <Input
              type='text'
              value={formatCurrency(service.rate)}
              className='input-field'
            />
          </div>
          <div className='col-span-2'>
            <Label className='field-label'>Description</Label>
            <Textarea
              value={service.description}
              rows={3}
              className='input-field'
            />
          </div>
          <div className='col-span-2'>
            <h4 className='field-label mb-3'>Summary Totals</h4>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label className='field-label text-xs'>Line Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(service.lineTotal)}
                </p>
              </div>
              <div>
                <Label className='field-label text-xs'>Service Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(service.serviceTotal)}
                </p>
              </div>
              <div>
                <Label className='field-label text-xs'>Trade Total</Label>
                <p className='text-lg font-semibold text-[var(--primary)]'>
                  {formatCurrency(service.tradeTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Options */}
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
            Service Options - {service.serviceOptions.length} services
          </h3>
        </div>
        <div className='space-y-2'>
          {service.serviceOptions.map(option => (
            <div
              key={option.id}
              className='flex items-center justify-between p-3 border border-[var(--border-dark)] rounded-[10px] hover:bg-[var(--white-background)] cursor-pointer transition-colors'
            >
              <span className='font-medium text-[var(--text-dark)]'>
                {option.name}
              </span>
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-semibold text-[var(--primary)]'>
                  Trade Total {formatCurrency(option.tradeTotal)}
                </span>
                <span className='text-[var(--text-secondary)]'>→</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Materials */}
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
            Material - {service.materials.length} services
          </h3>
          <Button className='btn-primary bg-opacity-10' onClick={onAddMaterial}>
            + Material
          </Button>
        </div>
        <div className='space-y-4'>
          {service.materials.map(material => (
            <div
              key={material.id}
              className='border border-[var(--border-dark)] rounded-[10px] p-4 bg-[var(--white-background)]'
            >
              <div className='grid grid-cols-6 gap-4 mb-2'>
                <div>
                  <Label className='field-label text-xs'>Material Name</Label>
                  <SelectField
                    value={material.name}
                    onValueChange={() => {}}
                    options={[{ value: material.name, label: material.name }]}
                    placeholder='Select material'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Variant</Label>
                  <SelectField
                    value={material.variant}
                    onValueChange={() => {}}
                    options={[
                      { value: material.variant, label: material.variant },
                    ]}
                    placeholder='Select variant'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Qty</Label>
                  <Input
                    type='number'
                    value={material.qty}
                    className='input-field'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Unit</Label>
                  <SelectField
                    value={material.unit}
                    onValueChange={() => {}}
                    options={[{ value: material.unit, label: material.unit }]}
                    placeholder='Select unit'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Rate</Label>
                  <Input
                    type='text'
                    value={formatCurrency(material.rate)}
                    className='input-field'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Markup %</Label>
                  <Input
                    type='text'
                    value={formatCurrency(material.markup)}
                    className='input-field'
                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <Label className='field-label text-xs'>Description</Label>
                  <Input
                    type='text'
                    value={material.description}
                    className='input-field'
                  />
                </div>
                <div className='ml-4'>
                  <Label className='field-label text-xs'>Line Total</Label>
                  <p className='text-sm font-semibold text-[var(--primary)]'>
                    {formatCurrency(material.lineTotal)}
                  </p>
                </div>
                <div className='ml-4'>
                  <span className='text-[var(--text-secondary)]'>⋮</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Finishes */}
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
            Finishes
          </h3>
          <Button className='btn-primary bg-opacity-10' onClick={onAddFinish}>
            + Finishes
          </Button>
        </div>
        <div className='space-y-4'>
          {service.finishes.map(finish => (
            <div
              key={finish.id}
              className='border border-[var(--border-dark)] rounded-[10px] p-4 bg-[var(--white-background)]'
            >
              <div className='grid grid-cols-6 gap-4 mb-2'>
                <div>
                  <Label className='field-label text-xs'>Material Name</Label>
                  <SelectField
                    value={finish.name}
                    onValueChange={() => {}}
                    options={[{ value: finish.name, label: finish.name }]}
                    placeholder='Select material'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Variant</Label>
                  <SelectField
                    value={finish.variant}
                    onValueChange={() => {}}
                    options={[{ value: finish.variant, label: finish.variant }]}
                    placeholder='Select variant'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Qty</Label>
                  <Input
                    type='number'
                    value={finish.qty}
                    className='input-field'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Unit</Label>
                  <SelectField
                    value={finish.unit}
                    onValueChange={() => {}}
                    options={[{ value: finish.unit, label: finish.unit }]}
                    placeholder='Select unit'
                    className='mb-0'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Rate</Label>
                  <Input
                    type='text'
                    value={formatCurrency(finish.rate)}
                    className='input-field'
                  />
                </div>
                <div>
                  <Label className='field-label text-xs'>Markup %</Label>
                  <Input
                    type='text'
                    value={formatCurrency(finish.markup)}
                    className='input-field'
                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <Label className='field-label text-xs'>Description</Label>
                  <Input
                    type='text'
                    value={finish.description}
                    className='input-field'
                  />
                </div>
                <div className='ml-4'>
                  <Label className='field-label text-xs'>Line Total</Label>
                  <p className='text-sm font-semibold text-[var(--primary)]'>
                    {formatCurrency(finish.lineTotal)}
                  </p>
                </div>
                <div className='ml-4'>
                  <span className='text-[var(--text-secondary)]'>⋮</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
