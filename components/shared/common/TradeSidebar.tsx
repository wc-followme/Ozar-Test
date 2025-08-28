'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { tradeSidebarData } from '@/constants/dummy-data';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { IconChevronDown } from '@tabler/icons-react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { ExpandAllIcon } from '../../icons/ExpandAllIcon';

interface TradeSidebarProps {
  onRoomSelect: (room: any) => void;
  onTradeSelect: (trade: any) => void;
  onServiceSelect: (service: any) => void;
  selectedRoomId?: string;
  selectedTradeId?: string;
  selectedServiceId?: string;
  isAuctionBidMode?: boolean;
  onExitAuctionBidMode?: () => void;
  onCheckedItemsChange?: (checkedItems: Set<string>) => void;
  onAddToOutSourceTrades?: () => void;
  triggerAddToOutSource?: boolean;
  onSubContractorSelect?: (subContractor: any) => void;
}

const TradeSidebar = forwardRef<
  { addToOutSourceTrades: () => void },
  TradeSidebarProps
>(
  (
    {
      onRoomSelect,
      onTradeSelect,
      onServiceSelect,
      selectedRoomId,
      selectedTradeId,
      selectedServiceId,
      isAuctionBidMode = false,
      onExitAuctionBidMode,
      onCheckedItemsChange,
      onAddToOutSourceTrades,
      triggerAddToOutSource = false,
      onSubContractorSelect,
    },
    ref
  ) => {
    const [expandedRooms, setExpandedRooms] = React.useState<string[]>([
      'room_1',
    ]);
    const [expandedTrades, setExpandedTrades] = React.useState<string[]>([
      'trade_1_1',
    ]);
    const [isMainAccordionExpanded, setIsMainAccordionExpanded] =
      React.useState(true);
    const [checkedItems, setCheckedItems] = React.useState<Set<string>>(
      new Set()
    );
    const [outSourceTrades, setOutSourceTrades] = React.useState<any[]>([]);
    const [expandedOutSourceRooms, setExpandedOutSourceRooms] = React.useState<
      string[]
    >([]);
    const [expandedOutSourceTrades, setExpandedOutSourceTrades] =
      React.useState<string[]>([]);

    // Clear checked items and out source trades when exiting auction bid mode
    React.useEffect(() => {
      if (!isAuctionBidMode) {
        setCheckedItems(new Set());
        setOutSourceTrades([]); // Clear out source trades when exiting auction bid mode
      }
    }, [isAuctionBidMode]);

    // Notify parent of checked items changes
    React.useEffect(() => {
      if (onCheckedItemsChange) {
        onCheckedItemsChange(checkedItems);
      }
    }, [checkedItems, onCheckedItemsChange]);

    // Add selected items to out source trades
    const addToOutSourceTrades = () => {
      const selectedItems: any[] = [];

      // Get all selected rooms, trades, and services
      tradeSidebarData.forEach(room => {
        if (checkedItems.has(room.uniqueKey)) {
          // Add room and all its trades and services
          selectedItems.push({
            id: room.uniqueKey,
            name: room.name,
            type: 'room',
            value: room.total,
            parentId: null,
          });

          // Add all trades under this room
          room.trades.forEach(trade => {
            selectedItems.push({
              id: trade.uniqueKey,
              name: trade.name,
              type: 'trade',
              value: trade.tradeTotal,
              parentId: room.uniqueKey,
              parentName: room.name,
            });

            // Add all services under this trade
            trade.serviceList.forEach(service => {
              selectedItems.push({
                id: service.id,
                name: service.name,
                type: 'service',
                value: service.tradeTotal,
                parentId: trade.uniqueKey,
                parentName: trade.name,
                grandParentId: room.uniqueKey,
                grandParentName: room.name,
              });
            });
          });
        }

        room.trades.forEach(trade => {
          if (checkedItems.has(trade.uniqueKey)) {
            // Add trade and all its services
            selectedItems.push({
              id: trade.uniqueKey,
              name: trade.name,
              type: 'trade',
              value: trade.tradeTotal,
              parentId: room.uniqueKey,
              parentName: room.name,
            });

            // Add all services under this trade
            trade.serviceList.forEach(service => {
              selectedItems.push({
                id: service.id,
                name: service.name,
                type: 'service',
                value: service.tradeTotal,
                parentId: trade.uniqueKey,
                parentName: trade.name,
                grandParentId: room.uniqueKey,
                grandParentName: room.name,
              });
            });
          }

          trade.serviceList.forEach(service => {
            if (checkedItems.has(service.id)) {
              // Add service and its parent trade and room
              selectedItems.push({
                id: service.id,
                name: service.name,
                type: 'service',
                value: service.tradeTotal,
                parentId: trade.uniqueKey,
                parentName: trade.name,
                grandParentId: room.uniqueKey,
                grandParentName: room.name,
              });

              // Add parent trade if not already added
              if (!checkedItems.has(trade.uniqueKey)) {
                selectedItems.push({
                  id: trade.uniqueKey,
                  name: trade.name,
                  type: 'trade',
                  value: trade.tradeTotal,
                  parentId: room.uniqueKey,
                  parentName: room.name,
                });
              }

              // Add parent room if not already added
              if (!checkedItems.has(room.uniqueKey)) {
                selectedItems.push({
                  id: room.uniqueKey,
                  name: room.name,
                  type: 'room',
                  value: room.total,
                  parentId: null,
                });
              }
            }
          });
        });
      });

      // Remove duplicates based on id
      const uniqueItems = selectedItems.filter(
        (item, index, self) => index === self.findIndex(t => t.id === item.id)
      );

      // Add to out source trades
      setOutSourceTrades(prev => [...prev, ...uniqueItems]);

      // Clear checked items
      setCheckedItems(new Set());

      console.log('Added to Out Source Trades:', uniqueItems);
    };

    // Call parent function when adding to out source trades
    React.useEffect(() => {
      if (onAddToOutSourceTrades && outSourceTrades.length > 0) {
        onAddToOutSourceTrades();
      }
    }, [outSourceTrades, onAddToOutSourceTrades]);

    // Function to clear out source trades
    const clearOutSourceTrades = () => {
      setOutSourceTrades([]);
      setExpandedOutSourceRooms([]);
      setExpandedOutSourceTrades([]);
    };

    // Expose functions to parent component
    useImperativeHandle(ref, () => ({
      addToOutSourceTrades,
      clearOutSourceTrades,
    }));

    // Handle trigger to add items to out source trades
    React.useEffect(() => {
      if (triggerAddToOutSource && checkedItems.size > 0) {
        addToOutSourceTrades();
      }
    }, [triggerAddToOutSource, checkedItems.size]);

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

    const handleOutSourceRoomAccordionChange = (value: string[]) => {
      setExpandedOutSourceRooms(value);
    };

    const handleOutSourceTradeAccordionChange = (value: string[]) => {
      setExpandedOutSourceTrades(value);
    };

    const toggleMainAccordion = () => {
      const allRoomIds = tradeSidebarData.map(room => room.uniqueKey);
      const allTradeIds = tradeSidebarData.flatMap(room =>
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
        setIsMainAccordionExpanded(false);
      } else {
        setExpandedTrades(allTradeIds);
        setExpandedRooms(allRoomIds);
        setIsMainAccordionExpanded(true);
      }
    };

    const handleCheckboxChange = (itemId: string, checked: boolean) => {
      const newCheckedItems = new Set(checkedItems);
      if (checked) {
        newCheckedItems.add(itemId);
      } else {
        newCheckedItems.delete(itemId);
      }
      setCheckedItems(newCheckedItems);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    return (
      <div className='w-80 bg-[var(--card-background)] border-r border-[var(--border-dark)]'>
        <div className='h-[calc(100vh_-_120px)] overflow-y-auto px-4 py-2'>
          {/* Title */}
          <div className='mb-4 px-2'>
            <h2 className="font-['Inter'] font-medium text-[12px] leading-[100%] text-[var(--text-secondary)]">
              My Trades
            </h2>
          </div>

          {/* View All / Collapse All Buttons */}
          <div className='flex items-center justify-between mb-2 px-2 py-2'>
            <div className='flex items-center gap-2'>
              <button
                onClick={toggleMainAccordion}
                className='flex items-center gap-2 text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-all duration-200 ease-in-out'
              >
                <div className={`transition-transform`}>
                  <ExpandAllIcon />
                </div>
                {(() => {
                  // Check if there are any rooms
                  if (tradeSidebarData.length === 0) return 'No Rooms';

                  const allRoomIds = tradeSidebarData.map(
                    room => room.uniqueKey
                  );
                  const allTradeIds = tradeSidebarData.flatMap(room =>
                    room.trades.map(trade => trade.uniqueKey)
                  );

                  // Check if all rooms are expanded
                  const allRoomsExpanded =
                    allRoomIds.length > 0 &&
                    allRoomIds.every(id => expandedRooms.includes(id));

                  // Check if all trades are expanded (only if there are trades)
                  const allTradesExpanded =
                    allTradeIds.length === 0 ||
                    allTradeIds.every(id => expandedTrades.includes(id));

                  // Both rooms and trades must be expanded to show "Collapse All"
                  const allExpanded = allRoomsExpanded && allTradesExpanded;

                  return allExpanded ? 'Collapse All' : 'Expand All';
                })()}
              </button>
            </div>
          </div>

          <Accordion
            type='multiple'
            value={expandedRooms}
            onValueChange={handleAccordionChange}
            className='w-full'
          >
            {tradeSidebarData.map(room => (
              <AccordionItem
                key={room.uniqueKey}
                value={room.uniqueKey}
                className='border-none'
              >
                <AccordionPrimitive.Header className='flex'>
                  <AccordionPrimitive.Trigger
                    className={`flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors hover:no-underline w-full ${
                      selectedRoomId === room.uniqueKey
                        ? 'bg-[var(--card-hover)]'
                        : 'hover:bg-[var(--card-hover)]'
                    }`}
                    onClick={() => onRoomSelect(room)}
                  >
                    <div className='flex items-center flex-1 min-w-0'>
                      <IconChevronDown
                        size={16}
                        className={`mr-2 transition-transform duration-200 ${
                          expandedRooms.includes(room.uniqueKey)
                            ? 'rotate-180'
                            : ''
                        } ${
                          selectedRoomId === room.uniqueKey
                            ? 'text-[var(--primary)]'
                            : 'text-[var(--text-dark)]'
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={`font-medium text-sm truncate ${
                          selectedRoomId === room.uniqueKey
                            ? 'text-[var(--primary)]'
                            : 'text-[var(--text-dark)]'
                        }`}
                      >
                        {room.name}
                      </span>
                      <div
                        className={`ml-auto text-xs font-semibold flex items-center gap-2 var(--text-dark)`}
                      >
                        {formatCurrency(room.total)}
                        {isAuctionBidMode && (
                          <Checkbox
                            checked={checkedItems.has(room.uniqueKey)}
                            onCheckedChange={checked =>
                              handleCheckboxChange(
                                room.uniqueKey,
                                checked as boolean
                              )
                            }
                            className='
            rounded-[6px] 
            border-2 
            border-[var(--dark-border-other)]
            data-[state=checked]:bg-[--primary]
            data-[state=checked]:border-[--primary]
            data-[state=checked]:text-white
            text-white 
            w-5 h-5
            flex items-center justify-center -mt-0.4
          '
                            onClick={e => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                  {room.trades.length > 0 && (
                    <div className='ml-4 mt-1 animate-in slide-in-from-top-2 duration-200'>
                      <Accordion
                        type='multiple'
                        value={expandedTrades}
                        onValueChange={handleTradeAccordionChange}
                        className='w-full'
                      >
                        {room.trades.map(trade => (
                          <AccordionItem
                            key={`${room.uniqueKey}_${trade.uniqueKey}`}
                            value={trade.uniqueKey}
                            className='border-none'
                          >
                            <AccordionPrimitive.Header className='flex'>
                              <AccordionPrimitive.Trigger
                                className={`flex items-center justify-between py-1 px-4 rounded cursor-pointer transition-colors hover:no-underline w-full `}
                                onClick={() => onTradeSelect(trade)}
                              >
                                <div className='flex items-center flex-1 min-w-0'>
                                  <IconChevronDown
                                    size={16}
                                    className={`mr-2 transition-transform duration-200 ${
                                      expandedTrades.includes(trade.uniqueKey)
                                        ? 'rotate-180'
                                        : ''
                                    } text-[var(--text-dark)]`}
                                  />
                                  <span className='text-sm font-medium text-[var(--text-dark)]'>
                                    {trade.name}
                                  </span>
                                  <div className='ml-auto text-xs font-semibold text-[var(--text-dark)] flex items-center gap-2'>
                                    {formatCurrency(trade.tradeTotal)}
                                    {isAuctionBidMode && (
                                      <Checkbox
                                        checked={checkedItems.has(
                                          trade.uniqueKey
                                        )}
                                        onCheckedChange={checked =>
                                          handleCheckboxChange(
                                            trade.uniqueKey,
                                            checked as boolean
                                          )
                                        }
                                        className='
            rounded-[6px] 
            border-2 
            border-[var(--dark-border-other)]
            data-[state=checked]:bg-[--primary]
            data-[state=checked]:border-[--primary]
            data-[state=checked]:text-white
            text-white 
            w-5 h-5
            flex items-center justify-center -mt-0.4'
                                        onClick={e => e.stopPropagation()}
                                      />
                                    )}
                                  </div>
                                </div>
                              </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                              {trade.serviceList.length > 0 && (
                                <div className='ml-6 mt-1 animate-in slide-in-from-top-2 duration-200'>
                                  {trade.serviceList.map(service => (
                                    <div
                                      key={`${room.uniqueKey}_${trade.uniqueKey}_${service.id}`}
                                      className={`flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-[var(--background)] group rounded-lg ${
                                        selectedServiceId === service.id
                                          ? 'bg-[var(--background)]'
                                          : ''
                                      }`}
                                      onClick={() => onServiceSelect(service)}
                                    >
                                      <span
                                        className={`text-sm font-medium group-hover:text-[var(--primary)] ${
                                          selectedServiceId === service.id
                                            ? 'text-[var(--primary)]'
                                            : 'text-[var(--text-dark)]'
                                        }`}
                                      >
                                        {service.name}
                                      </span>
                                      <div className='text-xs font-semibold text-[var(--text-dark)] flex items-center gap-2'>
                                        {formatCurrency(service.tradeTotal)}
                                        {isAuctionBidMode && (
                                          <Checkbox
                                            checked={checkedItems.has(
                                              service.id
                                            )}
                                            onCheckedChange={checked =>
                                              handleCheckboxChange(
                                                service.id,
                                                checked as boolean
                                              )
                                            }
                                            className='
            rounded-[6px] 
            border-2 
            border-[var(--dark-border-other)]
            data-[state=checked]:bg-[--primary]
            data-[state=checked]:border-[--primary]
            data-[state=checked]:text-white
            text-white 
            w-5 h-5
            flex items-center justify-center -mt-0.4'
                                            onClick={e => e.stopPropagation()}
                                          />
                                        )}
                                      </div>
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

          {/* Out Source Trades Section */}
          {outSourceTrades.length > 0 && (
            <>
              {/* Divider */}
              <div className='border-t border-[var(--border-dark)] my-4'></div>

              {/* Out Source Trades Title */}
              <div className='mb-4 px-2'>
                <h2 className="font-['Inter'] font-medium text-[12px] leading-[100%] text-[var(--text-secondary)]">
                  Out Source Trades
                </h2>
              </div>

              {/* Out Source Trades Accordion */}
              <Accordion
                type='multiple'
                value={expandedOutSourceRooms}
                onValueChange={handleOutSourceRoomAccordionChange}
                className='w-full'
              >
                {(() => {
                  // Define types for the grouped structure
                  interface GroupedService {
                    id: string;
                    name: string;
                    type: string;
                    value: number;
                    parentId: string;
                    parentName: string;
                    grandParentId: string;
                    grandParentName: string;
                  }

                  interface GroupedTrade {
                    id: string;
                    name: string;
                    type: string;
                    value: number;
                    parentId: string;
                    parentName: string;
                    services: GroupedService[];
                  }

                  interface GroupedRoom {
                    id: string;
                    name: string;
                    type: string;
                    value: number;
                    parentId: string | null;
                    trades: Map<string, GroupedTrade>;
                  }

                  // Group items by room
                  const roomsMap = new Map<string, GroupedRoom>();
                  outSourceTrades.forEach(item => {
                    if (item.type === 'room') {
                      if (!roomsMap.has(item.id)) {
                        roomsMap.set(item.id, {
                          ...item,
                          trades: new Map(),
                        });
                      }
                    } else if (item.type === 'trade') {
                      const roomId = item.parentId;
                      if (!roomsMap.has(roomId)) {
                        roomsMap.set(roomId, {
                          id: roomId,
                          name: item.parentName,
                          type: 'room',
                          value: 0,
                          parentId: null,
                          trades: new Map(),
                        });
                      }
                      if (!roomsMap.get(roomId)!.trades.has(item.id)) {
                        roomsMap.get(roomId)!.trades.set(item.id, {
                          ...item,
                          services: [],
                        });
                      }
                    } else if (item.type === 'service') {
                      const roomId = item.grandParentId;
                      const tradeId = item.parentId;
                      if (!roomsMap.has(roomId)) {
                        roomsMap.set(roomId, {
                          id: roomId,
                          name: item.grandParentName,
                          type: 'room',
                          value: 0,
                          parentId: null,
                          trades: new Map(),
                        });
                      }
                      if (!roomsMap.get(roomId)!.trades.has(tradeId)) {
                        roomsMap.get(roomId)!.trades.set(tradeId, {
                          id: tradeId,
                          name: item.parentName,
                          type: 'trade',
                          value: 0,
                          parentId: roomId,
                          parentName: item.grandParentName,
                          services: [],
                        });
                      }
                      roomsMap
                        .get(roomId)!
                        .trades.get(tradeId)!
                        .services.push(item as GroupedService);
                    }
                  });

                  return Array.from(roomsMap.values()).map(room => (
                    <AccordionItem
                      key={room.id}
                      value={room.id}
                      className='border-none'
                    >
                      <AccordionPrimitive.Header className='flex'>
                        <AccordionPrimitive.Trigger className='flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors hover:no-underline w-full hover:bg-[var(--card-hover)]'>
                          <div className='flex items-center flex-1 min-w-0'>
                            <IconChevronDown
                              size={16}
                              className={`mr-2 transition-transform duration-200 ${
                                expandedOutSourceRooms.includes(room.id)
                                  ? 'rotate-180'
                                  : ''
                              } text-[var(--text-dark)]`}
                              strokeWidth={2}
                            />
                            <span className='text-sm font-semibold text-[var(--text-dark)] truncate'>
                              {room.name}
                            </span>
                          </div>
                          <div className='text-xs font-semibold text-[var(--text-dark)]'>
                            {formatCurrency(room.value)}
                          </div>
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                        {Array.from(room.trades.values()).length > 0 && (
                          <div className='ml-4 mt-1 animate-in slide-in-from-top-2 duration-200'>
                            <Accordion
                              type='multiple'
                              value={expandedOutSourceTrades}
                              onValueChange={
                                handleOutSourceTradeAccordionChange
                              }
                              className='w-full'
                            >
                              {Array.from(room.trades.values()).map(
                                (trade: GroupedTrade) => (
                                  <AccordionItem
                                    key={trade.id}
                                    value={trade.id}
                                    className='border-none'
                                  >
                                    <AccordionPrimitive.Header className='flex'>
                                      <AccordionPrimitive.Trigger className='flex items-center justify-between py-1 px-4 rounded cursor-pointer transition-colors hover:no-underline w-full hover:bg-[var(--card-hover)]'>
                                        <div className='flex items-center flex-1 min-w-0'>
                                          <IconChevronDown
                                            size={16}
                                            className={`mr-2 transition-transform duration-200 ${
                                              expandedOutSourceTrades.includes(
                                                trade.id
                                              )
                                                ? 'rotate-180'
                                                : ''
                                            } text-[var(--text-dark)]`}
                                            strokeWidth={2}
                                          />
                                          <span className='text-sm font-medium text-[var(--text-dark)] truncate'>
                                            {trade.name}
                                          </span>
                                        </div>
                                        <div className='text-xs font-semibold text-[var(--text-dark)]'>
                                          {formatCurrency(trade.value)}
                                        </div>
                                      </AccordionPrimitive.Trigger>
                                    </AccordionPrimitive.Header>
                                    <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                                      {trade.services.length > 0 && (
                                        <div className='ml-6 mt-1 animate-in slide-in-from-top-2 duration-200'>
                                          {trade.services.map(
                                            (service: GroupedService) => (
                                              <div
                                                key={service.id}
                                                className='flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-[var(--background)] group rounded-lg'
                                              >
                                                <span className='text-sm font-medium group-hover:text-[var(--primary)] text-[var(--text-dark)]'>
                                                  {service.name}
                                                </span>
                                                <div className='text-xs font-semibold text-[var(--text-dark)]'>
                                                  {formatCurrency(
                                                    service.value
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                )
                              )}
                            </Accordion>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ));
                })()}
              </Accordion>
            </>
          )}

          {/* Received Trades Section */}
          {outSourceTrades.length > 0 && (
            <>
              {/* Divider */}
              <div className='border-t border-[var(--border-dark)] my-4'></div>

              {/* Received Trades Title */}
              <div className='mb-4 px-2'>
                <h2 className="font-['Inter'] font-medium text-[12px] leading-[100%] text-[var(--text-secondary)]">
                  Received Trades
                </h2>
              </div>

              {/* Received Trades Accordion - Dynamic from outSourceTrades */}
              <Accordion type='multiple' className='w-full'>
                {/* Sub Contractor 1 - Using actual selected data */}
                <AccordionItem
                  key='sub_contractor_1'
                  value='sub_contractor_1'
                  className='border-none'
                >
                  <AccordionPrimitive.Header className='flex'>
                    <AccordionPrimitive.Trigger
                      className='flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors hover:no-underline w-full hover:bg-[var(--card-hover)]'
                      onClick={() => {
                        if (onSubContractorSelect) {
                          // Create sub contractor data from outSourceTrades
                          const subContractorData = {
                            id: 'sub_contractor_1',
                            name: 'Sub Contractor 1',
                            companyName: 'Company Name',
                            total: outSourceTrades.reduce(
                              (sum, item) => sum + item.value,
                              0
                            ),
                            rooms: (() => {
                              // Group items by room from outSourceTrades
                              const roomsMap = new Map<string, any>();

                              outSourceTrades.forEach(item => {
                                if (item.type === 'room') {
                                  if (!roomsMap.has(item.id)) {
                                    roomsMap.set(item.id, {
                                      ...item,
                                      trades: new Map(),
                                    });
                                  }
                                } else if (item.type === 'trade') {
                                  const roomId = item.parentId;
                                  if (!roomsMap.has(roomId)) {
                                    roomsMap.set(roomId, {
                                      id: roomId,
                                      name: item.parentName,
                                      type: 'room',
                                      value: 0,
                                      parentId: null,
                                      trades: new Map(),
                                    });
                                  }
                                  if (
                                    !roomsMap.get(roomId)!.trades.has(item.id)
                                  ) {
                                    roomsMap.get(roomId)!.trades.set(item.id, {
                                      ...item,
                                      services: [],
                                    });
                                  }
                                } else if (item.type === 'service') {
                                  const roomId = item.grandParentId;
                                  const tradeId = item.parentId;
                                  if (!roomsMap.has(roomId)) {
                                    roomsMap.set(roomId, {
                                      id: roomId,
                                      name: item.grandParentName,
                                      type: 'room',
                                      value: 0,
                                      parentId: null,
                                      trades: new Map(),
                                    });
                                  }
                                  if (
                                    !roomsMap.get(roomId)!.trades.has(tradeId)
                                  ) {
                                    roomsMap.get(roomId)!.trades.set(tradeId, {
                                      id: tradeId,
                                      name: item.parentName,
                                      type: 'trade',
                                      value: 0,
                                      parentId: roomId,
                                      parentName: item.grandParentName,
                                      services: [],
                                    });
                                  }
                                  roomsMap
                                    .get(roomId)!
                                    .trades.get(tradeId)!
                                    .services.push(item);
                                }
                              });

                              return Array.from(roomsMap.values()).map(
                                room => ({
                                  ...room,
                                  trades: Array.from(room.trades.values()),
                                })
                              );
                            })(),
                          };
                          onSubContractorSelect(subContractorData);
                        }
                      }}
                    >
                      <div className='flex items-center flex-1 min-w-0'>
                        <IconChevronDown
                          size={16}
                          className='mr-2 transition-transform duration-200 text-[var(--text-dark)]'
                          strokeWidth={2}
                        />
                        <span className='text-sm font-semibold text-[var(--text-dark)] truncate'>
                          Sub Contractor 1
                        </span>
                      </div>
                      <div className='text-xs font-semibold text-[var(--text-dark)]'>
                        {(() => {
                          // Calculate total from selected items
                          const total = outSourceTrades.reduce(
                            (sum, item) => sum + item.value,
                            0
                          );
                          return formatCurrency(total);
                        })()}
                      </div>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                    {/* Dynamic Room Accordions from selected data */}
                    <div className='ml-4 mt-1'>
                      {(() => {
                        // Group items by room from outSourceTrades
                        const roomsMap = new Map<string, any>();

                        outSourceTrades.forEach(item => {
                          if (item.type === 'room') {
                            if (!roomsMap.has(item.id)) {
                              roomsMap.set(item.id, {
                                ...item,
                                trades: new Map(),
                              });
                            }
                          } else if (item.type === 'trade') {
                            const roomId = item.parentId;
                            if (!roomsMap.has(roomId)) {
                              roomsMap.set(roomId, {
                                id: roomId,
                                name: item.parentName,
                                type: 'room',
                                value: 0,
                                parentId: null,
                                trades: new Map(),
                              });
                            }
                            if (!roomsMap.get(roomId)!.trades.has(item.id)) {
                              roomsMap.get(roomId)!.trades.set(item.id, {
                                ...item,
                                services: [],
                              });
                            }
                          } else if (item.type === 'service') {
                            const roomId = item.grandParentId;
                            const tradeId = item.parentId;
                            if (!roomsMap.has(roomId)) {
                              roomsMap.set(roomId, {
                                id: roomId,
                                name: item.grandParentName,
                                type: 'room',
                                value: 0,
                                parentId: null,
                                trades: new Map(),
                              });
                            }
                            if (!roomsMap.get(roomId)!.trades.has(tradeId)) {
                              roomsMap.get(roomId)!.trades.set(tradeId, {
                                id: tradeId,
                                name: item.parentName,
                                type: 'trade',
                                value: 0,
                                parentId: roomId,
                                parentName: item.grandParentName,
                                services: [],
                              });
                            }
                            roomsMap
                              .get(roomId)!
                              .trades.get(tradeId)!
                              .services.push(item);
                          }
                        });

                        return Array.from(roomsMap.values()).map(room => (
                          <AccordionItem
                            key={`received_${room.id}`}
                            value={`received_${room.id}`}
                            className='border-none'
                          >
                            <AccordionPrimitive.Header className='flex'>
                              <AccordionPrimitive.Trigger className='flex items-center justify-between py-2 px-4 rounded cursor-pointer transition-colors hover:no-underline w-full hover:bg-[var(--card-hover)]'>
                                <div className='flex items-center flex-1 min-w-0'>
                                  <IconChevronDown
                                    size={16}
                                    className='mr-2 transition-transform duration-200 text-[var(--text-dark)]'
                                    strokeWidth={2}
                                  />
                                  <span className='text-sm font-medium text-[var(--text-dark)] truncate'>
                                    {room.name}
                                  </span>
                                </div>
                                <div className='text-xs font-semibold text-[var(--text-dark)]'>
                                  {formatCurrency(room.value)}
                                </div>
                              </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                              {/* Dynamic Trade Accordions from selected data */}
                              <div className='ml-4 mt-1'>
                                <Accordion type='multiple' className='w-full'>
                                  {Array.from(room.trades.values()).map(
                                    (trade: any) => (
                                      <AccordionItem
                                        key={`received_${trade.id}`}
                                        value={`received_${trade.id}`}
                                        className='border-none'
                                      >
                                        <AccordionPrimitive.Header className='flex'>
                                          <AccordionPrimitive.Trigger className='flex items-center justify-between py-1 px-4 rounded cursor-pointer transition-colors hover:no-underline w-full hover:bg-[var(--card-hover)]'>
                                            <div className='flex items-center flex-1 min-w-0'>
                                              <IconChevronDown
                                                size={16}
                                                className='mr-2 transition-transform duration-200 text-[var(--text-dark)]'
                                                strokeWidth={2}
                                              />
                                              <span className='text-sm font-medium text-[var(--text-dark)] truncate'>
                                                {trade.name}
                                              </span>
                                            </div>
                                            <div className='text-xs font-semibold text-[var(--text-dark)]'>
                                              {formatCurrency(trade.value)}
                                            </div>
                                          </AccordionPrimitive.Trigger>
                                        </AccordionPrimitive.Header>
                                        <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                                          {/* Dynamic Services from selected data */}
                                          {trade.services.length > 0 && (
                                            <div className='ml-6 mt-1'>
                                              {trade.services.map(
                                                (service: any) => (
                                                  <div
                                                    key={`received_${service.id}`}
                                                    className='flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-[var(--background)] group rounded-lg'
                                                  >
                                                    <span className='text-sm font-medium group-hover:text-[var(--primary)] text-[var(--text-dark)]'>
                                                      {service.name}
                                                    </span>
                                                    <div className='text-xs font-semibold text-[var(--text-dark)]'>
                                                      {formatCurrency(
                                                        service.value
                                                      )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </AccordionContent>
                                      </AccordionItem>
                                    )
                                  )}
                                </Accordion>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ));
                      })()}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default TradeSidebar;
