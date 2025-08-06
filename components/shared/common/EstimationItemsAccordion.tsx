'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
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
}

export default function EstimationItemsAccordion({
  title,
  items,
  addButtonText,
  onAddItem,
  onItemUpdate,
  onItemDelete,
  defaultExpanded = true,
}: EstimationItemsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleItemUpdate = (itemId: string, updatedItem: EstimationItem) => {
    onItemUpdate(itemId, updatedItem);
  };

  const handleItemDelete = (itemId: string) => {
    onItemDelete(itemId);
  };

  return (
    <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
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
                  {title} - {items.length} services
                </h3>
              </div>
              <Button
                className='btn-primary !pl-3 !pr-5 !gap-1 text-base !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
                onClick={e => {
                  e.stopPropagation();
                  onAddItem();
                }}
              >
                <Add size='20' color='var(--secondary)' className='!h-5 !w-5' />
                {addButtonText}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className='border-t-2 border-[var(--border-dark)] mt-3'>
            <div className='space-y-4 mt-4'>
              {items.map(item => (
                <EstimationItemForm
                  key={item.id}
                  item={item}
                  onItemUpdate={updatedItem =>
                    handleItemUpdate(item.id, updatedItem)
                  }
                  onDelete={() => handleItemDelete(item.id)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
