'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Add, ArrowSquareDown } from 'iconsax-react';
import { useState } from 'react';
import EstimationItemForm from '../forms/EstimationItemForm';
import { EstimationItem } from '../forms/estimation-types';

interface EstimationItemsAccordionProps {
  title: string;
  items: EstimationItem[];
  addButtonText: string;
  onAddItem: () => void;
  onItemUpdate: (itemId: string, updatedItem: EstimationItem) => void;
  onItemDelete: (itemId: string) => void;
  defaultExpanded?: boolean;
  serviceId?: string | undefined; // Add service ID prop for fetching materials
  useFixedWidths?: boolean; // New prop to control fixed widths in EstimationItemForm
  containerWidthClass?: string; // New prop to control container width class
  cardWidthClass?: string; // New prop to control card width class
  borderClass?: string; // New prop to control border styling
  showAddButton?: boolean; // New prop to control add button visibility
  disableVariant?: boolean; // New prop to disable variant field in items
  isDisabled?: boolean; // New prop to disable all form fields
  isFromReceivedTrades?: boolean; // New prop to show Offer Rate instead of Markup
}

export default function EstimationItemsAccordion({
  title,
  items,
  addButtonText,
  onAddItem,
  onItemUpdate,
  onItemDelete,
  defaultExpanded = true,
  serviceId, // Add service ID prop
  useFixedWidths = true, // Default to true to maintain current behavior
  containerWidthClass = 'min-w-fit', // Default to just min-w-fit
  cardWidthClass = 'w-full min-w-max', // Default to w-full min-w-max
  borderClass = 'border-none', // Default to border-none
  showAddButton = true, // Default to true to maintain current behavior
  disableVariant = false,
  isDisabled = false,
  isFromReceivedTrades = false,
}: EstimationItemsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Build a stable, deterministic key for each item without using array index
  const getStableItemKey = (
    item: EstimationItem,
    listTitle: string,
    svcId?: string
  ): string => {
    const baseId =
      item.uuid ||
      (item as unknown as { material_id?: string }).material_id ||
      item.id;
    if (baseId) {
      return `${svcId || 'service'}_${listTitle}_${baseId}`;
    }
    const payload = `${svcId || 'service'}_${listTitle}_${JSON.stringify(item)}`;
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      // simple deterministic hash
      hash = (hash << 5) - hash + payload.charCodeAt(i);
      hash |= 0;
    }
    return `${svcId || 'service'}_${listTitle}_${Math.abs(hash)}`;
  };

  const handleItemUpdate = (itemId: string, updatedItem: EstimationItem) => {
    onItemUpdate(itemId, updatedItem);
  };

  const handleItemDelete = (itemId: string) => {
    onItemDelete(itemId);
  };

  return (
    <Card
      className={`p-4 rounded-[10px] bg-[var(--card-background)] ${borderClass} ${cardWidthClass}`}
    >
      <Accordion
        type='single'
        collapsible
        value={isExpanded ? 'items' : ''}
        onValueChange={value => setIsExpanded(value === 'items')}
      >
        <AccordionItem value='items' className='border-none'>
          <AccordionTrigger className='hover:no-underline py-0 [&>svg]:hidden'>
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center gap-2'>
                <ArrowSquareDown
                  size={20}
                  className={`transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  color='var(--text-dark)'
                />
                <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
                  {title} - {items.length}
                </h3>
              </div>
              {showAddButton && (
                <div
                  className='btn-primary !pl-3 !pr-5 w-32 !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)] inline-flex items-center justify-center !gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'
                  onClick={e => {
                    e.stopPropagation();
                    onAddItem();
                  }}
                >
                  <Add
                    size='20'
                    color='var(--secondary)'
                    className='!h-5 !w-5'
                  />
                  {addButtonText}
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className='border-t-2 border-[var(--border-dark)] mt-3'>
            {items.length > 0 ? (
              <div className='space-y-4 mt-4'>
                {items.map(item => (
                  <EstimationItemForm
                    key={getStableItemKey(item, title, serviceId)}
                    item={item}
                    onItemUpdate={updatedItem =>
                      handleItemUpdate(item.id, updatedItem)
                    }
                    onDelete={() => handleItemDelete(item.id)}
                    serviceId={serviceId}
                    useFixedWidths={useFixedWidths}
                    containerWidthClass={containerWidthClass}
                    disableVariant={disableVariant}
                    isDisabled={isDisabled}
                    isFromReceivedTrades={isFromReceivedTrades}
                  />
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-sm mt-4'>
                {(() => {
                  const lowered = title.trim().toLowerCase();
                  const noun =
                    lowered === 'material'
                      ? 'materials'
                      : lowered === 'finishes'
                        ? 'finishes'
                        : lowered;
                  return `No ${noun} added yet. Click "+ ${addButtonText}" to add ${noun}.`;
                })()}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
