'use client';

import { MediaPreview } from '@/components/shared/common/MediaPreview';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface DocumentUploadFormProps {
  onSubmit: (data: { name: string; file: File | null }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const DocumentUploadForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DocumentUploadFormProps) => {
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documentName.trim() && selectedFile) {
      onSubmit({ name: documentName.trim(), file: selectedFile });
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFile(null);
  };

  const getImageSrc = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return '/images/img-placeholder-md.png';
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='document-name' className='field-label'>
          Document Name
        </Label>
        <Input
          id='document-name'
          placeholder='Enter document name'
          value={documentName}
          onChange={e => setDocumentName(e.target.value)}
          className='input-field'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label className='field-label'>File Upload</Label>

        {!selectedFile ? (
          // Show upload component when no file is selected
          <>
            <ImageUpload
              onClick={() => document.getElementById('file-upload')?.click()}
              label='Upload Photo or Drag and drop'
              className='h-[150px]'
            />
            <input
              id='file-upload'
              type='file'
              className='hidden'
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'
            />
          </>
        ) : (
          // Show document preview when file is selected
          <MediaPreview
            files={selectedFile ? [selectedFile] : []}
            onRemove={handleRemoveFile}
            className='w-full'
            previewClassName='h-[80px]'
          />
        )}
      </div>

      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!documentName.trim() || !selectedFile || isSubmitting}
          className='btn-primary'
        >
          {isSubmitting ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
};
