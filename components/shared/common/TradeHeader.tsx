import { Button } from '@/components/ui/button';
import { Trash } from 'iconsax-react';

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

interface TradeHeaderProps {
  showAddService: boolean;
  isEditing: boolean;
  editingRoomName: string;
  setEditingRoomName: (name: string) => void;
  handleNameSave: () => void;
  handleRoomNameKeyDown: (e: React.KeyboardEvent) => void;
  handleEditClick: () => void;
  selectedRoom: Room | undefined;
  showServiceForm: boolean;
  selectedServiceData: Service | undefined;
  selectedTradeData: Trade | undefined;
  handleAddTrade: () => void;
  handleAddService: () => void;
  onDeleteClick: () => void;
}

export default function TradeHeader({
  showAddService,
  selectedRoom,
  showServiceForm,
  selectedServiceData,
  selectedTradeData,
  onDeleteClick,
}: TradeHeaderProps) {
  return (
    <div className='bg-white border-b border-gray-200 p-4 h-[75px] flex items-center'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center space-x-2'>
          {!showAddService ? (
            // Room view - show room name only
            <div>
              <h1 className='text-xl font-semibold text-gray-800'>
                {selectedRoom?.name}
              </h1>
            </div>
          ) : showServiceForm && selectedServiceData ? (
            // Service view - show service name with breadcrumb
            <div>
              <h1 className='text-xl font-semibold text-gray-800'>
                {selectedServiceData.name}
              </h1>
              <p className='text-sm text-gray-500'>
                {selectedRoom?.name} / {selectedTradeData?.name} /{' '}
                {selectedServiceData.name}
              </p>
            </div>
          ) : (
            // Trade view - show trade name with breadcrumb
            selectedTradeData && (
              <div>
                <h1 className='text-xl font-semibold text-gray-800'>
                  {selectedTradeData.name}
                </h1>
                <p className='text-sm text-gray-500'>in {selectedRoom?.name}</p>
              </div>
            )
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            onClick={onDeleteClick}
          >
            <Trash className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
