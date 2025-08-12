'use client';

import { Video } from '@/components/ui/video';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { Button } from '../../ui/button';

export const ProfileDetailsComponent = () => {
  return (
    <div className='bg-[var(--card-background)] rounded-lg p-5 border border-[var(--border-dark)] w-full'>
      <div className='flex gap-6 lg:flex-row flex-col'>
        {/* Left Section - Text Content */}
        <div className='flex-1 max-w-full'>
          <h3 className='text-sm text-[var(--text-secondary)] mb-2'>About</h3>
          <div className='text-[var(--text-dark)] leading-snug font-medium space-y-3'>
            <p>
              Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
              dalar dolor elementum tempus hac.Lorem ipsum dolor sit amet
              consecte tur adipiscing elit semper dalar dolor elementum tempus
              hac.Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
              dalar dolor elementum tempus hac.Lorem ipsum dolor sit amet
              consecte tur adipiscing elit semper dalar dolor elementum tempus
              hac .Lorem ipsum dolor sit amet consecte tur adipiscing elit
              semper dalar dolor elementum tempus hac.Lorem ipsum dolor sit amet
              consecte tur adipiscing elit semper dalar dolor elementum tempus
              hac.Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
              dalar dolor elementum tempus hac.Lorem ipsum dolor sit amet
              consecte tur adipiscing elit semper dalar dolor elementum tempus
              hac.
            </p>
          </div>
        </div>

        {/* Right Section - Video Thumbnail */}
        <div className='min-w-[232px] h-[156px] relative rounded-2xl bg-[var(--border-dark)] flex items-center justify-center'>
          <Video
            src='https://www.w3schools.com/html/mov_bbb.mp4'
            poster='https://www.w3schools.com/html/mov_bbb.mp4'
            controls={false}
            autoPlay={false}
            muted={true}
            aspectRatio={1.49}
            className='rounded-2xl'
          />
          <Button className='absolute h-8 w-8 bg-[#2D2D2DB2] rounded-full hover:bg-[#2D2D2DB2]'>
            <IconPlayerPlayFilled size={24} color='white' />
          </Button>
        </div>
      </div>
    </div>
  );
};
