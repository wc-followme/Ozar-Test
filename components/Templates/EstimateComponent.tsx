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
  breadcrumbData?: BreadcrumbItem[];
  onAddRoom: () => void;
  jobId?: string; // Add job ID prop for API calls
  categoryId?: string | undefined; // Add category ID prop for filtering trades
  onSaveSuccess?: () => void; // Callback for successful save
  onSaveError?: (error: any) => void; // Callback for save errors
  onFormSubmit?: number; // Trigger value for form submission
}

// Common function to update localStorage from component state
// This is the ONLY function that should be called to update localStorage
export const updateLocalStorageFromState = (
  rooms: Array<{
    id: string;
    name: string;
    trades: Array<{
      id: string;
      name: string;
      startDate?: Date;
      endDate?: Date;
      markup?: number;
      serviceList?: Array<{
        id: string;
        uuid?: string;
        name: string;
        description: string;
        qty: number;
        rate: number;
        lineTotal: number;
        serviceTotal: number;
        tradeTotal: number;
        materials: Array<{
          id: string;
          uuid?: string;
          name: string;
          variant: string;
          qty: number;
          unit: string;
          description: string;
          rate: number;
          markup: number;
          lineTotal: number;
        }>;
        finishes: Array<{
          id: string;
          uuid?: string;
          name: string;
          variant: string;
          qty: number;
          unit: string;
          description: string;
          rate: number;
          markup: number;
          lineTotal: number;
        }>;
        tools: Array<{
          id: string;
          uuid?: string;
          name: string;
          category: string;
          description: string;
          status: string;
        }>;
      }>;
    }>;
  }>,
  jobId?: string
) => {
  try {
    const jobRooms = rooms.map(room => ({
      room_name: room.name,
      trades: room.trades.map(trade => ({
        trade_id: trade.id, // This will be the UUID from database
        start_date: trade.startDate?.toISOString() || new Date().toISOString(),
        end_date:
          trade.endDate?.toISOString() ||
          new Date(Date.now() + 86400000).toISOString(),
        markup: trade.markup || 0,
        services:
          trade.serviceList?.map((service, index) => ({
            service_id: service.uuid || service.id,
            service_order_no: index + 1,
            description: service.description || service.name,
            qty: service.qty,
            rate: service.rate,
            materials: service.materials.map(material => ({
              material_id: material.uuid || material.id,
              description: material.description,
              disclaimer: '', // Add disclaimer field if needed
              qty: material.qty,
              unit: material.unit,
              rate: material.rate,
              markup: material.markup,
            })),
            finishes: service.finishes.map(finish => ({
              material_id: finish.uuid || finish.id,
              description: finish.description,
              disclaimer: '', // Add disclaimer field if needed
              qty: finish.qty,
              unit: finish.unit,
              rate: finish.rate,
              markup: finish.markup,
            })),
            tools: service.tools.map(tool => ({
              tool_id: tool.uuid || tool.id,
            })),
          })) || [],
      })),
    }));

    const storageKey = jobId ? `job_rooms_${jobId}` : 'job_rooms';
    localStorage.setItem(storageKey, JSON.stringify(jobRooms));
    return true;
  } catch (error) {
    console.error('Error updating localStorage from state:', error);
    return false;
  }
};

// Function to replace a trade in a room (used when user changes trade from dropdown)
export const replaceTradeInRoom = (
  roomName: string,
  oldTradeId: string,
  newTradeId: string,
  updates: {
    start_date?: string;
    end_date?: string;
    markup?: number;
  },
  jobId?: string
) => {
  try {
    const storageKey = jobId ? `job_rooms_${jobId}` : 'job_rooms';
    const existingData = localStorage.getItem(storageKey);
    const jobRooms = existingData ? JSON.parse(existingData) : [];

    // Find the room
    const roomIndex = jobRooms.findIndex(
      (room: any) => room.room_name === roomName
    );

    if (roomIndex === -1) {
      console.error('Room not found:', roomName);
      return false;
    }

    // Remove the old trade from this room
    jobRooms[roomIndex].trades = jobRooms[roomIndex].trades.filter(
      (trade: any) => trade.trade_id !== oldTradeId
    );

    // Add the new trade to this room
    jobRooms[roomIndex].trades.push({
      trade_id: newTradeId,
      start_date: updates.start_date || new Date().toISOString(),
      end_date:
        updates.end_date || new Date(Date.now() + 86400000).toISOString(),
      markup: updates.markup || 0,
      services: [], // Initialize with empty services array
    });

    localStorage.setItem(storageKey, JSON.stringify(jobRooms));
    return true;
  } catch (error) {
    console.error('Error replacing trade in room:', error);
    return false;
  }
};

// Function to clear and reset localStorage
export const resetRoomTradeData = (jobId?: string) => {
  try {
    const storageKey = jobId ? `job_rooms_${jobId}` : 'job_rooms';
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error resetting room trade data:', error);
    return false;
  }
};

// Function to get room trade data from localStorage
export const getRoomTradeData = (jobId?: string) => {
  try {
    const storageKey = jobId ? `job_rooms_${jobId}` : 'job_rooms';
    const existingData = localStorage.getItem(storageKey);
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Error getting room trade data:', error);
    return [];
  }
};

// Function to clear room trade data from localStorage
export const clearRoomTradeData = (jobId?: string) => {
  try {
    const storageKey = jobId ? `job_rooms_${jobId}` : 'job_rooms';
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error clearing room trade data:', error);
    return false;
  }
};

export default function EstimateComponent({
  breadcrumbData,
  onAddRoom,
  jobId,
  categoryId,
  onSaveSuccess,
  onSaveError,
  onFormSubmit,
}: EstimateComponentProps) {
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [showEstimationBox, setShowEstimationBox] = useState(false);

  const handleAddFromTemplate = () => {
    setIsTemplateSheetOpen(true);
  };

  const handleTemplateSave = (_selectedTemplates: string[]) => {
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
    return (
      <EstimationBox
        _onClose={handleCloseEstimationBox}
        {...(jobId && { jobId })}
        {...(categoryId && { categoryId })}
        {...(onSaveSuccess && { onSaveSuccess })}
        {...(onSaveError && { onSaveError })}
        {...(onFormSubmit && { onFormSubmit })}
      />
    );
  }

  return (
    <section className=''>
      {/* Breadcrumb */}
      {breadcrumbData && breadcrumbData.length > 0 && (
        <div className='mb-6'>
          <Breadcrumb items={breadcrumbData} />
        </div>
      )}

      {/* Estimate Empty State */}
      <div className='p-4 lg:p-10 rounded-[20px] bg-[var(--card-background)]'>
        <NoDataFound
          title='Nothing Here Yet'
          description="You haven't created any estimate yet. Start by adding your first one to organize your estimate."
          buttonText='Add Room'
          onButtonClick={onAddRoom}
          showButton={false}
          height='h-auto'
        />
        <div className='flex sm:flex-row flex-col gap-4 justify-center'>
          <Button className='btn-primary' onClick={handleAddRoom}>
            <RoomIcon className='!h-6 !w-6' />
            Add Room&nbsp;/&nbsp;Project
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
