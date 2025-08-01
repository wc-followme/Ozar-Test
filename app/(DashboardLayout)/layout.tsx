import { Header } from '@/components/layout/Header';
import { PermissionAwareSidebar } from '@/components/layout/PermissionAwareSidebar';
import { SideToolbarWrapper } from '@/components/layout/SideToolbarWrapper';
import { PermissionProvider } from '@/lib/permission-context';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('is_authenticated')?.value === 'true';
  const authToken = cookieStore.get('auth_token');

  // Redirect to login if not authenticated
  if (!isAuthenticated || !authToken) {
    redirect('/auth/login');
  }

  return (
    <PermissionProvider>
      <div className='flex bg-[var(--white-background)] min-h-screen'>
        <PermissionAwareSidebar />
        <div className='flex flex-col flex-1'>
          <Header />
          <div className='flex flex-1'>
            <main className='rounded-t-[30px] p-4 md:p-6 md:pb-0 bg-[var(--background)] flex-1'>
              {children}
            </main>
            <SideToolbarWrapper />
          </div>
        </div>
      </div>
    </PermissionProvider>
  );
}
