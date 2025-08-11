'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { IconChevronDown } from '@tabler/icons-react';
import { Add, SidebarLeft } from 'iconsax-react';
import React from 'react';
import { ExpandAllIcon } from '../../icons/ExpandAllIcon';

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

interface EstimationBoxSidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  handleAddRoom: () => void;
  expandedRooms: string[];
  handleAccordionChange: (value: string[]) => void;
  rooms: Room[];
  handleRoomSelect: (roomId: string) => void;
  expandedTrades: string[];
  handleTradeAccordionChange: (value: string[]) => void;
  handleTradeSelect: (tradeId: string) => void;
  selectedService: string | null;
  handleServiceSelect: (serviceId: string) => void;
  formatCurrency: (amount: number) => string;
  selectedRoomId: string;
  isMainAccordionExpanded: boolean;
  toggleMainAccordion: () => void;
}

export const EstimationBoxSidebar: React.FC<EstimationBoxSidebarProps> = ({
  isSidebarCollapsed,
  toggleSidebar,
  handleAddRoom,
  expandedRooms,
  handleAccordionChange,
  rooms,
  handleRoomSelect,
  expandedTrades,
  handleTradeAccordionChange,
  handleTradeSelect,
  selectedService,
  handleServiceSelect,
  formatCurrency,
  selectedRoomId,
  isMainAccordionExpanded,
  toggleMainAccordion,
}) => {
  return (
    <div
      className={`bg-[var(--card-background)] border-r border-[var(--border-dark)] transition-all duration-300 ${
        isSidebarCollapsed ? 'w-14' : 'w-80'
      }`}
    >
      <div
        className={`border-b border-[var(--border-dark)] flex items-center gap-2 h-[75px] ${
          isSidebarCollapsed ? 'p-4' : 'p-4'
        }`}
      >
        <div
          className='cursor-pointer transition-colors'
          onClick={toggleSidebar}
        >
          <SidebarLeft
            size='24'
            color='var(--text-dark)'
            className={`transition-transform duration-300 origin-center ${
              isSidebarCollapsed
                ? '[&>path:last-child]:rotate-180 transition-transform duration-300 [&>path:last-child]:[transform-origin:14px_12px]'
                : ''
            }`}
          />
        </div>
        {!isSidebarCollapsed && (
          <Button
            className='btn-primary text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)] w-full'
            onClick={handleAddRoom}
          >
            <Add size='24' color='var(--secondary)' className='!h-6 !w-6' />
            Add Room&nbsp;/&nbsp;Project
          </Button>
        )}
      </div>

      {!isSidebarCollapsed && (
        <div className='h-[calc(100vh_-_200px)] overflow-y-auto px-4 py-2'>
          {/* View All / Collapse All Buttons */}
          <div className='flex items-center justify-between mb-2 px-2 py-2'>
            <button
              onClick={toggleMainAccordion}
              className='flex items-center gap-2 text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-all duration-200 ease-in-out hover:scale-105 active:scale-95'
            >
              <div className={`transition-transform`}>
                <ExpandAllIcon />
              </div>
              {isMainAccordionExpanded ? 'Collapse All' : 'View All'}
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMainAccordionExpanded
                ? 'max-h-[calc(100vh_-_250px)] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
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
                      className={`flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors hover:no-underline w-full ${
                        selectedRoomId === room.id
                          ? 'bg-[var(--card-hover)]'
                          : 'hover:bg-[var(--card-hover)]'
                      }`}
                      onClick={() => handleRoomSelect(room.id)}
                    >
                      <div className='flex items-center flex-1 min-w-0'>
                        <IconChevronDown
                          size={16}
                          className={`mr-2 transition-transform duration-200 ${
                            expandedRooms.includes(room.id) ? 'rotate-180' : ''
                          } ${
                            selectedRoomId === room.id
                              ? 'text-[var(--primary)]'
                              : 'text-[var(--text-dark)]'
                          }`}
                          strokeWidth={2}
                        />
                        <span
                          className={`font-medium text-sm truncate ${
                            selectedRoomId === room.id
                              ? 'text-[var(--primary)]'
                              : 'text-[var(--text-dark)]'
                          }`}
                        >
                          {room.name}
                        </span>
                        <span
                          className={`ml-auto text-xs font-semibold var(--text-dark)`}
                        >
                          {formatCurrency(room.total)}
                        </span>
                      </div>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                    {room.trades.length > 0 && (
                      <div className='ml-4 mt-1 animate-in slide-in-from-top-2 duration-200'>
                        <Accordion
                          type='multiple'
                          value={isMainAccordionExpanded ? expandedTrades : []}
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
                                  className={`flex items-center justify-between py-1 px-4 rounded cursor-pointer transition-colors hover:no-underline w-full `}
                                  onClick={() => handleTradeSelect(trade.id)}
                                >
                                  <div className='flex items-center flex-1 min-w-0'>
                                    <IconChevronDown
                                      size={16}
                                      className={`mr-2 transition-transform duration-200 ${
                                        expandedTrades.includes(trade.id)
                                          ? 'rotate-180'
                                          : ''
                                      } text-[var(--text-dark)]`}
                                    />
                                    <span className='text-sm font-medium text-[var(--text-dark)]'>
                                      {trade.name}
                                    </span>
                                    <span className='ml-auto text-xs font-semibold text-[var(--text-dark)]'>
                                      {formatCurrency(trade.tradeTotal)}
                                    </span>
                                  </div>
                                </AccordionPrimitive.Trigger>
                              </AccordionPrimitive.Header>
                              <AccordionContent className='px-0 pb-0 overflow-hidden transition-all duration-200 ease-in-out'>
                                {trade.serviceList.length > 0 && (
                                  <div className='ml-6 mt-1 animate-in slide-in-from-top-2 duration-200'>
                                    {trade.serviceList.map(service => (
                                      <div
                                        key={service.id}
                                        className={`flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-[var(--background)] group rounded-lg ${
                                          selectedService === service.id
                                            ? 'bg-[var(--background)]'
                                            : ''
                                        }`}
                                        onClick={() =>
                                          handleServiceSelect(service.id)
                                        }
                                      >
                                        <span
                                          className={`text-sm font-medium group-hover:text-[var(--primary)] ${
                                            selectedService === service.id
                                              ? 'text-[var(--primary)]'
                                              : 'text-[var(--text-dark)]'
                                          }`}
                                        >
                                          {service.name}
                                        </span>
                                        <span className='text-xs font-semibold text-[var(--text-dark)]'>
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
      )}
    </div>
  );
};
