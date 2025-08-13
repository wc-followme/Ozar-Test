'use client';

import { Video } from '@/components/ui/video';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '../../ui/button';

export const ProfileDetailsComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className='bg-[var(--card-background)] rounded-lg p-5 border border-[var(--border-dark)] w-full'>
      <div className='flex gap-6 lg:flex-row flex-col'>
        {/* Left Section - Text Content */}
        <div className='flex-1 max-w-full'>
          <h3 className='text-sm text-[var(--text-secondary)] mb-2'>About</h3>
          <div className='text-[var(--text-dark)] leading-snug font-medium space-y-3'>
            <div className='relative'>
              <p
                className={`${!isExpanded ? 'lg:block md:hidden line-clamp-5' : ''}`}
              >
                Lorem ipsum dolor sit amet consecte tur adipiscing elit semper
                dalar dolor elementum tempus hac.Lorem ipsum dolor sit amet
                consecte tur adipiscing elit semper dalar dolor elementum tempus
                hac.Lorem ipsum dolor sit amet consecte tur adipiscing elit
                semper dalar dolor elementum tempus hac.Lorem ipsum dolor sit
                amet consecte tur adipiscing elit semper dalar dolor elementum
                tempus hac .Lorem ipsum dolor sit amet consecte tur adipiscing
                elit semper dalar dolor elementum tempus hac.Lorem ipsum dolor
                sit amet consecte tur adipiscing elit semper dalar dolor
                elementum tempus hac.Lorem ipsum dolor sit amet consecte tur
                adipiscing elit semper dalar dolor elementum tempus hac.Lorem
                ipsum dolor sit amet consecte tur adipiscing elit semper dalar
                dolor elementum tempus hac.
              </p>

              {/* Mobile View More/Less Button */}
              <div className='md:hidden mt-3'>
                <button
                  onClick={toggleExpanded}
                  className='text-[var(--primary)] text-sm font-medium hover:underline'
                >
                  {isExpanded ? 'Show Less' : 'View More'}
                </button>
              </div>
            </div>
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
