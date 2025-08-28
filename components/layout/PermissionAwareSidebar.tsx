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
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ScrollArea } from '../ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { MinimalSidebar } from './MinimalSidebar';

export function PermissionAwareSidebar() {
  const versionInfo = process.env['NEXT_PUBLIC_VERSION'];
  const versionUrl = process.env['NEXT_PUBLIC_GITHUB_URL'] || '#';

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const sidebarRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { permissions, isLoading, hasPermission } = usePermissions();
  const pathname = usePathname();

  // Close any open tooltips when sidebar state changes
  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close tooltips when sidebar opens
  useEffect(() => {
    if (isOpen) {
      // Force close any open tooltip portals
      const closeTooltips = () => {
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
    // Return undefined when isOpen is false to satisfy TypeScript
    return undefined;
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
      case SIDEBAR_TITLES.CATALOGUE_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.CATALOGUE_SERVICES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.ROLES_ACCOUNTS:
        return (
          hasPermission(PERMISSION_CATEGORIES.ROLES, PERMISSION_ACTIONS.VIEW) ||
          hasPermission(PERMISSION_CATEGORIES.USERS, PERMISSION_ACTIONS.VIEW)
        );
      case SIDEBAR_TITLES.COMPANY_MANAGEMENT:
        return hasPermission(
          PERMISSION_CATEGORIES.COMPANIES,
          PERMISSION_ACTIONS.VIEW
        );
      case SIDEBAR_TITLES.PROJECTS:
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

  // Filter submenu items based on permissions
  const filterSubmenuItems = (submenu: (typeof sidebarItems)[0]['submenu']) => {
    if (!submenu) return [];
    return submenu.filter(subItem => {
      switch (subItem.title) {
        case SIDEBAR_TITLES.ROLE_MANAGEMENT:
          return hasPermission(
            PERMISSION_CATEGORIES.ROLES,
            PERMISSION_ACTIONS.VIEW
          );
        case SIDEBAR_TITLES.STAFF_MANAGEMENT:
        case SIDEBAR_TITLES.PORTAL_USERS:
          return hasPermission(
            PERMISSION_CATEGORIES.USERS,
            PERMISSION_ACTIONS.VIEW
          );
        case SIDEBAR_TITLES.CATEGORY_MANAGEMENT:
        case SIDEBAR_TITLES.TRADE_MANAGEMENT:
        case SIDEBAR_TITLES.SERVICE_MANAGEMENT:
        case SIDEBAR_TITLES.MATERIAL_MANAGEMENT:
        case SIDEBAR_TITLES.TOOLS_MANAGEMENT:
          return hasPermission(
            PERMISSION_CATEGORIES.CATALOGUE_SERVICES,
            PERMISSION_ACTIONS.VIEW
          );
        default:
          return true;
      }
    });
  };

  const renderMenuItem = (item: (typeof sidebarItems)[0]) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const filteredSubmenu = hasSubmenu ? filterSubmenuItems(item.submenu) : [];
    // Check if item is active - for job management, also check if pathname starts with the href
    const isActive =
      pathname === item.href ||
      (item.menu_id === 'projects' && item.href && pathname?.startsWith(item.href)) ||
      (hasSubmenu &&
        filteredSubmenu.some(subItem => pathname === subItem.href));

    const handleMouseEnter = (event: React.MouseEvent) => {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      setHoveredItem(item.menu_id);
      if (hasSubmenu && sidebarRef.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        setSubmenuPosition({
          top: rect.top,
          left: rect.right + 16, // Remove the 8px gap - stick to sidebar
        });
      }
    };

    const handleMouseLeave = () => {
      // Set a timeout to hide the submenu after a short delay
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
      }, 150); // 150ms delay to allow moving to submenu
    };

    const menuItemContent = (
      <div
        className={cn(
          'flex items-center flex-nowrap w-full pl-[18px] rounded-[16px] h-[60px] text-[var(--text-dark)] hover:text-white transition-colors hover:bg-[var(--primary)] relative',
          isActive && 'bg-[var(--primary)] text-white'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='stroke-[var(--text)] '>
          <item.icon size='24' color={isActive ? 'white' : 'currentcolor'} />
        </div>
        <span
          className={cn(
            'ml-2 max-w-[180px] overflow-hidden text-nowrap text-sm font-medium transition-all duration-300 ',
            isOpen ? 'opacity-100' : 'opacity-0 max-w-0'
          )}
        >
          {item.title}
        </span>
      </div>
    );

    // If item has submenu, don't wrap in Link
    if (hasSubmenu) {
      return menuItemContent;
    }

    // For items without submenu, wrap in Link
    return <Link href={item.href || '#'}>{menuItemContent}</Link>;
  };

  return (
    <TooltipProvider>
      <aside
        ref={sidebarRef}
        className={cn(
          'hidden lg:block transition-all duration-300 ease h-full bg-[var(--white-background)] sticky top-0 z-[50]',
          isOpen ? 'w-[280px]' : 'w-[94px]'
        )}
      >
        <div className='flex flex-col h-screen max-h-[100dvh]'>
          {/* Burger Menu */}
          <div className='w-[60px] h-[60px] flex items-center pl-[18px] mx-4 mt-2'>
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
          <div className='flex-1 min-h-0 flex flex-col'>
            <ScrollArea className='h-full w-full px-4 flex-1'>
              <ul className='py-2 [&>li+li]:mt-0.5'>
                {filteredSidebarItems.map(item => (
                  <li key={item.menu_id}>
                    {isOpen ? (
                      // When sidebar is open, show menu item without tooltip
                      renderMenuItem(item)
                    ) : // When sidebar is collapsed, show menu item with tooltip only if no submenu
                    item.submenu ? (
                      renderMenuItem(item)
                    ) : (
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          {renderMenuItem(item)}
                        </TooltipTrigger>
                        <TooltipContent
                          side='right'
                          sideOffset={8}
                          className='bg-[var(--white-background)] border border-[var(--border-dark)] rounded-lg p-3 text-base z-[9999]'
                        >
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className='p-4 flex text-xs justify-center items-center border-t border-[var(--border-dark)] mt-auto'>
              <Link href={versionUrl}>V-{versionInfo}</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Portal for submenu */}
      {hoveredItem &&
        (() => {
          const item = sidebarItems.find(i => i.menu_id === hoveredItem);
          const hasSubmenu = item?.submenu && item.submenu.length > 0;
          const filteredSubmenu = hasSubmenu
            ? filterSubmenuItems(item.submenu)
            : [];

          if (!hasSubmenu || filteredSubmenu.length === 0) return null;

          return createPortal(
            <div
              className='fixed p-4 bg-[var(--white-background)] flex flex-col gap-1 rounded-2xl shadow-card-hover min-w-[200px] z-50'
              style={{
                top: submenuPosition.top,
                left: submenuPosition.left,
              }}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                  hoverTimeoutRef.current = null;
                }
                setHoveredItem(hoveredItem);
              }}
              onMouseLeave={() => {
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredItem(null);
                }, 150);
              }}
            >
              {filteredSubmenu.map(subItem => (
                <Link
                  key={subItem.menu_id}
                  href={subItem.href || '#'}
                  className={cn(
                    'flex items-center px-4 py-3 text-[var(--text-dark)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors',
                    pathname === subItem.href &&
                      'bg-[var(--primary)] text-white'
                  )}
                  onClick={() => setHoveredItem(null)} // Close submenu when clicking a link
                >
                  <div className='mr-3'>
                    <subItem.icon
                      size='20'
                      color={
                        pathname === subItem.href ? 'white' : 'currentcolor'
                      }
                    />
                  </div>
                  <span className={cn('text-sm font-medium')}>
                    {subItem.title}
                  </span>
                </Link>
              ))}
            </div>,
            document.body
          );
        })()}
    </TooltipProvider>
  );
}
