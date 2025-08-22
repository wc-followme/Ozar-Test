'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { DocUploads } from './DocUploads';
import { DynamicTable } from './DynamicTable';
import { QRCodeListingCard } from './QRCodeListingCard';

interface QRCodeSectionProps {
  barcodes: string[];
  onBarcodesChange: (barcodes: string[]) => void;
  existingBarcodes?: Array<{ id: string; toolId: string; barcode: string }>;
  onExistingBarcodesChange?: (
    barcodes: Array<{ id: string; toolId: string; barcode: string }>
  ) => void;
  className?: string;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  barcodes,
  onBarcodesChange,
  existingBarcodes = [],
  onExistingBarcodesChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('qr-doc');
  const [newBarcode, setNewBarcode] = useState('');

  // Convert barcodes array to table data format for new barcodes
  const newBarcodesTableData = barcodes.map((barcode, index) => ({
    id: `new-${index}`,
    no: String(index + 1).padStart(2, '0'),
    toolIdBarcode: `- / ${barcode}`,
    type: 'new' as const,
  }));

  // Convert existing barcodes to table data format
  const existingBarcodesTableData = existingBarcodes.map((item, index) => ({
    id: item.id,
    no: String(index + 1).padStart(2, '0'),
    toolIdBarcode: `${item.toolId} / ${item.barcode}`,
    type: 'existing' as const,
  }));

  // Combine both tables for display
  const allTableData = [...existingBarcodesTableData, ...newBarcodesTableData];

