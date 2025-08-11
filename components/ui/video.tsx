import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface VideoProps extends React.HTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  aspectRatio?: number;
}

const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      className,
      src,
      poster,
      controls = true,
      autoPlay = false,
      muted = false,
      loop = false,
      preload = 'metadata',
      aspectRatio = 16 / 9,
      ...props
    },
    ref
  ) => {
    return (
      <AspectRatio
        ratio={aspectRatio}
        className={cn('overflow-hidden rounded-lg', className)}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          className='h-full w-full object-cover'
          {...props}
        />
      </AspectRatio>
    );
  }
);
Video.displayName = 'Video';

export { Video };
