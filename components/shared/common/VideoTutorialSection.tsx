'use client';

import { MediaPreview } from '@/components/shared/common/MediaPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Trash } from 'iconsax-react';
import { Camera, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface VideoTutorialSectionProps {
  videos: File[];
  onVideosChange: (videos: File[]) => void;
  videoLinks: string[];
  onVideoLinksChange: (links: string[]) => void;
  className?: string;
}

export const VideoTutorialSection: React.FC<VideoTutorialSectionProps> = ({
  videos,
  onVideosChange,
  videoLinks,
  onVideoLinksChange,
  className = '',
}) => {
  const [videoLinkInputs, setVideoLinkInputs] = useState<
    { id: string; value: string }[]
  >([{ id: '1', value: '' }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddVideoLink = (id: string, value: string) => {
    if (value.trim()) {
      onVideoLinksChange([...videoLinks, value.trim()]);
      // Clear the input after adding
      setVideoLinkInputs(prev =>
        prev.map(input => (input.id === id ? { ...input, value: '' } : input))
      );
    }
  };

  const handleRemoveVideoLink = (index: number) => {
    onVideoLinksChange(videoLinks.filter((_, i) => i !== index));
  };

  const handleAddAnotherLink = () => {
    const newId = (videoLinkInputs.length + 1).toString();
    setVideoLinkInputs(prev => [...prev, { id: newId, value: '' }]);
  };

  const handleRemoveLinkInput = (id: string) => {
    if (videoLinkInputs.length > 1) {
      setVideoLinkInputs(prev => prev.filter(input => input.id !== id));
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setVideoLinkInputs(prev =>
      prev.map(input => (input.id === id ? { ...input, value } : input))
    );
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
              className='w-24 h-24 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors'
            >
              <Camera size={24} className='text-blue-500 mb-1' />
              <span className='text-xs text-blue-600 font-medium'>Add</span>
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
          {videoLinkInputs.map(({ id, value }, index) => (
            <div key={id} className='flex items-center gap-3'>
              <Input
                type='url'
                placeholder='Paste link here'
                value={value}
                onChange={e => handleInputChange(id, e.target.value)}
                className={cn(
                  'flex-1 input-field',
                  'border-[var(--border-dark)]'
                )}
              />
              {videoLinkInputs.length > 1 && (
                <button
                  type='button'
                  onClick={() => handleRemoveLinkInput(id)}
                  className='w-[42px] h-[42px] shrink-0 flex items-center justify-center text-gray-400 border-2 border-[var(--border-dark)] rounded-[10px]'
                >
                  <Trash color='var(--text-dark)' size={24} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Links List */}
      {videoLinks.length > 0 && (
        <div className='space-y-2'>
          {videoLinks.map((link, index) => (
            <div
              key={index}
              className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'
            >
              <span className='flex-1 text-sm text-gray-700 truncate'>
                {link}
              </span>
              <Button
                type='button'
                onClick={() => handleRemoveVideoLink(index)}
                size='sm'
                variant='ghost'
                className='text-red-500 hover:text-red-700'
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
