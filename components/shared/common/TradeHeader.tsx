'use client';

import { Button } from '@/components/ui/button';
import { Trash } from 'iconsax-react';
import { useState } from 'react';
import { Avatar } from '../common/Avatar';
import OfferBid from './OfferBid';
import SideSheet from './SideSheet';

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
  selectedSubContractor?: any;
}

export default function TradeHeader({
  showAddService,
  selectedRoom,
  showServiceForm,
  selectedServiceData,
  selectedTradeData,
  onDeleteClick,
  selectedSubContractor,
}: TradeHeaderProps) {
  const [showOfferBid, setShowOfferBid] = useState(false);

  const handleRequestBid = (selectedSubContractors: any[]) => {
    console.log('Selected sub-contractors for bid:', selectedSubContractors);
    // Here you can implement the logic to send bid requests
    setShowOfferBid(false);
  };

  // If sub contractor is selected, show sub contractor UI with same style as rooms/trades
  if (selectedSubContractor) {
    return (
      <>
        <div className='bg-[var(--card-background)] border-b border-[var(--border-dark)] p-4 h-[75px] flex items-center'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center space-x-3'>
              <Avatar
                name={selectedSubContractor.name}
                image={selectedSubContractor.image || ''}
                height={32}
                width={32}
                className='rounded-full text-xs'
              />
              <div>
                <h1 className='text-base font-medium text-[var(--text-dark)]'>
                  {selectedSubContractor.name}
                </h1>
                <p className='text-xs font-medium text-[var(--text-secondary)]'>
                  {selectedSubContractor.companyName}
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline' className='btn-secondary'>
                Cancel bid
              </Button>
              <Button variant='outline' className='btn-secondary'>
                Reject
              </Button>
              <Button className='btn-primary'>Approve</Button>
            </div>
          </div>
        </div>

        {/* Offer Bid Side Sheet */}
        <SideSheet
          open={showOfferBid}
          onOpenChange={setShowOfferBid}
          title=''
          size='600px'
        >
          <OfferBid
            onClose={() => setShowOfferBid(false)}
            onRequestBid={handleRequestBid}
          />
        </SideSheet>
      </>
    );
  }

  // Original TradeHeader UI for normal cases
  return (
    <>
      <div className='bg-white border-b border-[var(--border-dark)] p-4 h-[75px] flex items-center'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center space-x-2'>
            {!showAddService ? (
              // Room view - show room name only
              <div>
                <h1 className='text-xl font-semibold text-gray-800'>
                  {selectedRoom?.name || 'Bed Room 1'}
                </h1>
              </div>
            ) : showServiceForm && selectedServiceData ? (
              // Service view - show service name with breadcrumb
              <div>
                <h1 className='text-xl font-semibold text-[var(--text-dark)]'>
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
                  <h1 className='text-xl font-semibold text-[var(--text-dark)]'>
                    {selectedTradeData.name}
                  </h1>
                  <p className='text-sm text-gray-500'>
                    in {selectedRoom?.name}
                  </p>
                </div>
              )
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {!showAddService ? (
              // Room view - show Request Bid button
              <Button
                className='btn-primary rounded-full px-4 py-2'
                onClick={() => setShowOfferBid(true)}
              >
                Request Bid
              </Button>
            ) : (
              // Trade/Service view - show delete button
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-600 hover:text-[var] hover:bg-gray-100'
                onClick={onDeleteClick}
              >
                <Trash className='!h-5 !w-5' color='var(--text-dark)' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Offer Bid Side Sheet */}
      <SideSheet
        open={showOfferBid}
        onOpenChange={setShowOfferBid}
        title='Offer Trade'
        size='600px'
      >
        <OfferBid
          onClose={() => setShowOfferBid(false)}
          onRequestBid={handleRequestBid}
        />
      </SideSheet>
    </>
  );
}
