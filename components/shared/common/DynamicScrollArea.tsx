import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn, useDynamicWidth } from '@/lib/utils';
import React from 'react';

interface DynamicScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  widthOptions?: {
    mobilePadding?: number;
    tabletPadding?: number;
    desktopPadding?: number;
    maxMobileWidth?: number;
    maxTabletWidth?: number;
    maxLargeTabletWidth?: number;
    defaultDesktopWidth?: number;
    buttonWidth?: number;
    buttonWidthDesktop?: number;
  };
}

/**
 * A ScrollArea component that automatically adjusts its width based on screen size
 * Uses the dynamic width calculation utility for responsive behavior
 */
export const DynamicScrollArea: React.FC<DynamicScrollAreaProps> = ({
  children,
  className,
  widthOptions,
}) => {
  const dynamicWidth = useDynamicWidth(widthOptions);

  return (
    <ScrollArea
      className={cn('max-w-full flex-1 rounded-full', className)}
      style={{ width: dynamicWidth }}
    >
      {children}
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};
