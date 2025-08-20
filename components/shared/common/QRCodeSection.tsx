'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { DocUploads } from './DocUploads';
import { DynamicTable } from './DynamicTable';
import { QRCodeListingCard } from './QRCodeListingCard';

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

  // Removed unused handleAddToolId

  // const handleRemoveToolId = (id: string) => {
  //   onToolIdsChange(toolIds.filter(tool => tool.id !== id));
  // };

  const handleConfirmDelete = () => {
    if (itemToDelete && (itemToDelete as any).id) {
      // Remove from sample data (in real app, this would be API call)
      const updatedData = sampleToolData.filter(
        item => item.id !== (itemToDelete as any).id
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

  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  const handleBulkUpload = (file: File | null) => {
    if (file) {
      // Avoid duplicate listing for the same file name in a single upload
      setUploadedFileNames(prev =>
        prev.includes(file.name) ? prev : [...prev, file.name]
      );
      // Handle CSV file upload
      const reader = new FileReader();
      reader.onload = event => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const newToolIds: ToolIdBarcode[] = [];

        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
          const [toolId, barcode] = (lines[i] || '').split(',');
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

  const handleBulkUploads = (files: File[]) => {
    if (!files || files.length === 0) return;
    // De-duplicate by name for display
    const names = files.map(f => f.name);
    setUploadedFileNames(prev => Array.from(new Set([...prev, ...names])));
    files.forEach(file => handleBulkUpload(file));
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

        <TabsContent value='qr-scan' className='space-y-4'>
          {/* Tool Management Table */}
          <div className='space-y-4'>
            {/* Dynamic Table with Simple Tool Data */}
            <DynamicTable
              columns={toolTableColumns}
              data={sampleToolData}
              actions={toolTableActions}
              emptyMessage='No tools found'
              showRowNumbers={true}
              tableConfig={{
                headerBgColor: 'bg-[var(--background)]',
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

        <TabsContent value='qr-doc' className='space-y-4'>
          <DocUploads
            title='Bulk Import QR Code'
            description='Download template to see the required format'
            supportedFormats='Supported formats: .csv, .xlsx'
            onFileChange={handleBulkUpload}
            onFilesChange={handleBulkUploads}
            onDownloadTemplate={handleDownloadTemplate}
          />
          {uploadedFileNames.length > 0 && (
            <div className='space-y-2'>
              {uploadedFileNames.map((fileName, index) => (
                <QRCodeListingCard
                  key={`${fileName}-${index}`}
                  fileName={fileName}
                  onRemove={() =>
                    setUploadedFileNames(prev =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
