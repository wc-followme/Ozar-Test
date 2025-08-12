'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { EstimationBoxSidebar } from '@/components/shared/common/EstimationBoxSidebar';
import EstimationHeader from '@/components/shared/common/EstimationHeader';
import { Tool } from '@/components/shared/forms/estimation-types';
import EstimationServiceForm from '@/components/shared/forms/EstimationServiceForm';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
import { Sortable } from '@/components/ui/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { CUSTOM_EVENTS, STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useEffect, useState } from 'react';
import NoDataFound from '../shared/common/NoDataFound';
import { updateLocalStorageFromState } from './EstimateComponent';

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
}

interface Room {
  id: string;
  uniqueKey: string; // Add unique generated key
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

interface EstimationBoxProps {
  _onClose: () => void;
}

// Utility function to generate unique keys
const generateUniqueKey = (
  prefix: string,
  tradeUuid?: string,
  roomId?: string,
  tradeSequenceNumber?: number
): string => {
  if (
    prefix === 'trade' &&
    roomId !== undefined &&
    tradeSequenceNumber !== undefined
  ) {
    return `trade_${roomId}_${tradeSequenceNumber}`;
  }
  // Fallback for other cases (rooms, etc.)
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
};

export default function EstimationBox(_props: Readonly<EstimationBoxProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [expandedRooms, setExpandedRooms] = useState<string[]>([
    'room-1',
    'room-2',
  ]);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedTradeUniqueKey, setSelectedTradeUniqueKey] = useState<
    string | null
  >(null);
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
      id: '0', // Use sequence number as room ID
      uniqueKey: generateUniqueKey('room'),
      name: 'Home 1',
      total: 0.0,
      trades: [],
      isExpanded: true,
    },
  ]);

  // Trades dropdown options from API
  const [tradeOptions, setTradeOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

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

  const fetchTrades = async (companyUuid: string | null) => {
    try {
      const response = await apiService.fetchTrades({
        page: 1,
        limit: 10,
        is_active: true,
        company_id: companyUuid || '',
      });
      type TradeItem = { id?: string | number; uuid?: string; name?: string };
      const payload = response as unknown as {
        data?: TradeItem[] | { data?: TradeItem[] };
      };
      const list: TradeItem[] = Array.isArray(payload?.data)
        ? (payload.data as TradeItem[])
        : Array.isArray((payload?.data as { data?: TradeItem[] })?.data)
          ? ((payload.data as { data?: TradeItem[] }).data as TradeItem[])
          : [];
      const options = list
        .filter(t => !!t?.name)
        .map(t => ({
          value: String(t.uuid || t.id || t.name),
          label: String(t.name),
        }));
      setTradeOptions(options);
    } catch {
      setTradeOptions([]);
    }
  };

  // Load trades on mount and when company changes
  useEffect(() => {
    const selectedCompanyRaw =
      typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY)
        : null;
    const companyUuid = selectedCompanyRaw
      ? (() => {
          try {
            const parsed: { uuid?: string; id?: string | number } =
              JSON.parse(selectedCompanyRaw);
            return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
          } catch {
            return '';
          }
        })()
      : '';
    fetchTrades(companyUuid);

    const handleCompanyChanged = () => {
      const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
      let uuid = '';
      if (raw) {
        try {
          const parsed: { uuid?: string; id?: string | number } =
            JSON.parse(raw);
          uuid = parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
        } catch {}
      }
      fetchTrades(uuid);
    };

    window.addEventListener(
      CUSTOM_EVENTS.COMPANY_CHANGED,
      handleCompanyChanged as EventListener
    );
    return () => {
      window.removeEventListener(
        CUSTOM_EVENTS.COMPANY_CHANGED,
        handleCompanyChanged as EventListener
      );
    };
  }, []);

  // Save state whenever rooms change
  useEffect(() => {
    if (rooms.length > 0) {
      updateLocalStorageFromState(rooms);
    }
  }, [rooms]);

  const handleAddRoom = () => {
    // If no rooms exist, create the default Home 1 room
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: '0', // Use sequence number as room ID
        uniqueKey: generateUniqueKey('room'),
        name: 'Home 1',
        total: 0.0,
        isExpanded: true,
        trades: [],
      };

      setRooms([defaultRoom]);
      setExpandedRooms(['0']);
      setSelectedRoomId('0');
      setSelectedTrade(null);
      setSelectedTradeUniqueKey(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
      return;
    }

    // Generate room ID as sequence number
    const roomSequenceNumber = rooms.length;
    const newRoom: Room = {
      id: roomSequenceNumber.toString(), // Use sequence number as room ID
      uniqueKey: generateUniqueKey('room'),
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
    setSelectedTradeUniqueKey(null);
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
    // Use the UUID from the first trade option in the dropdown
    const defaultTradeOption = tradeOptions[0];
    if (!defaultTradeOption) {
      console.error('No trade options available');
      return;
    }

    const tradeUuid = defaultTradeOption.value; // This is the UUID from database
    const tradeName = defaultTradeOption.label; // This is the trade name
    const selectedRoom = rooms.find(room => room.id === selectedRoomId);
    const roomSequenceNumber = parseInt(selectedRoomId); // Room ID is now the sequence number
    const tradeSequenceNumber = selectedRoom ? selectedRoom.trades.length : 0;

    const newTrade: Trade = {
      id: tradeUuid, // Use the UUID from database instead of generated ID
      uniqueKey: generateUniqueKey(
        'trade',
        tradeUuid,
        selectedRoomId, // Use room ID directly
        tradeSequenceNumber
      ),
      name: tradeName,
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
    setExpandedTrades(prev => [...prev, newTrade.uniqueKey]);

    // Select the new trade
    setSelectedTrade(newTrade.id);
    setShowAddService(true);
  };

  const handleAddService = () => {
    // Generate a unique ID using timestamp + random number to avoid conflicts
    const uniqueId = `service-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
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

  const handleTradeSelect = (tradeUniqueKey: string) => {
    // Find which room contains this trade using uniqueKey
    let foundRoom: Room | null = null;
    let foundTrade: Trade | null = null;

    for (const room of rooms) {
      const trade = room.trades.find(tr => tr.uniqueKey === tradeUniqueKey);
      if (trade) {
        foundRoom = room;
        foundTrade = trade;
        break;
      }
    }

    // Set the room that contains this trade
    if (foundRoom && foundTrade) {
      setSelectedRoomId(foundRoom.id);
      setSelectedTrade(foundTrade.id); // Keep the trade ID for backward compatibility
      setSelectedTradeUniqueKey(foundTrade.uniqueKey);

      // Ensure the room is expanded
      if (!expandedRooms.includes(foundRoom.id)) {
        setExpandedRooms(prev => [...prev, foundRoom.id]);
      }

      // Ensure the trade accordion is expanded
      if (!expandedTrades.includes(foundTrade.uniqueKey)) {
        setExpandedTrades(prev => [...prev, foundTrade.uniqueKey]);
      }
    }

    setShowAddService(true); // Set to true to show trade state
    setShowServiceForm(false); // Always go to trade view first
    setSelectedService(null); // Clear service selection
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);

    // Always show room view when room is clicked
    setSelectedTrade(null);
    setSelectedTradeUniqueKey(null);
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
    let foundRoom: Room | null = null;
    let foundTrade: Trade | null = null;

    for (const room of rooms) {
      const trade = room.trades.find(tr =>
        tr.serviceList.some(service => service.id === serviceId)
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
      setSelectedTradeUniqueKey(foundTrade.uniqueKey);

      // Ensure the room and trade are expanded
      if (!expandedRooms.includes(foundRoom.id)) {
        setExpandedRooms(prev => [...prev, foundRoom.id]);
      }
      if (!expandedTrades.includes(foundTrade.uniqueKey)) {
        setExpandedTrades(prev => [...prev, foundTrade.uniqueKey]);
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
    console.log('selectedTrade ======================>', selectedTrade);
    console.log('selectedRoomId ======================>', selectedRoomId);
    console.log(
      'selectedTradeUniqueKey ======================>',
      selectedTradeUniqueKey
    );

    if (selectedTrade && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
                    ? { ...trade, name: newTradeName }
                    : trade
                ),
              }
            : room
        )
      );

      // Save complete state after trade name change
      setTimeout(() => {
        const roomsData = rooms.map(room => ({
          id: room.id,
          name: room.name,
          trades: room.trades.map(trade => ({
            id: trade.id,
            name: trade.name,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            markup: 0,
          })),
        }));
        updateLocalStorageFromState(roomsData);
      }, 0);
    }
  };

  // Handle trade replacement when user changes trade from dropdown
  const handleTradeReplacement = (
    oldTradeUniqueKey: string,
    newTradeId: string,
    newTradeName: string
  ) => {
    // Only update the trade in the selected room, not all rooms
    setRooms(prev => {
      const updatedRooms = prev.map(room =>
        room.id === selectedRoomId
          ? {
              ...room,
              trades: room.trades.map(trade => {
                const shouldUpdate = trade.uniqueKey === oldTradeUniqueKey;
                return shouldUpdate
                  ? {
                      ...trade,
                      id: newTradeId, // Update the trade ID
                      name: newTradeName,
                      // Generate new unique key with same sequence numbers
                      uniqueKey: generateUniqueKey(
                        'trade',
                        newTradeId,
                        selectedRoomId, // Use room ID directly
                        room.trades.indexOf(trade)
                      ),
                    }
                  : trade;
              }),
            }
          : room
      );
      // console.log("updatedRooms ======================>",updatedRooms);
      // console.log("room ======================>",rooms);
      // console.log("selectedRoomId ======================>",selectedRoomId);
      // console.log("selectedTrade ======================>",selectedTrade);
      // console.log("oldTradeUniqueKey ======================>",oldTradeUniqueKey);
      // console.log("newTradeId ======================>",newTradeId);
      // console.log("newTradeName ======================>",newTradeName);

      // Update the selected trade ID if it matches the specific trade instance
      const currentSelectedTrade = rooms
        .find(room => room.id === selectedRoomId)
        ?.trades.find(trade => trade.uniqueKey === oldTradeUniqueKey);
      // console.log("currentSelectedTrade ======================>",currentSelectedTrade);
      if (
        selectedTrade &&
        currentSelectedTrade &&
        currentSelectedTrade.id === selectedTrade
      ) {
        setSelectedTrade(newTradeId);
      }

      // Save complete state after trade replacement
      setTimeout(() => {
        const roomsData = updatedRooms.map(room => ({
          id: room.id,
          name: room.name,
          trades: room.trades.map(trade => ({
            id: trade.id,
            name: trade.name,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            markup: 0,
          })),
        }));
        updateLocalStorageFromState(roomsData);
      }, 0);

      return updatedRooms;
    });
  };

  const handleServiceNameChange = (newServiceName: string) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
                    ? {
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? {
                                ...service,
                                name: newServiceName,
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

  const handleServiceUpdate = (updatedService: Service) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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

  const handleMaterialAdd = (newMaterial: Material) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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

  const handleMaterialUpdate = (
    materialId: string,
    updatedMaterial: Material
  ) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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

  const handleFinishUpdate = (finishId: string, updatedFinish: Material) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
            id: '0', // Use sequence number as room ID
            uniqueKey: generateUniqueKey('room'),
            name: 'Home 1',
            total: 0.0,
            trades: [],
            isExpanded: true,
          };
          setSelectedRoomId('0');
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
      setSelectedTradeUniqueKey(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
    } else if (
      deleteType === 'trade' &&
      selectedTrade &&
      selectedTradeUniqueKey
    ) {
      // Delete trade using uniqueKey
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.filter(
                  trade => trade.uniqueKey !== selectedTradeUniqueKey
                ),
              }
            : room
        )
      );
      setSelectedTrade(null);
      setSelectedTradeUniqueKey(null);
      setShowAddService(false);
      setShowServiceForm(false);
      setSelectedService(null);
    } else if (
      deleteType === 'service' &&
      selectedService &&
      selectedTrade &&
      selectedTradeUniqueKey
    ) {
      // Delete service using uniqueKey
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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

  // Calculate project total across all rooms
  const calculateProjectTotal = () => {
    return rooms.reduce((total, room) => {
      const roomTotal = room.trades.reduce((tradeTotal, trade) => {
        const serviceTotal = trade.serviceList.reduce((serviceSum, service) => {
          return serviceSum + service.lineTotal;
        }, 0);
        return tradeTotal + serviceTotal;
      }, 0);
      return total + roomTotal;
    }, 0);
  };

  const projectTotal = calculateProjectTotal();

  const saveCurrentState = () => {
    // Save all rooms and trades to localStorage
    const roomsData = rooms.map(room => ({
      id: room.id,
      name: room.name,
      trades: room.trades.map(trade => ({
        id: trade.id,
        name: trade.name,
        startDate: new Date(), // You can get actual dates from trade state
        endDate: new Date(Date.now() + 86400000), // You can get actual dates from trade state
        markup: 0, // You can get actual markup from trade state
      })),
    }));

    updateLocalStorageFromState(roomsData);
    console.log('Saved current state to localStorage');
  };

  const handleSave = () => {
    saveCurrentState();
    console.log('Saving estimation...');
  };

  const handleReviewAndSend = () => {
    // TODO: Implement review and send functionality
    console.log('Reviewing and sending estimation...');
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

  const handleFinishAdd = (newFinish: Material) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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
                    <SortableItem
                      key={`${selectedRoom.uniqueKey}_${trade.uniqueKey}`}
                      id={trade.id}
                    >
                      {dragHandleProps => (
                        <TradeListCardComponent
                          trade={trade}
                          onClick={() => handleTradeSelect(trade.uniqueKey)}
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
                onAddMaterial={() => {}}
                onAddFinish={() => {}}
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
                roomName={selectedRoom?.name || 'Room'}
                roomUniqueKey={selectedRoom?.uniqueKey || ''}
                tradeUniqueKey={selectedTradeData?.uniqueKey || ''}
                onTradeNameChange={handleTradeNameChange}
                onTradeReplacement={handleTradeReplacement}
                onServiceSelect={serviceId => {
                  handleServiceSelect(serviceId);
                }}
                onServiceReorder={handleServiceReorder}
                onLocalStorageUpdate={saveCurrentState}
                tradeOptions={tradeOptions}
              />
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>Trade not found.</p>
              </div>
            )
          ) : null}
        </div>

        {/* Project Total and Submit Buttons */}
        <div className='p-6 bg-white border-t border-gray-200 shadow-sm'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Project Total:
              </h3>
              <span className='text-2xl font-bold text-gray-900'>
                {formatCurrency(projectTotal)}
              </span>
            </div>
            <div className='flex gap-3'>
              <button onClick={handleSave} className='btn-secondary'>
                Save
              </button>
              <button
                onClick={handleReviewAndSend}
                className='px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium'
              >
                Review & Send
              </button>
            </div>
          </div>
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
