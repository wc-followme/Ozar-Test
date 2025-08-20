import type React from 'react';
import { HomeOwnerHeader } from '../../components/layout/HomeOwnerHeader';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <div className='flex flex-col flex-1'>
        <HomeOwnerHeader />
        <div className='min-h-[calc(100vh_-_80px)]'>{children}</div>
      </div>
    </div>
  );
}
