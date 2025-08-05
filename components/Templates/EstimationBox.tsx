'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import EstimationServiceForm from '@/components/shared/forms/EstimationServiceForm';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ArrowDown2, Edit2, Trash } from 'iconsax-react';
import { useState } from 'react';

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

interface EstimationBoxProps {
  onClose: () => void;
}

export default function EstimationBox({ onClose }: EstimationBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [roomName, setRoomName] = useState('Room');
  const [expandedRooms, setExpandedRooms] = useState<string[]>(['room']);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room');
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room',
      name: 'Room',
      total: 0.0,
      isExpanded: true,
      trades: [],
    },
  ]);

  const selectedRoom =
    rooms.find(room => room.id === selectedRoomId) || rooms[0];
  const selectedTradeData = selectedRoom?.trades.find(
    trade => trade.id === selectedTrade
  );
  const selectedServiceData = selectedTradeData?.serviceList.find(
    service => service.id === selectedService
  );

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: `Room ${rooms.length + 1}`,
      total: 0.0,
      isExpanded: true,
      trades: [],
    };

    setRooms(prev => [...prev, newRoom]);
    setExpandedRooms(prev => [...prev, newRoom.id]);
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedRooms(value);
  };

  const handleTradeAccordionChange = (value: string[]) => {
    setExpandedTrades(value);
  };

  const handleAddTrade = () => {
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      name: 'New Trade',
      services: 0,
      dateRange: '',
      type: '2D',
      laborCost: 0.0,
      materialCost: 0.0,
      tradeTotal: 0.0,
      serviceList: [],
      isExpanded: true,
    };

    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoomId
          ? {
              ...room,
              trades: [...room.trades, newTrade],
              total: room.total + newTrade.tradeTotal,
            }
          : room
      )
    );

    // Add the new trade to expanded trades
    setExpandedTrades(prev => [...prev, newTrade.id]);

    // Select the new trade
    setSelectedTrade(newTrade.id);
    setShowAddService(true);
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: 'Install Shower',
      description:
        'Install a complete shower system, including fixtures, valves, and piping, to provide an efficient and leak-free showering experience.',
      qty: 2,
      rate: 100.0,
      lineTotal: 480.0,
      serviceTotal: 200.0,
      tradeTotal: 680.0,
      serviceOptions: [
        {
          id: 'option1',
          name: 'Shower Option 1 Onyx',
          tradeTotal: 480.0,
        },
        {
          id: 'option2',
          name: 'Shower Option 2 Tile Shower',
          tradeTotal: 840.0,
        },
      ],
      materials: [
        {
          id: 'material1',
          name: 'Shut of valve',
          variant: 'Stylish Tile for Bathroom',
          qty: 4,
          unit: 'Sq. Feet',
          description:
            'Inline shut-off valve for isolating water supply to the shower system during maintenance or emergencies.',
          rate: 25.0,
          markup: 0.0,
          lineTotal: 100.0,
        },
        {
          id: 'material2',
          name: 'Supply line',
          variant: 'Stylish Tile for Bathroom',
          qty: 2,
          unit: 'Sq. Feet',
          description:
            'Flexible supply lines for connecting shower fixtures to water supply.',
          rate: 15.0,
          markup: 0.0,
          lineTotal: 30.0,
        },
        {
          id: 'material3',
          name: 'Drain pipe',
          variant: 'Stylish Tile for Bathroom',
          qty: 1,
          unit: 'Sq. Feet',
          description: 'PVC drain pipe for proper water drainage from shower.',
          rate: 20.0,
          markup: 0.0,
          lineTotal: 20.0,
        },
        {
          id: 'material4',
          name: 'Exhaust',
          variant: 'Stylish Tile for Bathroom',
          qty: 1,
          unit: 'Sq. Feet',
          description: 'Ventilation exhaust fan for shower area.',
          rate: 50.0,
          markup: 0.0,
          lineTotal: 50.0,
        },
      ],
      finishes: [
        {
          id: 'finish1',
          name: 'Tub',
          variant: 'Stylish Tile for Bathroom',
          qty: 2,
          unit: 'Sq. Feet',
          description: 'Stylish bathroom tub with modern design.',
          rate: 245.0,
          markup: 0.0,
          lineTotal: 490.0,
        },
        {
          id: 'finish2',
          name: 'Tub Faucet',
          variant: 'Stylish Tile for Bathroom',
          qty: 2,
          unit: 'Sq. Feet',
          description: 'Modern tub faucet with elegant finish.',
          rate: 245.0,
          markup: 0.0,
          lineTotal: 490.0,
        },
      ],
    };

    if (selectedTrade) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: [...trade.serviceList, newService],
                        services: trade.serviceList.length + 1,
                        tradeTotal: trade.tradeTotal + newService.tradeTotal,
                      }
                    : trade
                ),
                total: room.trades.reduce(
                  (sum, trade) => sum + trade.tradeTotal,
                  0
                ),
              }
            : room
        )
      );

      // Select the new service
      setSelectedService(newService.id);
      setShowServiceForm(true);
    }
  };

  const handleTradeSelect = (tradeId: string) => {
    setSelectedTrade(tradeId);
    setShowAddService(true); // Set to true to show trade state
    setShowServiceForm(false); // Always go to trade view first
    setSelectedService(null); // Clear service selection
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedTrade(null);
    setShowAddService(false);
    setShowServiceForm(false);
    setSelectedService(null);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowServiceForm(true);
    setShowAddService(true); // Keep this true for service state
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNameSave = () => {
    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoomId ? { ...room, name: roomName } : room
      )
    );
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setRoomName(selectedRoom?.name || 'Room');
    setIsEditing(false);
  };

  const handleTradeNameChange = (newTradeName: string) => {
    if (selectedTrade) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? { ...trade, name: newTradeName }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className='flex  bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] overflow-hidden'>
      {/* Sidebar */}
      <div className='bg-white border-r border-gray-200 w-80'>
        <div className='p-4 border-b border-gray-200'>
          <Button
            className='btn-primary bg-opacity-10 w-full'
            onClick={handleAddRoom}
          >
            + Add Room
          </Button>
        </div>

        <div className='px-4'>
          <Accordion
            type='multiple'
            value={expandedRooms}
            onValueChange={handleAccordionChange}
            className='w-full'
          >
            {rooms.map(room => (
              <AccordionItem
                key={room.id}
                value={room.id}
                className='border-none'
              >
                <AccordionPrimitive.Header className='flex'>
                  <AccordionPrimitive.Trigger
                    className='flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:no-underline hover:bg-gray-50 w-full'
                    onClick={() => handleRoomSelect(room.id)}
                  >
                    <div className='flex items-center flex-1 min-w-0'>
                      <ArrowDown2
                        size={16}
                        className={`mr-2 transition-transform duration-200 ${
                          expandedRooms.includes(room.id) ? 'rotate-180' : ''
                        }`}
                        color='var(--text-dark)'
                        strokeWidth={3}
                      />
                      <span className='font-medium text-sm truncate'>
                        {room.name}
                      </span>
                      <span className='ml-auto text-sm font-semibold text-blue-600'>
                        {formatCurrency(room.total)}
                      </span>
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className='px-0'>
                  {room.trades.length > 0 && (
                    <div className='ml-6 mt-1'>
                      <Accordion
                        type='multiple'
                        value={expandedTrades}
                        onValueChange={handleTradeAccordionChange}
                        className='w-full'
                      >
                        {room.trades.map(trade => (
                          <AccordionItem
                            key={trade.id}
                            value={trade.id}
                            className='border-none'
                          >
                            <AccordionPrimitive.Header className='flex'>
                              <AccordionPrimitive.Trigger
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:no-underline w-full ${
                                  selectedTrade === trade.id
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleTradeSelect(trade.id)}
                              >
                                <div className='flex items-center flex-1 min-w-0'>
                                  <ArrowDown2
                                    size={16}
                                    className={`mr-2 transition-transform duration-200 ${
                                      expandedTrades.includes(trade.id)
                                        ? 'rotate-180'
                                        : ''
                                    }`}
                                    color='var(--text-dark)'
                                  />
                                  <span className='text-sm text-gray-600'>
                                    {trade.name}
                                  </span>
                                  <span className='ml-auto text-sm font-semibold text-blue-600'>
                                    {formatCurrency(trade.tradeTotal)}
                                  </span>
                                </div>
                              </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className='px-0'>
                              {trade.serviceList.length > 0 && (
                                <div className='ml-6 mt-1'>
                                  {trade.serviceList.map(service => (
                                    <div
                                      key={service.id}
                                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                        selectedService === service.id
                                          ? 'bg-blue-50 border border-blue-200'
                                          : ''
                                      }`}
                                      onClick={() =>
                                        handleServiceSelect(service.id)
                                      }
                                    >
                                      <span className='text-xs text-gray-500'>
                                        {service.name}
                                      </span>
                                      <span className='text-xs font-semibold text-blue-600'>
                                        {formatCurrency(service.tradeTotal)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='bg-white border-b border-gray-200 p-4 h-[75px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              {!showAddService ? (
                // Room view
                isEditing ? (
                  <div className='flex items-center space-x-2'>
                    <input
                      type='text'
                      value={roomName}
                      onChange={e => setRoomName(e.target.value)}
                      className='text-xl font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500'
                      autoFocus
                    />
                    <Button
                      size='sm'
                      onClick={handleNameSave}
                      className='bg-green-600 hover:bg-green-700 text-white'
                    >
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={handleNameCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className='text-xl font-semibold'>
                      {selectedRoom?.name}
                    </h1>
                    <Edit2
                      size={14}
                      color='var(--text-secondary)'
                      className='cursor-pointer hover:text-blue-600'
                      onClick={handleEditClick}
                    />
                  </>
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
                    <p className='text-sm text-gray-500'>
                      in {selectedRoom?.name}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className='flex items-center space-x-2'>
              {!showAddService ? (
                <Button
                  className='btn-primary bg-opacity-10'
                  onClick={handleAddTrade}
                >
                  + Add Trade
                </Button>
              ) : showServiceForm && selectedServiceData ? (
                <Button
                  className='btn-primary bg-opacity-10'
                  onClick={() => {
                    // Handle option template logic here
                    console.log('Option Template clicked');
                  }}
                >
                  Option Template
                </Button>
              ) : (
                <Button
                  className='btn-primary bg-opacity-10'
                  onClick={handleAddService}
                >
                  + Add Service
                </Button>
              )}
              <Button variant='ghost' size='sm' className=''>
                <Trash
                  className='!h-5 !w-5'
                  size={24}
                  color='var(--text-dark)'
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='flex-1 p-6 overflow-auto bg-[var(--background)]'>
          {!showAddService ? (
            // Room view - show trades list
            selectedRoom && selectedRoom.trades.length > 0 ? (
              <div className='space-y-4'>
                {selectedRoom.trades.map(trade => (
                  <TradeListCardComponent
                    key={trade.id}
                    trade={trade}
                    onClick={() => handleTradeSelect(trade.id)}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>
                  No trades added yet. Click "+ Add Trade" to get started.
                </p>
              </div>
            )
          ) : showServiceForm && selectedService ? (
            // Service form view
            selectedServiceData ? (
              <EstimationServiceForm
                service={selectedServiceData}
                onServiceUpdate={updatedService => {
                  console.log('Service updated:', updatedService);
                }}
                onAddMaterial={() => {
                  console.log('Add material clicked');
                }}
                onAddFinish={() => {
                  console.log('Add finish clicked');
                }}
              />
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>Service not found.</p>
              </div>
            )
          ) : selectedTrade ? (
            // Trade view - show trade details and services
            selectedTradeData ? (
              <EstimationTradeForm
                trade={selectedTradeData}
                onTradeUpdate={updatedTrade => {
                  // Handle trade update logic here
                  console.log('Trade updated:', updatedTrade);
                }}
                onServiceSelect={serviceId => {
                  // Handle service selection logic here
                  console.log('Service selected:', serviceId);
                }}
                onAddService={() => {
                  // Handle add service logic here
                  console.log('Add service clicked');
                }}
                onTradeNameChange={handleTradeNameChange}
              />
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>Trade not found.</p>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
