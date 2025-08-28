'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { EstimationBoxSidebar } from '@/components/shared/common/EstimationBoxSidebar';
import EstimationHeader from '@/components/shared/common/EstimationHeader';
import { Tool } from '@/components/shared/forms/estimation-types';
import EstimationServiceForm from '@/components/shared/forms/EstimationServiceForm';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
// import { useToast } from '@/components/ui/use-toast';
import { CUSTOM_EVENTS, STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import {
  calculateJobTotal,
  calculateServiceTotal,
  calculateServiceTotalMaterialCost,
  calculateTradeTotal,
  MARKUP_TYPES,
} from '@/lib/estimation-calculations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NoDataFound from '../shared/common/NoDataFound';

interface Material {
  id: string;
  uuid?: string;
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
  uniqueKey: string; // Add unique generated key
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

interface EstimationBoxEditProps {
  _onClose: () => void;
  templateId: string; // Template ID is required for edit mode
  categoryId?: string; // Add category ID prop for filtering trades
  onSaveSuccess?: () => void; // Callback for successful save
}

// Helper function to generate unique keys
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

// Helper function to get storage key
const getStorageKey = (jobId?: string, templateId?: string) => {
  if (templateId) {
    return `template_rooms_${templateId}`;
  }
  if (jobId) {
    return `job_rooms_${jobId}`;
  }
  return 'template_rooms';
};

export default function EstimationBoxEdit({
  templateId,
  categoryId,
}: EstimationBoxEditProps) {
  // const { toast } = useToast();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedTradeUniqueKey, setSelectedTradeUniqueKey] = useState<
    string | null
  >(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'room' | 'trade' | 'service' | null
  >(null);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]); // Start with empty rooms for edit mode
  const [didInitialSync, setDidInitialSync] = useState(false);

  // Trades dropdown options from API
  const [tradeOptions, setTradeOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const selectedRoom = useMemo(() => {
    return (
      rooms.find(room => room.id === selectedRoomId) || rooms[0] || undefined
    );
  }, [rooms, selectedRoomId]);

  // Debug logging for rooms state

  // Find the trade data using uniqueKey to ensure room-specific selection
  const selectedTradeData = useMemo(() => {
    return selectedTradeUniqueKey
      ? rooms
          .flatMap(room => room.trades)
          .find(trade => trade.uniqueKey === selectedTradeUniqueKey)
      : selectedRoom?.trades.find(
          trade => trade.uniqueKey === selectedTradeUniqueKey
        );
  }, [rooms, selectedTradeUniqueKey, selectedRoom]);

  const selectedServiceData = useMemo(() => {
    const serviceData =
      selectedService && selectedTradeData
        ? selectedTradeData.serviceList.find(
            service => service.id === selectedService
          )
        : undefined;

    return serviceData;
  }, [selectedService, selectedTradeData]);

  // ===== Calculation helpers (mirrors create mode) =====
  const updateServiceCalculations = (service: Service): Service => {
    const serviceTotal = calculateServiceTotal(service.rate, service.qty);
    const materialCost = calculateServiceTotalMaterialCost(
      service.materials || [],
      service.finishes || []
    );
    return {
      ...service,
      lineTotal: serviceTotal,
      serviceTotal: serviceTotal,
      tradeTotal: serviceTotal + materialCost,
    };
  };

  const updateTradeCalculations = (trade: Trade): Trade => {
    const updatedServices = (trade.serviceList || []).map(
      updateServiceCalculations
    );
    const totals = calculateTradeTotal({
      markup_type: trade.markup_type || MARKUP_TYPES.FLAT_AMOUNT,
      markup: trade.markup || 0,
      services: updatedServices,
    });
    return {
      ...trade,
      serviceList: updatedServices,
      laborCost: totals.labor_cost,
      materialCost: totals.material_cost,
      tradeTotal: totals.trade_total,
    };
  };

  const updateRoomCalculations = (room: Room): Room => {
    const updatedTrades = (room.trades || []).map(updateTradeCalculations);
    const roomTotal = updatedTrades.reduce((sum, t) => sum + t.tradeTotal, 0);
    return { ...room, trades: updatedTrades, total: roomTotal };
  };

  const updateAllCalculations = (inputRooms: Room[]): Room[] => {
    return inputRooms.map(updateRoomCalculations);
  };

  const fetchTrades = async (companyUuid: string | null) => {
    try {
      const response = await apiService.fetchTradesPublic({
        page: 1,
        limit: 10,
        company_id: companyUuid || '',
        ...(categoryId && { category_id: categoryId }),
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
      const newCompanyRaw = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
      const newCompanyUuid = newCompanyRaw
        ? (() => {
            try {
              const parsed: { uuid?: string; id?: string | number } =
                JSON.parse(newCompanyRaw);
              return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
            } catch {
              return '';
            }
          })()
        : '';
      fetchTrades(newCompanyUuid);
    };

    window.addEventListener(
      CUSTOM_EVENTS.COMPANY_CHANGED,
      handleCompanyChanged
    );

    return () => {
      window.removeEventListener(
        CUSTOM_EVENTS.COMPANY_CHANGED,
        handleCompanyChanged
      );
    };
  }, [categoryId]); // Add categoryId as dependency

  // Save state whenever rooms change
  useEffect(() => {
    // Don't save if we're currently loading from storage
    if (isLoadingFromStorage) {
      return;
    }

    // Only save if rooms have actual content changes, not just re-render updates
    if (rooms.length > 0) {
      const storageKey = getStorageKey(undefined, templateId);
      const existingData = localStorage.getItem(storageKey);

      // Convert back to hybrid format for storage (keeping both formats)
      const hybridFormatData = rooms.map(room => ({
        // Your desired format
        room_name: room.name,
        trades: room.trades.map(trade => ({
          trade_id: trade.id,
          id: trade.id,
          uuid: trade.id,
          start_date: trade.start_date,
          end_date: trade.end_date,
          markup: trade.markup || 0,
          services: trade.serviceList.map(service => ({
            // Persist UUID when available; fallback to id for legacy items
            service_id: service.uuid || service.id,
            id: service.uuid || service.id,
            uuid: service.uuid || service.id,
            service_order_no: 1,
            description: service.name,
            qty: service.qty,
            rate: service.rate,
            materials: Array.isArray(service.materials)
              ? service.materials.map(m => ({
                  id: m.uuid || m.id,
                  uuid: m.uuid || m.id,
                  name: m.name,
                  variant: m.variant || '',
                  qty: m.qty,
                  unit: m.unit,
                  description: m.description,
                  rate: m.rate,
                  markup: m.markup || 0,
                  markup_type: m.markup_type || 'FLAT_AMOUNT',
                  lineTotal: m.lineTotal || 0,
                }))
              : [],
            finishes: Array.isArray(service.finishes)
              ? service.finishes.map(f => ({
                  id: f.uuid || f.id,
                  uuid: f.uuid || f.id,
                  name: f.name,
                  variant: f.variant || '',
                  qty: f.qty,
                  unit: f.unit,
                  description: f.description,
                  rate: f.rate,
                  markup: f.markup || 0,
                  markup_type: f.markup_type || 'FLAT_AMOUNT',
                  lineTotal: f.lineTotal || 0,
                }))
              : [],
            tools: Array.isArray(service.tools)
              ? service.tools.map(t => ({
                  id: t.uuid || t.id,
                  uuid: t.uuid || t.id,
                  name: t.name,
                  category: t.category || '',
                  description: t.description || '',
                  status: t.status || 'available',
                }))
              : [],
          })),
        })),
        // Extra fields for component functionality
        id: room.id,
        uniqueKey: room.uniqueKey,
        name: room.name,
        total: room.total,
        isExpanded: room.isExpanded,
      }));

      const newData = JSON.stringify(hybridFormatData);

      // Only save if the data has actually changed
      if (existingData !== newData) {
        localStorage.setItem(storageKey, newData);
        // Also save to regular template_rooms key for consistency
        localStorage.setItem('template_rooms', newData);
      }
    }
  }, [rooms, templateId, isLoadingFromStorage]);

  // Normalize trade names once trade options are available so UI shows correct names on load
  useEffect(() => {
    if (isLoadingFromStorage) return;
    if (tradeOptions.length === 0) return;
    if (rooms.length === 0) return;

    setRooms(prevRooms => {
      let hasAnyChange = false;
      const updatedRooms = prevRooms.map(room => {
        let roomChanged = false;
        const updatedTrades = room.trades.map(trade => {
          const matchedOption = tradeOptions.find(
            opt => opt.value === trade.id
          );
          if (matchedOption && trade.name !== matchedOption.label) {
            hasAnyChange = true;
            roomChanged = true;
            return { ...trade, name: matchedOption.label };
          }
          return trade;
        });
        return roomChanged ? { ...room, trades: updatedTrades } : room;
      });
      return hasAnyChange ? updatedRooms : prevRooms;
    });
  }, [tradeOptions, rooms.length, isLoadingFromStorage]);

  // Load initial data from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey(undefined, templateId);

    setIsLoadingFromStorage(true);

    let existingData = localStorage.getItem(storageKey);

    // If no data in template-specific key, try the regular template_rooms key as fallback
    if (!existingData) {
      const regularData = localStorage.getItem('template_rooms');
      if (regularData) {
        existingData = regularData;
      }
    }

    if (existingData) {
      try {
        const roomsData = JSON.parse(existingData);
        if (Array.isArray(roomsData) && roomsData.length > 0) {
          // Convert from hybrid format to EstimationBox format
          const sanitizedRoomsData = roomsData.map(
            (room: any, roomIndex: number) => ({
              id: String(roomIndex),
              uniqueKey: generateUniqueKey('room'),
              name: room.room_name || 'Room',
              total: 0,
              trades: (room.trades || []).map(
                (trade: any, tradeIndex: number) => ({
                  id: trade.trade_id || `trade_${Date.now()}`,
                  uniqueKey: generateUniqueKey(
                    'trade',
                    String(trade.trade_id || ''),
                    String(roomIndex),
                    tradeIndex
                  ),
                  name: trade.name || `Trade ${tradeIndex + 1}`,
                  services: trade.services?.length || 0,
                  start_date: trade.start_date || null,
                  end_date: trade.end_date || null,
                  type: 'default',
                  laborCost: 0,
                  materialCost: 0,
                  tradeTotal: 0,
                  serviceList: (trade.services || []).map(
                    (service: any, serviceIndex: number) => ({
                      id: service.service_id || `service_${serviceIndex}`,
                      uuid: service.service_id || `service_${serviceIndex}`,
                      name:
                        service.description || `Service ${serviceIndex + 1}`,
                      description: service.description || '',
                      qty: service.qty || 1,
                      rate: service.rate || 0,
                      lineTotal: 0,
                      serviceTotal: 0,
                      tradeTotal: 0,
                      serviceOptions: [],
                      materials: service.materials || [],
                      finishes: service.finishes || [],
                      tools: service.tools || [],
                      is_hidden: false,
                    })
                  ),
                  isExpanded: true,
                  startDate: trade.start_date
                    ? new Date(trade.start_date)
                    : undefined,
                  endDate: trade.end_date
                    ? new Date(trade.end_date)
                    : undefined,
                  markup: trade.markup || 0,
                  markup_type: 'FLAT_AMOUNT',
                })
              ),
              isExpanded: true,
            })
          );

          // Recalculate totals for loaded data before setting state
          const calculatedRooms = updateAllCalculations(sanitizedRoomsData);

          // Batch all state updates together to prevent cascading re-renders
          setRooms(calculatedRooms);
          setExpandedRooms(sanitizedRoomsData.map(room => room.id));
          setExpandedTrades(
            sanitizedRoomsData.flatMap(room =>
              room.trades.map((trade: Trade) => trade.uniqueKey)
            )
          );

          // Set the first room as selected
          const firstRoom = sanitizedRoomsData[0];
          if (firstRoom && firstRoom.id) {
            setSelectedRoomId(firstRoom.id);

            // Auto-select the first trade if available
            const firstTrade = firstRoom.trades && firstRoom.trades[0];
            if (firstTrade) {
              setSelectedTrade(firstTrade.id);
              setSelectedTradeUniqueKey(firstTrade.uniqueKey);

              // Auto-select the first service if available
              if (firstTrade.serviceList && firstTrade.serviceList.length > 0) {
                setSelectedService(firstTrade.serviceList[0].id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading template rooms data:', error);
      }
    }

    // Reset the loading flag after a short delay to allow state updates
    setTimeout(() => {
      setIsLoadingFromStorage(false);
    }, 100);
  }, [templateId]);

  // After initial load completes, trigger one save to ensure hybrid format is written
  useEffect(() => {
    if (!isLoadingFromStorage && rooms.length > 0 && !didInitialSync) {
      setDidInitialSync(true);
      // Trigger rooms change to invoke the save effect with hybrid format
      setRooms(prevRooms => [...prevRooms]);
    }
  }, [isLoadingFromStorage, rooms.length, didInitialSync]);

  // Rest of the component logic would be the same as EstimationBox
  // For brevity, I'll include the essential functions

  const addRoom = () => {
    const newRoom: Room = {
      id: String(rooms.length), // Use sequence number like EstimationBox
      uniqueKey: generateUniqueKey('room'),
      name: `Room ${rooms.length + 1}`,
      total: 0,
      trades: [],
      isExpanded: true,
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    setExpandedRooms(prev => [...prev, newRoom.id]);
    setSelectedRoomId(newRoom.id);
  };

  const deleteRoom = (roomId: string) => {
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    setRooms(updatedRooms);
    setExpandedRooms(prev => prev.filter(id => id !== roomId));

    if (selectedRoomId === roomId && updatedRooms.length > 0) {
      const firstUpdatedRoom = updatedRooms[0];
      if (firstUpdatedRoom && firstUpdatedRoom.id) {
        setSelectedRoomId(firstUpdatedRoom.id);
      }
    } else if (updatedRooms.length === 0) {
      setSelectedRoomId('');
    }
  };

  const addTrade = () => {
    if (!selectedRoom) return;

    // Use the UUID from the first trade option in the dropdown (like create mode)
    const defaultTradeOption = tradeOptions[0];
    if (!defaultTradeOption) {
      // Create a default trade if no options are available (silently)
      const newTrade: Trade = {
        id: 'default-trade',
        uniqueKey: generateUniqueKey(
          'trade',
          'default-trade',
          selectedRoom.id,
          selectedRoom.trades.length
        ),
        name: 'New Trade',
        services: 0,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        type: 'default',
        laborCost: 0,
        materialCost: 0,
        tradeTotal: 0,
        serviceList: [],
        isExpanded: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      };

      const updatedRooms = rooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, trades: [...room.trades, newTrade] }
          : room
      );

      setRooms(updatedRooms);
      setExpandedTrades(prev => [...prev, newTrade.uniqueKey]);
      setSelectedTradeUniqueKey(newTrade.uniqueKey);
      return;
    }

    const tradeUuid = defaultTradeOption.value; // This is the UUID from database
    const tradeName = defaultTradeOption.label; // This is the trade name

    const newTrade: Trade = {
      id: tradeUuid, // Use the UUID from database instead of generated ID
      uniqueKey: generateUniqueKey(
        'trade',
        tradeUuid,
        selectedRoom.id,
        selectedRoom.trades.length
      ),
      name: tradeName,
      services: 0,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      type: 'default',
      laborCost: 0,
      materialCost: 0,
      tradeTotal: 0,
      serviceList: [],
      isExpanded: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    };

    const updatedRooms = rooms.map(room =>
      room.id === selectedRoom.id
        ? { ...room, trades: [...room.trades, newTrade] }
        : room
    );

    setRooms(updatedRooms);
    setExpandedTrades(prev => [...prev, newTrade.uniqueKey]);
    setSelectedTradeUniqueKey(newTrade.uniqueKey);
  };

  const deleteTrade = (tradeUniqueKey: string) => {
    const updatedRooms = rooms.map(room => ({
      ...room,
      trades: room.trades.filter(trade => trade.uniqueKey !== tradeUniqueKey),
    }));

    setRooms(updatedRooms);
    setExpandedTrades(prev => prev.filter(key => key !== tradeUniqueKey));
    setSelectedTradeUniqueKey(null);
  };

  const handleTradeNameChange = (newTradeName: string) => {
    if (!selectedTradeUniqueKey) return;

    const updatedRooms = rooms.map(room => ({
      ...room,
      trades: room.trades.map(trade =>
        trade.uniqueKey === selectedTradeUniqueKey
          ? { ...trade, name: newTradeName }
          : trade
      ),
    }));

    setRooms(updatedRooms);
  };

  const handleTradeReplacement = (
    oldTradeUniqueKey: string,
    newTradeId: string,
    newTradeName: string
  ) => {
    const updatedRooms = rooms.map(room => ({
      ...room,
      trades: room.trades.map(trade =>
        trade.uniqueKey === oldTradeUniqueKey
          ? { ...trade, id: newTradeId, name: newTradeName }
          : trade
      ),
    }));

    setRooms(updatedRooms);
  };

  const handleServiceReorder = (reorderedServices: Service[]) => {
    if (!selectedTradeUniqueKey) return;

    const updatedRooms = rooms.map(room => ({
      ...room,
      trades: room.trades.map(trade =>
        trade.uniqueKey === selectedTradeUniqueKey
          ? { ...trade, serviceList: reorderedServices }
          : trade
      ),
    }));

    setRooms(updatedRooms);
  };

  // Handle trade updates (like date changes, markup changes, etc.)
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
    }
  };

  // Handle service updates
  const handleServiceUpdate = (updatedService: Service) => {
    if (selectedTrade && selectedService && selectedTradeUniqueKey) {
      setRooms(prev => {
        const updatedRooms = prev.map(room =>
          room.id === selectedRoomId
            ? updateRoomCalculations({
                ...room,
                trades: room.trades.map(trade =>
                  trade.uniqueKey === selectedTradeUniqueKey
                    ? updateTradeCalculations({
                        ...trade,
                        serviceList: trade.serviceList.map(service =>
                          service.id === selectedService
                            ? updatedService
                            : service
                        ),
                      })
                    : trade
                ),
              })
            : room
        );
        return updatedRooms;
      });
    }
  };

  // Material handlers
  const handleMaterialAdd = (newMaterial: any) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  const handleMaterialUpdate = (materialId: string, updatedMaterial: any) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  const handleMaterialDelete = (materialId: string) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  // Finish handlers
  const handleFinishAdd = (newFinish: any) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  const handleFinishUpdate = (finishId: string, updatedFinish: any) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
                          finish.id === finishId ? updatedFinish : finish
                        ),
                      }
                    : service
                ),
              }
            : trade
        ),
      }));
      setRooms(updatedRooms);
    }
  };

  const handleFinishDelete = (finishId: string) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  // Tool handlers
  const handleToolAdd = (newTool: any) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  const handleToolRemove = (toolId: string) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
        ...room,
        trades: room.trades.map(trade =>
          trade.uniqueKey === selectedTradeUniqueKey
            ? {
                ...trade,
                serviceList: trade.serviceList.map(service =>
                  service.id === selectedService
                    ? {
                        ...service,
                        tools: service.tools.filter(tool => tool.id !== toolId),
                      }
                    : service
                ),
              }
            : trade
        ),
      }));
      setRooms(updatedRooms);
    }
  };

  const handleToolReplace = (newTools: any[]) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
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
      }));
      setRooms(updatedRooms);
    }
  };

  // Service name change handler
  const handleServiceNameChange = (newName: string) => {
    if (selectedService && selectedTradeUniqueKey) {
      const updatedRooms = rooms.map(room => ({
        ...room,
        trades: room.trades.map(trade =>
          trade.uniqueKey === selectedTradeUniqueKey
            ? {
                ...trade,
                serviceList: trade.serviceList.map(service =>
                  service.id === selectedService
                    ? { ...service, name: newName }
                    : service
                ),
              }
            : trade
        ),
      }));
      setRooms(updatedRooms);
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
      setSelectedTrade(foundTrade.id);
      setSelectedTradeUniqueKey(foundTrade.uniqueKey);

      // Ensure the room is expanded
      if (!expandedRooms.includes(foundRoom.id)) {
        setExpandedRooms(prev => [...prev, foundRoom.id]);
      }

      // Ensure the trade accordion is expanded
      if (!expandedTrades.includes(foundTrade.uniqueKey)) {
        setExpandedTrades(prev => [...prev, foundTrade.uniqueKey]);
      }

      // Clear service selection when switching trades
      setSelectedService(null);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);

    // Clear trade and service selection when room is clicked
    setSelectedTrade(null);
    setSelectedTradeUniqueKey(null);
    setSelectedService(null);

    // Ensure the room is expanded
    if (!expandedRooms.includes(roomId)) {
      setExpandedRooms(prev => [...prev, roomId]);
    }
  };

  const handleServiceSelect = (serviceId: string, tradeUniqueKey?: string) => {
    // If a specific trade context is provided, scope the search to that trade
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
    }
  };

  const handleAddService = () => {
    // For now, just add a default service to the selected trade
    if (selectedTradeUniqueKey && selectedRoomId) {
      const newUuid =
        globalThis.crypto && 'randomUUID' in globalThis.crypto
          ? globalThis.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const newService = {
        id: newUuid,
        uuid: newUuid,
        name: 'New Service',
        description: '',
        qty: 1,
        rate: 0,
        lineTotal: 0,
        serviceTotal: 0,
        tradeTotal: 0,
        serviceOptions: [],
        materials: [],
        finishes: [],
        tools: [],
        is_hidden: false,
      };

      const updatedRooms = rooms.map(room =>
        room.id === selectedRoomId
          ? {
              ...room,
              trades: room.trades.map(trade =>
                trade.uniqueKey === selectedTradeUniqueKey
                  ? {
                      ...trade,
                      serviceList: [...trade.serviceList, newService],
                    }
                  : trade
              ),
            }
          : room
      );

      setRooms(updatedRooms);
      setSelectedService(newService.id);
    }
  };

  const handleLocalStorageUpdate = useCallback(() => {
    // Only update if not currently loading from storage
    if (!isLoadingFromStorage) {
      // Force a re-render by updating rooms state
      // Use a callback to ensure we're working with the latest state
      setRooms(prevRooms => [...prevRooms]);
    }
  }, [isLoadingFromStorage]);

  // Calculate totals - transform data structure to match calculateJobTotal expectations
  const transformedRooms = useMemo(() => {
    return rooms.map(room => ({
      ...room,
      trades: room.trades.map(trade => ({
        ...trade,
        services: (trade.serviceList || []).map(service => ({
          ...service,
          materials: Array.isArray(service.materials) ? service.materials : [],
          finishes: Array.isArray(service.finishes) ? service.finishes : [],
          tools: Array.isArray(service.tools) ? service.tools : [],
          serviceOptions: Array.isArray(service.serviceOptions)
            ? service.serviceOptions
            : [],
        })),
      })),
    }));
  }, [rooms]);

  // Calculate project total to show at bottom like create mode
  const projectTotals = useMemo(
    () => calculateJobTotal(transformedRooms),
    [transformedRooms]
  );
  const projectTotal = projectTotals.trade_total;

  // Header handlers to support inline room title edit like create mode
  const handleEditClick = () => {
    setEditingRoomName(selectedRoom?.name || '');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (!selectedRoom) return;
    setRooms(prev =>
      prev.map(room =>
        room.id === selectedRoom.id ? { ...room, name: editingRoomName } : room
      )
    );
    setIsEditing(false);
  };

  const handleRoomNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    }
  };

  const onDeleteClick = () => {
    if (selectedService) {
      setDeleteType('service');
    } else if (selectedTradeUniqueKey) {
      setDeleteType('trade');
    } else {
      setDeleteType('room');
    }
    setShowDeleteModal(true);
  };

  // Derive header UI state like create mode
  const showAddService = !!selectedTradeUniqueKey;
  const showServiceForm = !!selectedService;

  if (!selectedRoom || rooms.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <NoDataFound />
      </div>
    );
  }

  return (
    <div className='flex h-full bg-[var(--background)]'>
      {/* Left Sidebar */}
      <EstimationBoxSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        handleAddRoom={addRoom}
        expandedRooms={expandedRooms}
        handleAccordionChange={value => setExpandedRooms(value)}
        rooms={rooms}
        handleRoomSelect={handleRoomSelect}
        expandedTrades={expandedTrades}
        handleTradeAccordionChange={value => setExpandedTrades(value)}
        handleTradeSelect={handleTradeSelect}
        selectedService={selectedService}
        selectedTradeUniqueKey={selectedTradeUniqueKey}
        handleServiceSelect={(serviceId, tradeKey) => {
          if (tradeKey) {
            setSelectedTradeUniqueKey(tradeKey);
          }
          handleServiceSelect(serviceId, tradeKey);
        }}
        formatCurrency={amount =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
        }
        selectedRoomId={selectedRoomId}
        toggleMainAccordion={() => {
          const allRoomIds = rooms.map(room => room.id);
          const allTradeIds = rooms.flatMap(room =>
            room.trades.map(trade => trade.uniqueKey)
          );

          const allRoomsExpanded = allRoomIds.every(id =>
            expandedRooms.includes(id)
          );
          const allTradesExpanded = allTradeIds.every(id =>
            expandedTrades.includes(id)
          );
          const allExpanded = allRoomsExpanded && allTradesExpanded;

          if (allExpanded) {
            setExpandedTrades([]);
            setExpandedRooms([]);
          } else {
            setExpandedTrades(allTradeIds);
            setExpandedRooms(allRoomIds);
          }
        }}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
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
          handleAddTrade={addTrade}
          handleAddService={handleAddService}
          onDeleteClick={onDeleteClick}
        />

        {/* Trades Section */}
        <div className='flex-1 p-6'>
          {selectedService ? (
            // Service view - show service form inline
            selectedServiceData ? (
              <div className='space-y-4'>
                <EstimationServiceForm
                  key={`${selectedTradeData?.id || 'no-trade'}_${selectedService || 'no-service'}`}
                  service={selectedServiceData}
                  onServiceUpdate={handleServiceUpdate}
                  onAddMaterial={() => {}} // Add missing handler for material add button
                  onAddFinish={() => {}} // Add missing handler for finish add button
                  onServiceNameChange={handleServiceNameChange}
                  onMaterialAdd={handleMaterialAdd}
                  onFinishAdd={handleFinishAdd}
                  onMaterialUpdate={handleMaterialUpdate}
                  onMaterialDelete={handleMaterialDelete}
                  onFinishUpdate={handleFinishUpdate}
                  onFinishDelete={handleFinishDelete}
                  tools={selectedServiceData?.tools || []}
                  onAddTool={handleToolAdd}
                  onRemoveTool={handleToolRemove}
                  onReplaceTools={handleToolReplace}
                  roomName={selectedRoom?.name || 'Room'}
                  tradeName={selectedTradeData?.name || 'Trade'}
                  // Pass the DB UUID of the trade to drive the services API
                  tradeId={selectedTradeData?.id || undefined}
                />
              </div>
            ) : null
          ) : // Trade view - show ONLY the selected trade (like create mode)
          selectedTradeData ? (
            <div className='space-y-4'>
              <EstimationTradeForm
                key={selectedTradeData.uniqueKey}
                trade={selectedTradeData}
                roomUniqueKey={selectedRoom.uniqueKey}
                tradeUniqueKey={selectedTradeData.uniqueKey}
                _onTradeUpdate={handleTradeUpdate}
                onTradeNameChange={handleTradeNameChange}
                onTradeReplacement={handleTradeReplacement}
                onServiceSelect={handleServiceSelect}
                onServiceReorder={handleServiceReorder}
                tradeOptions={tradeOptions}
                onLocalStorageUpdate={handleLocalStorageUpdate}
              />
            </div>
          ) : (
            <div className='text-center py-12'>
              <NoDataFound
                title='No trade selected.'
                description='Please select a trade from the left sidebar.'
              />
            </div>
          )}
        </div>
        {/* Project Total (edit mode) */}
        <div className='p-6 py-3 bg-[var(--card-background)] border-t border-[var(--border-dark)] shadow-sm'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <h3 className='text-base font-semibold text-[var(--text-dark)]'>
                Project Total:
              </h3>
              <div className='h-10 w-[1px] bg-[var(--border-dark)]'></div>
              <span className='text-xl font-bold text-[var(--primary)]'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(projectTotal)}
              </span>
            </div>
            <div className='flex gap-3'></div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={() => {
          if (deleteType === 'room' && selectedRoomId) {
            deleteRoom(selectedRoomId);
          } else if (deleteType === 'trade' && selectedTradeUniqueKey) {
            deleteTrade(selectedTradeUniqueKey);
          } else if (
            deleteType === 'service' &&
            selectedService &&
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
          }
          setShowDeleteModal(false);
          setDeleteType(null);
        }}
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
              ? 'Are you sure you want to delete this trade? This will also delete all services within this trade.'
              : `Are you sure you want to delete "${selectedServiceData?.name || 'this service'}"? This action cannot be undone.`
        }
        archiveButtonText={'Delete'}
      />
    </div>
  );
}
