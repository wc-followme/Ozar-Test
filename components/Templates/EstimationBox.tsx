'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { EstimationBoxSidebar } from '@/components/shared/common/EstimationBoxSidebar';
import EstimationHeader from '@/components/shared/common/EstimationHeader';
import EstimationServiceForm from '@/components/shared/forms/EstimationServiceForm';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
import { Tool } from '@/components/shared/forms/estimation-types';
import { Sortable } from '@/components/ui/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { useState } from 'react';
import NoDataFound from '../shared/common/NoDataFound';

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

interface EstimationBoxProps {
  _onClose: () => void;
}

export default function EstimationBox({}: EstimationBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [expandedRooms, setExpandedRooms] = useState<string[]>([
    'room-1',
    'room-2',
  ]);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'room' | 'trade' | 'service' | null
  >(null);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room-1',
      name: 'Home 1',
      total: 0.0,
      trades: [],
      isExpanded: true,
    },
  ]);

  const selectedRoom =
    rooms.find(room => room.id === selectedRoomId) || rooms[0];

  // Find the trade data across all rooms to handle cross-room trade selection
  const selectedTradeData = selectedTrade
    ? rooms
        .flatMap(room => room.trades)
        .find(trade => trade.id === selectedTrade)
    : selectedRoom?.trades.find(trade => trade.id === selectedTrade);

  const selectedServiceData =
    selectedService && selectedTradeData
      ? selectedTradeData.serviceList.find(
          service => service.id === selectedService
        )
      : undefined;

  const handleAddRoom = () => {
    // If no rooms exist, create the default Home 1 room
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: 'room-1',
        name: 'Home 1',
        total: 0.0,
        isExpanded: true,
        trades: [],
      };

      setRooms([defaultRoom]);
      setExpandedRooms(['room-1']);
      setSelectedRoomId('room-1');
      setSelectedTrade(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
      return;
    }

    // Generate a unique ID using timestamp + random number to avoid conflicts
    const uniqueId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRoom: Room = {
      id: uniqueId,
      name: `Room ${rooms.length + 1}`,
      total: 0.0,
      isExpanded: true,
      trades: [],
    };

    setRooms(prev => [...prev, newRoom]);
    setExpandedRooms(prev => [...prev, newRoom.id]);

    // Automatically select the newly created room
    setSelectedRoomId(newRoom.id);
    setSelectedTrade(null);
    setShowAddService(false);
    setShowServiceForm(false);
    setSelectedService(null);
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedRooms(value);
  };

  const handleTradeAccordionChange = (value: string[]) => {
    setExpandedTrades(value);
  };

  const handleAddTrade = () => {
    // Generate a unique ID using timestamp + random number to avoid conflicts
    const uniqueId = `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTrade: Trade = {
      id: uniqueId,
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
    // Generate a unique ID using timestamp + random number to avoid conflicts
    const uniqueId = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newService: Service = {
      id: uniqueId,
      name: 'New Service',
      description: '',
      qty: 1,
      rate: 0.0,
      lineTotal: 0.0,
      serviceTotal: 0.0,
      tradeTotal: 0.0,
      serviceOptions: [],
      materials: [],
      finishes: [],
      tools: [],
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

    // Ensure the trade accordion is expanded
    if (!expandedTrades.includes(tradeId)) {
      setExpandedTrades(prev => [...prev, tradeId]);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);

    // Always show room view when room is clicked
    setSelectedTrade(null);
    setShowAddService(false);
    setShowServiceForm(false);
    setSelectedService(null);

    // Ensure the room is expanded
    if (!expandedRooms.includes(roomId)) {
      setExpandedRooms(prev => [...prev, roomId]);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    // Find which room and trade contains this service across ALL rooms
    let foundRoom = null;
    let foundTrade = null;

    for (const room of rooms) {
      const trade = room.trades.find(trade =>
        trade.serviceList.some(service => service.id === serviceId)
      );
      if (trade) {
        foundRoom = room;
        foundTrade = trade;
        break;
      }
    }

    if (foundRoom && foundTrade) {
      // Set the room that contains this service
      setSelectedRoomId(foundRoom.id);

      // Set the trade that contains this service
      setSelectedTrade(foundTrade.id);

      // Ensure the room and trade are expanded
      if (!expandedRooms.includes(foundRoom.id)) {
        setExpandedRooms(prev => [...prev, foundRoom.id]);
      }
      if (!expandedTrades.includes(foundTrade.id)) {
        setExpandedTrades(prev => [...prev, foundTrade.id]);
      }

      // Set service and form states
      setSelectedService(serviceId);
      setShowServiceForm(true);
      setShowAddService(true);
    }
  };

  const handleEditClick = () => {
    // Set the editing room name to the current selected room's name
    setEditingRoomName(selectedRoom?.name || 'Room');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (editingRoomName.trim()) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? { ...room, name: editingRoomName.trim() }
            : room
        )
      );
    }
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setEditingRoomName(selectedRoom?.name || 'Room');
    setIsEditing(false);
  };

  const handleRoomNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
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

  const handleServiceNameChange = (newServiceName: string) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? { ...service, name: newServiceName }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleServiceUpdate = (updatedService: Service) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? updatedService
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleMaterialAdd = (newMaterial: any) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                materials: [...service.materials, newMaterial],
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleFinishAdd = (newFinish: any) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                finishes: [...service.finishes, newFinish],
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleMaterialUpdate = (materialId: string, updatedMaterial: any) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                materials: service.materials.map(material =>
                                  material.id === materialId
                                    ? updatedMaterial
                                    : material
                                ),
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleMaterialDelete = (materialId: string) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                materials: service.materials.filter(
                                  material => material.id !== materialId
                                ),
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleFinishUpdate = (finishId: string, updatedFinish: any) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                finishes: service.finishes.map(finish =>
                                  finish.id === finishId
                                    ? updatedFinish
                                    : finish
                                ),
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleFinishDelete = (finishId: string) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                finishes: service.finishes.filter(
                                  finish => finish.id !== finishId
                                ),
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleToolAdd = (newTool: Tool) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                tools: [...service.tools, newTool],
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  const handleToolRemove = (toolId: string) => {
    if (selectedTrade && selectedService) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                tools: service.tools.filter(
                                  tool => tool.id !== toolId
                                ),
                              }
                            : service
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  // Delete handlers
  const handleDeleteClick = () => {
    if (showServiceForm && selectedService) {
      setDeleteType('service');
    } else if (showAddService && selectedTrade) {
      setDeleteType('trade');
    } else {
      setDeleteType('room');
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'room') {
      // Delete room
      setRooms(prev => {
        const filteredRooms = prev.filter(room => room.id !== selectedRoomId);
        if (filteredRooms.length === 0) {
          // If this was the last room, create a default room
          const defaultRoom: Room = {
            id: 'room-1',
            name: 'Home 1',
            total: 0.0,
            trades: [],
            isExpanded: true,
          };
          setSelectedRoomId('room-1');
          return [defaultRoom];
        } else {
          // Select the first remaining room
          if (filteredRooms.length > 0) {
            setSelectedRoomId(filteredRooms[0]!.id);
          }
          return filteredRooms;
        }
      });
      setSelectedTrade(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
    } else if (deleteType === 'trade' && selectedTrade) {
      // Delete trade
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.filter(trade => trade.id !== selectedTrade),
              }
            : room
        )
      );
      setSelectedTrade(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
    } else if (deleteType === 'service' && selectedService && selectedTrade) {
      // Delete service
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.id === selectedTrade
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.filter(
                          service => service.id !== selectedService
                        ),
                      }
                    : trade
                ),
              }
            : room
        )
      );
      setSelectedService(null);
      setShowServiceForm(false);
    }
    setShowDeleteModal(false);
    setDeleteType(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteType(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Reorder handlers for drag and drop
  const handleTradeReorder = (reorderedTrades: Trade[]) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoomId
          ? {
              ...room,
              trades: reorderedTrades,
            }
          : room
      )
    );
  };

  const handleServiceReorder = (reorderedServices: Service[]) => {
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
                        serviceList: reorderedServices,
                      }
                    : trade
                ),
              }
            : room
        )
      );
    }
  };

  return (
    <div className='flex bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] overflow-hidden'>
      {/* Sidebar */}
      <EstimationBoxSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        handleAddRoom={handleAddRoom}
        expandedRooms={expandedRooms}
        handleAccordionChange={handleAccordionChange}
        rooms={rooms}
        handleRoomSelect={handleRoomSelect}
        expandedTrades={expandedTrades}
        handleTradeAccordionChange={handleTradeAccordionChange}
        handleTradeSelect={handleTradeSelect}
        selectedService={selectedService}
        handleServiceSelect={handleServiceSelect}
        formatCurrency={formatCurrency}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col h-[calc(100vh_-_120px)]'>
        {/* Header */}
        <EstimationHeader
          showAddService={showAddService}
          isEditing={isEditing}
          editingRoomName={editingRoomName}
          setEditingRoomName={setEditingRoomName}
          handleNameSave={handleNameSave}
          handleRoomNameKeyDown={handleRoomNameKeyDown}
          handleEditClick={handleEditClick}
          selectedRoom={selectedRoom}
          showServiceForm={showServiceForm}
          selectedServiceData={selectedServiceData}
          selectedTradeData={selectedTradeData}
          handleAddTrade={handleAddTrade}
          handleAddService={handleAddService}
          onDeleteClick={handleDeleteClick}
        />

        {/* Content Area */}
        <div className='flex-1 p-6 overflow-auto bg-[var(--background)]'>
          {!showAddService ? (
            // Room view - show trades list
            selectedRoom && selectedRoom.trades.length > 0 ? (
              <Sortable
                items={selectedRoom.trades}
                onReorder={handleTradeReorder}
                idField='id'
              >
                <div className='space-y-4'>
                  {selectedRoom.trades.map(trade => (
                    <SortableItem key={trade.id} id={trade.id}>
                      {dragHandleProps => (
                        <TradeListCardComponent
                          trade={trade}
                          onClick={() => handleTradeSelect(trade.id)}
                          dragHandleProps={dragHandleProps}
                        />
                      )}
                    </SortableItem>
                  ))}
                </div>
              </Sortable>
            ) : (
              <div className='text-center py-12'>
                <NoDataFound
                  title='No trades added yet.'
                  description='Click "+ Add Trade" to get started.'
                />
              </div>
            )
          ) : showServiceForm && selectedService ? (
            // Service form view - check if we have the data
            selectedServiceData ? (
              <EstimationServiceForm
                service={selectedServiceData}
                onServiceUpdate={handleServiceUpdate}
                onAddMaterial={() => {
                  console.log('Add material clicked');
                }}
                onAddFinish={() => {
                  console.log('Add finish clicked');
                }}
                onServiceNameChange={handleServiceNameChange}
                onMaterialAdd={handleMaterialAdd}
                onFinishAdd={handleFinishAdd}
                onMaterialUpdate={handleMaterialUpdate}
                onMaterialDelete={handleMaterialDelete}
                onFinishUpdate={handleFinishUpdate}
                onFinishDelete={handleFinishDelete}
                tools={selectedServiceData.tools}
                onAddTool={handleToolAdd}
                onRemoveTool={handleToolRemove}
                roomName={selectedRoom?.name || 'Room'}
                tradeName={selectedTradeData?.name || 'Trade'}
              />
            ) : (
              // Service selected but data not found
              <div className='text-center py-12'>
                <NoDataFound
                  title='No Service found.'
                  description='Click "+ Add Service" to get started.'
                />
              </div>
            )
          ) : selectedTrade ? (
            // Trade view - show trade details and services
            selectedTradeData ? (
              <EstimationTradeForm
                trade={selectedTradeData}
                _onTradeUpdate={updatedTrade => {
                  // Handle trade update logic here
                  console.log('Trade updated:', updatedTrade);
                }}
                onServiceSelect={serviceId => {
                  // Handle service selection logic here
                  handleServiceSelect(serviceId);
                }}
                _onAddService={() => {
                  // Handle add service logic here
                  handleAddService();
                }}
                onTradeNameChange={handleTradeNameChange}
                onServiceReorder={handleServiceReorder}
              />
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>Trade not found.</p>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title={
          deleteType === 'room'
            ? 'Delete Room'
            : deleteType === 'trade'
              ? 'Delete Trade'
              : 'Delete Service'
        }
        subtitle={
          deleteType === 'room'
            ? `Are you sure you want to delete "${selectedRoom?.name}"? This will also delete all trades and services within this room.`
            : deleteType === 'trade'
              ? `Are you sure you want to delete "${selectedTradeData?.name}"? This will also delete all services within this trade.`
              : `Are you sure you want to delete "${selectedServiceData?.name}"? This action cannot be undone.`
        }
        archiveButtonText={'Delete'}
        onCancel={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
