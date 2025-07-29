'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from '@/components/ui/sheet';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { CloseCircle } from 'iconsax-react';
import * as React from 'react';

interface SideSheetProps {
  title?: string;
  size?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Custom SheetContent without the default close button
const CustomSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: 'left' | 'right' | 'top' | 'bottom';
  }
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={`fixed z-50 gap-4 bg-[var(--card-background)] p-4 md:p-6 !border-0 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm ${className || ''}`}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
CustomSheetContent.displayName = 'CustomSheetContent';

export default function SideSheet({
  title = 'Sidebar',
  children,
  open,
  size = '846px',
  onOpenChange, // ✅ Accept it
}: SideSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <CustomSheetContent
        side='right'
        className={`w-full bg-[var(--card-background)] border-0 overflow-auto`}
        style={{ maxWidth: size }}
      >
        <SheetHeader className='flex items-center flex-row pb-4 md:pb-8'>
          <SheetTitle className='text-[var(--text-dark)] text-xl md:text-2xl font-medium '>
            {title}
          </SheetTitle>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)} // ✅ This now works
            className='ml-auto !mt-0 p-0'
          >
            <CloseCircle size='24' className='!h-6 !w-6' color='#818181' />
          </Button>
        </SheetHeader>
        <div>{children}</div>
      </CustomSheetContent>
    </Sheet>
  );
}
