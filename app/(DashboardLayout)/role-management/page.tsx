'use client';

import { HelmetIcon } from '@/components/icons/HelmetIcon';
import { RoleCard } from '@/components/shared/cards/RoleCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { roleIconOptions } from '@/constants/sidebar-items';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import RoleCardSkeleton from '../../../components/shared/skeleton/RoleCardSkeleton';
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

const getMenuOptions = (isDefault: boolean): MenuOption[] => {
  const options: MenuOption[] = [];

  // Only show delete option if role is not default
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

  return options;
};

// Adapter for icons that expect className instead of size/color
const IconAdapter = (IconComp: any) => {
  const WrappedIcon = ({ color = '#00a8bf' }) => (
    <IconComp className='w-8 h-8' style={{ color }} />
  );
  WrappedIcon.displayName = `IconAdapter(${IconComp.displayName || IconComp.name || 'Component'})`;
  return WrappedIcon;
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

        const params: FetchRolesParams = {
          page: targetPage,
          limit,
          search,
          name,
          status: ACTIVE, // Only fetch active roles
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
    [limit, search, name]
  );

  // Handle company changes
  const refetchRoles = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setRoles([]);
    fetchRoles(1, false);
  }, []);

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

  // Handler for deleting a role
  const handleDeleteRole = async (uuid: string) => {
    try {
      const response = await apiService.deleteRole(uuid);
      setRoles(prev => prev.filter(role => role.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, ROLE_MESSAGES.DELETE_SUCCESS)
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }
      const message = extractApiErrorMessage(err, ROLE_MESSAGES.DELETE_ERROR);
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

  // Ensure icon options is always an array and has label property
  const safeIconOptions = Array.isArray(roleIconOptions) ? roleIconOptions : [];

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
    <section className=''>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>{ROLE_MESSAGES.PAGE_TITLE}</h2>
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
      </header>

      {/* Initial Loading State */}
      {roles.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
          {[...Array(8)].map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Roles Grid */}
          <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl w-full gap-3 xl:gap-6'>
            {roles.length === 0 && !loading ? (
              <div className='w-full col-span-full h-full md:h-[calc(100vh_-_220px)]'>
                <NoDataFound
                  buttonText={ROLE_MESSAGES.CREATE_ROLE_BUTTON}
                  onButtonClick={handleCreateRole}
                  description={ROLE_MESSAGES.NO_ROLES_FOUND_DESCRIPTION}
                  showButton={canEdit ?? false}
                />
              </div>
            ) : (
              roles?.map(
                ({
                  uuid,
                  icon,
                  name,
                  description,
                  total_permissions,
                  is_default,
                }) => {
                  // Use the icon component directly if it matches the expected signature
                  const iconOptionRaw = safeIconOptions.find(
                    (opt: any) => opt.value === icon
                  );
                  const iconOption = iconOptionRaw
                    ? {
                        ...iconOptionRaw,
                        icon: IconAdapter(iconOptionRaw.icon),
                      }
                    : {
                        icon: IconAdapter(HelmetIcon),
                        color: '#00a8bf',
                      };
                  return (
                    <div key={uuid}>
                      <RoleCard
                        menuOptions={getMenuOptions(is_default ?? false)}
                        iconSrc={iconOption.icon}
                        iconBgColor={iconOption.color + '26'}
                        title={name}
                        description={description}
                        permissionCount={total_permissions || 0}
                        iconColor={iconOption.color}
                        onEdit={() => handleEditRole(uuid)}
                        onDelete={() => handleDeleteRole(uuid)}
                      />
                    </div>
                  );
                }
              )
            )}
          </div>
        </>
      )}

      {/* Loading more roles */}
      {loading && roles.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </section>
  );
};

export default RoleManagement;
