'use client';

import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION, ROUTES } from '@/constants/common';

import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Refresh, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ArchiveList from './ArchiveList';
import RoleList from './RoleList';
import { ROLE_MESSAGES } from './role-messages';
import type { FetchRolesParams, Role, RoleApiResponse } from './types';

interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

const getMenuOptions = (isDefault: boolean, isArchive: boolean): MenuOption[] => {
  const options: MenuOption[] = [];

  if (isArchive) {
    // Archive tab - only show retrieve option
    options.push({
      label: ROLE_MESSAGES.RETRIEVE_MENU,
      action: ACTIONS.RETRIEVE,
      icon: Refresh,
    });
  } else {
    // Active roles tab - show edit and delete options if not default
    if (!isDefault) {
      options.push(
        {
          label: ROLE_MESSAGES.DELETE_MENU,
          action: ACTIONS.DELETE,
          icon: Trash,
        },
        {
          label: ROLE_MESSAGES.EDIT_MENU,
          action: ACTIONS.EDIT,
          icon: Edit2,
        }
      );
    }
  }

  return options;
};



const RoleManagement = () => {
  // Destructure constants for better readability
  const { CREATE_ROLE, EDIT_ROLE } = ROUTES;
  const { ROLES_LIMIT } = PAGINATION;
  const { ACTIVE } = CommonStatus;

  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(ROLES_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [name] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('roles');
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for roles
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.roles?.edit;
  const canViewRoles = userPermissions?.roles?.view;

  const fetchRoles = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setLoading(true);
      }
      try {
        // Get selected company ID using global utility function
        const company_id = getCompanyId();

        const statusParam = selectedTab === 'archive' ? CommonStatus.INACTIVE : ACTIVE;

        const params: FetchRolesParams = {
          page: targetPage,
          limit,
          search,
          name,
          status: statusParam,
          ...(company_id ? { company_id } : {}),
        };
        const res = (await apiService.fetchRoles(params)) as RoleApiResponse;
        const data = res.data || { data: [], total: 0 };
        const newRoles = data.data;

        setRoles(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(role => role.uuid));
            const uniqueNewRoles = newRoles.filter(
              role => !existingUuids.has(role.uuid)
            );
            return [...prev, ...uniqueNewRoles];
          } else {
            return newRoles;
          }
        });

        const total = data.total;
        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          ROLE_MESSAGES.FETCH_ROLES_ERROR
        );
        showErrorToast(message);
        if (!append) setRoles([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, name, selectedTab]
  );

  // Handle company changes
  const refetchRoles = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setRoles([]);
    fetchRoles(1, false);
  }, [fetchRoles]);

  // Refetch when tab changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setRoles([]);
    fetchRoles(1, false);
  }, [selectedTab]);

  useCompanyChange(refetchRoles);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRoles(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  // Handler for archiving a role
  const handleArchiveRole = async (uuid: string) => {
    try {
      const response = await apiService.updateRoleDetails(uuid, { status: CommonStatus.INACTIVE });
      setRoles(prev => prev.filter(role => role.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, ROLE_MESSAGES.DELETE_SUCCESS)
      );
      // Refresh list to reflect latest server state based on current tab
      refetchRoles();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.DELETE_ERROR);
      showErrorToast(message);
    }
  };

  // Handler for retrieving a role
  const handleRetrieveRole = async (uuid: string) => {
    try {
      const response = await apiService.updateRoleDetails(uuid, { status: CommonStatus.ACTIVE });
      showSuccessToast(
        extractApiSuccessMessage(response, ROLE_MESSAGES.RETRIEVE_SUCCESS)
      );
      // Refresh list to reflect latest server state based on current tab
      refetchRoles();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.RETRIEVE_ERROR);
      showErrorToast(message);
    }
  };

  // Handler for editing a role with loading state
  const handleEditRole = useCallback(
    (uuid: string) => {
      setIsNavigating(true);
      router.push(`${EDIT_ROLE}/${uuid}`);
    },
    [router]
  );

  // Handler for create role navigation with loading state
  const handleCreateRole = useCallback(() => {
    setIsNavigating(true);
    router.push(CREATE_ROLE);
  }, [router]);

  // Show navigation loading state
  if (isNavigating) {
    return <LoadingComponent variant='fullscreen' text='Loading form...' />;
  }



  // Check if user has permission to view roles
  if (userPermissions && !canViewRoles) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.ROLE_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.ROLE_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.ROLE_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>{ROLE_MESSAGES.PAGE_TITLE}</h2>
        </div>
      </div>

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex sm:flex-row flex-col-reverse items-center justify-between sm:gap-3'>
            <TabsList className='grid w-full sm:max-w-[328px] grid-cols-2 bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='roles'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Roles
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
              {canEdit && (
                <button
                  onClick={handleCreateRole}
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                  disabled={loading}
                >
                  <Add size='24' color='#fff' className='sm:hidden' />
                  <span className='hidden sm:inline'>
                    {ROLE_MESSAGES.CREATE_ROLE_BUTTON}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Roles Tab Content */}
          <TabsContent value='roles' className='mt-6'>
            <RoleList
              roles={roles}
              loading={loading}
              noDataDescription={ROLE_MESSAGES.NO_ROLES_FOUND_DESCRIPTION}
              menuOptions={getMenuOptions(false, false)}
              onEdit={handleEditRole}
              onDelete={handleArchiveRole}
              onCreateRole={handleCreateRole}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              roles={roles}
              loading={loading}
              noDataTitle={ROLE_MESSAGES.ARCHIVED_ROLES_TITLE}
              noDataDescription={ROLE_MESSAGES.NO_ARCHIVED_ROLES_FOUND}
              menuOptions={getMenuOptions(false, true)}
              onRetrieve={handleRetrieveRole}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoleManagement;
