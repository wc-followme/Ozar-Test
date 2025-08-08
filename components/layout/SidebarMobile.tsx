import { sidebarItems } from '@/constants/sidebar-items';
import type { UserPermissions } from '@/lib/api';
import { cn, getUserPermissionsFromStorage } from '@/lib/utils';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

interface SidebarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SidebarMobile({ open, onOpenChange }: SidebarMobileProps) {
  const [userPermissions, setUserPermissions] =
    useState<UserPermissions | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle hydration and permissions loading
  useEffect(() => {
    setIsHydrated(true);
    const permissions = getUserPermissionsFromStorage();
    setUserPermissions(permissions);
  }, []);

  // Filter sidebar items based on permissions
  const filteredSidebarItems = sidebarItems.filter(item => {
    // During SSR or before hydration, show all items to prevent mismatch
    if (!isHydrated) {
      return true;
    }

    switch (item.title) {
      case 'Category Management':
        return userPermissions?.categories?.view;
      case 'Role Management':
        return userPermissions?.roles?.view;
      case 'User Management':
        return userPermissions?.users?.view;
      case 'Company Management':
        return userPermissions?.companies?.view;
      case 'Trade Management':
        return userPermissions?.trades?.view;
      case 'Service Management':
        return userPermissions?.services?.view;
      case 'Material Management':
        return userPermissions?.materials?.view;
      case 'Tools Management':
        return userPermissions?.tools?.view;
      case 'Jobs':
        return userPermissions?.jobs?.edit;
      case 'Home':
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
        case 'Role Management':
          return userPermissions?.roles?.view;
        case 'User Management':
        case 'Portal Users':
          return userPermissions?.users?.view;
        case 'Category Management':
          return userPermissions?.categories?.view;
        case 'Trade Management':
          return userPermissions?.trades?.view;
        case 'Service Management':
          return userPermissions?.services?.view;
        case 'Material Management':
          return userPermissions?.materials?.view;
        case 'Tools Management':
          return userPermissions?.tools?.view;
        default:
          return true;
      }
    });
  };

  const handleSubmenuClick = (item: (typeof sidebarItems)[0]) => {
    if (item.submenu && item.submenu.length > 0) {
      setActiveSubmenu(item.menu_id);
    }
  };

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  const currentItem = activeSubmenu
    ? sidebarItems.find(item => item.menu_id === activeSubmenu)
    : null;

  const filteredSubmenu = currentItem?.submenu
    ? filterSubmenuItems(currentItem.submenu)
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='p-0 w-[320px] max-w-full bg-[var(--card-background)] px-4 border-0 overflow-hidden shadow-2xl'
      >
        <SheetTitle className='hidden'></SheetTitle>
        <div className='relative h-full overflow-hidden'>
          {/* Main Menu */}
          <nav
            className={cn(
              'pt-10 pb-8 absolute inset-0 w-full transition-transform duration-300 ease-in-out',
              activeSubmenu ? '-translate-x-[120%]' : 'translate-x-0'
            )}
          >
            <ul className='py-2 space-y-2'>
              {filteredSidebarItems.map(item => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const filteredSubmenu = hasSubmenu
                  ? filterSubmenuItems(item.submenu)
                  : [];
                const isActive =
                  pathname === item.href ||
                  (hasSubmenu &&
                    filteredSubmenu.some(subItem => pathname === subItem.href));

                return (
                  <li key={item.menu_id}>
                    {hasSubmenu ? (
                      // Item with submenu - click to open submenu
                      <button
                        onClick={() => handleSubmenuClick(item)}
                        className={cn(
                          'flex items-center justify-between flex-nowrap w-full px-4 rounded-[16px] h-[56px] text-[var(--text-dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:shadow-lg group transform hover:scale-[1.02] active:scale-[0.98]',
                          isActive && 'bg-[var(--primary)] text-white shadow-lg'
                        )}
                      >
                        <div className='flex items-center'>
                          <div className='stroke-[var(--text)] group-hover:text-white transition-colors duration-300'>
                            <item.icon size='24' color='currentcolor' />
                          </div>
                          <span
                            className={cn(
                              'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white ml-3 opacity-100 font-medium'
                            )}
                          >
                            {item.title}
                          </span>
                        </div>
                        <ArrowRight2
                          size='20'
                          className=' group-hover:text-white transition-colors duration-300'
                          color='currentcolor'
                        />
                      </button>
                    ) : (
                      // Item without submenu - direct link
                      <Link
                        href={item.href || '#'}
                        className={cn(
                          'flex items-center flex-nowrap w-full px-4 rounded-[16px] h-[56px] text-[var(--text-dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:shadow-lg group transform hover:scale-[1.02] active:scale-[0.98]',
                          isActive && 'bg-[var(--primary)] text-white shadow-lg'
                        )}
                        onClick={() => onOpenChange(false)}
                      >
                        <div className='stroke-[var(--text)] group-hover:text-white transition-colors duration-300'>
                          <item.icon size='24' color='currentcolor' />
                        </div>
                        <span
                          className={cn(
                            'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white ml-3 opacity-100 font-medium'
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Submenu */}
          <nav
            className={cn(
              'pt-10 pb-8 absolute inset-0 w-full transition-transform duration-300 ease-in-out',
              activeSubmenu ? 'translate-x-0' : 'translate-x-[120%]'
            )}
          >
            {/* Back button for submenu */}
            <div className='mb-2'>
              <button
                onClick={handleBackClick}
                className='flex items-center absolute left-0 top-4 text-[var(--text-dark)] rounded-xl transition-colors'
              >
                <ArrowLeft2
                  size='16'
                  className='mr-1'
                  strokeWidth={2}
                  color='var(--text)'
                />{' '}
                Back
              </button>
            </div>

            <ul className='py-2 space-y-2'>
              {filteredSubmenu.map(subItem => (
                <li key={subItem.menu_id}>
                  <Link
                    href={subItem.href || '#'}
                    className={cn(
                      'flex items-center flex-nowrap w-full px-4 rounded-[16px] h-[56px] text-[var(--text-dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:shadow-lg group transform hover:scale-[1.02] active:scale-[0.98]',
                      pathname === subItem.href &&
                        'bg-[var(--primary)] text-white shadow-lg'
                    )}
                    onClick={() => {
                      onOpenChange(false);
                      setActiveSubmenu(null);
                    }}
                  >
                    <div className='stroke-[var(--text)] group-hover:text-white transition-colors duration-300'>
                      <subItem.icon size='24' color='currentcolor' />
                    </div>
                    <span
                      className={cn(
                        'overflow-hidden text-nowrap transition-all duration-300 group-hover:text-white ml-3 opacity-100 font-medium'
                      )}
                    >
                      {subItem.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
