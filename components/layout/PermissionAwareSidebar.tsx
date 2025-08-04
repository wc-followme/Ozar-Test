'use client';
import {
  PERMISSION_ACTIONS,
  PERMISSION_CATEGORIES,
  SIDEBAR_TITLES,
  sidebarItems,
} from '@/constants/sidebar-items';
import { usePermissions } from '@/lib/permission-context';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { MinimalSidebar } from './MinimalSidebar';

export function PermissionAwareSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions, isLoading, hasPermission } = usePermissions();
  const pathname = usePathname();

  // Close any open tooltips when sidebar state changes
  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close tooltips when sidebar opens
  useEffect(() => {
    if (isOpen) {
      // Force close any open tooltips when sidebar opens
      const closeTooltips = () => {
        // Find and close any open tooltip portals
        const tooltipPortals = document.querySelectorAll(
          '[data-radix-popper-content-wrapper]'
        );
        tooltipPortals.forEach(portal => {
          if (portal instanceof HTMLElement) {
            portal.style.display = 'none';
          }
        });
      };

      // Small delay to ensure state has updated
      const timeoutId = setTimeout(closeTooltips, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Show minimal sidebar while loading to prevent flash
  if (isLoading) {
    return <MinimalSidebar />;
  }

  // Filter sidebar items based on permissions
  const filteredSidebarItems = sidebarItems.filter(menu_item => {
    // If no permissions loaded, show only home
    if (!permissions) {
      return menu_item.title === SIDEBAR_TITLES.HOME;
    }

    switch (menu_item.title) {
      case SIDEBAR_TITLES.CATEGORY_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.CATEGORIES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.ROLE_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.ROLES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.USER_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.USERS,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.COMPANY_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.COMPANIES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.TRADE_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.TRADES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.SERVICE_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.SERVICES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.MATERIAL_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.MATERIALS,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.TOOLS_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.TOOLS,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.JOBS:
        return (
          hasPermission(PERMISSION_CATEGORIES.JOBS, PERMISSION_ACTIONS.VIEW) ||
          hasPermission(PERMISSION_CATEGORIES.JOBS, PERMISSION_ACTIONS.EDIT)
        );
      case SIDEBAR_TITLES.HOME:
        return true; // Always show home
      default:
        return true; // Show other items by default
    }
  });

  return (
    <aside
      className={cn(
        'hidden lg:block transition-all duration-300 ease h-full bg-[var(--white-background)] sticky top-0 z-[99]',
        isOpen && 'min-w-[276px]'
      )}
    >
      <div className='flex flex-col h-screen max-h-[100dvh]'>
        {/* Burger Menu */}
        <div className='w-[60px] h-[60px] flex items-center px-[18px] mx-4 mt-2'>
          <div
            className='w-[24px] h-[17px] cursor-pointer flex flex-col justify-between'
            onClick={handleSidebarToggle}
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
              {filteredSidebarItems.map(
                ({ menu_id, title, href, icon: Icon }) => (
                  <li key={menu_id}>
                    {isOpen ? (
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
                        <span className='opacity-100 ml-2 max-w-[180px] overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white'>
                          {title}
                        </span>
                      </Link>
                    ) : (
                      <TooltipProvider>
                        <Tooltip
                          key={`tooltip-${menu_id}-${isOpen}`}
                          delayDuration={100}
                        >
                          <TooltipTrigger asChild>
                            <Link
                              href={href}
                              className={cn(
                                'flex items-center flex-nowrap w-full px-[18px] rounded-[16px] h-[60px] text-[var(--text-dark)] transition-colors hover:bg-[var(--primary)] group',
                                pathname === href &&
                                  'bg-[var(--primary)] text-white'
                              )}
                            >
                              <div className='stroke-[var(--text)] group-hover:text-white'>
                                <Icon size='24' color='currentcolor' />
                              </div>
                              <span className='opacity-0 max-w-0 overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white'>
                                {title}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            side='right'
                            sideOffset={8}
                            className='bg-[var(--white-background)] border border-[var(--border-dark)] rounded-lg p-3 text-base z-[9999]'
                          >
                            <p>{title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </li>
                )
              )}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
