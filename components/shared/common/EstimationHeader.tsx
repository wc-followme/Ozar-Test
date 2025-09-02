import { Button } from '@/components/ui/button';
import { Add, Trash } from 'iconsax-react';

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
  dateRange?: string;
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

interface EstimationHeaderProps {
  showAddService: boolean;
  isEditing: boolean;
  selectedRoom: Room | undefined;
  showServiceForm: boolean;
  selectedServiceData: Service | undefined;
  selectedTradeData: Trade | undefined;
  handleAddTrade: () => void;
  handleAddService: () => void;
  onDeleteClick: () => void;
}

export default function EstimationHeader({
  showAddService,
  isEditing,
  selectedRoom,
  showServiceForm,
  selectedServiceData,
  selectedTradeData,
  handleAddTrade,
  handleAddService,
  onDeleteClick,
}: EstimationHeaderProps) {
  return (
    <div className='bg-[var(--card-background)] border-b border-[var(--border-dark)] p-4 h-[75px] flex items-center'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center space-x-2'>
          {!showAddService ? (
            // Room view (no room name editing)
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-semibold truncate'>
                {selectedRoom?.name}
              </h1>
            </div>
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
          ) : showServiceForm && selectedServiceData ? null : ( // </Button> //   Option Template //   <Add size='24' color='var(--secondary)' className='!h-6 !w-6' /> // > //   }} //     // Handle option template logic here //   onClick={() => { //   className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]' // <Button
            <Button
              className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
              onClick={handleAddService}
            >
              <Add size='24' color='var(--secondary)' className='!h-6 !w-6' />{' '}
              Add Service
            </Button>
          )}
          <Button
            variant='ghost'
            size='sm'
            className=''
            onClick={onDeleteClick}
          >
            <Trash className='!h-5 !w-5' size={24} color='var(--text-dark)' />
          </Button>
        </div>
      </div>
    </div>
  );
}
