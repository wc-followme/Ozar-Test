'use client';
import SelectField from '@/components/shared/common/SelectField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';

import AccessDenied from '@/components/shared/common/AccessDenied';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService, FetchUsersResponse, User } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Edit2, Refresh, Trash } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import ArchiveList from '../user-management/ArchiveList';
import UserList from '../user-management/UserList';
import { PORTAL_USER_MESSAGES } from './portal-user-messages';
import { MenuOption, Role, RoleApiResponse } from './types';

export default function PortalUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState('users');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for users
  const userPermissions = getUserPermissionsFromStorage();
  const canViewUsers = userPermissions?.users?.view;

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

  const fetchUsers = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        // Fetch roles only on first load
        if (targetPage === 1) {
          // Get selected company ID using common function
          const companyId = getCompanyId();

          const rolesRes = await apiService.fetchRoles({
            page: 1,
            limit: PAGINATION.ROLES_DROPDOWN_LIMIT,
            status: CommonStatus.ACTIVE, // Only fetch active roles for dropdown
            ...(companyId ? { company_id: companyId } : {}),
          });
          const roleList = isRoleApiResponse(rolesRes)
            ? rolesRes.data.data
            : [];
          setRoles(
            roleList?.map(({ uuid, name, status }) => ({
              uuid,
              name,
              status: status || CommonStatus.ACTIVE,
            }))
          );
        }

        // Get selected company ID using global utility function
        // const companyId = getCompanyId();

        const companyId = '';
        const role_id = filter !== 'all' ? filter : '';
        const user_type = 'portal_users';
        const statusParam =
          selectedTab === 'archive' ? CommonStatus.INACTIVE : CommonStatus.ACTIVE;
        const usersRes: FetchUsersResponse = await apiService.fetchUsers({
          page: targetPage,
          limit: PAGINATION.USERS_LIMIT,
          role_id,
          status: statusParam,
          user_type,
          ...(companyId ? { company_id: companyId } : {}),
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
        const message = extractApiErrorMessage(
          err,
          PORTAL_USER_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setUsers([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [filter, selectedTab]
  );

  // Handle company changes - refetch based on current tab
  const refetchUsers = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setUsers([]);
    fetchUsers(1, false);
  }, [fetchUsers]);

  useCompanyChange(refetchUsers);

  // Refetch when role filter or tab changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setUsers([]);
    fetchUsers(1, false);
  }, [filter, selectedTab]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchUsers(nextPage, true);
          return nextPage;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Status toggle handler
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user || !user.uuid)
        throw new Error(PORTAL_USER_MESSAGES.USER_NOT_FOUND_ERROR);
      const newStatus = currentStatus
        ? CommonStatus.INACTIVE
        : CommonStatus.ACTIVE;
      const response = await apiService.updateUserStatus(user.uuid, newStatus);
      setUsers(users =>
        users.map(u => (u.id === id ? { ...u, status: newStatus } : u))
      );
      showSuccessToast(
        extractApiSuccessMessage(
          response,
          PORTAL_USER_MESSAGES.STATUS_UPDATE_SUCCESS
        )
      );
      // Refresh list to reflect latest server state based on current tab
      refetchUsers();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message =
        err instanceof Error
          ? err.message
          : PORTAL_USER_MESSAGES.STATUS_UPDATE_ERROR;
      showErrorToast(message);
    }
  };

  // Delete handler
  const handleDeleteUser = async (uuid: string) => {
    try {
      const response = await apiService.deleteUser(uuid);
      setUsers(users => users.filter(user => user.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, PORTAL_USER_MESSAGES.DELETE_SUCCESS)
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message =
        err instanceof Error ? err.message : PORTAL_USER_MESSAGES.DELETE_ERROR;
      showErrorToast(message);
    }
  };

  // Retrieve handler
  const handleRetrieveUser = async (uuid: string) => {
    try {
      const response = await apiService.updateUserStatus(uuid, CommonStatus.ACTIVE);
      showSuccessToast(
        extractApiSuccessMessage(response, PORTAL_USER_MESSAGES.STATUS_UPDATE_SUCCESS)
      );
      // Refresh list to reflect latest server state based on current tab
      refetchUsers();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message =
        err instanceof Error ? err.message : PORTAL_USER_MESSAGES.STATUS_UPDATE_ERROR;
      showErrorToast(message);
    }
  };

  const menuOptions: MenuOption[] = selectedTab === 'archive' 
    ? [
        {
          label: PORTAL_USER_MESSAGES.RETRIEVE_BUTTON,
          action: ACTIONS.RETRIEVE,
          icon: Refresh,
          variant: 'default',
        },
      ]
    : [
        {
          label: PORTAL_USER_MESSAGES.EDIT_USER_TITLE,
          action: ACTIONS.EDIT,
          icon: Edit2,
          variant: 'default',
        },
        {
          label: PORTAL_USER_MESSAGES.ARCHIVE_BUTTON,
          action: ACTIONS.DELETE,
          icon: Trash,
          variant: 'destructive',
        },
      ];

  // Check if user has permission to view users
  if (userPermissions && !canViewUsers) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.USER_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.USER_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.USER_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {PORTAL_USER_MESSAGES.PORTAL_USERS_TITLE}
          </h2>
        </div>
      </div>

      {/* Tabs, Filter, and Create Button Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex sm:flex-row flex-col-reverse items-center justify-between gap-3'>
            <TabsList className='grid w-full sm:max-w-[328px] grid-cols-2 bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='users'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
              <SelectField
                value={filter}
                onValueChange={setFilter}
                options={[
                  { value: 'all', label: PORTAL_USER_MESSAGES.ALL_USERS },
                  ...roles
                    .filter(({ name }) =>
                      ['homeowner', 'vendor', 'admin'].includes(
                        name.toLowerCase()
                      )
                    )
                    .map(({ uuid, name }) => ({
                      value: String(uuid),
                      label: name,
                    })),
                ]}
                placeholder={PORTAL_USER_MESSAGES.ALL_USERS}
                className='w-full sm:w-40'
                triggerClassName='bg-[var(--white-background)] rounded-[30px] border-2 border-[var(--border-dark)] h-[42px] shadow-sm sm:shadow-none'
                optionClassName='text-[var(--text-dark)] hover:bg-[var(--select-option)] focus:bg-[var(--select-option)] cursor-pointer rounded-[5px]'
              />
            </div>
          </div>
          {/* Users Tab Content */}
          <TabsContent value='users' className='mt-6'>
            <UserList
              users={users}
              loading={loading}
              noDataDescription={
                PORTAL_USER_MESSAGES.NO_USERS_FOUND_DESCRIPTION
              }
              menuOptions={menuOptions}
              onToggle={handleToggleStatus}
              onDelete={handleDeleteUser}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              users={users}
              loading={loading}
              noDataTitle={PORTAL_USER_MESSAGES.ARCHIVED_USERS_TITLE}
              noDataDescription={PORTAL_USER_MESSAGES.NO_ARCHIVED_USERS_FOUND}
              menuOptions={menuOptions}
              onToggle={handleToggleStatus}
              onDelete={handleDeleteUser}
              onRetrieve={handleRetrieveUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
