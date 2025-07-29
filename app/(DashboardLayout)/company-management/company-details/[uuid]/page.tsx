'use client';
import { Search } from '@/components/icons/Search';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { UserCard } from '@/components/shared/cards/UserCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION, ROUTES } from '@/constants/common';
import {
  apiService,
  FetchUsersResponse,
  GetCompanyResponse,
  User,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  formatDate,
} from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Edit2, Trash, UserAdd } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  MenuOption,
  Role,
  RoleApiResponse,
} from '../../../user-management/types';
import { USER_MESSAGES } from '../../../user-management/user-messages';
import { COMPANY_MESSAGES } from '../../company-messages';

interface CompanyDetailsPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

const breadcrumbData: BreadcrumbItem[] = [
  {
    name: COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE,
    href: ROUTES.COMPANY_MANAGEMENT,
  },
  { name: COMPANY_MESSAGES.COMPANY_DETAILS_TITLE }, // current page
];

const CompanyDetails = ({ params }: CompanyDetailsPageProps) => {
  // Destructure constants for better readability
  const { ROLES_DROPDOWN_LIMIT, USERS_LIMIT } = PAGINATION;
  const { ACTIVE, INACTIVE } = CommonStatus;
  const { EDIT, ARCHIVE } = ACTIONS;
  const { COMPANY_MANAGEMENT, ADD_USER } = ROUTES;

  const resolvedParams = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get initial tab from URL parameter, default to 'about'
  const initialTab = searchParams.get('tab') || 'about';

  const [enabled, setEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [filter, setFilter] = useState('all');
  const [company, setCompany] = useState<GetCompanyResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isCompanyApiResponse = (obj: unknown): obj is GetCompanyResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as GetCompanyResponse).data === 'object'
    );
  };

  const isRoleApiResponse = (obj: unknown): obj is RoleApiResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'data' in obj &&
      typeof (obj as RoleApiResponse).data === 'object' &&
      (obj as RoleApiResponse).data !== null &&
      'data' in (obj as RoleApiResponse).data &&
      Array.isArray((obj as RoleApiResponse).data.data)
    );
  };

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompanyDetails(
          resolvedParams.uuid
        );

        if (isCompanyApiResponse(response)) {
          setCompany(response.data);
          setEnabled(response.data.status === 'ACTIVE');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return;
        }
        const errorMessage = extractApiErrorMessage(
          err,
          COMPANY_MESSAGES.FETCH_DETAILS_ERROR
        );
        showErrorToast(errorMessage);
        router.push(COMPANY_MANAGEMENT);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [resolvedParams.uuid, router, showErrorToast, handleAuthError]);

  // Debounced search effect
  useEffect(() => {
    if (selectedTab !== 'usermanagement' || !company) return;

    const timeoutId = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setUsers([]);
      fetchUsers(1, false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filter, selectedTab, company]);

  // Infinite scroll for user management tab
  useEffect(() => {
    if (selectedTab !== 'usermanagement') return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !usersLoading &&
        hasMore
      ) {
        fetchUsers(page + 1, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersLoading, hasMore, page, filter, selectedTab, searchTerm]);

  // Fetch users function - same as user-management page but with company_id filter
  const fetchUsers = async (targetPage = 1, append = false) => {
    if (!company) return;

    setUsersLoading(true);
    try {
      // Fetch roles only on first load
      if (targetPage === 1) {
        const rolesRes = await apiService.fetchRoles({
          page: 1,
          limit: ROLES_DROPDOWN_LIMIT,
          status: ACTIVE, // Only fetch active roles for dropdown
        });
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map((role: Role) => ({ id: role.id, name: role.name }))
        );
      }

      const role_id = filter !== 'all' ? filter : '';
      const searchParam = searchTerm.trim();
      const fetchParams: any = {
        page: targetPage,
        limit: USERS_LIMIT,
        role_id,
        company_id: company.id, // Filter by current company
      };
      if (searchParam) {
        fetchParams.search = searchParam;
      }
      const usersRes: FetchUsersResponse = await apiService.fetchUsers({
        ...fetchParams,
        status: ACTIVE, // Only fetch active users
      });

      const newUsers = usersRes.data;
      setUsers(prev => {
        if (append) {
          // Filter out duplicates when appending to prevent duplicate keys
          const existingUuids = new Set(prev.map(user => user.uuid));
          const uniqueNewUsers = newUsers.filter(
            user => !existingUuids.has(user.uuid)
          );
          return [...prev, ...uniqueNewUsers];
        } else {
          return newUsers;
        }
      });
      setPage(targetPage);
      setHasMore(usersRes.pagination.page < usersRes.pagination.totalPages);
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.FETCH_ERROR);
      showErrorToast(message);
      if (!append) setUsers([]);
      setHasMore(false);
    } finally {
      setUsersLoading(false);
    }
  };

  // User status toggle handler - same as user-management page
  const handleUserToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user || !user.uuid)
        throw new Error(USER_MESSAGES.USER_NOT_FOUND_ERROR);
      const newStatus = currentStatus ? INACTIVE : ACTIVE;
      const response = await apiService.updateUserStatus(user.uuid, newStatus);
      setUsers(users =>
        users.map(u => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.STATUS_UPDATE_SUCCESS)
      );
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }

      const message = extractApiErrorMessage(
        err,
        USER_MESSAGES.STATUS_UPDATE_ERROR
      );
      showErrorToast(message);
    }
  };

  // User delete handler - same as user-management page
  const handleDeleteUser = async (uuid: string) => {
    try {
      const response = await apiService.deleteUser(uuid);
      setUsers(users => users.filter(user => user.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.DELETE_SUCCESS)
      );
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.DELETE_ERROR);
      showErrorToast(message);
    }
  };

  // Filter users based on role
  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role_id === parseInt(filter);
  });

  // Menu options for user cards
  const menuOptions: MenuOption[] = [
    {
      label: USER_MESSAGES.UPDATE_BUTTON,
      action: EDIT,
      icon: Edit2,
      variant: 'default',
    },
    {
      label: USER_MESSAGES.ARCHIVE_BUTTON,
      action: ARCHIVE,
      icon: Trash,
      variant: 'destructive',
    },
  ];

  const switchStyleSm =
    'h-4 w-9 data-[state=checked]:bg-[var(--secondary)] data-[state=unchecked]:bg-gray-300 [&>span]:h-3 [&>span]:w-3  [&>span]:bg-white data-[state=checked]:[&>span]:border-green-400 [&>span]:transition-all [&>span]:duration-200';

  const [isToggling, setIsToggling] = useState(false);

  // Status toggle handler - same as listing page
  const handleToggle = async () => {
    if (!company) return;

    try {
      setIsToggling(true);

      // Prevent status changes for default companies
      if (company.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_STATUS_ERROR);
        return;
      }

      const currentStatus = company.status;
      const newStatus = currentStatus === 'ACTIVE' ? INACTIVE : ACTIVE;

      const response = await apiService.updateCompanyStatus(
        company.uuid,
        newStatus
      );

      // Update local state
      setCompany(prev => (prev ? { ...prev, status: newStatus } : null));
      setEnabled(newStatus === 'ACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(
          response,
          COMPANY_MESSAGES.STATUS_UPDATE_SUCCESS
        )
      );

      // If company is archived (status changed to INACTIVE), redirect to company listing
      if (newStatus === INACTIVE) {
        router.push(COMPANY_MANAGEMENT);
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.STATUS_UPDATE_ERROR
      );
      showErrorToast(message);

      // Revert local state on error
      if (company) {
        setEnabled(company.status === 'ACTIVE');
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return <LoadingComponent variant='page' />;
  }

  if (!company) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-gray-600'>{COMPANY_MESSAGES.COMPANY_NOT_FOUND}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-full overflow-auto'>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} className='mb-6' />
      <div className='p-4 md:p-6 bg-[var(--white-background)] rounded-[16px] md:rounded-[24px] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
        {/* Header */}
        <div className='grid grid-cols-[100px_auto] sm:grid-cols-[120px_auto] gap-4 gap-y-1 sm:gap-y-4 items-start sm:items-start'>
          <div className='flex-shrink-0 row-span-2 w-[100px] sm:w-[120px]'>
            {company.image ? (
              <div className='w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] p-3 rounded-[12px] md:rounded-[16px] border border-[var(--border-dark)] flex items-center justify-center shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
                <Image
                  src={
                    (process.env['NEXT_PUBLIC_CDN_URL'] || '') + company.image
                  }
                  height={120}
                  width={120}
                  alt='company'
                  className='mx-auto object-contain'
                />
              </div>
            ) : (
              <div className='w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-[12px] md:rounded-[16px] border border-[var(--border-dark)] flex items-center justify-center bg-gray-50 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
                <span className='text-gray-400 text-sm text-center'>
                  {COMPANY_MESSAGES.NO_IMAGE_LABEL}
                </span>
              </div>
            )}
          </div>
          <div className='flex flex-col lg:flex-row item-start lg:items-center gap-3 lg:gap-4 lg:border-b border-[var(--border-dark)] pb-3 md:pb-4'>
            <div className='flex-1'>
              <h1 className='text-lg sm:text-xl md:text-[24px] font-bold text-[var(--text-dark)] leading-[1] mb-2'>
                {company.name}
              </h1>
              <p className='text-sm md:text-[16px] text-[var(--text-secondary)] leading-[1]'>
                {COMPANY_MESSAGES.COMPANY_TYPE_LABEL}
              </p>
            </div>

            <div className='flex flex-row items-center gap-2 sm:gap-4'>
              <Link href={`${COMPANY_MANAGEMENT}/edit-company/${company.uuid}`}>
                <Button
                  variant='outline'
                  className='btn-secondary !h-9 text-sm w-auto shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
                >
                  <Edit2
                    size='28'
                    color='currentColor'
                    className='[&_path]:stroke-2'
                  />
                  <span className='text-[var(--text-dark)]'>
                    {COMPANY_MESSAGES.EDIT_DETAILS_BUTTON}
                  </span>
                </Button>
              </Link>
              <Link
                className='!h-9 btn-primary flex items-center justify-center !px-0 sm:!px-6 text-center !w-9 sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100'
                href={`${ADD_USER}?company_id=${company.uuid}`}
              >
                <UserAdd size='20' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {COMPANY_MESSAGES.ADD_USER_BUTTON}
                </span>
              </Link>
            </div>
          </div>
          {/* Info Row */}
          <div className='flex flex-col sm:flex-row gap-3 md:gap-4 col-span-2 lg:col-span-1 flex-wrap'>
            <div className='flex flex-col sm:flex-row sm:gap-6 gap-3 md:gap-14 text-sm md:text-[16px] flex-1 leading-tight'>
              <div>
                <div className='text-[var(--text-secondary)] text-sm'>
                  {COMPANY_MESSAGES.INDUSTRY_LABEL}
                </div>
                <div className='font-medium text-[var(--text-dark)] text-sm'>
                  {COMPANY_MESSAGES.INDUSTRY_VALUE}
                </div>
              </div>
              <div>
                <div className='text-[var(--text-secondary)] text-sm'>
                  {COMPANY_MESSAGES.CREATED_ON_LABEL}
                </div>
                <div className='font-medium text-[var(--text-dark)] text-sm'>
                  {formatDate(company.created_at)}
                </div>
              </div>
              <div>
                <div className='text-[var(--text-secondary)] text-sm'>
                  {COMPANY_MESSAGES.SUBSCRIPTION_ENDS_LABEL}
                </div>
                <div className='font-medium text-[var(--text-dark)] text-sm'>
                  {formatDate(company.expiry_date)}
                </div>
              </div>
            </div>
            {/* Status Toggle */}
            {!company.is_default && (
              <div className='flex gap-3 items-center justify-between bg-[var(--border-light)] rounded-[30px] py-1 px-3 self-start shadow-lg sm:shadow-none'>
                <span className='text-[12px] font-medium text-[var(--text-dark)] w-[100px]'>
                  {enabled
                    ? COMPANY_MESSAGES.ENABLE_LABEL
                    : COMPANY_MESSAGES.DISABLE_LABEL}
                </span>
                <Switch
                  checked={enabled}
                  onCheckedChange={handleToggle}
                  disabled={isToggling}
                  className={switchStyleSm}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
      </div>
      {/* Main Content */}
      <div className='bg-[var(--white-background)] rounded-[16px] md:rounded-[20px] p-4 md:p-[28px] mt-4 min-h-[calc(100vh-370px)] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex justify-center sm:justify-start'>
            <TabsList className='grid grid-cols-[auto_auto] sm:grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal w-full max-w-md sm:w-auto shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='about'
                className='px-3 md:px-6 lg:px-8 py-2 text-sm transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal whitespace-nowrap'
              >
                {COMPANY_MESSAGES.ABOUT_LABEL}
              </TabsTrigger>
              <TabsTrigger
                value='usermanagement'
                className='px-3 md:px-6 lg:px-8 py-2 text-sm transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal whitespace-nowrap'
              >
                {COMPANY_MESSAGES.TAB_USER_MANAGEMENT}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='about' className='py-4 md:py-6'>
            {/* About Section */}
            <div className='bg-[var(--white-background)] rounded-[12px] md:rounded-[16px] border border-[#EAECF0] p-3 md:p-5 mb-4 md:mb-6 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-2'>
                {COMPANY_MESSAGES.ABOUT_LABEL}
              </div>
              <div className='text-sm text-[var(--text-dark)] font-medium leading-tight'>
                {company.about || COMPANY_MESSAGES.NO_DESCRIPTION_LABEL}
              </div>
            </div>
            {/* Contact Info Row */}
            <div className='bg-[var(--white-background)] rounded-[12px] md:rounded-[16px] border border-[#EAECF0] p-3 md:p-5 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 text-sm'>
                <div className='min-w-0'>
                  <div className='font-normal text-[var(--text-secondary)] mb-1 text-sm'>
                    {COMPANY_MESSAGES.EMAIL_LABEL}
                  </div>
                  <div className='text-[var(--text-dark)] text-sm font-medium break-words'>
                    {company.email || COMPANY_MESSAGES.N_A_LABEL}
                  </div>
                </div>
                <div className='min-w-0'>
                  <div className='font-normal text-[var(--text-secondary)] mb-1 text-sm'>
                    {COMPANY_MESSAGES.PHONE_LABEL}
                  </div>
                  <div className='text-[var(--text-dark)] text-sm font-medium break-words'>
                    {company.phone_number || COMPANY_MESSAGES.N_A_LABEL}
                  </div>
                </div>
                <div className='min-w-0'>
                  <div className='font-normal text-[var(--text-secondary)] mb-1 text-sm'>
                    {COMPANY_MESSAGES.ADDRESS_LABEL}
                  </div>
                  <div className='text-[var(--text-dark)] text-sm font-medium break-words'>
                    {company.city && company.pincode
                      ? `${company.city}, ${company.pincode}`
                      : COMPANY_MESSAGES.N_A_LABEL}
                  </div>
                </div>
                <div className='min-w-0'>
                  <div className='font-normal text-[var(--text-secondary)] mb-1 text-sm'>
                    {COMPANY_MESSAGES.COMMUNICATION_LABEL}
                  </div>
                  <div className='text-[var(--text-dark)] text-sm font-medium break-words'>
                    {company.preferred_communication_method ||
                      COMPANY_MESSAGES.N_A_LABEL}
                  </div>
                </div>
                <div className='min-w-0 sm:col-span-2 lg:col-span-1'>
                  <div className='font-normal text-[var(--text-secondary)] mb-1 text-sm'>
                    {COMPANY_MESSAGES.WEBSITE_LABEL}
                  </div>
                  <div className='flex items-center gap-1 text-[var(--text-dark)] text-sm font-medium break-words'>
                    {company.website ? (
                      <>
                        <span className='truncate'>{company.website}</span>
                        <Link
                          href={
                            company.website.startsWith('http')
                              ? company.website
                              : `https://${company.website}`
                          }
                          target='_blank'
                          className='underline ml-1 flex-shrink-0'
                        >
                          ↗
                        </Link>
                      </>
                    ) : (
                      COMPANY_MESSAGES.N_A_LABEL
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='usermanagement' className='py-4 md:py-6'>
            <div className='flex flex-col sm:flex-row justify-between gap-3 md:gap-4'>
              <div className='relative w-full sm:max-w-[360px]'>
                <Input
                  id='search'
                  placeholder={COMPANY_MESSAGES.SEARCH_PLACEHOLDER}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[30px] pl-12 placeholder:text-[var(--text-secondary)] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'
                />
                <Search className='absolute top-3 left-4' />
              </div>
              <SelectField
                value={filter}
                onValueChange={setFilter}
                options={[
                  { value: 'all', label: USER_MESSAGES.ALL_USERS },
                  ...roles.map(role => ({
                    value: String(role.id),
                    label: role.name,
                  })),
                ]}
                placeholder={USER_MESSAGES.ALL_USERS}
                className='w-full sm:w-40 rounded-full'
                optionClassName={''}
                triggerClassName='rounded-full h-[42px] border-2 border-[var(--border-dark)] shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300'
              />
            </div>
            <div className='mt-4 md:mt-6'>
              {/* User Grid */}
              {usersLoading && users.length === 0 ? (
                <LoadingComponent variant='inline' />
              ) : users.length === 0 ? (
                <div className='text-center py-10 text-gray-500'>
                  {USER_MESSAGES.NO_USERS_FOUND}
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'>
                  {filteredUsers.map(
                    ({
                      uuid,
                      name,
                      role,
                      phone_number,
                      email,
                      profile_picture_url,
                      status,
                      id,
                    }) => (
                      <UserCard
                        key={uuid} // Use uuid instead of id for unique keys
                        name={name}
                        role={role?.name || ''}
                        phone={phone_number}
                        email={email}
                        image={
                          profile_picture_url
                            ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') +
                              profile_picture_url
                            : ''
                        }
                        status={status === 'ACTIVE'}
                        onToggle={() =>
                          handleUserToggleStatus(id, status === 'ACTIVE')
                        }
                        onDelete={() => handleDeleteUser(uuid)}
                        menuOptions={menuOptions}
                        userUuid={uuid}
                        disableActions={usersLoading}
                      />
                    )
                  )}
                </div>
              )}
              {usersLoading && users.length > 0 && (
                <div className='text-center py-4'>
                  <LoadingComponent
                    variant='inline'
                    size='sm'
                    text={USER_MESSAGES.LOADING_MORE}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDetails;
