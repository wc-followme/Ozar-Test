'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { EstimationBoxSidebar } from '@/components/shared/common/EstimationBoxSidebar';
import EstimationHeader from '@/components/shared/common/EstimationHeader';
import { Tool } from '@/components/shared/forms/estimation-types';
import EstimationTradeForm from '@/components/shared/forms/EstimationTradeForm';
import { useToast } from '@/components/ui/use-toast';
import { CUSTOM_EVENTS, STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { calculateJobTotal } from '@/lib/estimation-calculations';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

interface EstimationBoxEditProps {
  _onClose: () => void;
  templateId: string; // Template ID is required for edit mode
  categoryId?: string; // Add category ID prop for filtering trades
  onSaveSuccess?: () => void; // Callback for successful save
}

// Helper function to generate unique keys
const generateUniqueKey = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
  _onClose,
  templateId,
  categoryId,
  onSaveSuccess,
}: EstimationBoxEditProps) {
  console.log('EstimationBoxEdit props:', {
    templateId,
    categoryId,
  });

  const { toast } = useToast();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedTradeUniqueKey, setSelectedTradeUniqueKey] = useState<
    string | null
  >(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'room' | 'trade' | 'service' | null
  >(null);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]); // Start with empty rooms for edit mode

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
  console.log('EstimationBoxEdit: Current rooms state:', rooms);
  console.log('EstimationBoxEdit: Selected room ID:', selectedRoomId);
  console.log('EstimationBoxEdit: Selected room:', selectedRoom);
  console.log('EstimationBoxEdit: Selected room trades:', selectedRoom?.trades);
  console.log(
    'EstimationBoxEdit: Selected room trades length:',
    selectedRoom?.trades?.length
  );

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
    return selectedService && selectedTradeData
      ? selectedTradeData.serviceList.find(
          service => service.id === selectedService
        )
      : undefined;
  }, [selectedService, selectedTradeData]);

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
      const newData = JSON.stringify(rooms);

      // Only save if the data has actually changed
      if (existingData !== newData) {
        localStorage.setItem(storageKey, newData);
      }
    }
  }, [rooms, templateId, isLoadingFromStorage]);

  // Load initial data from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey(undefined, templateId);
    console.log(
      'EstimationBoxEdit: Loading data with storage key:',
      storageKey
    );
    setIsLoadingFromStorage(true);

    const existingData = localStorage.getItem(storageKey);
    console.log(
      'EstimationBoxEdit: Found data in localStorage:',
      existingData ? 'yes' : 'no'
    );

    if (existingData) {
      try {
        const roomsData = JSON.parse(existingData);
        if (Array.isArray(roomsData) && roomsData.length > 0) {
          console.log('EstimationBoxEdit: Setting rooms data:', roomsData);

          // Ensure all trades have proper arrays
          const sanitizedRoomsData = roomsData.map(room => ({
            ...room,
            trades: room.trades.map((trade: any) => ({
              ...trade,
              serviceList: trade.serviceList || [],
            })),
          }));

          // Batch all state updates together to prevent cascading re-renders
          setRooms(sanitizedRoomsData);
          setExpandedRooms(sanitizedRoomsData.map(room => room.id));
          setExpandedTrades(
            sanitizedRoomsData.flatMap(room =>
              room.trades.map((trade: any) => trade.id)
            )
          );

          // Set the first room as selected
          if (sanitizedRoomsData.length > 0) {
            setSelectedRoomId(sanitizedRoomsData[0].id);
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

  // Rest of the component logic would be the same as EstimationBox
  // For brevity, I'll include the essential functions

  const addRoom = () => {
    const newRoom: Room = {
      id: String(rooms.length),
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
      setSelectedRoomId(updatedRooms[0].id);
    } else if (updatedRooms.length === 0) {
      setSelectedRoomId('');
    }
  };

  const addTrade = () => {
    if (!selectedRoom) return;

    const newTrade: Trade = {
      id: String(selectedRoom.trades.length),
      uniqueKey: generateUniqueKey('trade'),
      name: 'New Trade',
      services: 0,
      dateRange: '',
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
    setExpandedTrades(prev => [...prev, newTrade.id]);
    setSelectedTradeUniqueKey(newTrade.uniqueKey);
  };

  const deleteTrade = (tradeUniqueKey: string) => {
    const updatedRooms = rooms.map(room => ({
      ...room,
      trades: room.trades.filter(trade => trade.uniqueKey !== tradeUniqueKey),
    }));

    setRooms(updatedRooms);
    setExpandedTrades(prev => prev.filter(id => id !== tradeUniqueKey));
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

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowServiceForm(true);
  };

  const handleAddService = () => {
    setShowAddService(true);
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
        services: trade.serviceList || [], // Map serviceList to services
      })),
    }));
  }, [rooms]);

  const totalJobAmount = useMemo(() => {
    return calculateJobTotal(transformedRooms);
  }, [transformedRooms]);

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
        handleRoomSelect={setSelectedRoomId}
        expandedTrades={expandedTrades}
        handleTradeAccordionChange={value => setExpandedTrades(value)}
        handleTradeSelect={tradeUniqueKey =>
          setSelectedTradeUniqueKey(tradeUniqueKey)
        }
        selectedService={selectedService}
        handleServiceSelect={handleServiceSelect}
        formatCurrency={amount =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
        }
        selectedRoomId={selectedRoomId}
        toggleMainAccordion={() =>
          setIsMainAccordionExpanded(!isMainAccordionExpanded)
        }
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <EstimationHeader
          roomName={selectedRoom?.name || 'Room'}
          onBack={_onClose}
          totalAmount={selectedRoom?.total || 0}
        />

        {/* Trades Section */}
        <div className='flex-1 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold'>Trades</h2>
            <div className='flex items-center gap-2'>
              <button
                onClick={addTrade}
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                + Add Trade
              </button>
              {selectedRoom.trades.length > 0 && (
                <button
                  onClick={() => {
                    setDeleteType('trade');
                    setShowDeleteModal(true);
                  }}
                  className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          {selectedRoom.trades.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
              <div className='text-6xl mb-4'>📁❓</div>
              <p className='text-lg mb-2'>No trades added yet.</p>
              <p className='text-sm'>Click "+ Add Trade" to get started.</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {selectedRoom.trades.map(trade => (
                <EstimationTradeForm
                  key={trade.uniqueKey}
                  trade={trade}
                  roomUniqueKey={selectedRoom.uniqueKey}
                  tradeUniqueKey={trade.uniqueKey}
                  onTradeNameChange={handleTradeNameChange}
                  onTradeReplacement={handleTradeReplacement}
                  onServiceSelect={handleServiceSelect}
                  onAddService={handleAddService}
                  onServiceReorder={handleServiceReorder}
                  tradeOptions={tradeOptions}
                  // onLocalStorageUpdate={handleLocalStorageUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (deleteType === 'room' && selectedRoomId) {
            deleteRoom(selectedRoomId);
          } else if (deleteType === 'trade' && selectedTradeUniqueKey) {
            deleteTrade(selectedTradeUniqueKey);
          }
          setShowDeleteModal(false);
          setDeleteType(null);
        }}
        title={
          deleteType === 'room'
            ? `Are you sure you want to delete "${selectedRoom?.name}"? This will also delete all trades and services within this room.`
            : 'Are you sure you want to delete this trade? This will also delete all services within this trade.'
        }
      />
    </div>
  );
}
