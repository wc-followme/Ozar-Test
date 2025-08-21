'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PhotoUploadField from './PhotoUploadField';

interface CoverImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coverPhotoFile: File | null;
  onPhotoChange: (file: File | null) => void;
  onDeletePhoto: () => void;
  uploading: boolean;
  coverFileKey?: string;
  onSave: () => void;
}

export const CoverImageUploadDialog = ({
  open,
  onOpenChange,
  coverPhotoFile,
  onPhotoChange,
  onDeletePhoto,
  uploading,
  coverFileKey,
  onSave,
}: CoverImageUploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg bg-[var(--card-background)] border border-[var(--border-dark)] rounded-[20px] shadow-xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle className='text-xl font-bold text-[var(--text-primary)]'>
            Change Cover Image
          </DialogTitle>
          <p className='text-sm text-[var(--text-secondary)] mt-1'>
            Upload a new cover image for your profile
          </p>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='w-full bg-[var(--white-background)] rounded-[16px] border-2 border-dashed border-[var(--border-light)] p-6 relative transition-all duration-300 hover:border-[var(--secondary)]'>
            <PhotoUploadField
              photo={coverPhotoFile}
              onPhotoChange={onPhotoChange}
              onDeletePhoto={onDeletePhoto}
              label='Upload Cover Photo'
              text='Click to upload or drag and drop your cover image'
              uploading={uploading}
              existingImageUrl={
                coverFileKey && !coverPhotoFile
                  ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + coverFileKey
                  : ''
              }
              cardHeight='h-[280px]'
              className='rounded-[12px] border-0'
            />
            {uploading && (
              <div className='absolute inset-0 bg-black/20 rounded-[16px] flex items-center justify-center'>
                <div className='bg-white rounded-lg px-4 py-2 shadow-lg'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <div className='w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin'></div>
                    Uploading...
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              onClick={() => onOpenChange(false)}
              className='btn-secondary flex-1 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95'
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!coverFileKey || uploading}
              className='btn-primary flex-1 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
              {uploading ? 'Uploading...' : 'Save Cover'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
