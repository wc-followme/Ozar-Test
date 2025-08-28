'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { Add, ArrowSquareDown, CloseCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';
import AddToolListForm from '../forms/AddToolListForm';
import SideSheet from './SideSheet';

interface Tool {
  id: string;
  uuid?: string; // Add UUID field for database tool UUID
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
  onReplaceTools?: (tools: Tool[]) => void; // Add callback for replacing all tools
  defaultExpanded?: boolean;
  roomName?: string;
  tradeName?: string;
  serviceName?: string;
  serviceId?: string | undefined; // Add service ID prop for fetching tools
  borderClass?: string; // New prop to control border styling
  showAddButton?: boolean; // New prop to control add button visibility
}

export default function ToolsAccordion(props: Readonly<ToolsAccordionProps>) {
  const {
    title,
    tools,
    onAddTool,
    onRemoveTool,
    onReplaceTools,
    defaultExpanded = true,
    roomName = 'Room',
    tradeName = 'Trade',
    serviceName = 'Service',
    serviceId, // Add service ID prop
    borderClass = 'border-none', // Default to border-none
    showAddButton = true, // Default to true to maintain current behavior
  } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [toolNameById, setToolNameById] = useState<Record<string, string>>({});

  // Fetch tool names so chips display names instead of UUIDs/IDs
  useEffect(() => {
    const fetchTools = async (serviceUuid: string | undefined | null) => {
      try {
        if (!serviceUuid) {
          setToolNameById({});
          return;
        }
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
        if (!companyUuid) {
          setToolNameById({});
          return;
        }
        const response = await apiService.fetchToolsPublic({
          page: 1,
          limit: 100,
          company_id: companyUuid,
          service_id: serviceUuid,
        });
        type ToolItem = { id?: string | number; uuid?: string; name?: string };
        const payload = response as unknown as {
          data?: ToolItem[] | { tools?: ToolItem[] };
        };
        const list: ToolItem[] = Array.isArray(payload?.data)
          ? (payload.data as ToolItem[])
          : Array.isArray((payload?.data as { tools?: ToolItem[] })?.tools)
            ? ((payload.data as { tools?: ToolItem[] }).tools as ToolItem[])
            : [];
        const map: Record<string, string> = {};
        list.forEach(t => {
          const key = String(t.uuid || t.id || '');
          if (key) map[key] = String(t.name || '');
        });
        setToolNameById(map);
      } catch {
        setToolNameById({});
      }
    };
    fetchTools(serviceId);
  }, [serviceId]);

  // Build a stable key per tool without relying on array index
  const getStableToolKey = (tool: Tool): string => {
    const rawId =
      tool.uuid || tool.id || (tool as unknown as { tool_id?: string }).tool_id;
    if (rawId) {
      return `${serviceId || 'service'}_${title}_${rawId}`;
    }
    const payload = `${serviceId || 'service'}_${title}_${tool.name || ''}_$${
      tool.category || ''
    }_${JSON.stringify(tool)}`;
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = (hash << 5) - hash + payload.charCodeAt(i);
      hash |= 0;
    }
    return `${serviceId || 'service'}_${title}_${Math.abs(hash)}`;
  };

  const handleAddTools = (tools: Tool[]) => {
    // Replace all existing tools with the new selection to avoid duplicates
    if (onReplaceTools) {
      // Use the new replace callback if available
      onReplaceTools(tools);
    } else {
      // Fallback to individual add/remove if replace callback is not provided
      tools.forEach(tool => {
        onAddTool(tool);
      });
    }
    setIsSideSheetOpen(false);
  };

  const handleRemoveTool = (toolId: string) => {
    onRemoveTool(toolId);
  };

  return (
    <>
      <Card
        className={`p-4 rounded-[10px] bg-[var(--card-background)] ${borderClass}`}
      >
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
                    {title} - {tools.length}
                  </h3>
                </div>
                {showAddButton && (
                  <div
                    role='button'
                    tabIndex={0}
                    aria-label='Add tools'
                    className='btn-primary text-sm !pl-3 !pr-5 w-32 !bg-greenaccent-100 !h-9 hover:!bg-greenaccent-100 !text-[var(--secondary)] inline-flex items-center justify-center !gap-1 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'
                    onClick={e => {
                      e.stopPropagation();
                      setIsSideSheetOpen(true);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSideSheetOpen(true);
                      }
                    }}
                  >
                    <Add
                      size='24'
                      color='var(--secondary)'
                      className='!h-5 !w-5'
                    />
                    Tools
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className='border-t-2 border-[var(--border-dark)] mt-3'>
              <div className='flex flex-wrap gap-2 mt-4'>
                {tools.length > 0 ? (
                  tools.map(tool => (
                    <div
                      key={getStableToolKey(tool)}
                      className='flex items-center gap-2 pl-4 pr-3 py-2 bg-cyanwave-light  rounded-full'
                    >
                      <span className='text-base font-medium text-[var(--text-dark)]'>
                        {toolNameById[tool.uuid || tool.id] ||
                          tool.name ||
                          'Tool'}
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
                    No tools added yet. Click &quot;+ Tools&quot; to add tools.
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
          serviceId={serviceId}
          existingTools={tools}
        />
      </SideSheet>
    </>
  );
}
