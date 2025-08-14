'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { DocUploads } from './DocUploads';
import { DynamicTable } from './DynamicTable';

interface ToolIdBarcode {
  id: string;
  toolId: string;
  barcode: string;
}

interface QRCodeSectionProps {
  toolIds: ToolIdBarcode[];
  onToolIdsChange: (toolIds: ToolIdBarcode[]) => void;
  className?: string;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  toolIds,
  onToolIdsChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('qr-doc');
  const [newToolId, setNewToolId] = useState('');
  const [newBarcode, setNewBarcode] = useState('');

  // Sample data for the table matching the image
  const sampleToolData = [
    {
      id: '1',
      toolId: '11345',
      barcode: 'QR12345',
    },
    {
      id: '2',
      toolId: '10345',
      barcode: 'QR12346',
    },
    {
      id: '3',
      toolId: '12745',
      barcode: 'QR12347',
    },
    {
      id: '4',
      toolId: '12344',
      barcode: 'QR12386',
    },
  ];

  // Column configuration for the DynamicTable - Simple table matching the image
  const toolTableColumns = [
    {
      key: 'toolId',
      label: 'Tool ID / Barcode',
      type: 'combined' as const,
      subKey: 'barcode',
    },
  ];

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Actions for the table (delete icon)
  const toolTableActions = [
    {
      key: 'delete',
      icon: 'Trash',
      onClick: (row: any) => {
        setItemToDelete(row);
        setShowDeleteModal(true);
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  const handleAddToolId = () => {
    if (newToolId.trim() && newBarcode.trim()) {
      const newId: ToolIdBarcode = {
        id: `tool-${Date.now()}`,
        toolId: newToolId.trim(),
        barcode: newBarcode.trim(),
      };
      onToolIdsChange([...toolIds, newId]);
      setNewToolId('');
      setNewBarcode('');
    }
  };

  const handleRemoveToolId = (id: string) => {
    onToolIdsChange(toolIds.filter(tool => tool.id !== id));
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Remove from sample data (in real app, this would be API call)
      const updatedData = sampleToolData.filter(
        item => item.id !== itemToDelete.id
      );
      console.log('Deleted item:', itemToDelete);
      console.log('Updated data:', updatedData);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = 'Tool ID,Barcode\n12345,QR12345\n10345,QR12346';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tool_qr_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = (file: File | null) => {
    if (file) {
      // Handle CSV file upload
      const reader = new FileReader();
      reader.onload = event => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const newToolIds: ToolIdBarcode[] = [];

        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
          const [toolId, barcode] = lines[i].split(',');
          if (toolId && barcode) {
            newToolIds.push({
              id: `tool-${Date.now()}-${i}`,
              toolId: toolId.trim(),
              barcode: barcode.trim(),
            });
          }
        }

        onToolIdsChange([...toolIds, ...newToolIds]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='flex w-full bg-[var(--dark-background)] p-1 rounded-[32px] h-auto font-normal justify-stretch border border-[var(--border-dark)]'>
          <TabsTrigger
            value='qr-doc'
            className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
          >
            <span className='flex items-center gap-2'>
              <span className='text-base'>QR Doc</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value='qr-scan'
            className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
          >
            <span className='flex items-center gap-2'>
              <span className='text-base'>QR Scan</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='qr-doc' className='space-y-4'>
          {/* Tool Management Table */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
                Tool Management
              </h3>
              <Button
                type='button'
                onClick={handleAddToolId}
                disabled={!newToolId.trim() || !newBarcode.trim()}
                className='text-sm'
                size='sm'
              >
                Add New
              </Button>
            </div>

            {/* Add New Tool ID Form */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tool-id' className='text-sm font-medium'>
                  Tool ID
                </Label>
                <Input
                  id='tool-id'
                  placeholder='Enter Tool ID'
                  value={newToolId}
                  onChange={e => setNewToolId(e.target.value)}
                  className='input-field border-[var(--border-dark)]'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='barcode' className='text-sm font-medium'>
                  Barcode
                </Label>
                <Input
                  id='barcode'
                  placeholder='Enter Barcode'
                  value={newBarcode}
                  onChange={e => setNewBarcode(e.target.value)}
                  className='input-field border-[var(--border-dark)]'
                />
              </div>
            </div>

            {/* Dynamic Table with Simple Tool Data */}
            <DynamicTable
              columns={toolTableColumns}
              data={sampleToolData}
              actions={toolTableActions}
              emptyMessage='No tools found'
              showRowNumbers={true}
              tableConfig={{
                headerBgColor: 'bg-[#F5F7FA]',
                borderColor: 'border-[var(--border-dark)]',
                hoverColor: 'hover:bg-[var(--background-light)]',
              }}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
              open={showDeleteModal}
              title={`Delete ${itemToDelete?.toolId} / ${itemToDelete?.barcode}?`}
              subtitle='Are you sure you want to delete this tool? This action cannot be undone.'
              onCancel={handleCancelDelete}
              onDelete={handleConfirmDelete}
              archiveButtonText='Delete'
            />
          </div>
        </TabsContent>

        <TabsContent value='qr-scan' className='space-y-4'>
          <DocUploads
            title='Bulk Import QR Code'
            description='Download template to see the required format'
            supportedFormats='Supported formats: .csv, .xlsx'
            onFileChange={handleBulkUpload}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
