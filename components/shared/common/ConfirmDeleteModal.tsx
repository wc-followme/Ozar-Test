import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Trash } from 'iconsax-react';
import * as React from 'react';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  onCancel: () => void;
  onDelete: () => void;
  archiveButtonText?: string;
}

// Custom DialogContent without the close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={
        'fixed left-[50%] bg-[var(--card-background)] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ' +
        (className || '')
      }
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
CustomDialogContent.displayName = 'CustomDialogContent';

export function ConfirmDeleteModal({
  open,
  title,
  subtitle,
  onCancel,
  onDelete,
  archiveButtonText,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <CustomDialogContent className='!max-w-[95%] sm:!max-w-[519px] !rounded-[20px] py-[30px] px-[25px] flex flex-col items-center text-center bg-[var(--card-background)] !gap-0 border-[var(--border-dark)]'>
        <div className='flex items-center justify-center w-16 md:w-[100px] h-16 md:h-[100px] rounded-full bg-redbrand-100 mb-6 mx-auto'>
          <Trash size='40' color='var(--warning)' />
        </div>
        <DialogTitle className='text-base md:text-2xl text-[var(--text-dark)] font-medium mb-2 leading-[1.3] tracking-[-0.025em]'>
          {title}
        </DialogTitle>
        <p className='text-[var(--text-secondary)] mb-6 text-xs md:text-[18px] leading-[1.4]'>
          {subtitle}
        </p>
        <div className='flex gap-2 md:gap-4 w-full justify-center'>
          <Button
            onClick={onCancel}
            className='h-[48px] px-6 md:px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            type='submit'
            className='h-[48px] px-6 md:px-12 bg-[var(--warning)] hover:bg-[var(--warning)] rounded-full font-semibold text-white'
          >
            {archiveButtonText || 'Archive'}
          </Button>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
}
