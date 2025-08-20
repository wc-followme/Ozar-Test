'use client';

import FileUploadField from '@/components/shared/common/FileUploadField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DocumentDownload } from 'iconsax-react';
import { Info } from 'lucide-react';

interface DocUploadsProps {
  title: string;
  description?: string;
  supportedFormats?: string;
  onFileChange: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  uploading?: boolean;
  className?: string;
  onDownloadTemplate?: () => void;
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
}) => {
  const handleFileChange = (newFile: File | null) => {
    onFileChange(newFile);
  };

  const handleDownloadTemplate = () => {
    if (onDownloadTemplate) {
      onDownloadTemplate();
    } else {
      // Default CSV template download
      const csvContent = 'Tool ID,Barcode\n12345,QR12345\n10345,QR12346';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
        <Button
          type='button'
          onClick={handleDownloadTemplate}
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
