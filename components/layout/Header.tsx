'use client';
import { ModeToggle } from '@/components/mode-toggle';
import ChangePasswordForm from '@/components/shared/forms/ChangePasswordForm';
import { Button } from '@/components/ui/button';
import {
  APP_CONFIG,
  CUSTOM_EVENTS,
  ROLE_IDS,
  STORAGE_KEYS,
} from '@/constants/common';
import { COMPANY_IMAGES, HEADER_MESSAGES } from '@/constants/header-messages';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { HambergerMenu, Key } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn, getCompanyId, getCurrentUser } from '../../lib/utils';
import { SignoutIcon } from '../icons/SignoutIcon';
import CompanyDropdown, { Company } from '../shared/common/CompanyDropdown';
import Dropdown from '../shared/common/Dropdown';
import SideSheet from '../shared/common/SideSheet';
import { SidebarMobile } from './SidebarMobile';

const menuOptions = [
  // { label: 'View Profile', action: 'edit', icon: UserOctagon },
  { label: 'Change Password', action: 'changePassword', icon: Key },
  { label: 'Logout', action: 'delete', icon: SignoutIcon },
];

export function Header() {
  const { logout, user } = useAuth();

  // Destructure user data
  const { role, company, profile_picture_url } = user || {};
  const { id: userRoleId } = role || {};
  const { name: userCompany } = company || {};

  // Add scroll direction state
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [profileImageError, setProfileImageError] = useState(false);

  // Fetch companies function
  const fetchCompanies = async () => {
    if (!user) return;

    const isAdmin = userRoleId === ROLE_IDS.ADMIN;

    // Only fetch companies if user is admin
    if (isAdmin) {
      try {
        setLoadingCompanies(true);
        const response = await apiService.getCompaniesDropdown();

        if (response.statusCode === 200 && response.data) {
          // Transform API response to match Company interface
          const transformedCompanies: Company[] = response.data.map(
            ({ uuid, name, image, is_default }: any) => ({
              id: uuid,
              name,
              icon: image
                ? COMPANY_IMAGES.CDN_URL + image
                : COMPANY_IMAGES.PLACEHOLDER,
              is_default,
            })
          );

          setCompanies(transformedCompanies);

          // Load selected company using global utility function
          const savedCompanyId = getCompanyId();
          if (savedCompanyId) {
            // Check if saved company exists in fetched companies
            const foundCompany = transformedCompanies.find(
              c => c.id === savedCompanyId
            );
            setSelectedCompany(foundCompany || transformedCompanies[0]);
          } else {
            // Set company with is_default: true as default, fallback to first company
            const defaultCompany =
              transformedCompanies.find(c => c.is_default) ||
              transformedCompanies[0];
            setSelectedCompany(defaultCompany);
            localStorage.setItem(
              STORAGE_KEYS.SELECTED_COMPANY,
              JSON.stringify(defaultCompany)
            );
          }
        }
      } catch (error) {
        // Fallback to empty array if API fails
        setCompanies([]);
        setSelectedCompany(undefined);
      } finally {
        setLoadingCompanies(false);
      }
    } else {
      // For non-admin users, get company data from user in localStorage
      try {
        const currentUser = getCurrentUser();
        if (currentUser?.company?.uuid && currentUser?.company?.name) {
          // Set selected company in localStorage for non-admin users
          const userCompany: Company = {
            id: currentUser.company.uuid,
            name: currentUser.company.name,
            icon: COMPANY_IMAGES.PLACEHOLDER, // Use placeholder icon for non-admin users
            color: '#000000', // Default color for non-admin users
          };

          // Save to localStorage
          localStorage.setItem(
            STORAGE_KEYS.SELECTED_COMPANY,
            JSON.stringify(userCompany)
          );

          setSelectedCompany(userCompany);
        }
      } catch (error) {
        console.error('Error setting company data for non-admin user:', error);
      } finally {
        setLoadingCompanies(false);
      }
    }
  };

  // Fetch companies from API only for Admin users
  useEffect(() => {
    fetchCompanies();
  }, [user]);

  // Listen for company creation events to refresh the list
  useEffect(() => {
    const handleCompanyCreated = () => {
      fetchCompanies();
    };

    window.addEventListener(
      CUSTOM_EVENTS.COMPANY_CREATED,
      handleCompanyCreated
    );

    return () => {
      window.removeEventListener(
        CUSTOM_EVENTS.COMPANY_CREATED,
        handleCompanyCreated
      );
    };
  }, [user]);

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
    const { DELETE, CHANGE_PASSWORD } = {
      DELETE: 'delete',
      CHANGE_PASSWORD: 'changePassword',
    };

    if (action === DELETE) {
      // Remove selected company from localStorage on logout
      localStorage.removeItem(STORAGE_KEYS.SELECTED_COMPANY);
      logout();
    } else if (action === CHANGE_PASSWORD) {
      setChangePasswordOpen(true);
    }
    return action;
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    localStorage.setItem(
      STORAGE_KEYS.SELECTED_COMPANY,
      JSON.stringify(company)
    );

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.COMPANY_CHANGED, { detail: company })
    );
  };

  // Determine what to show based on user role
  const renderCompanySection = () => {
    if (!user) return null;

    const isAdmin = userRoleId === ROLE_IDS.ADMIN;

    // Show loading state only for admin users while fetching companies
    if (isAdmin && loadingCompanies) {
      return (
        <div className='flex items-center'>
          <span className='text-[var(--text-dark)] text-lg sm:text-2xl font-bold truncate'>
            Loading...
          </span>
        </div>
      );
    }

    // Admin users see the full dropdown
    if (isAdmin) {
      return (
        <CompanyDropdown
          companies={companies}
          selectedCompany={selectedCompany}
          onSelect={handleCompanySelect}
          placeholder={HEADER_MESSAGES.COMPANY_DROPDOWN.PLACEHOLDER}
        />
      );
    }

    // Employee users see their company name only
    if (userCompany) {
      return (
        <div className='flex items-center'>
          <span className='text-[var(--text-dark)] text-lg sm:text-2xl font-bold truncate'>
            {userCompany}
          </span>
        </div>
      );
    }

    // Other roles see "Virtual Homes" as static text
    return (
      <div className='flex items-center'>
        <span className='text-[var(--text-dark)] text-lg sm:text-2xl font-bold truncate'>
          {HEADER_MESSAGES.COMPANY.DEFAULT_NAME}
        </span>
      </div>
    );
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
          {renderCompanySection()}
        </div>
        <div className='flex items-center gap-4 md:gap-6'>
          {/* <div className='items-center border-2 border-[var(--border-dark)] rounded-[20px] overflow-hidden w-[280px] xl:w-[443px] focus-within:border-[var(--secondary)] hidden md:flex'>
            <Input
              id='Search'
              type='Search'
              placeholder={HEADER_MESSAGES.SEARCH.PLACEHOLDER}
              className='pl-4 h-12 text-[16px] border-0 focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-transparent rounded-[10px] !placeholder-[var(--text-placeholder)]'
              required
            />

            <Button className='bg-buttonblue hover:bg-buttonblue text-white h-10 w-10 flex items-center justify-center rounded-[16px] m-1'>
              <Search />
            </Button>
          </div> */}
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
                    profile_picture_url && !profileImageError
                      ? `${APP_CONFIG.CDN_URL}${profile_picture_url}`
                      : APP_CONFIG.IMAGES.USER_PLACEHOLDER
                  }
                  alt='profile'
                  width={40}
                  height={40}
                  className='h-full w-full rounded-full object-cover'
                  onError={() => setProfileImageError(true)}
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
        title={HEADER_MESSAGES.CHANGE_PASSWORD.TITLE}
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        size='600px'
      >
        <ChangePasswordForm onCancel={() => setChangePasswordOpen(false)} />
      </SideSheet>
    </header>
  );
}
