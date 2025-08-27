'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { EstimationBoxSidebar } from '@/components/shared/common/EstimationBoxSidebar';
import EstimationHeader from '@/components/shared/common/EstimationHeader';
import {
  EstimationItem,
  Tool,
} from '@/components/shared/forms/estimation-types';
import EstimationServiceForm from '@/components/shared/forms/EstimationServiceForm';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
import { Sortable } from '@/components/ui/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { useToast } from '@/components/ui/use-toast';
import { CUSTOM_EVENTS, STORAGE_KEYS } from '@/constants/common';
import { ESTIMATION_MESSAGES } from '@/constants/messages';
import { apiService } from '@/lib/api';
import {
  calculateJobTotal,
  calculateServiceTotal,
  calculateServiceTotalMaterialCost,
  calculateTradeTotal,
  MARKUP_TYPES,
} from '@/lib/estimation-calculations';
import { extractApiErrorMessage } from '@/lib/utils';
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
  markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
  lineTotal: number;
  is_hidden?: boolean;
}

interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

interface Service {
  id: string;
  uuid?: string; // Add UUID field for database service UUID
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
  is_hidden?: boolean;
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
  uniqueKey: string; // Add unique generated key
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

interface EstimationBoxProps {
  _onClose: () => void;
  jobId?: string; // Add job ID prop for API calls
  templateId?: string | undefined; // Add template ID prop for template context
  categoryId?: string; // Add category ID prop for filtering trades
  onSaveSuccess?: () => void; // Callback for successful save
  onSaveError?: (error: any) => void; // Callback for save errors
  onFormSubmit?: number; // Trigger value for form submission
}

// Utility function to generate unique keys
const generateUniqueKey = (
  prefix: string,
  _tradeUuid?: string,
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

// Helper function to get the appropriate localStorage key
const getStorageKey = (jobId?: string, templateId?: string): string => {
  if (templateId) {
    return `template_rooms_${templateId}`;
  } else if (jobId) {
    return `job_rooms_${jobId}`;
  } else {
    return 'template_rooms'; // Default for new templates without ID
  }
};

export default function EstimationBox(props: Readonly<EstimationBoxProps>) {
  const { showErrorToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [expandedRooms, setExpandedRooms] = useState<string[]>(['0']);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedTradeUniqueKey, setSelectedTradeUniqueKey] = useState<
    string | null
  >(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('0');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'room' | 'trade' | 'service' | null
  >(null);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '0', // Use sequence number as room ID
      uniqueKey: generateUniqueKey('room'),
      name: 'Room 1',
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

  // Find the trade data using uniqueKey to ensure room-specific selection
  const selectedTradeData = selectedTradeUniqueKey
    ? rooms
        .flatMap(room => room.trades)
        .find(trade => trade.uniqueKey === selectedTradeUniqueKey)
    : selectedRoom?.trades.find(
        trade => trade.uniqueKey === selectedTradeUniqueKey
      );

  const selectedServiceData =
    selectedService && selectedTradeData
      ? selectedTradeData.serviceList.find(
          service => service.id === selectedService
        )
      : undefined;

  const fetchTrades = async (companyUuid: string | null) => {
    try {
      const response = await apiService.fetchTradesPublic({
        page: 1,
        limit: 10,
        company_id: companyUuid || '',
        ...(props.categoryId && { category_id: props.categoryId }),
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
    } catch (_error) {
      // If fetching fails or returns unexpected data, show an empty dropdown silently
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
  }, [props.categoryId]); // Add categoryId as dependency

  // Save state whenever rooms change
  useEffect(() => {
    if (rooms.length > 0) {
      const storageKey = getStorageKey(props.jobId, props.templateId);
      updateLocalStorageFromState(rooms, storageKey);
    }
  }, [rooms]);

  // Update calculations on mount
  useEffect(() => {
    if (rooms.length > 0) {
      updateAllCalculations();
    }
  }, []);

  // Listen for form submission and trigger save
  useEffect(() => {
    if (props.onFormSubmit && props.onFormSubmit > 0) {
      handleSave();
    }
  }, [props.onFormSubmit]);

  // Recalculate width when sidebar states change
  useEffect(() => {
    // Force re-render when sidebar states change
    const handleResize = () => {
      // This will trigger a re-render and recalculate width
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  // Function to update calculations for a service
  const updateServiceCalculations = (service: Service): Service => {
    const serviceTotal = calculateServiceTotal(service.rate, service.qty);
    const totalMaterialCost = calculateServiceTotalMaterialCost(
      service.materials,
      service.finishes
    );

    const updatedService = {
      ...service,
      lineTotal: serviceTotal,
      serviceTotal: serviceTotal,
      tradeTotal: serviceTotal + totalMaterialCost,
    };

    return updatedService;
  };

  // Function to update calculations for a trade
  const updateTradeCalculations = (trade: Trade): Trade => {
    // First update individual service calculations
    const updatedServices = trade.serviceList.map(updateServiceCalculations);

    const tradeTotals = calculateTradeTotal({
      markup_type: trade.markup_type || MARKUP_TYPES.FLAT_AMOUNT,
      markup: trade.markup || 0,
      services: updatedServices,
    });

    return {
      ...trade,
      serviceList: updatedServices,
      laborCost: tradeTotals.labor_cost,
      materialCost: tradeTotals.material_cost,
      tradeTotal: tradeTotals.trade_total,
      // Don't store the calculated markup value back - keep the original markup percentage
    };
  };

  // Function to update calculations for a room
  const updateRoomCalculations = (room: Room): Room => {
    const updatedTrades = room.trades.map(updateTradeCalculations);
    const roomTotal = updatedTrades.reduce(
      (total, trade) => total + trade.tradeTotal,
      0
    );

    return {
      ...room,
      trades: updatedTrades,
      total: roomTotal,
    };
  };

  // Function to update all calculations
  const updateAllCalculations = (): void => {
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(updateRoomCalculations);
      return updatedRooms;
    });
  };

  const handleAddRoom = () => {
    // If no rooms exist, create the default Room 1 room
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: '0', // Use sequence number as room ID
        uniqueKey: generateUniqueKey('room'),
        name: 'Room 1',
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
    // If main accordion is collapsed, don't allow individual changes
    if (!isMainAccordionExpanded) {
      return;
    }
    setExpandedRooms(value);
  };

  const handleTradeAccordionChange = (value: string[]) => {
    // If main accordion is collapsed, don't allow individual changes
    if (!isMainAccordionExpanded) {
      return;
    }
    setExpandedTrades(value);
  };

  const handleAddTrade = () => {
    // Use the UUID from the first trade option in the dropdown
    const defaultTradeOption = tradeOptions[0];
    if (!defaultTradeOption) {
      // Create a default trade if no options are available (silently)
      const defaultTrade: Trade = {
        id: 'default-trade',
        uniqueKey: generateUniqueKey(
          'trade',
          'default-trade',
          selectedRoomId,
          0
        ),
        name: ESTIMATION_MESSAGES.DEFAULT_TRADE_NAME,
        services: 0,
        dateRange: '',
        type: '2D',
        laborCost: 0.0,
        materialCost: 0.0,
        tradeTotal: 0.0,
        serviceList: [],
        isExpanded: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // Default to tomorrow
        markup: 0,
        markup_type: MARKUP_TYPES.FLAT_AMOUNT,
      };

      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: [...room.trades, defaultTrade],
                total: room.total + defaultTrade.tradeTotal,
              }
            : room
        )
      );

      setExpandedTrades(prev => [...prev, defaultTrade.uniqueKey]);
      setSelectedTrade(defaultTrade.id);
      setSelectedTradeUniqueKey(defaultTrade.uniqueKey);
      setShowAddService(true);
      return;
    }

    const tradeUuid = defaultTradeOption.value; // This is the UUID from database
    const tradeName = defaultTradeOption.label; // This is the trade name
    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

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
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // Default to tomorrow
      markup: 0,
      markup_type: MARKUP_TYPES.FLAT_AMOUNT,
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
    setSelectedTradeUniqueKey(newTrade.uniqueKey);
    setShowAddService(true);
  };

  const handleAddService = () => {
    // If no trade is selected, create a trade first
    if (!selectedTradeUniqueKey) {
      handleAddTrade();
      return;
    }

    // Generate a unique ID using timestamp + random number to avoid conflicts
    const uniqueId = `service-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newService: Service = {
      id: uniqueId,
      uuid: uniqueId, // Use the same ID as UUID for now
      name: 'New Service',
      description: '',
      qty: 1,
      rate: 0.0, // Set default rate to 0
      lineTotal: 0.0, // Calculate initial line total
      serviceTotal: 0.0, // Calculate initial service total
      tradeTotal: 0.0, // Calculate initial trade total
      serviceOptions: [],
      materials: [],
      finishes: [],
      tools: [],
    };

    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoomId
          ? {
              ...room,
              trades: room.trades.map(trade =>
                trade.uniqueKey === selectedTradeUniqueKey
                  ? {
                      ...trade,
                      serviceList: [...trade.serviceList, newService],
                      services: trade.serviceList.length + 1,
                    }
                  : trade
              ),
            }
          : room
      )
    );

    // Update calculations after adding service
    setTimeout(() => updateAllCalculations(), 0);

    // Select the new service
    setSelectedService(newService.id);
    setShowServiceForm(true);
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

      // Don't clear service data when switching trades - only clear selectedService state
      // The service data should remain intact in the trade object
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

  const handleServiceSelect = (serviceId: string, tradeUniqueKey?: string) => {
    // If tradeUniqueKey provided, scope search to that trade
    if (tradeUniqueKey) {
      for (const room of rooms) {
        const trade = room.trades.find(tr => tr.uniqueKey === tradeUniqueKey);
        if (trade && trade.serviceList.some(s => s.id === serviceId)) {
          setSelectedRoomId(room.id);
          setSelectedTrade(trade.id);
          setSelectedTradeUniqueKey(trade.uniqueKey);
          if (!expandedRooms.includes(room.id)) {
            setExpandedRooms(prev => [...prev, room.id]);
          }
          if (!expandedTrades.includes(trade.uniqueKey)) {
            setExpandedTrades(prev => [...prev, trade.uniqueKey]);
          }
          setSelectedService(serviceId);
          setShowServiceForm(true);
          setShowAddService(true);
          return;
        }
      }
    }

    // Fallback: find the first occurrence across all rooms
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
      setSelectedRoomId(foundRoom.id);
      setSelectedTrade(foundTrade.id);
      setSelectedTradeUniqueKey(foundTrade.uniqueKey);
      if (!expandedRooms.includes(foundRoom.id)) {
        setExpandedRooms(prev => [...prev, foundRoom.id]);
      }
      if (!expandedTrades.includes(foundTrade.uniqueKey)) {
        setExpandedTrades(prev => [...prev, foundTrade.uniqueKey]);
      }
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
            startDate: trade.startDate || new Date(),
            endDate: trade.endDate || new Date(Date.now() + 86400000),
            markup: trade.markup || 0,
            serviceList: trade.serviceList || [],
          })),
        }));
        const storageKey = getStorageKey(props.jobId, props.templateId);
        updateLocalStorageFromState(roomsData, storageKey);
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

      // Update the selected trade ID if it matches the specific trade instance
      const currentSelectedTrade = rooms
        .find(room => room.id === selectedRoomId)
        ?.trades.find(trade => trade.uniqueKey === oldTradeUniqueKey);
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
            startDate: trade.startDate || new Date(),
            endDate: trade.endDate || new Date(Date.now() + 86400000),
            markup: trade.markup || 0,
            serviceList: trade.serviceList || [],
          })),
        }));
        const storageKey = getStorageKey(props.jobId, props.templateId);
        updateLocalStorageFromState(roomsData, storageKey);
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
      setRooms(prev => {
        const updatedRooms = prev.map(room =>
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
        );
        return updatedRooms;
      });

      // Update calculations after service update
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleTradeUpdate = (updatedTrade: Trade) => {
    if (selectedTrade && selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
                    ? { ...trade, ...updatedTrade }
                    : trade
                ),
              }
            : room
        )
      );

      // Update calculations after trade update
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleMaterialAdd = (newMaterial: EstimationItem) => {
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

      // Update calculations after material add
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleMaterialUpdate = (
    materialId: string,
    updatedMaterial: EstimationItem
  ) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev => {
        const updatedRooms = prev.map(room =>
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
        );

        // Update calculations immediately with the new state
        setTimeout(() => {
          const recalculatedRooms = updatedRooms.map(updateRoomCalculations);
          setRooms(recalculatedRooms);
        }, 0);

        return updatedRooms;
      });
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

      // Update calculations after material delete
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleFinishUpdate = (finishId: string, updatedFinish: Material) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev => {
        const updatedRooms = prev.map(room =>
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
        );

        // Update calculations immediately with the new state
        setTimeout(() => {
          const recalculatedRooms = updatedRooms.map(updateRoomCalculations);
          setRooms(recalculatedRooms);
        }, 0);

        return updatedRooms;
      });
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

      // Update calculations after finish delete
      setTimeout(() => updateAllCalculations(), 0);
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

      // Update calculations after tool add
      setTimeout(() => updateAllCalculations(), 0);
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

      // Update calculations after tool remove
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleToolReplace = (newTools: Tool[]) => {
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
                                tools: newTools, // Replace entire tools array
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

      // Update calculations after tool replace
      setTimeout(() => updateAllCalculations(), 0);
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
            name: 'Room 1',
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

  // Calculate project total across all rooms using backend logic
  const calculateProjectTotal = () => {
    const jobRoomsData = rooms.map(room => ({
      trades: room.trades.map(trade => ({
        markup_type: trade.markup_type || MARKUP_TYPES.FLAT_AMOUNT,
        markup: trade.markup || 0,
        services: trade.serviceList,
      })),
    }));

    const jobTotals = calculateJobTotal(jobRoomsData);
    return jobTotals.trade_total;
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
        startDate: trade.startDate || new Date(),
        endDate: trade.endDate || new Date(Date.now() + 86400000),
        markup: trade.markup || 0,
        serviceList: trade.serviceList || [],
      })),
    }));

    const storageKey = getStorageKey(props.jobId, props.templateId);
    updateLocalStorageFromState(roomsData, storageKey);
  };

  const handleSave = async () => {
    try {
      // First save to localStorage
      saveCurrentState();

      // If jobId is provided, make API call
      if (props.jobId) {
        // Get the job_rooms data from localStorage
        const storageKey = getStorageKey(props.jobId, props.templateId);
        const jobRoomsData = localStorage.getItem(storageKey);
        if (jobRoomsData) {
          const jobRooms = JSON.parse(jobRoomsData);

          // Make API call using makeGenericRequest
          await apiService.makeGenericRequest(`/jobs/${props.jobId}/rooms`, {
            method: 'POST',
            body: JSON.stringify({
              job_rooms: jobRooms,
            }),
          });

          // Show success toast with API response message
          // showSuccessToast(
          //   extractApiSuccessMessage(response, 'Estimation saved successfully!')
          // );

          // Call success callback if provided
          if (props.onSaveSuccess) {
            props.onSaveSuccess();
          }
        }
      } else {
        // Show success toast for localStorage save only
        //showSuccessToast('Estimation saved to local storage successfully!');
      }
    } catch (error) {
      console.error('Error saving job rooms:', error);

      // Show error toast with API error message
      showErrorToast(
        extractApiErrorMessage(
          error,
          'Failed to save estimation. Please try again.'
        )
      );

      // Call error callback if provided
      if (props.onSaveError) {
        props.onSaveError(error);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Calculate dynamic width based on sidebar states
  const calculateContentWidth = () => {
    const baseWidth = '100vw';
    const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';
    const estimationSidebarWidth = '320px'; // Fixed width for estimation sidebar
    const padding = '48px'; // 24px on each side
    const margins = '32px'; // 16px on each side

    return `calc(${baseWidth} - ${sidebarWidth} - ${estimationSidebarWidth} - ${padding} - ${margins})`;
  };

  const toggleMainAccordion = () => {
    // Check if all accordions are currently expanded
    const allRoomIds = rooms.map(room => room.id);
    const allTradeIds = rooms.flatMap(room =>
      room.trades.map(trade => trade.uniqueKey)
    );

    const allRoomsExpanded = allRoomIds.every(id => expandedRooms.includes(id));
    const allTradesExpanded = allTradeIds.every(id =>
      expandedTrades.includes(id)
    );
    const allExpanded = allRoomsExpanded && allTradesExpanded;

    if (allExpanded) {
      // All are expanded, so collapse all
      setExpandedTrades([]);
      setExpandedRooms([]);
      setIsMainAccordionExpanded(false);
    } else {
      // Some or none are expanded, so expand all
      setExpandedTrades(allTradeIds);
      setExpandedRooms(allRoomIds);
      setIsMainAccordionExpanded(true);
    }
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
    if (selectedTradeUniqueKey) {
      setRooms(prev =>
        prev.map(room =>
          room.id === selectedRoomId
            ? {
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
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

      // Update calculations after finish add
      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  return (
    <div className='flex bg-[var(--card-background)] rounded-[20px] w-full border border-[var(--border-dark)] overflow-hidden'>
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
        selectedTradeUniqueKey={selectedTradeUniqueKey}
        handleServiceSelect={(serviceId, tradeKey) => {
          if (tradeKey) {
            setSelectedTradeUniqueKey(tradeKey);
          }
          handleServiceSelect(serviceId, tradeKey);
        }}
        formatCurrency={formatCurrency}
        selectedRoomId={selectedRoomId}
        toggleMainAccordion={toggleMainAccordion}
      />

      {/* Main Content */}
      <div
        className='flex-1 flex flex-col h-[calc(100vh_-_120px)] min-w-0 overflow-hidden transition-all duration-300 ease-in-out !touch-pan-x !touch-pan-y touch-manipulation'
        style={{ width: calculateContentWidth() }}
      >
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
        <div className='flex-1 overflow-hidden bg-[var(--background)]'>
          <div
            className='h-full overflow-x-auto overscroll-contain touch-pan-x touch-pan-y -webkit-overflow-scrolling-touch touch-manipulation scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300'
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              touchAction: 'pan-x pan-y',
              msOverflowStyle: 'auto',
              scrollbarWidth: 'auto',
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <div className='p-6 min-w-[800px] max-w-none w-full'>
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
                    onReplaceTools={handleToolReplace}
                    roomName={selectedRoom?.name || 'Room'}
                    tradeName={selectedTradeData?.name || 'Trade'}
                    tradeId={selectedTrade || undefined}
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
                    roomUniqueKey={selectedRoom?.uniqueKey || ''}
                    tradeUniqueKey={selectedTradeData?.uniqueKey || ''}
                    _onTradeUpdate={(u: unknown) =>
                      handleTradeUpdate(u as Trade)
                    }
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
          </div>
        </div>

        {/* Project Total and Submit Buttons */}
        <div className='p-6 py-3 bg-[var(--card-background)] border-t border-[var(--border-dark)] shadow-sm'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <h3 className='text-base font-semibold text-[var(--text-dark)]'>
                Project Total:
              </h3>
              <div className='h-10 w-[1px] bg-[var(--border-dark)]'></div>
              <span className='text-xl font-bold text-[var(--primary)]'>
                {formatCurrency(projectTotal)}
              </span>
            </div>
            <div className='flex gap-3'>
              {/* Save button hidden - will be triggered by form submission */}
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
            ? `Are you sure you want to delete &ldquo;${selectedRoom?.name}&rdquo;? This will also delete all trades and services within this room.`
            : deleteType === 'trade'
              ? `Are you sure you want to delete &ldquo;${selectedTradeData?.name}&rdquo;? This will also delete all services within this trade.`
              : `Are you sure you want to delete &ldquo;${selectedServiceData?.name}&rdquo;? This action cannot be undone.`
        }
        archiveButtonText={'Delete'}
        onCancel={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
