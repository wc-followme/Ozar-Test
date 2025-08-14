import { cn } from '@/lib/utils';
import React from 'react';

interface DynamicScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A ScrollArea component that automatically adjusts its width based on screen size
 * Uses the dynamic width calculation utility for responsive behavior
 */
export const DynamicScrollArea: React.FC<DynamicScrollAreaProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto scrollbar-hide', className)}>
      {children}
    </div>
  );
};
