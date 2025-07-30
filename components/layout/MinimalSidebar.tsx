'use client';
import { SIDEBAR_TITLES, sidebarItems } from '@/constants/sidebar-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

export function MinimalSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Show only home while loading to prevent flash
  const minimalItems = sidebarItems.filter(
    menu_item => menu_item.title === SIDEBAR_TITLES.HOME
  );

  return (
    <aside className='hidden lg:block transition-all duration-300 ease h-full bg-[var(--white-background)] sticky top-0 opacity-75'>
      <div className='flex flex-col h-screen max-h-[100dvh]'>
        {/* Burger Menu */}
        <div className='w-[60px] h-[60px] flex items-center px-[18px] mx-4 mt-2'>
          <div
            className='w-[24px] h-[17px] cursor-pointer flex flex-col justify-between'
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={cn(
                'block h-[2px] bg-black dark:bg-white rounded transition-transform duration-300',
                isOpen && 'rotate-45 translate-y-[9px]'
              )}
            ></span>
            <span
              className={cn(
                'block h-[2px] bg-black dark:bg-white rounded transition-opacity duration-300',
                isOpen && 'opacity-0 hidden'
              )}
            ></span>
            <span
              className={cn(
                'block h-[2px] bg-black dark:bg-white rounded transition-transform duration-300',
                isOpen && '-rotate-45 -translate-y-[6px]'
              )}
            ></span>
          </div>
        </div>
        {/* Sidebar Links */}
        <div className='flex-1 min-h-0'>
          <ScrollArea className='h-full w-full px-4'>
            <ul className='py-2 [&>li+li]:mt-0.5'>
              {minimalItems.map(({ menu_id, title, href, icon: Icon }) => (
                <li key={menu_id}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center flex-nowrap w-full px-[18px] rounded-[16px] h-[60px] text-[var(--text-dark)] transition-colors hover:bg-[var(--primary)] group',
                      pathname === href && 'bg-[var(--primary)] text-white'
                    )}
                  >
                    <div className='stroke-[var(--text)] group-hover:text-white'>
                      <Icon size='24' color='currentcolor' />
                    </div>
                    <span
                      className={cn(
                        'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white',
                        isOpen
                          ? 'opacity-100 ml-2 max-w-[180px]'
                          : 'opacity-0 max-w-0'
                      )}
                    >
                      {title} sdfsd
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
