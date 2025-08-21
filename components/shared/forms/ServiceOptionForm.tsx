'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CloseCircle, TickCircle } from 'iconsax-react';
import { useState } from 'react';
import EstimationItemsAccordion from '../common/EstimationItemsAccordion';
import ToolsAccordion from '../common/ToolsAccordion';
import { EstimationItem, Tool } from './estimation-types';

interface ServiceOptionFormProps {
  onClose: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
  serviceOption?: {
    id: string;
    name: string;
    tradeTotal: number;
  };
}

export default function ServiceOptionForm({
  onClose,
  onApprove,
  onDecline,
  serviceOption,
}: ServiceOptionFormProps) {
  const [formData, setFormData] = useState({
    option: serviceOption?.name || 'Shower Option 2 Tile Shower',
    service: 'Tile',
    qty: 2,
    rate: 100.0,
    description:
      'Install a tiled shower area with water-resistant materials and secure fittings for long-lasting durability and modern aesthetics.',
  });

  const [materials, setMaterials] = useState<EstimationItem[]>([
    {
      id: '1',
      name: 'Tile',
      description:
        'High-quality ceramic or porcelain wall tiles suitable for wet areas with slip resistance and easy maintenance.',
      variant: 'Stylish Tile for Bathroom',
      qty: 1,
      unit: 'Sq. Feet',
      rate: 200.0,
      markup: 20.0,
      lineTotal: 220.0,
      markup_type: 'PERCENTAGE',
    },
    {
      id: '2',
      name: 'Mortar',
      description:
        'High-quality ceramic or porcelain wall tiles suitable for wet areas with slip resistance and easy maintenance.',
      variant: 'Stylish Tile for Bathroom',
      qty: 2,
      unit: 'Sq. Feet',
      rate: 50.0,
      markup: 20.0,
      lineTotal: 70.0,
      markup_type: 'PERCENTAGE',
    },
  ]);

  const [finishes, setFinishes] = useState<EstimationItem[]>([
    {
      id: '1',
      name: 'Grout',
      description:
        'High-quality grout for tile joints with moisture resistance.',
      variant: 'Premium Grout',
      qty: 1,
      unit: 'Sq. Feet',
      rate: 15.0,
      markup: 10.0,
      lineTotal: 16.5,
      markup_type: 'PERCENTAGE',
    },
  ]);

  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Tile Cutter',
      category: 'Cutting Tools',
      description: 'Professional tile cutting tool for precise cuts.',
      status: 'available',
    },
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMaterialUpdate = (
    materialId: string,
    updatedMaterial: EstimationItem
  ) => {
    setMaterials(prev =>
      prev.map(item => (item.id === materialId ? updatedMaterial : item))
    );
  };

  const handleMaterialDelete = (materialId: string) => {
    setMaterials(prev => prev.filter(item => item.id !== materialId));
  };

  const handleFinishUpdate = (
    finishId: string,
    updatedFinish: EstimationItem
  ) => {
    setFinishes(prev =>
      prev.map(item => (item.id === finishId ? updatedFinish : item))
    );
  };

  const handleFinishDelete = (finishId: string) => {
    setFinishes(prev => prev.filter(item => item.id !== finishId));
  };

  const handleToolUpdate = (toolId: string, updatedTool: Tool) => {
    setTools(prev =>
      prev.map(item => (item.id === toolId ? updatedTool : item))
    );
  };

  const handleToolDelete = (toolId: string) => {
    setTools(prev => prev.filter(item => item.id !== toolId));
  };

  const calculateTotals = () => {
    const lineTotal = formData.qty * formData.rate;
    const serviceTotal = lineTotal;
    const materialsTotal = materials.reduce(
      (sum, material) => sum + material.lineTotal,
      0
    );
    const finishesTotal = finishes.reduce(
      (sum, finish) => sum + finish.lineTotal,
      0
    );
    const tradeTotal = serviceTotal + materialsTotal + finishesTotal;

    return { lineTotal, serviceTotal, tradeTotal };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className=''>
      {/* Option Selection */}
      <div className='mb-6 space-y-2'>
        <Label className='field-label'>Option</Label>
        <SelectField
          value={formData.option}
          onValueChange={value => handleInputChange('option', value)}
          options={[
            {
              value: 'Shower Option 2 Tile Shower',
              label: 'Shower Option 2 Tile Shower',
            },
            {
              value: 'Shower Option 1 Basic Shower',
              label: 'Shower Option 1 Basic Shower',
            },
            {
              value: 'Shower Option 3 Luxury Shower',
              label: 'Shower Option 3 Luxury Shower',
            },
          ]}
          placeholder='Select option'
        />
      </div>
      <div className='flex flex-col gap-4'>
        {/* Materials Accordion */}
        <EstimationItemsAccordion
          title='Materials'
          items={materials}
          addButtonText='Material'
          onAddItem={() => {}} // Empty function to hide add button
          onItemUpdate={handleMaterialUpdate}
          onItemDelete={handleMaterialDelete}
          defaultExpanded={false}
          serviceId='service-option'
          useFixedWidths={false}
          containerWidthClass='w-full min-w-fit md:min-w-max lg:min-w-full'
          cardWidthClass='w-full min-w-fit md:min-w-max lg:min-w-full'
          borderClass='border border-[var(--border-dark)]'
          showAddButton={false}
        />

        {/* Finishes Accordion */}
        <EstimationItemsAccordion
          title='Finishes'
          items={finishes}
          addButtonText='Finish'
          onAddItem={() => {}} // Empty function to hide add button
          onItemUpdate={handleFinishUpdate}
          onItemDelete={handleFinishDelete}
          defaultExpanded={false}
          serviceId='service-option'
          useFixedWidths={false}
          containerWidthClass='w-full min-w-fit md:min-w-max lg:min-w-full'
          cardWidthClass='w-full min-w-fit md:min-w-max lg:min-w-full'
          borderClass='border border-[var(--border-dark)]'
          showAddButton={false}
        />

        {/* Tools Accordion */}
        <ToolsAccordion
          title='Tools'
          tools={tools}
          onAddTool={() => {}} // Empty function to hide add button
          onRemoveTool={handleToolDelete}
          onReplaceTools={() => {}} // Empty function to hide add button
          defaultExpanded={false}
          roomName='Service Option'
          tradeName='Service'
          serviceName='Service Option'
          serviceId='service-option'
          borderClass='border border-[var(--border-dark)]'
          showAddButton={false}
        />
      </div>
      {/* Action Buttons */}
      <div className='flex gap-4 justify-start mt-4'>
        <Button
          onClick={onApprove}
          className='bg-[var(--secondary-15)] hover:bg-[var(--secondary-15)] text-[var(--secondary)] px-6 py-2 rounded-3xl'
        >
          <TickCircle size={20} color='var(--secondary)' variant='Bold' />
          Approve
        </Button>
        <Button
          onClick={onDecline}
          className='bg-[var(--warning-15)] hover:bg-[var(--warning-15)] text-[var(--warning)] px-6 py-2 rounded-3xl'
        >
          <CloseCircle size={20} color='var(--warning)' variant='Bold' />
          Decline
        </Button>
      </div>
    </div>
  );
}
