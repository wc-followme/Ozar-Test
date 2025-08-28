'use client';

import FileUploadField from '@/components/shared/common/FileUploadField';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DocumentDownload } from 'iconsax-react';
import { ChevronDown, Info } from 'lucide-react';

interface DocUploadsProps {
  title: string;
  description?: string;
  supportedFormats?: string;
  onFileChange: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  uploading?: boolean;
  className?: string;
  onDownloadTemplate?: (fileType?: 'csv' | 'xlsx') => void;
  showFileTypeOptions?: boolean;
}

export const DocUploads: React.FC<DocUploadsProps> = ({
  title,
  description = 'Download template to see the required format',
  supportedFormats = 'Supported formats: .csv, .xlsx',
  onFileChange,
  onFilesChange,
  uploading = false,
  className = '',
  onDownloadTemplate,
  showFileTypeOptions = false,
}) => {
  const handleFileChange = (newFile: File | null) => {
    onFileChange(newFile);
  };

  const handleDownloadTemplate = (fileType?: 'csv' | 'xlsx') => {
    const typeToUse = fileType || 'xlsx';
    if (onDownloadTemplate) {
      onDownloadTemplate(typeToUse);
    } else {
      // Default template download - use static files
      const a = document.createElement('a');
      if (typeToUse === 'csv') {
        a.href = '/barcodes_template.csv';
        a.download = 'barcodes_template.csv';
      } else {
        a.href = '/barcodes_template.xlsx';
        a.download = 'barcodes_template.xlsx';
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-[var(--text-dark)] font-semibold text-sm'>
            {title}
          </h3>
          <Info size={16} className='text-[var(--text-secondary)]' />
        </div>
        {showFileTypeOptions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                className='text-[var(--text-dark)] font-semibold text-sm'
                size='sm'
              >
                <DocumentDownload
                  size={24}
                  className='!h-6 !w-5'
                  color='var(--text-dark)'
                  strokeWidth={4}
                />
                Download Template
                <ChevronDown size={16} className='ml-1' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => handleDownloadTemplate('csv')}>
                Download CSV Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadTemplate('xlsx')}>
                Download XLSX Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            type='button'
            onClick={() => handleDownloadTemplate()}
            variant='ghost'
            className='text-[var(--text-dark)] font-semibold text-sm'
            size='sm'
          >
            <DocumentDownload
              size={24}
              className='!h-6 !w-5'
              color='var(--text-dark)'
              strokeWidth={4}
            />
            Download Template
          </Button>
        )}
      </div>

      {description && (
        <p className='text-xs text-[var(--text-secondary)]'>{description}</p>
      )}

      {/* Upload Section */}
      <FileUploadField
        onFileChange={handleFileChange}
        onFilesChange={onFilesChange}
        uploading={uploading}
        label='Upload Photo or Drag and Drop'
        text={supportedFormats}
        accept='image/*,.csv,.xlsx'
        multiple
        cardHeight='min-h-[120px]'
        className='w-full'
      />
    </div>
  );
};
