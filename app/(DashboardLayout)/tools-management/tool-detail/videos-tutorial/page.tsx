'use client';

import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { VideoPreviewCard } from '@/components/shared/cards/VideoPreviewCard';
import SideSheet from '@/components/shared/common/SideSheet';
import { VideoTutorialSection } from '@/components/shared/common/VideoTutorialSection';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TOOL_VIDEOS } from './dummy-data';

export default function ToolVideosPage() {
  const breadcrumbItems = [
    { name: 'Tools', href: '/tools-management' },
    { name: 'Drill Machine', href: '/tools-management/tool-detail' },
    { name: 'Videos Tutorial' },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  const handleAddVideos = () => {
    // TODO: integrate API or state update for added videos/links
    console.log('Adding videos:', videos, 'links:', videoLinks);
    setIsOpen(false);
  };

  return (
    <div className='space-y-4'>
      <div className='flex md:flex-row flex-col md:items-center gap-4'>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          className='btn-primary px-4 py-2 ml-auto'
          onClick={() => setIsOpen(true)}
        >
          Add Videos
        </Button>
      </div>

      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {TOOL_VIDEOS.map(video => (
          <VideoPreviewCard key={video.id} {...video} />
        ))}
      </div>

      <SideSheet
        open={isOpen}
        onOpenChange={open => setIsOpen(open)}
        title='Add Videos'
        size='600px'
      >
        <VideoTutorialSection
          videos={videos}
          onVideosChange={setVideos}
          videoLinks={videoLinks}
          onVideoLinksChange={setVideoLinks}
        />
        <div className='flex gap-3 items-center pt-4'>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            className='btn-secondary'
          >
            Cancel
          </Button>
          <Button onClick={handleAddVideos} className='btn-primary'>
            Add
          </Button>
        </div>
      </SideSheet>
    </div>
  );
}
