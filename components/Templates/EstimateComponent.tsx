'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Dropdown } from '@/components/shared/common/Dropdown';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { TemplateListForm } from '@/components/shared/forms/TemplateListForm';
import { Button } from '@/components/ui/button';
import { IconHistory } from '@tabler/icons-react';
import {
  ArrowDown2,
  ArrowRotateLeft,
  ArrowRotateRight,
  Document,
  DocumentText,
  Edit2,
  Link,
  Save2,
  Trash,
} from 'iconsax-react';
import { useRef, useState } from 'react';
import { RoomIcon } from '../icons/RoomIcon';
import { TemplateIcon } from '../icons/TemplateIcon';
import VersionHistoryComponent from '../shared/common/VersionHistoryComponent';
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
  storageKey?: string
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

    const key = storageKey || 'job_rooms';
    localStorage.setItem(key, JSON.stringify(jobRooms));
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
  storageKey?: string
) => {
  try {
    const key = storageKey || 'job_rooms';
    const existingData = localStorage.getItem(key);
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

    localStorage.setItem(key, JSON.stringify(jobRooms));
    return true;
  } catch (error) {
    console.error('Error replacing trade in room:', error);
    return false;
  }
};

// Function to clear and reset localStorage
export const resetRoomTradeData = (storageKey?: string) => {
  try {
    const key = storageKey || 'job_rooms';
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error resetting room trade data:', error);
    return false;
  }
};

// Function to get room trade data from localStorage
export const getRoomTradeData = (storageKey?: string) => {
  try {
    const key = storageKey || 'job_rooms';
    const existingData = localStorage.getItem(key);
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Error getting room trade data:', error);
    return [];
  }
};

// Function to clear room trade data from localStorage
export const clearRoomTradeData = (storageKey?: string) => {
  try {
    const key = storageKey || 'job_rooms';
    localStorage.removeItem(key);
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
  const estimationBoxRef = useRef<{ toggleEditMode: () => void }>(null);
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [showEstimationBox, setShowEstimationBox] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string>('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      <>
        <div className='flex items-center mb-4'>
          {isEditing ? (
            // Edit mode header
            <>
              <div className='flex items-center gap-1'>
                <div className='h-10 w-[1px] bg-white'></div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 hover:text-gray-300'
                >
                  <ArrowRotateLeft
                    size='32'
                    color='var(--text-dark)'
                    className='!h-6 !w-6'
                  />
                </Button>
                <div className='h-8 w-[1px] bg-[var(--border-dark)]'></div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-600 hover:text-gray-500'
                  disabled
                >
                  <ArrowRotateRight
                    size='32'
                    color='var(--text-dark)'
                    className='!h-6 !w-6'
                  />
                </Button>
              </div>
              <div className='flex items-center ml-auto'>
                <Button
                  className='border-2 h-10 w-10 rounded-[10px] border-[var(--border-dark)]'
                  onClick={() => {
                    setIsEditing(false);
                    estimationBoxRef.current?.toggleEditMode();
                  }}
                >
                  <Trash
                    size={24}
                    color='var(--text-dark)'
                    className='!h-5 !w-5'
                  />
                </Button>
              </div>
            </>
          ) : (
            // Normal mode header
            <>
              <Button
                className='btn-secondary'
                onClick={() => setShowVersionHistory(true)}
              >
                <IconHistory size={18} color='var(--text-dark)' />
                <span className='font-medium'>Show version history</span>
              </Button>
              <div className='flex items-center gap-3 ml-auto'>
                {/* Quick Actions Dropdown */}
                <Button
                  className='btn-secondary'
                  onClick={() => {
                    setIsEditing(true);
                    estimationBoxRef.current?.toggleEditMode();
                  }}
                >
                  <Edit2 size={18} color='var(--text-dark)' />
                  <span className='font-medium'>Edit</span>
                </Button>
                <Dropdown
                  trigger={
                    <div className='btn-secondary cursor-pointer'>
                      <span className='font-medium'>Quick Actions</span>
                      <ArrowDown2
                        className='w-4 h-4 [&>path]:stroke-2 ml-2'
                        color='var(--text-dark)'
                      />
                    </div>
                  }
                  menuOptions={[
                    {
                      label: 'Send Material List',
                      action: 'send-material-list',
                      icon: DocumentText,
                    },
                    {
                      label: 'Save as Estimate Template',
                      action: 'save-as-template',
                      icon: Save2,
                    },
                    {
                      label: 'Send Invite Estimate',
                      action: 'send-invite-estimate',
                      icon: Link,
                    },
                    {
                      label: 'Send PDF',
                      action: 'send-pdf',
                      icon: Document,
                    },
                  ]}
                  onAction={action => {
                    setSelectedQuickAction(action);
                    if (action === 'send-material-list') {
                      console.log('Send Material List clicked');
                      // Add material list functionality here
                    } else if (action === 'save-as-template') {
                      console.log('Save as Estimate Template clicked');
                      // Add save template functionality here
                    } else if (action === 'send-invite-estimate') {
                      console.log('Send Invite Estimate clicked');
                      // Add invite estimate functionality here
                    } else if (action === 'send-pdf') {
                      console.log('Send PDF clicked');
                      // Add PDF functionality here
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
        <EstimationBox
          ref={estimationBoxRef}
          _onClose={handleCloseEstimationBox}
          {...(jobId && { jobId })}
          {...(categoryId && { categoryId })}
          {...(onSaveSuccess && { onSaveSuccess })}
          {...(onSaveError && { onSaveError })}
          {...(onFormSubmit && { onFormSubmit })}
          onEditModeChange={setIsEditing}
        />

        {/* Version History Sidesheet */}
        <SideSheet
          open={showVersionHistory}
          onOpenChange={setShowVersionHistory}
          title='Version History'
          size='600px'
        >
          <VersionHistoryComponent
            onClose={() => setShowVersionHistory(false)}
          />
        </SideSheet>
      </>
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
