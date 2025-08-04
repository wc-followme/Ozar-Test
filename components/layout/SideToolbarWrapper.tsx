'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import {
  SideToolbar,
  SideToolbarProvider,
  defaultJobToolbarItems,
} from './SideToolbar';

export const SideToolbarWrapper: React.FC = () => {
  const pathname = usePathname();

  // Check if current path is job-management or job-details
  const isJobPage = pathname?.startsWith('/job-management');

  if (!isJobPage) {
    return null;
  }

  return (
    <SideToolbarProvider>
      <SideToolbar
        items={defaultJobToolbarItems}
        className='sticky top-[200px]'
      />
    </SideToolbarProvider>
  );
};
