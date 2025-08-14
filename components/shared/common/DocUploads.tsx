'use client';

import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DocumentDownload } from 'iconsax-react';
import { Info } from 'lucide-react';
import { useState } from 'react';

interface DocUploadsProps {
  title: string;
  description?: string;
  supportedFormats?: string;
  onFileChange: (file: File | null) => void;
  onDeleteFile?: () => void;
  uploading?: boolean;
  existingFileUrl?: string | undefined;
  className?: string;
  onDownloadTemplate?: () => void;
}

export const DocUploads: React.FC<DocUploadsProps> = ({
  title,
  description = 'Download template to see the required format',
  supportedFormats = 'Supported formats: .csv, .xlsx',
  onFileChange,
  onDeleteFile,
  uploading = false,
  existingFileUrl,
  className = '',
  onDownloadTemplate,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    onFileChange(newFile);
  };

  const handleDeleteFile = () => {
    setFile(null);
    onDeleteFile?.();
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

      {/* Upload Section */}
      <PhotoUploadField
        photo={file}
        onPhotoChange={handleFileChange}
        onDeletePhoto={handleDeleteFile}
        uploading={uploading}
        label='Upload Photo or Drag and Drop'
        text={supportedFormats}
        existingImageUrl={existingFileUrl}
        cardHeight='min-h-[120px]'
        className='w-full'
      />
    </div>
  );
};
