'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { TemplateListForm } from '@/components/shared/forms/TemplateListForm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RoomIcon } from '../icons/RoomIcon';
import { TemplateIcon } from '../icons/TemplateIcon';
import EstimationBox from './EstimationBox';

interface EstimateComponentProps {
  breadcrumbData: BreadcrumbItem[];
  onAddRoom: () => void;
}

export default function EstimateComponent({
  breadcrumbData,
  onAddRoom,
}: EstimateComponentProps) {
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [showEstimationBox, setShowEstimationBox] = useState(false);

  const handleAddFromTemplate = () => {
    setIsTemplateSheetOpen(true);
  };

  const handleTemplateSave = (selectedTemplates: string[]) => {
    console.log('Selected templates:', selectedTemplates);
    setIsTemplateSheetOpen(false);
  };

  const handleTemplateCancel = () => {
    setIsTemplateSheetOpen(false);
  };

  const handleAddRoom = () => {
    setShowEstimationBox(true);
  };

  const handleCloseEstimationBox = () => {
    setShowEstimationBox(false);
  };

  // If EstimationBox is shown, render only that
  if (showEstimationBox) {
    return <EstimationBox _onClose={handleCloseEstimationBox} />;
  }

  return (
    <section className=''>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbData} />
      </div>

      {/* Estimate Empty State */}
      <div className='p-4 lg:p-10 rounded-[20px] bg-[var(--card-background)]'>
        <NoDataFound
          title='Nothing Here Yet'
          description="You haven't created any estimate yet. Start by adding your first one to organize your estimate."
          buttonText='Add Room'
          onButtonClick={onAddRoom}
          showButton={false}
        />
        <div className='flex gap-4 justify-center'>
          <Button className='btn-primary' onClick={handleAddRoom}>
            <RoomIcon className='!h-6 !w-6' />
            Add Room
          </Button>
          <Button className='btn-secondary' onClick={handleAddFromTemplate}>
            <TemplateIcon className='!h-6 !w-6' />
            Add From Template
          </Button>
        </div>
      </div>

      {/* Template Selection Sidesheet */}
      <SideSheet
        open={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        title='Estimate Templates'
        size='800px'
      >
        <TemplateListForm
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
        />
      </SideSheet>
    </section>
  );
}
