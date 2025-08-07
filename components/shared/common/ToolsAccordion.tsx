'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Add, ArrowSquareDown, CloseCircle } from 'iconsax-react';
import { useState } from 'react';
import AddToolListForm from '../forms/AddToolListForm';
import SideSheet from './SideSheet';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

interface ToolsAccordionProps {
  title: string;
  tools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
  defaultExpanded?: boolean;
  roomName?: string;
  tradeName?: string;
  serviceName?: string;
}

export default function ToolsAccordion({
  title,
  tools,
  onAddTool,
  onRemoveTool,
  defaultExpanded = true,
  roomName = 'Room',
  tradeName = 'Trade',
  serviceName = 'Service',
}: ToolsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);

  const handleAddTools = (tools: Tool[]) => {
    // Add selected tools to the service
    tools.forEach(tool => {
      onAddTool(tool);
    });
    setIsSideSheetOpen(false);
  };

  const handleRemoveTool = (toolId: string) => {
    onRemoveTool(toolId);
  };

  return (
    <>
      <Card className='p-4 rounded-[10px] bg-[var(--card-background)] border-none'>
        <Accordion
          type='single'
          collapsible
          value={isExpanded ? 'tools' : ''}
          onValueChange={value => setIsExpanded(value === 'tools')}
        >
          <AccordionItem value='tools' className='border-none'>
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
                    {title}
                  </h3>
                </div>
                <Button
                  className='btn-primary text-base !pl-3 !pr-5 !gap-1 !font-medium !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)]'
                  onClick={e => {
                    e.stopPropagation();
                    setIsSideSheetOpen(true);
                  }}
                >
                  <Add
                    size='24'
                    color='var(--secondary)'
                    className='!h-6 !w-6'
                  />
                  Tools
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className='border-t-2 border-[var(--border-dark)] mt-3'>
              <div className='flex flex-wrap gap-2 mt-4'>
                {tools.length > 0 ? (
                  tools.map(tool => (
                    <div
                      key={tool.id}
                      className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light  rounded-full'
                    >
                      <span className='text-base font-medium text-[var(--text-dark)]'>
                        {tool.name}
                      </span>
                      <button
                        onClick={() => handleRemoveTool(tool.id)}
                        className='w-5 h-5 rounded-full flex items-center justify-center transition-colors'
                      >
                        <CloseCircle size={24} color='#6B7280' />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 text-sm'>
                    No tools added yet. Click "+ Tools" to add tools.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Add Tools List SideSheet */}
      <SideSheet
        title='Add Tools List'
        open={isSideSheetOpen}
        onOpenChange={setIsSideSheetOpen}
        size='600px'
      >
        <AddToolListForm
          onSubmit={handleAddTools}
          onCancel={() => setIsSideSheetOpen(false)}
          roomName={roomName}
          tradeName={tradeName}
          serviceName={serviceName}
        />
      </SideSheet>
    </>
  );
}
