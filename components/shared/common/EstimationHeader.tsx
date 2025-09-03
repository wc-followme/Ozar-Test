import { Button } from '@/components/ui/button';
import { Add, Edit2, Trash } from 'iconsax-react';

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
  uniqueKey: string; // Add unique generated key
  name: string;
  services: number;
  dateRange: string;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
  serviceList: Service[];
  isExpanded: boolean;
  startDate?: Date;
  endDate?: Date;
  markup?: number;
  markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
}

interface Room {
  id: string;
  uniqueKey: string;
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

interface EstimationHeaderProps {
  showAddService: boolean;
  isEditing: boolean;
  editingRoomName: string;
  setEditingRoomName: (name: string) => void;
  handleNameSave: () => void;
  handleRoomNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleEditClick: () => void;
  selectedRoom: Room | undefined;
  showServiceForm: boolean;
  selectedServiceData: Service | undefined;
  selectedTradeData: Trade | undefined;
  handleAddTrade: () => void;
  handleAddService: () => void;
  onDeleteClick: () => void;
  isSelectionMode?: boolean;
}

export default function EstimationHeader({
  showAddService,
  isEditing,
  editingRoomName,
  setEditingRoomName,
  handleNameSave,
  handleRoomNameKeyDown,
  handleEditClick,
  selectedRoom,
  showServiceForm,
  selectedServiceData,
  selectedTradeData,
  handleAddTrade,
  handleAddService,
  onDeleteClick,
  isSelectionMode = false,
}: EstimationHeaderProps) {
  return (
    <div className='bg-[var(--card-background)] border-b border-[var(--border-dark)] p-4 h-[75px] flex items-center'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center space-x-2'>
          {!showAddService ? (
            // Room view
            isEditing && !isSelectionMode ? (
              <input
                type='text'
                value={editingRoomName}
                onChange={e => setEditingRoomName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleRoomNameKeyDown}
                className='text-xl font-semibold bg-transparent border-b-0 border-[var(--primary)] focus:outline-none focus:border-[var(--primary)] px-1'
                autoFocus
              />
            ) : (
              <div className='flex items-center gap-2'>
                <h1 className='text-xl font-semibold'>{selectedRoom?.name}</h1>
                {!isSelectionMode && (
                  <Edit2
                    size={14}
                    color='var(--text-secondary)'
                    className='cursor-pointer hover:text-[var(--primary)] transition-colors duration-200'
                    onClick={handleEditClick}
                  />
                )}
              </div>
            )
          ) : showServiceForm && selectedServiceData ? (
            // Service view
            <div>
              <h1 className='text-xl font-semibold'>
                {selectedServiceData.name}
              </h1>
              <p className='text-sm text-gray-500'>
                {selectedRoom?.name} / {selectedTradeData?.name} /{' '}
                {selectedServiceData.name}
              </p>
            </div>
          ) : (
            // Trade view
            selectedTradeData && (
              <div>
                <h1 className='text-xl font-semibold'>
                  {selectedTradeData.name}
                </h1>
                <p className='text-sm text-gray-500'>in {selectedRoom?.name}</p>
              </div>
            )
          )}
        </div>
        <div className='flex items-center space-x-2'>
          {!showAddService ? (
            <Button
              className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
              onClick={handleAddTrade}
            >
              <Add size='24' color='var(--secondary)' className='!h-6 !w-6' />
              Add Trade
            </Button>
          ) : showServiceForm && selectedServiceData ? (
            <Button
              className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
              onClick={() => {
                // Handle option template logic here
              }}
            >
              <Add size='24' color='var(--secondary)' className='!h-6 !w-6' />
              Option Template
            </Button>
          ) : (
            <Button
              className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
              onClick={handleAddService}
            >
              <Add size='24' color='var(--secondary)' className='!h-6 !w-6' />{' '}
              Add Service
            </Button>
          )}
          {!isSelectionMode && (
            <Button
              variant='ghost'
              size='sm'
              className=''
              onClick={onDeleteClick}
            >
              <Trash className='!h-5 !w-5' size={24} color='var(--text-dark)' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
