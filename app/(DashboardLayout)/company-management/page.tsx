'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import CompanyCardSkeleton from '@/components/shared/skeleton/CompanyCardSkeleton';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION, ROUTES } from '@/constants/common';
import { apiService, Company, FetchCompaniesResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  formatDate,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { COMPANY_MESSAGES } from './company-messages';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_page, _setPage] = useState<number>(1);
  const [_hasMore, _setHasMore] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const router = useRouter();

  // Destructure constants for cleaner code
  const { COMPANY_LIMIT } = PAGINATION;
  const { ACTIVE, INACTIVE } = CommonStatus;
  const { EDIT, DELETE } = ACTIONS;

  // Memoize menu options to prevent unnecessary re-renders
  const menuOptions = [
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

  // Get user permissions for companies
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.companies?.assign_user;

  // Fetch companies
  useEffect(() => {
    fetchCompanies(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchCompanies = async (targetPage = 1, append = false) => {
    setLoading(true);
    try {
      const res: FetchCompaniesResponse = await apiService.fetchCompanies({
        page: targetPage,
        limit: COMPANY_LIMIT,
        status: ACTIVE,
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
  };

  // Handler for create company navigation with loading state
  const handleCreateCompany = () => {
    setIsNavigating(true);
    router.push(ROUTES.ADD_COMPANY);
  };

  // Status toggle handler - updated to actually call API
  const handleToggleStatus = async (
    id: number,
    currentStatus: 'ACTIVE' | 'INACTIVE'
  ) => {
    try {
      const company = companies.find(c => c.id === id);
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

  // Delete handler
  const handleDeleteCompany = async (uuid: string) => {
    try {
      const company = companies.find(c => c.uuid === uuid);

      // Prevent deletion of default companies
      if (company?.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_DELETE_ERROR);
        return;
      }

      const response = await apiService.deleteCompany(uuid);
      setCompanies(companies => companies.filter(c => c.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, COMPANY_MESSAGES.DELETE_SUCCESS)
      );
      // Redirect to company listing page after successful archive
      router.push(ROUTES.COMPANY_MANAGEMENT);
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

  // Show navigation loading state
  if (isNavigating) {
    return <LoadingComponent variant='fullscreen' text='Loading form...' />;
  }

  return (
    <div className='w-full pb-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='page-title'>
            {COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE}
          </h1>
          <div className='flex items-center gap-4 justify-end'>
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
      </div>

      {/* Initial Loading State */}
      {companies.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Company Grid */}
          {companies.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                description={COMPANY_MESSAGES.NO_COMPANIES_FOUND_DESCRIPTION}
                buttonText={COMPANY_MESSAGES.ADD_COMPANY_BUTTON}
                onButtonClick={handleCreateCompany}
                showButton={canEdit ?? false}
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {companies.map(
                ({
                  id,
                  name,
                  created_at,
                  expiry_date,
                  image,
                  status,
                  is_default,
                  uuid,
                }) => (
                  <CompanyCard
                    key={id}
                    name={name}
                    createdOn={formatDate(created_at)}
                    subsEnd={formatDate(expiry_date)}
                    image={
                      image
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + image
                        : ''
                    }
                    status={status === 'ACTIVE'}
                    onToggle={() => handleToggleStatus(id, status)}
                    menuOptions={menuOptions}
                    isDefault={is_default}
                    companyUuid={uuid}
                    onDelete={() => handleDeleteCompany(uuid)}
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {loading && companies.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
