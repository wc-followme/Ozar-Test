import { cn } from '@/lib/utils';
import { GalleryAdd } from 'iconsax-react';
import React, { useEffect, useRef } from 'react';
import { JSX } from 'react/jsx-runtime';

interface FileUploadFieldProps {
  onFileChange: (file: File | null) => void;
  onFilesChange?: ((files: File[]) => void) | undefined;
  label?: string;
  text?: JSX.Element | string;
  className?: string;
  uploading?: boolean;
  accept?: string;
  cardHeight?: string;
  multiple?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChange,
  onFilesChange,
  label = 'Upload Photo or Drag and Drop',
  text,
  className = '',
  uploading = false,
  accept = 'image/*',
  cardHeight,
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    if (fileList.length > 0) {
      if (multiple && onFilesChange) {
        // Multiple mode preferred callback
        onFilesChange(fileList);
      } else {
        // Fallback to single-file callback
        onFileChange(fileList[0] ?? null);
      }
    } else {
      onFileChange(null);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  // Reset file input when parent clears it by passing null
  useEffect(() => {
    if (inputRef.current) {
      // no-op hook to keep parity with PhotoUploadField behaviour
    }
  }, []);

  return (
    <div className={className}>
      <input
        type='file'
        accept={accept}
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
        multiple={multiple}
      />
      <div className='mb-2 h-full w-full'>
        <div
          className={cn(
            'w-full h-full px-4 rounded-xl border-2 border-dashed border-cyanwave-main bg-cyanwave-light flex flex-col items-center justify-center cursor-pointer relative py-10',
            cardHeight || 'min-h-[9.375rem]'
          )}
          onClick={handleClick}
        >
          <GalleryAdd size='32' color='#00A8BF' variant='Outline' />
          <div className='mt-2 text-sm font-semibold text-center text-[var(--text-dark)]'>
            {label}
          </div>
          {text && (
            <div className='text-sm text-[var(--text-secondary)] mt-1.5 text-center max-w-[246px]'>
              {text}
            </div>
          )}
          {uploading && (
            <div className='absolute right-4 bottom-4 flex items-center gap-2 text-[var(--text-secondary)] text-sm'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-[var(--text-secondary)] border-t-transparent'></div>
              Uploading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadField;
