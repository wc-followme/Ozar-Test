'use client';

import { MediaPreview } from '@/components/shared/common/MediaPreview';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { IconVideoPlus } from '@tabler/icons-react';
import { Trash } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';

interface VideoTutorialSectionProps {
  videos: File[];
  onVideosChange: (videos: File[]) => void;
  videoLinks: string[];
  onVideoLinksChange: (links: string[]) => void;
  existingVideoUrls?: string[];
  onExistingVideoUrlsChange?: (urls: string[]) => void;
  className?: string;
  errorMessage?: string;
}

export const VideoTutorialSection: React.FC<VideoTutorialSectionProps> = ({
  videos,
  onVideosChange,
  videoLinks,
  onVideoLinksChange,
  existingVideoUrls = [],
  onExistingVideoUrlsChange,
  className = '',
  errorMessage,
}) => {
  // State for managing input fields - each field has an id, value, and showDelete flag
  const [videoLinkInputs, setVideoLinkInputs] = useState<
    { id: string; value: string; showDelete: boolean }[]
  >([]);
  console.log('videoLinkInputs', { videoLinkInputs, videoLinks });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize input fields with existing video links (external URLs)
  useEffect(() => {
    const initialInputs = videoLinks.map((link, index) => ({
      id: `existing-link-${index}`,
      value: link,
      showDelete: true, // Existing links always show delete button
    }));

    // Add one empty input field for new links if no existing links
    if (initialInputs.length === 0) {
      initialInputs.push({ id: '1', value: '', showDelete: false });
    }

    setVideoLinkInputs(initialInputs);
  }, [videoLinks]);

  // Update videoLinks when inputs change
  useEffect(() => {
    const validLinks = videoLinkInputs
      .filter(input => input.value.trim() !== '')
      .map(input => input.value.trim());

    // Only update if the links have actually changed to avoid infinite loops
    if (JSON.stringify(validLinks) !== JSON.stringify(videoLinks)) {
      onVideoLinksChange(validLinks);
    }
  }, [videoLinkInputs, onVideoLinksChange, videoLinks]);

  const handleAddVideo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onVideosChange([...videos, ...files]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = (index: number) => {
    onVideosChange(videos.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (index: number) => {
    if (onExistingVideoUrlsChange) {
      onExistingVideoUrlsChange(
        existingVideoUrls.filter((_, i) => i !== index)
      );
    }
  };

  const handleAddAnotherLink = () => {
    const newId = `new-${Date.now()}`;
    setVideoLinkInputs(prev => [
      ...prev,
      { id: newId, value: '', showDelete: false },
    ]);
  };

  const handleRemoveLinkInput = (id: string) => {
    setVideoLinkInputs(prev => prev.filter(input => input.id !== id));
  };

  const handleInputChange = (id: string, value: string) => {
    setVideoLinkInputs(prev =>
      prev.map(input => (input.id === id ? { ...input, value } : input))
    );
  };

  const handleInputBlur = (id: string, value: string) => {
    // Show delete button when input has value and loses focus
    if (value.trim() !== '') {
      setVideoLinkInputs(prev =>
        prev.map(input =>
          input.id === id ? { ...input, showDelete: true } : input
        )
      );
    }
  };

  const handleInputFocus = (id: string) => {
    // Hide delete button when input gains focus (to allow editing)
    setVideoLinkInputs(prev =>
      prev.map(input =>
        input.id === id ? { ...input, showDelete: false } : input
      )
    );
  };

  const handleKeyPress = (
    id: string,
    value: string,
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        // Show delete button when Enter is pressed
        setVideoLinkInputs(prev =>
          prev.map(input =>
            input.id === id ? { ...input, showDelete: true } : input
          )
        );
      }
    }
  };

  return (
    <div
      className={cn(
        'space-y-2 p-4 border border-[var(--border-dark)] rounded-[10px]',
        className
      )}
    >
      <h3 className='text-sm font-semibold text-[var(--text-dark)]'>
        Video Tutorial
      </h3>

      {/* Video Thumbnails Section */}
      <div className='space-y-4'>
        {/* Add Video Button */}
        <div className='flex gap-4 flex-wrap'>
          <div className='relative'>
            <button
              type='button'
              onClick={handleAddVideo}
              className='w-24 h-24 bg-[var(--info)]/15 border-2 border-dashed border-[var(--info)] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors'
            >
              <IconVideoPlus size={36} className='text-[var(--info)]' />
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='video/*'
              className='hidden'
              onChange={handleFileChange}
              multiple
            />
          </div>
          {/* Video Previews */}
          {videos.length > 0 && (
            <MediaPreview
              files={videos}
              onRemove={handleRemoveVideo}
              className='grid-cols-[repeat(auto-fill,minmax(88px,1fr))] flex-1'
              previewClassName='h-full min-h-[98px] shrink-0'
            />
          )}
        </div>
      </div>

      {/* Existing Video Files Section */}
      {existingVideoUrls.length > 0 && (
        <div className='space-y-4'>
          <Label className='field-label'>Existing Video Files</Label>
          <div className='flex gap-4 flex-wrap'>
            {existingVideoUrls.map((url, index) => (
              <div key={index} className='relative'>
                <div className='w-24 h-24 bg-gray-100 border-2 border-gray-300 rounded-2xl overflow-hidden relative'>
                  <video
                    src={url}
                    className='w-full h-full object-cover'
                    preload='metadata'
                  />
                  <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                    <div className='w-8 h-8 bg-white/80 rounded-full flex items-center justify-center'>
                      <div className='w-0 h-0 border-l-[6px] border-l-gray-800 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1'></div>
                    </div>
                  </div>
                </div>
                {onExistingVideoUrlsChange && (
                  <button
                    type='button'
                    onClick={() => handleRemoveExistingVideo(index)}
                    className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Link Input Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='field-label'>Video link</Label>
          <button
            type='button'
            onClick={handleAddAnotherLink}
            className='text-greenbrand hover:text-[var(--primary-dark)] text-sm font-semibold transition-colors'
          >
            Add Another
          </button>
        </div>

        <div className='space-y-3'>
          {videoLinkInputs.map(({ id, value, showDelete }) => (
            <div key={id} className='flex items-center gap-3'>
              <Input
                type='url'
                placeholder='Paste link here (press Enter to add)'
                value={value}
                onChange={e => handleInputChange(id, e.target.value)}
                onKeyPress={e => handleKeyPress(id, value, e)}
                onBlur={() => handleInputBlur(id, value)}
                onFocus={() => handleInputFocus(id)}
                className={cn(
                  'flex-1 input-field',
                  'border-[var(--border-dark)]'
                )}
              />
              {showDelete && (
                <button
                  type='button'
                  onClick={() => handleRemoveLinkInput(id)}
                  className='w-[42px] h-[42px] shrink-0 flex items-center justify-center text-gray-400 border-2 border-[var(--border-dark)] rounded-[10px] hover:border-red-300 hover:text-red-500 transition-colors'
                >
                  <Trash color='var(--text-dark)' size={24} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className='text-sm text-red-500 mt-2'>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};
