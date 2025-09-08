'use client';

import { CloseCircle } from 'iconsax-react';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DocumentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  className?: string;
  previewClassName?: string;
}

export const DocumentPreview = ({
  files,
  onRemove,
  className = '',
  previewClassName = '',
}: DocumentPreviewProps) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [pdfThumbnails, setPdfThumbnails] = useState<Record<number, string>>(
    {}
  );

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const isPDF = (file: File) => {
    return file.type === 'application/pdf';
  };

  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  const getFileUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Generate a simple canvas image for PDF preview
  const generatePDFThumbnail = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = 320;
        canvas.height = 240;

        // Dark background like in the image
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

        // Add PDF icon (red rectangle) in top-left corner
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(10, 10, 40, 50);

        // Add "PDF" text on the icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PDF', 30, 30);
        ctx.fillText('DOC', 30, 45);

        // Add filename below the PDF icon in white text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        const filename = file.name;
        ctx.fillText(filename, 10, 80);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      } else {
        resolve('');
      }
    });
  };

  // Generate PDF thumbnails when files change
  useEffect(() => {
    files.forEach((file: File, index: number) => {
      if (isPDF(file) && !pdfThumbnails[index]) {
        generatePDFThumbnail(file).then((thumb: string) => {
          setPdfThumbnails(prev => ({ ...prev, [index]: thumb }));
        });
      }
    });
    // We intentionally skip thumbnails from deps to avoid re-generating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {files.map((file, index) => {
        const fileUrl = getFileUrl(file);
        const isPDFFile = isPDF(file);
        const isImageFile = isImage(file);
        const hasError = imageErrors.has(index);

        return (
          <div key={index} className='relative group h-full'>
            <div
              className={`w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 ${previewClassName}`}
            >
              {isPDFFile ? (
                <div className='w-full h-full bg-gray-800 flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <FileText className='h-16 w-16 mx-auto mb-3' />
                    <p className='text-sm font-medium'>PDF Document</p>
                    <p className='text-xs opacity-75 mt-1 truncate px-4'>
                      {file.name}
                    </p>
                  </div>
                </div>
              ) : isImageFile ? (
                hasError ? (
                  <div className='w-full h-full bg-gray-100'>
                    <div className='relative w-full h-full'>
                      <Image
                        src='/images/img-placeholder-sm.png'
                        alt='Placeholder'
                        fill
                        className='object-contain'
                      />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={fileUrl}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className='w-full h-full object-contain'
                    onError={() => handleImageError(index)}
                  />
                )
              ) : (
                // Unsupported file type
                <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                  <div className='text-center text-gray-500 p-2'>
                    <FileText className='h-8 w-8 mx-auto mb-2' />
                    <p className='text-xs mb-1'>Unsupported</p>
                    <p className='text-xs break-words'>{file.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Remove Button */}
            <button
              type='button'
              onClick={() => onRemove(index)}
              className='absolute top-1 right-1 p-0'
            >
              <CloseCircle
                size={16}
                color='var(--white-background)'
                variant='Bold'
                className='p-0 drop-shadow-lg'
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};
