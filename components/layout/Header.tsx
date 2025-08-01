'use client';
import { ModeToggle } from '@/components/mode-toggle';
import ChangePasswordForm from '@/components/shared/forms/ChangePasswordForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { HambergerMenu, Key, UserOctagon } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Search } from '../icons/Search';
import { SignoutIcon } from '../icons/SignoutIcon';
import Dropdown from '../shared/common/Dropdown';
import EmployeesDropdown, {
  Employee,
} from '../shared/common/EmployeesDropdown';
import SideSheet from '../shared/common/SideSheet';
import { Input } from '../ui/input';
import { SidebarMobile } from './SidebarMobile';

const menuOptions = [
  { label: 'View Profile', action: 'edit', icon: UserOctagon },
  { label: 'Change Password', action: 'changePassword', icon: Key },
  { label: 'Logout', action: 'delete', icon: SignoutIcon },
];
export function Header() {
  const { logout, user } = useAuth();

  // Add scroll direction state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >({
    id: '1',
    name: 'Virtual Homes',
    icon: '/images/company-management/company-img-1.png',
    color: '#8B5CF6',
  });

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll behavior on tablet and smaller screens (lg breakpoint and below)
      if (window.innerWidth < 1024) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          // Scrolling down
          setShowHeader(false);
        } else {
          // Scrolling up
          setShowHeader(true);
        }
        lastScrollY.current = currentScrollY;
      } else {
        // On desktop (lg and above), always show header
        setShowHeader(true);
      }
    };

    // Also handle resize to update behavior when screen size changes
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowHeader(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMenuAction = (action: string) => {
    if (action === 'delete') {
      logout();
    } else if (action === 'changePassword') {
      setChangePasswordOpen(true);
    }
    return action;
  };
  return (
    <header
      className={cn(
        'bg-[var(--white-background)] px-4 md:px-6 py-3 sticky top-0 z-50 transition-transform ease-in-out duration-200',
        showHeader ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className='flex h-14 items-center gap-3'>
        <div className='block lg:hidden'>
          <Button
            onClick={() => setSideSheetOpen(true)}
            variant='ghost'
            size='icon'
          >
            <HambergerMenu
              size='64'
              color='var(--text-dark)'
              className='!h-7 !w-7'
            />
          </Button>
          <SidebarMobile open={sideSheetOpen} onOpenChange={setSideSheetOpen} />
        </div>
        <div className='flex items-center w-fit flex-auto'>
          <EmployeesDropdown
            selectedEmployee={selectedEmployee}
            onSelect={setSelectedEmployee}
            placeholder='Select Company'
          />
        </div>
        <div className='flex items-center gap-4 md:gap-6'>
          <div className='items-center border-2 border-[var(--border-dark)] rounded-[20px] overflow-hidden w-[280px] xl:w-[443px] focus-within:border-[var(--secondary)] hidden md:flex'>
            {/* Search Input */}
            <Input
              id='Search'
              type='Search'
              placeholder='What are you looking for?'
              className='pl-4 h-12 text-[16px] border-0 focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-transparent rounded-[10px] placeholder-[#C0C6CD] !placeholder-[var(--text-placeholder)]'
              required
            />
            {/* Type Selector */}
            {/* <div className="flex items-center px-3 cursor-pointer gap-1">
              <span className="text-gray-900 font-medium text-sm">{type}</span>
              <ChevronDown className=" text-gray-700" />
            </div> */}

            {/* Search Button */}
            <Button className='bg-[#263796] hover:bg-[#263796] text-white h-10 w-10 flex items-center justify-center rounded-[16px] m-1'>
              <Search />
            </Button>
          </div>
          <ModeToggle />
          {/* <Link href='/'>
            <Notification />
          </Link> */}
          <Dropdown
            menuOptions={menuOptions}
            onAction={handleMenuAction}
            trigger={
              <Button
                variant='ghost'
                size='sm'
                className='h-10 w-10 p-0 flex-shrink-0 self-center rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2'
              >
                <Image
                  src={
                    user?.profile_picture_url ||
                    '/images/user-img-placeholder.png'
                  }
                  alt='profile'
                  width={40}
                  height={40}
                  className='h-full w-full rounded-full object-cover'
                />
              </Button>
            }
            align='end'
            className='min-w-[185px] p-[10px]'
            itemsClass='py-3'
          />
        </div>
      </div>
      <SideSheet
        title='Change Password'
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        size='600px'
      >
        <ChangePasswordForm onCancel={() => setChangePasswordOpen(false)} />
      </SideSheet>
    </header>
  );
}
