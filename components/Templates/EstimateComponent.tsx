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

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

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
  tools: Tool[];
}

interface Trade {
  id: string;
  name: string;
  services: number;
  dateRange: string;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
  serviceList: Service[];
  isExpanded: boolean;
}

interface Room {
  id: string;
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

interface EstimateComponentProps {
  breadcrumbData: BreadcrumbItem[];
  onAddRoom: () => void;
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
      // Add any other trade properties that need to be saved
    }>;
  }>
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
        // Add any other trade properties that need to be saved
      })),
    }));

    localStorage.setItem('job_rooms', JSON.stringify(jobRooms));
    console.log('Updated localStorage from state:', jobRooms);
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
  }
) => {
  try {
    const existingData = localStorage.getItem('job_rooms');
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
    });

    localStorage.setItem('job_rooms', JSON.stringify(jobRooms));
    console.log('Replaced trade in localStorage:', jobRooms);
    return true;
  } catch (error) {
    console.error('Error replacing trade in room:', error);
    return false;
  }
};

// Function to clear and reset localStorage
export const resetRoomTradeData = () => {
  try {
    localStorage.removeItem('job_rooms');
    console.log('Reset room trade data in localStorage');
    return true;
  } catch (error) {
    console.error('Error resetting room trade data:', error);
    return false;
  }
};

// Function to get room trade data from localStorage
export const getRoomTradeData = () => {
  try {
    const existingData = localStorage.getItem('job_rooms');
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Error getting room trade data:', error);
    return [];
  }
};

// Function to clear room trade data from localStorage
export const clearRoomTradeData = () => {
  try {
    localStorage.removeItem('job_rooms');
    console.log('Cleared room trade data from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing room trade data:', error);
    return false;
  }
};

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
