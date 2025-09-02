'use client';

import { TradeListCardComponent } from '@/components/shared/cards/TradeListCardComponent';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { Dropdown } from '@/components/shared/common/Dropdown';
import TradeHeader from '@/components/shared/common/TradeHeader';
import TradeSidebar from '@/components/shared/common/TradeSidebar';
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
import { tradeSidebarData } from '@/constants/dummy-data';
import { ESTIMATION_MESSAGES } from '@/constants/messages';
import { apiService } from '@/lib/api';
import {
  calculateJobTotal,
  calculateServiceTotal,
  calculateServiceTotalMaterialCost,
  calculateTradeTotal,
  MARKUP_TYPES,
} from '@/lib/estimation-calculations';
import { ArrowDown2, SmsTracking } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { AuctionIcon } from '../../icons/AuctionIcon';
import NoDataFound from './NoDataFound';
import { SubContractorListCard } from './SubContractorListCard';

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
  uuid?: string;
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
  uniqueKey: string;
  name: string;
  services: number;
  start_date?: string | null;
  end_date?: string | null;
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

interface TradeComponentProps {
  jobId?: string;
  categoryId?: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
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
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
};

export default function TradeComponent(props: Readonly<TradeComponentProps>) {
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
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room_1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'room' | 'trade' | 'service' | null
  >(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string>('');
  const [isAuctionBidMode, setIsAuctionBidMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [triggerAddToOutSource, setTriggerAddToOutSource] = useState(false);
  const [selectedSubContractor, setSelectedSubContractor] = useState<any>(null);
  const [isReceivedTradeService, setIsReceivedTradeService] =
    useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '0',
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
    tradeSidebarData.find(room => room.uniqueKey === selectedRoomId) ||
    tradeSidebarData[0];

  // Find the trade data using uniqueKey to ensure room-specific selection
  const selectedTradeData = selectedTradeUniqueKey
    ? tradeSidebarData
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
  }, [props.categoryId]);

  // Update calculations on mount
  useEffect(() => {
    if (rooms.length > 0) {
      updateAllCalculations();
    }
  }, []);

  // Reset trigger after it's used
  useEffect(() => {
    if (triggerAddToOutSource) {
      setTriggerAddToOutSource(false);
    }
  }, [triggerAddToOutSource]);

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
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: '0',
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

    const roomSequenceNumber = rooms.length;
    const newRoom: Room = {
      id: roomSequenceNumber.toString(),
      uniqueKey: generateUniqueKey('room'),
      name: `Room ${rooms.length + 1}`,
      total: 0.0,
      isExpanded: true,
      trades: [],
    };

    setRooms(prev => [...prev, newRoom]);
    setExpandedRooms(prev => [...prev, newRoom.id]);

    setSelectedRoomId(newRoom.id);
    setSelectedTrade(null);
    setSelectedTradeUniqueKey(null);
    setShowAddService(false);
    setShowServiceForm(false);
    setSelectedService(null);
  };

  const handleAccordionChange = (value: string[]) => {
    if (!isMainAccordionExpanded) {
      return;
    }
    setExpandedRooms(value);
  };

  const handleTradeAccordionChange = (value: string[]) => {
    if (!isMainAccordionExpanded) {
      return;
    }
    setExpandedTrades(value);
  };

  const handleAddTrade = () => {
    const defaultTradeOption = tradeOptions[0];
    if (!defaultTradeOption) {
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
        start_date: '',
        end_date: '',
        type: '2D',
        laborCost: 0.0,
        materialCost: 0.0,
        tradeTotal: 0.0,
        serviceList: [],
        isExpanded: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
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

    const tradeUuid = defaultTradeOption.value;
    const tradeName = defaultTradeOption.label;
    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

    const tradeSequenceNumber = selectedRoom ? selectedRoom.trades.length : 0;

    const newTrade: Trade = {
      id: tradeUuid,
      uniqueKey: generateUniqueKey(
        'trade',
        tradeUuid,
        selectedRoomId,
        tradeSequenceNumber
      ),
      name: tradeName,
      services: 0,
      start_date: '',
      end_date: '',
      type: '2D',
      laborCost: 0.0,
      materialCost: 0.0,
      tradeTotal: 0.0,
      serviceList: [],
      isExpanded: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
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

    setExpandedTrades(prev => [...prev, newTrade.uniqueKey]);
    setSelectedTrade(newTrade.id);
    setSelectedTradeUniqueKey(newTrade.uniqueKey);
    setShowAddService(true);
  };

  const handleAddService = () => {
    if (!selectedTradeUniqueKey) {
      handleAddTrade();
      return;
    }

    const uniqueId = `service-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newService: Service = {
      id: uniqueId,
      uuid: uniqueId,
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

    setTimeout(() => updateAllCalculations(), 0);
    setSelectedService(newService.id);
    setShowServiceForm(true);
  };

  const handleTradeSelect = (tradeUniqueKey: string) => {
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
    }

    setShowAddService(true);
    setShowServiceForm(false);
    setSelectedService(null);
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedTrade(null);
    setSelectedTradeUniqueKey(null);
    setShowAddService(false);
    setShowServiceForm(false);
    setSelectedService(null);

    if (!expandedRooms.includes(roomId)) {
      setExpandedRooms(prev => [...prev, roomId]);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
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
    }
  };

  const handleTradeReplacement = (
    oldTradeUniqueKey: string,
    newTradeId: string,
    newTradeName: string
  ) => {
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
                      id: newTradeId,
                      name: newTradeName,
                      uniqueKey: generateUniqueKey(
                        'trade',
                        newTradeId,
                        selectedRoomId,
                        room.trades.indexOf(trade)
                      ),
                    }
                  : trade;
              }),
            }
          : room
      );

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
                                tools: newTools,
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
      setRooms(prev => {
        const filteredRooms = prev.filter(room => room.id !== selectedRoomId);
        if (filteredRooms.length === 0) {
          const defaultRoom: Room = {
            id: '0',
            uniqueKey: generateUniqueKey('room'),
            name: 'Home 1',
            total: 0.0,
            trades: [],
            isExpanded: true,
          };
          setSelectedRoomId('0');
          return [defaultRoom];
        } else {
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Calculate dynamic width based on sidebar states
  const calculateContentWidth = () => {
    const baseWidth = '100vw';
    const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';
    const tradeSidebarWidth = '320px'; // Fixed width for trade sidebar
    const padding = '48px'; // 24px on each side
    const margins = '32px'; // 16px on each side

    return `calc(${baseWidth} - ${sidebarWidth} - ${tradeSidebarWidth} - ${padding} - ${margins})`;
  };

  const toggleMainAccordion = () => {
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
      setExpandedTrades([]);
      setExpandedRooms([]);
      setIsMainAccordionExpanded(false);
    } else {
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

      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  // Component implementation will be added here
  return (
    <div className='space-y-4'>
      {/* Quick Actions Dropdown - Upper Side */}
      <div className='flex justify-end'>
        <Dropdown
          trigger={
            <div className='flex items-center gap-2 bg-[var(--white-background)] border border-[var(--border-dark)] rounded-full px-4 py-2.5 text-base text-[var(--text-dark)] hover:border-[var(--border-dark)] hover:shadow-sm cursor-pointer w-auto transition-all duration-200'>
              <span className='font-medium'>Quick Actions</span>
              <ArrowDown2
                className='w-4 h-4 [&>path]:stroke-2'
                color='var(--text-dark)'
              />
            </div>
          }
          menuOptions={[
            {
              label: 'Send Via Email',
              action: 'send-email',
              icon: SmsTracking,
            },
            {
              label: 'Add for Auction Bid',
              action: 'auction-bid',
              icon: AuctionIcon,
            },
          ]}
          onAction={action => {
            setSelectedQuickAction(action);
            if (action === 'send-email') {
              console.log('Send Via Email clicked');
              // Add your email functionality here
            } else if (action === 'auction-bid') {
              console.log('Add for Auction Bid clicked');
              setIsAuctionBidMode(true);
              // Log the currently checked items for auction bid
              console.log(
                'Checked items for auction bid:',
                Array.from(checkedItems)
              );
            }
          }}
        />
      </div>

      {/* Main TradeComponent */}
      <div className='flex bg-[var(--card-background)] rounded-[20px] w-full border border-[var(--border-dark)] overflow-hidden min-h-0'>
        {/* Sidebar */}
        <TradeSidebar
          onRoomSelect={room => {
            setSelectedRoomId(room.uniqueKey);
            setSelectedTrade(null);
            setSelectedTradeUniqueKey(null);
            setShowAddService(false);
            setShowServiceForm(false);
            setSelectedService(null);
            setSelectedSubContractor(null); // Clear sub contractor selection
            setIsReceivedTradeService(false); // Clear received trade service flag
          }}
          onTradeSelect={trade => {
            setSelectedTrade(trade.id);
            setSelectedTradeUniqueKey(trade.uniqueKey);
            setShowAddService(true);
            setShowServiceForm(false);
            setSelectedService(null);
            setSelectedSubContractor(null); // Clear sub contractor selection
            setIsReceivedTradeService(false); // Clear received trade service flag
          }}
          onServiceSelect={service => {
            setSelectedService(service.id);
            setShowServiceForm(true);
            setShowAddService(true);
            setSelectedSubContractor(null); // Clear sub contractor selection
            // Check if this service is from received trades
            setIsReceivedTradeService(service.isFromReceivedTrades || false);
          }}
          selectedRoomId={selectedRoomId || ''}
          selectedTradeId={selectedTrade || ''}
          selectedServiceId={selectedService || ''}
          isAuctionBidMode={isAuctionBidMode}
          onExitAuctionBidMode={() => setIsAuctionBidMode(false)}
          onCheckedItemsChange={setCheckedItems}
          onAddToOutSourceTrades={() => {
            // This will be called when items are added to out source trades
            console.log('Items added to out source trades');
          }}
          triggerAddToOutSource={triggerAddToOutSource}
          onSubContractorSelect={setSelectedSubContractor}
        />

        {/* Main Content */}
        <div
          className='flex-1 flex flex-col h-[calc(100vh_-_120px)] min-w-0 overflow-hidden transition-all duration-300 ease-in-out touch-manipulation'
          style={{ width: calculateContentWidth() }}
        >
          {/* Content Area */}
          <div className='flex-1 flex flex-col overflow-hidden bg-[var(--background)] touch-pan-y touch-pan-x'>
            {/* Header */}
            <TradeHeader
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
              selectedSubContractor={selectedSubContractor}
            />

            {/* Scrollable Content Container */}
            <div
              className='flex-1 overflow-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 transition-colors touch-pan-y touch-pan-x overscroll-contain'
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                touchAction: 'pan-x pan-y',
                msOverflowStyle: 'auto',
                scrollbarWidth: 'auto',
                overscrollBehavior: 'contain',
                '-webkit-overflow-scrolling': 'touch',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
                'scrollbar-gutter': 'stable',
                'scroll-padding': '0',
                'scroll-snap-type': 'y proximity',
              }}
            >
              <div className='p-6 min-w-fit max-w-none w-full'>
                {selectedSubContractor ? (
                  // Sub Contractor view - rooms with trades list and cost columns
                  <div className='space-y-8 min-w-[650px]'>
                    {selectedSubContractor.rooms?.map(
                      (room: {
                        id: string;
                        name: string;
                        trades: Array<{
                          id: string;
                          name: string;
                          dateRange?: string;
                          laborCost?: number;
                          materialCost?: number;
                          tradeTotal?: number;
                          services?: Array<any>;
                        }>;
                      }) => (
                        <div
                          key={room.id}
                          className='rounded-[10px] bg-[var(--white-background)] p-4 min-w-[650px]'
                        >
                          <h3 className='text-lg font-bold text-[var(--text-dark)] mb-3'>
                            {room.name}
                          </h3>
                          <div className='space-y-4'>
                            {room.trades?.map(trade => (
                              <SubContractorListCard
                                key={trade.id}
                                id={String(trade.id)}
                                name={trade.name}
                                dateRange={
                                  trade.dateRange || 'Mar 20 - Mar 23 (3D)'
                                }
                                laborCost={trade.laborCost || 0}
                                materialCost={trade.materialCost || 0}
                                tradeTotal={trade.tradeTotal || 0}
                                serviceCount={trade.services?.length || 0}
                                onClick={() => {
                                  // Find the actual trade data from tradeSidebarData
                                  const actualTrade = tradeSidebarData
                                    .flatMap(room => room.trades)
                                    .find(
                                      t =>
                                        t.id === trade.id ||
                                        t.uniqueKey === trade.id
                                    );

                                  if (actualTrade) {
                                    // Set the selected trade to show its details
                                    setSelectedTrade(actualTrade.id);
                                    setSelectedTradeUniqueKey(
                                      actualTrade.uniqueKey
                                    );
                                    setShowAddService(true);
                                    setShowServiceForm(false);
                                    setSelectedService(null);
                                    setSelectedSubContractor(null); // Clear sub contractor view
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : !showAddService ? (
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
                                onClick={() =>
                                  handleTradeSelect(trade.uniqueKey)
                                }
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
                      isDisabled={isReceivedTradeService}
                      isFromReceivedTrades={isReceivedTradeService}
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
                      _onTradeUpdate={handleTradeUpdate}
                      onTradeNameChange={handleTradeNameChange}
                      onTradeReplacement={handleTradeReplacement}
                      onServiceSelect={serviceId => {
                        handleServiceSelect(serviceId);
                      }}
                      onServiceReorder={handleServiceReorder}
                      onLocalStorageUpdate={() => {}}
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
        </div>
      </div>

      {/* Project Total and Submit Buttons - Outside the main box */}
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
          {isAuctionBidMode ? (
            <>
              <button
                onClick={() => setIsAuctionBidMode(false)}
                className='btn-secondary'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(
                    'Adding selected items for auction bid:',
                    Array.from(checkedItems)
                  );
                  // Trigger the add to out source trades
                  setTriggerAddToOutSource(true);
                  setIsAuctionBidMode(false);
                }}
                className='btn-primary'
              >
                Add for Auction Bid
              </button>
            </>
          ) : (
            <div className='flex gap-3'>
              {/* Save button hidden - will be triggered by form submission */}
            </div>
          )}
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
