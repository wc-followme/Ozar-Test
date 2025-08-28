'use client';
import AccessDenied from '@/components/shared/common/AccessDenied';
import SideSheet from '@/components/shared/common/SideSheet';
import ServiceForm from '@/components/shared/forms/ServiceForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';
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
import { useCallback, useEffect, useState } from 'react';
import ArchiveList from './ArchiveList';
import ServiceList from './ServiceList';
import { SERVICE_MESSAGES } from './service-messages';
import { Service } from './service-types';

// Get menu options based on current tab
const getMenuOptions = (isArchive: boolean) => {
  if (isArchive) {
    // Archive tab - only show retrieve option
    return [
      {
        label: SERVICE_MESSAGES.RETRIEVE_MENU,
        action: ACTIONS.RETRIEVE,
        icon: Refresh,
        variant: 'default' as const,
      },
    ];
  } else {
    // Active services tab - show edit and delete options
    return [
      {
        label: SERVICE_MESSAGES.EDIT_MENU,
        action: ACTIONS.EDIT,
        icon: Edit2,
        variant: 'default' as const,
      },
      {
        label: SERVICE_MESSAGES.DELETE_MENU,
        action: ACTIONS.DELETE,
        icon: Trash,
        variant: 'destructive' as const,
      },
    ];
  }
};

