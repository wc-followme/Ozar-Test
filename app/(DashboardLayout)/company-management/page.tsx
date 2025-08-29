'use client';

import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { apiService, Company, FetchCompaniesResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Refresh, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ArchiveList from './ArchiveList';
import CompanyList from './CompanyList';
import { COMPANY_MESSAGES } from './company-messages';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_page, _setPage] = useState<number>(1);
  const [_hasMore, _setHasMore] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('companies');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const router = useRouter();

  // Destructure constants for cleaner code
  const { COMPANY_LIMIT } = PAGINATION;
  const { ACTIVE, INACTIVE } = CommonStatus;
  const { EDIT, DELETE } = ACTIONS;

  const getMenuOptions = (isArchive: boolean) => {
    if (isArchive) {
      // Archive tab - only show retrieve option
      return [
        {
          label: COMPANY_MESSAGES.RETRIEVE_MENU,
          action: ACTIONS.RETRIEVE,
          icon: Refresh,
          variant: 'default' as const,
        },
      ];
    } else {
      // Active companies tab - show edit and delete options
      return [
        {
          label: COMPANY_MESSAGES.EDIT_MENU,
          action: EDIT,
          icon: Edit2,
          variant: 'default' as const,
        },
        {
          label: COMPANY_MESSAGES.DELETE_MENU,
          action: DELETE,
          icon: Trash,
          variant: 'destructive' as const,
        },
      ];
    }
  };

  // Get user permissions for companies
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.companies?.assign_user;
  const canViewCompany = userPermissions?.companies?.view;

  // Fetch companies
  useEffect(() => {
    fetchCompanies(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when tab changes
  useEffect(() => {
    fetchCompanies(1, false);
  }, [selectedTab]);

  const isCompanyApiResponse = (
    obj: unknown
  ): obj is FetchCompaniesResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as any).data === 'object' &&
      'data' in (obj as any).data &&
      Array.isArray((obj as any).data.data)
    );
  };

  const fetchCompanies = useCallback(async (targetPage = 1, append = false) => {
    setLoading(true);
    try {
      const statusParam = selectedTab === 'archive' ? INACTIVE : ACTIVE;
      
      const res: FetchCompaniesResponse = await apiService.fetchCompanies({
        page: targetPage,
        limit: COMPANY_LIMIT,
        status: statusParam,
        sortOrder: 'ASC',
      });

      if (isCompanyApiResponse(res)) {
        const { data } = res;
        const { data: companiesData, page, totalPages } = data;

        const newCompanies = companiesData;
        setCompanies(prev =>
          append ? [...prev, ...newCompanies] : newCompanies
        );
        _setPage(targetPage);
        _setHasMore(page < totalPages);
      } else {
        // Fallback for unexpected response structure
        setCompanies([]);
        _setHasMore(false);
      }
    } catch (err: unknown) {
      // API Error handling
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, COMPANY_MESSAGES.FETCH_ERROR);
      showErrorToast(message);
      if (!append) setCompanies([]);
      _setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Handler for create company navigation with loading state
  const handleCreateCompany = () => {
    setIsNavigating(true);
    router.push(ROUTES.ADD_COMPANY);
  };

  // Status toggle handler - updated to actually call API
  const handleToggleStatus = async (
    uuid: string,
    currentStatus: 'ACTIVE' | 'INACTIVE'
  ) => {
    try {
      const company = companies.find(c => c.uuid === uuid);
      if (!company || !company.uuid)
        throw new Error(COMPANY_MESSAGES.COMPANY_NOT_FOUND_ERROR);

      // Prevent status changes for default companies
      if (company.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_STATUS_ERROR);
        return;
      }

      const newStatus = currentStatus === ACTIVE ? INACTIVE : ACTIVE;
      const response = await apiService.updateCompanyStatus(
        company.uuid,
        newStatus
      );
      setCompanies(companies =>
        companies.map(c =>
          c.uuid === company.uuid ? { ...c, status: newStatus } : c
        )
      );
      showSuccessToast(
        extractApiSuccessMessage(
          response,
          COMPANY_MESSAGES.STATUS_UPDATE_SUCCESS
        )
      );
      // Refresh list to reflect latest server state based on current tab
      await fetchCompanies(1, false);
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
    }
  };

  // Handler for archiving a company
  const handleArchiveCompany = async (uuid: string) => {
    try {
      const company = companies.find(c => c.uuid === uuid);

      // Prevent archiving of default companies
      if (company?.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_DELETE_ERROR);
        return;
      }

      const response = await apiService.deleteCompany(uuid);
      setCompanies(companies => companies.filter(c => c.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, COMPANY_MESSAGES.DELETE_SUCCESS)
      );
      // Refresh list to reflect latest server state based on current tab
      fetchCompanies(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.DELETE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Handler for retrieving a company
  const handleRetrieveCompany = async (uuid: string) => {
    try {
      const response = await apiService.updateCompanyStatus(uuid, ACTIVE);
      showSuccessToast(
        extractApiSuccessMessage(response, COMPANY_MESSAGES.RETRIEVE_SUCCESS)
      );
      // Refresh list to reflect latest server state based on current tab
      fetchCompanies(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.RETRIEVE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Show navigation loading state
  if (isNavigating) {
    return <LoadingComponent variant='fullscreen' text='Loading form...' />;
  }

  // Check if user has permission to view companies
  if (userPermissions && !canViewCompany) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.COMPANY_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.COMPANY_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.COMPANY_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE}
          </h2>
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
                value='companies'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Companies
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
                  onClick={handleCreateCompany}
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                >
                  <Add size='24' color='#fff' className='sm:hidden' />
                  <span className='hidden sm:inline'>
                    {COMPANY_MESSAGES.ADD_COMPANY_BUTTON}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Companies Tab Content */}
          <TabsContent value='companies' className='mt-6'>
            <CompanyList
              companies={companies}
              loading={loading}
              noDataDescription={COMPANY_MESSAGES.NO_COMPANIES_FOUND_DESCRIPTION}
              menuOptions={getMenuOptions(false)}
              onToggle={handleToggleStatus}
              onDelete={handleArchiveCompany}
              onCreateCompany={handleCreateCompany}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              companies={companies}
              loading={loading}
              noDataTitle={COMPANY_MESSAGES.ARCHIVED_COMPANIES_TITLE}
              noDataDescription={COMPANY_MESSAGES.NO_ARCHIVED_COMPANIES_FOUND}
              menuOptions={getMenuOptions(true)}
              onRetrieve={handleRetrieveCompany}
              onToggle={handleToggleStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