  // Column configuration for the DynamicTable
  const toolTableColumns = [
    {
      key: 'no',
      label: 'No.',
      type: 'text' as const,
    },
    {
      key: 'toolIdBarcode',
      label: 'Tool ID / Barcode',
      type: 'text' as const,
    },
  ];

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    toolIdBarcode: string;
    type: 'new' | 'existing';
    id: string;
  } | null>(null);

  // Actions for the table (delete icon)
  const toolTableActions = [
    {
      key: 'delete',
      icon: 'Trash',
      onClick: (row: {
        toolIdBarcode: string;
        type: 'new' | 'existing';
        id: string;
      }) => {
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
    if (itemToDelete && itemToDelete.toolIdBarcode) {
      // Extract barcode from the combined field (e.g., "11345 / QR12345" -> "QR12345")
      const barcodeToDelete =
        itemToDelete.toolIdBarcode.split(' / ')[1] ||
        itemToDelete.toolIdBarcode;
      const itemType = itemToDelete.type;
      const itemId = itemToDelete.id;
      console.log('Deleting barcode:', barcodeToDelete, 'Type:', itemType);

      if (itemType === 'new') {
        // Remove barcode from new barcodes array
        const updatedBarcodes = barcodes.filter(
          barcode => barcode !== barcodeToDelete
        );
        onBarcodesChange(updatedBarcodes);
      } else if (itemType === 'existing' && onExistingBarcodesChange) {
        // Remove barcode from existing barcodes array
        const updatedExistingBarcodes = existingBarcodes.filter(
          item => item.id !== itemId
        );
        onExistingBarcodesChange(updatedExistingBarcodes);
      }

      // Check which files contain this barcode and update their mappings
      const updatedFileBarcodeMap = { ...fileBarcodeMap };
      const filesToRemove: string[] = [];

      Object.keys(updatedFileBarcodeMap).forEach(fileName => {
        const fileBarcodes = updatedFileBarcodeMap[fileName];
        if (fileBarcodes) {
          // Remove the deleted barcode from this file's barcodes
          const updatedFileBarcodes = fileBarcodes.filter(
            barcode => barcode !== barcodeToDelete
          );

          if (updatedFileBarcodes.length === 0) {
            // If file has no barcodes left, mark it for removal
            filesToRemove.push(fileName);
            console.log(
              'File has no barcodes left, will be removed:',
              fileName
            );
          } else {
            // Update file's barcode list
            updatedFileBarcodeMap[fileName] = updatedFileBarcodes;
            console.log(
              'Updated file barcodes for:',
              fileName,
              updatedFileBarcodes
            );
          }
        }
      });

      // Remove files that have no barcodes left
      if (filesToRemove.length > 0) {
        console.log('Removing files with no barcodes:', filesToRemove);
        setUploadedFileNames(prev =>
          prev.filter(fileName => !filesToRemove.includes(fileName))
        );

        // Remove files from barcode mapping
        filesToRemove.forEach(fileName => {
          delete updatedFileBarcodeMap[fileName];
        });
      }

      // Update file barcode mapping
      setFileBarcodeMap(updatedFileBarcodeMap);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleAddBarcode = () => {
    const trimmedBarcode = newBarcode.trim();
    if (trimmedBarcode) {
      // Check for duplicates in current barcodes and all uploaded files
      const allExistingBarcodes = new Set([
        ...barcodes,
        ...Object.values(fileBarcodeMap).flat(),
      ]);

      if (!allExistingBarcodes.has(trimmedBarcode)) {
        onBarcodesChange([...barcodes, trimmedBarcode]);
        setNewBarcode('');
        console.log('Added new barcode:', trimmedBarcode);
      } else {
        console.log('Barcode already exists:', trimmedBarcode);
        // You could add a toast notification here to inform the user
      }
    }
  };

  const handleDownloadTemplate = (fileType: 'csv' | 'xlsx' = 'xlsx') => {
    if (fileType === 'csv') {
      // Download the CSV template file
      const a = document.createElement('a');
      a.href = '/barcodes_template.csv';
      a.download = 'barcodes_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Download the XLSX template file
      const a = document.createElement('a');
      a.href = '/barcodes_template.xlsx';
      a.download = 'barcodes_template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [fileBarcodeMap, setFileBarcodeMap] = useState<
    Record<string, string[]>
  >({});

  const handleBulkUpload = (file: File | null) => {
    if (file) {
      // Check if file already exists in uploaded files
      const isFileAlreadyUploaded = uploadedFileNames.includes(file.name);

      if (isFileAlreadyUploaded) {
        console.log('File already uploaded, skipping:', file.name);
        return; // Skip processing if file already exists
      }

      // Add file to uploaded files list
      setUploadedFileNames(prev => [...prev, file.name]);
      console.log('Added new file to upload list:', file.name);

      // Handle CSV/XLSX file upload
      const reader = new FileReader();
      reader.onload = event => {
        console.log('File uploaded:', file.name);
        const newBarcodes: string[] = [];

        if (file.name.endsWith('.csv')) {
          const text = event.target?.result as string;
          console.log('CSV content:', text);
          // Handle CSV files
          const lines = text.split(/\r?\n/); // Handle different line endings
          // Skip header row and process data
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i]?.trim();
            if (line) {
              // Extract barcode from CSV line (single column format)
              const barcode = line.split(',')[0]?.trim();
              if (barcode && barcode !== 'Barcode') {
                // Skip header if present
                newBarcodes.push(barcode);
              }
            }
          }
        } else if (file.name.endsWith('.xlsx')) {
          // Handle XLSX files using the xlsx library
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];

            if (sheetName) {
              const worksheet = workbook.Sheets[sheetName];

              if (worksheet) {
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                  header: 1,
                });

                // Skip header row and extract barcodes from first column
                for (let i = 1; i < jsonData.length; i++) {
                  const row = jsonData[i] as any[];
                  const barcode = row[0]?.toString().trim();
                  if (barcode && barcode !== 'Barcode') {
                    newBarcodes.push(barcode);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error parsing XLSX file:', error);
          }
        }

        console.log('Parsed barcodes:', newBarcodes);

        // Get all existing barcodes from current state and all uploaded files
        const allExistingBarcodes = new Set([
          ...barcodes,
          ...Object.values(fileBarcodeMap).flat(),
        ]);

        // Filter out duplicates from new barcodes with detailed logging
        const duplicatesInFile: string[] = [];
        const uniqueNewBarcodes = newBarcodes.filter(barcode => {
          if (allExistingBarcodes.has(barcode)) {
            duplicatesInFile.push(barcode);
            console.log(
              `❌ Duplicate barcode skipped: ${barcode} (already exists)`
            );
            return false;
          }
          return true;
        });

        console.log('Unique new barcodes (no duplicates):', uniqueNewBarcodes);
        if (duplicatesInFile.length > 0) {
          console.log(
            `⚠️ Found ${duplicatesInFile.length} duplicates in file ${file.name}:`,
            duplicatesInFile
          );
        }

        // Store mapping of file to its barcodes (only unique ones)
        setFileBarcodeMap(prev => ({
          ...prev,
          [file.name]: uniqueNewBarcodes,
        }));

        // Add new barcodes to existing ones (don't overwrite)
        if (uniqueNewBarcodes.length > 0) {
          onBarcodesChange([...barcodes, ...uniqueNewBarcodes]);
        } else {
          console.log('No new unique barcodes to add from file:', file.name);
        }
      };

      // Read file based on type
      if (file.name.endsWith('.xlsx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const handleBulkUploads = (files: File[]) => {
    if (!files || files.length === 0) return;
    console.log(
      'Processing multiple files:',
      files.map(f => f.name)
    );

    // Process all files and collect all barcodes first
    const allNewBarcodes: { fileName: string; barcodes: string[] }[] = [];
    let processedFiles = 0;

    const processNextFile = (index: number) => {
      if (index >= files.length) {
        // All files processed, now update state
        updateStateWithAllFiles(allNewBarcodes);
        return;
      }

      const file = files[index];
      if (!file) {
        // Skip undefined files and process next
        processNextFile(index + 1);
        return;
      }

      const reader = new FileReader();

      reader.onload = event => {
        console.log('Processing file:', file.name);
        const newBarcodes: string[] = [];

        if (file.name.endsWith('.csv')) {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/);
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i]?.trim();
            if (line) {
              const barcode = line.split(',')[0]?.trim();
              if (barcode && barcode !== 'Barcode') {
                newBarcodes.push(barcode);
              }
            }
          }
        } else if (file.name.endsWith('.xlsx')) {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];

            if (sheetName) {
              const worksheet = workbook.Sheets[sheetName];

              if (worksheet) {
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                  header: 1,
                });

                for (let i = 1; i < jsonData.length; i++) {
                  const row = jsonData[i] as any[];
                  const barcode = row[0]?.toString().trim();
                  if (barcode && barcode !== 'Barcode') {
                    newBarcodes.push(barcode);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error parsing XLSX file:', error);
          }
        }

        console.log('Parsed barcodes from', file.name, ':', newBarcodes);
        allNewBarcodes.push({ fileName: file.name, barcodes: newBarcodes });
        processedFiles++;

        // Process next file
        processNextFile(index + 1);
      };

      // Read file based on type
      if (file.name.endsWith('.xlsx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    };

    // Start processing files
    processNextFile(0);
  };

  const updateStateWithAllFiles = (
    fileBarcodes: { fileName: string; barcodes: string[] }[]
  ) => {
    console.log('Updating state with all files:', fileBarcodes);

    // Collect all barcodes from all files
    const allBarcodesFromFiles = fileBarcodes.flatMap(fb => fb.barcodes);
    console.log('All barcodes from files:', allBarcodesFromFiles);

    // Get all existing barcodes from current state and uploaded files
    const allExistingBarcodes = new Set([
      ...barcodes,
      ...Object.values(fileBarcodeMap).flat(),
    ]);
    console.log('Existing barcodes:', Array.from(allExistingBarcodes));

    // Remove duplicates within the new files themselves AND with existing barcodes
    const uniqueBarcodesAcrossAllFiles = new Set<string>();
    const duplicatesFound: {
      barcode: string;
      reason: string;
      files: string[];
    }[] = [];

    // Track which barcodes appear in which files for duplicate detection
    const barcodeToFiles = new Map<string, string[]>();

    fileBarcodes.forEach(fb => {
      fb.barcodes.forEach(barcode => {
        if (!barcodeToFiles.has(barcode)) {
          barcodeToFiles.set(barcode, []);
        }
        barcodeToFiles.get(barcode)!.push(fb.fileName);
      });
    });

    allBarcodesFromFiles.forEach(barcode => {
      const filesWithThisBarcode = barcodeToFiles.get(barcode) || [];

      if (allExistingBarcodes.has(barcode)) {
        duplicatesFound.push({
          barcode,
          reason: 'Already exists in current data',
          files: filesWithThisBarcode,
        });
        console.log(
          `Duplicate found - already exists: ${barcode} (in files: ${filesWithThisBarcode.join(', ')})`
        );
      } else if (uniqueBarcodesAcrossAllFiles.has(barcode)) {
        duplicatesFound.push({
          barcode,
          reason: 'Appears in multiple uploaded files',
          files: filesWithThisBarcode,
        });
        console.log(
          `Duplicate found - across uploaded files: ${barcode} (in files: ${filesWithThisBarcode.join(', ')})`
        );
      } else {
        uniqueBarcodesAcrossAllFiles.add(barcode);
      }
    });

    const uniqueNewBarcodes = Array.from(uniqueBarcodesAcrossAllFiles);
    console.log('Unique new barcodes (no duplicates):', uniqueNewBarcodes);

    if (duplicatesFound.length > 0) {
      console.log('=== DUPLICATE DETECTION SUMMARY ===');
      duplicatesFound.forEach(dup => {
        console.log(
          `❌ ${dup.barcode}: ${dup.reason} (Files: ${dup.files.join(', ')})`
        );
      });
      console.log(
        `Total duplicates found and skipped: ${duplicatesFound.length}`
      );
      console.log('=================================');
    }

    // Update file names (only for files that have unique barcodes)
    const validFileNames: string[] = [];
    fileBarcodes.forEach(fb => {
      const uniqueBarcodesForFile = fb.barcodes.filter(barcode =>
        uniqueBarcodesAcrossAllFiles.has(barcode)
      );
      if (uniqueBarcodesForFile.length > 0) {
        validFileNames.push(fb.fileName);
        console.log(
          `✅ File ${fb.fileName} contributes ${uniqueBarcodesForFile.length} unique barcodes:`,
          uniqueBarcodesForFile
        );
      } else {
        console.log(
          `⚠️ File ${fb.fileName} has no unique barcodes, will not be added to file list`
        );
      }
    });

    setUploadedFileNames(prev => {
      const existingNames = new Set(prev);
      const additionalNames = validFileNames.filter(
        name => !existingNames.has(name)
      );
      console.log('Adding new file names:', additionalNames);
      return [...prev, ...additionalNames];
    });

    // Update file barcode mapping (only unique barcodes per file)
    const newFileBarcodeMap: Record<string, string[]> = {};
    fileBarcodes.forEach(fb => {
      const uniqueBarcodesForFile = fb.barcodes.filter(barcode =>
        uniqueBarcodesAcrossAllFiles.has(barcode)
      );
      if (uniqueBarcodesForFile.length > 0) {
        newFileBarcodeMap[fb.fileName] = uniqueBarcodesForFile;
      }
    });

    setFileBarcodeMap(prev => ({
      ...prev,
      ...newFileBarcodeMap,
    }));

    // Update main barcodes array
    if (uniqueNewBarcodes.length > 0) {
      onBarcodesChange([...barcodes, ...uniqueNewBarcodes]);
      console.log(
        `✅ Added ${uniqueNewBarcodes.length} unique barcodes to main array`
      );
    } else {
      console.log('⚠️ No new unique barcodes to add');
    }
  };

  const handleFileRemove = (fileName: string) => {
    console.log('Removing file:', fileName);

    // Get barcodes associated with this file
    const fileBarcodesToRemove = fileBarcodeMap[fileName] || [];
    console.log('Barcodes to remove:', fileBarcodesToRemove);

    // Remove file from uploaded files list
    setUploadedFileNames(prev => prev.filter(name => name !== fileName));

    // Remove file from barcode mapping
    setFileBarcodeMap(prev => {
      const newMap = { ...prev };
      delete newMap[fileName];
      return newMap;
    });

    // Remove associated barcodes from the main barcodes array
    const updatedBarcodes = barcodes.filter(
      barcode => !fileBarcodesToRemove.includes(barcode)
    );
    console.log('Updated barcodes after removal:', updatedBarcodes);

    onBarcodesChange(updatedBarcodes);
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
          {/* Add Barcode Input */}
          <div className='space-y-4 p-4 border border-[var(--border-dark)] rounded-lg bg-[var(--background)]'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
              <div className='md:col-span-2 space-y-2'>
                <Label htmlFor='barcode-input' className='field-label'>
                  Add Barcode
                </Label>
                <Input
                  id='barcode-input'
                  placeholder='Enter barcode...'
                  value={newBarcode}
                  onChange={e => setNewBarcode(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleAddBarcode();
                    }
                  }}
                  className='input-field'
                />
              </div>
              <Button
                onClick={handleAddBarcode}
                disabled={
                  !newBarcode.trim() || barcodes.includes(newBarcode.trim())
                }
                className='btn-primary'
              >
                Add Barcode
              </Button>
            </div>
          </div>

          {/* Tool Management Table */}
          <div className='space-y-4'>
            {/* Dynamic Table with Simple Tool Data */}
            <DynamicTable
              columns={toolTableColumns}
              data={allTableData}
              actions={toolTableActions}
              emptyMessage='No barcodes found'
              showRowNumbers={false}
              tableConfig={{
                headerBgColor: 'bg-[var(--background)]',
                borderColor: 'border-[var(--border-dark)]',
                hoverColor: 'hover:bg-[var(--background-light)]',
              }}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
              open={showDeleteModal}
              title={`Delete barcode ${itemToDelete?.toolIdBarcode ? itemToDelete.toolIdBarcode.split(' / ')[1] : ''}?`}
              subtitle='Are you sure you want to delete this barcode? This action cannot be undone.'
              onCancel={handleCancelDelete}
              onDelete={handleConfirmDelete}
              archiveButtonText='Delete'
            />
          </div>
        </TabsContent>

        <TabsContent value='qr-doc' className='space-y-4'>
          <DocUploads
            title='Bulk Import Barcodes'
            description='Download template to see the required format (single column with barcodes only)'
            supportedFormats='Supported formats: .csv, .xlsx'
            onFileChange={handleBulkUpload}
            onFilesChange={handleBulkUploads}
            onDownloadTemplate={handleDownloadTemplate}
            showFileTypeOptions={true}
          />
          {uploadedFileNames.length > 0 && (
            <div className='space-y-2'>
              {uploadedFileNames.map((fileName, index) => (
                <QRCodeListingCard
                  key={`${fileName}-${index}`}
                  fileName={fileName}
                  onRemove={() => handleFileRemove(fileName)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