export default function ServiceManagementPage() {
  // Destructure constants for better readability
  const { MATERIALS_LIMIT } = PAGINATION; // Using MATERIALS_LIMIT as it's 32, same as services

  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(MATERIALS_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingServiceUuid, setEditingServiceUuid] = useState<
    string | undefined
  >(undefined);
  const [selectedTab, setSelectedTab] = useState('service');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for services
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.catalogue_services?.edit;
  const canViewServices = userPermissions?.catalogue_services?.view;

  const fetchServices = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setLoading(true);
      }
      try {
        // Get selected company ID using common function
        const companyId = getCompanyId();

        // Determine status based on selected tab
        const statusParam =
          selectedTab === 'archive'
            ? CommonStatus.INACTIVE
            : CommonStatus.ACTIVE;

        const response = await apiService.fetchServices({
          page: targetPage,
          limit,
          name: search,
          status: statusParam,
          ...(companyId ? { company_id: companyId } : {}),
        });

        // Handle different possible response structures
        let newServices: Service[] = [];
        let total = 0;
        const { data: servicesData } = response;
        if (servicesData) {
          // If data is directly an array
          if (Array.isArray(servicesData)) {
            newServices = servicesData;
            total = servicesData.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (servicesData.data && Array.isArray(servicesData.data)) {
            const { data: nestedData, total: totalCount } = servicesData;
            newServices = nestedData;
            total = totalCount || nestedData.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(servicesData)) {
            newServices = servicesData;
            total = servicesData.length;
          }
        }

        setServices(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(service => service.uuid));
            const uniqueNewServices = newServices.filter(
              service => !existingUuids.has(service.uuid)
            );
            return [...prev, ...uniqueNewServices];
          } else {
            return newServices;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          SERVICE_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setServices([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast, selectedTab]
  );

  // Handle company changes
  const refetchServices = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setServices([]);
    fetchServices(1, false);
  }, [fetchServices]);

  useCompanyChange(refetchServices);

  // Refetch when tab changes
  useEffect(() => {
    fetchServices(1, false);
  }, [selectedTab]);

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
        fetchServices(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchServices, page]);

  const handleEditService = (uuid: string) => {
    setEditingServiceUuid(uuid);
    setSideSheetOpen(true);
  };

  // Archive handler (set service status to inactive)
  const handleArchiveService = async (uuid: string) => {
    try {
      const service = services.find(s => s.uuid === uuid);

      // Prevent archiving of default services
      if (service?.is_default) {
        showErrorToast(
          SERVICE_MESSAGES.DEFAULT_SERVICE_DELETE_ERROR ||
            'Cannot archive default service'
        );
        return;
      }

      const response = await apiService.updateServiceStatus(uuid, 'INACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(response, SERVICE_MESSAGES.DELETE_SUCCESS)
      );
      fetchServices(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        SERVICE_MESSAGES.DELETE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Handler for retrieving a service
  const handleRetrieveService = async (uuid: string) => {
    try {
      const response = await apiService.updateServiceStatus(uuid, 'ACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(response, SERVICE_MESSAGES.RETRIEVE_SUCCESS)
      );

      // Remove the retrieved service from the current list immediately
      setServices(prev => prev.filter(s => s.uuid !== uuid));

      // Refresh list to reflect latest server state based on current tab
      await fetchServices(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        SERVICE_MESSAGES.RETRIEVE_ERROR
      );
      showErrorToast(message);
    }
  };

  const handleCreateService = async (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => {
    const { serviceName, trades, serviceData } = data;

    // Get selected company ID using common function
    const companyId = getCompanyId();

    // Use the actual service data from API response if available
    if (serviceData) {
      // Add the new service to the beginning of the services list
      setServices(prevServices => [serviceData, ...prevServices]);
    } else {
      // Fallback: Create a new service object to add to local state
      const newService: Service = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: serviceName,
        description: '',
        is_default: false,
        is_active: true,
        status: CommonStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trades: trades.split(', ').map(trade => ({
          id: Date.now(),
          name: trade.trim(),
          status: CommonStatus.ACTIVE,
        })),
        ...(companyId ? { company_id: companyId } : {}),
      };

      // Add the new service to the beginning of the services list
      setServices(prevServices => [newService, ...prevServices]);
    }
  };

  const handleUpdateService = async (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => {
    const { serviceName, trades, serviceData } = data;

    // Use the actual service data from API response if available
    if (serviceData) {
      // Update the service in local state with the actual API response data
      setServices(prevServices =>
        prevServices.map(service =>
          service.uuid === editingServiceUuid ? serviceData : service
        )
      );
    } else {
      // Fallback: Update the service in local state manually
      setServices(prevServices =>
        prevServices.map(service =>
          service.uuid === editingServiceUuid
            ? {
                ...service,
                name: serviceName,
                trades: trades.split(', ').map(trade => ({
                  id: Date.now(),
                  name: trade.trim(),
                  status: CommonStatus.ACTIVE,
                })),
                updated_at: new Date().toISOString(),
              }
            : service
        )
      );
    }
  };

  // Check if user has permission to view services
  if (userPermissions && !canViewServices) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.SERVICE_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.SERVICE_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.SERVICE_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {SERVICE_MESSAGES.SERVICE_MANAGEMENT_TITLE}
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
                value='service'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Service
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
                <Button
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                  onClick={() => setSideSheetOpen(true)}
                >
                  <Add size='24' color='#fff' className='sm:hidden' />
                  <span className='hidden sm:inline'>
                    {SERVICE_MESSAGES.ADD_SERVICE_BUTTON}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Service Tab Content */}
          <TabsContent value='service' className='mt-6'>
            <ServiceList
              services={services}
              loading={loading}
              noDataDescription={SERVICE_MESSAGES.NO_SERVICES_FOUND_DESCRIPTION}
              menuOptions={getMenuOptions(false)}
              onDelete={handleArchiveService}
              onEdit={handleEditService}
              onCreateService={() => setSideSheetOpen(true)}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              services={services}
              loading={loading}
              noDataTitle={SERVICE_MESSAGES.ARCHIVED_SERVICES_TITLE}
              noDataDescription={SERVICE_MESSAGES.NO_ARCHIVED_SERVICES_FOUND}
              menuOptions={getMenuOptions(true)}
              onRetrieve={handleRetrieveService}
            />
          </TabsContent>
        </Tabs>
      </div>

      <SideSheet
        title={
          editingServiceUuid
            ? SERVICE_MESSAGES.EDIT_SERVICE_TITLE
            : SERVICE_MESSAGES.ADD_SERVICE_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingServiceUuid(undefined);
          }
        }}
        size='600px'
      >
        <ServiceForm
          onSubmit={
            editingServiceUuid ? handleUpdateService : handleCreateService
          }
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingServiceUuid(undefined);
          }}
          initialServiceUuid={editingServiceUuid}
        />
      </SideSheet>
    </div>
  );
}
