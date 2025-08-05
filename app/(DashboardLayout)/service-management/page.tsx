'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import ServiceForm from '@/components/shared/forms/ServiceForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  ACTIONS,
  CommonStatus,
  PAGINATION,
  STORAGE_KEYS,
} from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import TradeCardSkeleton from '../../../components/shared/skeleton/TradeCardSkeleton';
import { SERVICE_MESSAGES } from './service-messages';
import { Service } from './service-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: SERVICE_MESSAGES.EDIT_MENU,
    action: ACTIONS.EDIT,
    icon: Edit2,
    variant: 'default',
  },
  {
    label: SERVICE_MESSAGES.DELETE_MENU,
    action: ACTIONS.DELETE,
    icon: Trash,
    variant: 'destructive',
  },
];

export default function ServiceManagementPage() {
  // Destructure constants for better readability
  const { EDIT, DELETE } = ACTIONS;
  const { ACTIVE } = CommonStatus;
  const { MATERIALS_LIMIT } = PAGINATION; // Using MATERIALS_LIMIT as it's 32, same as services

  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(MATERIALS_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteServiceName, setDeleteServiceName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingServiceUuid, setEditingServiceUuid] = useState<
    string | undefined
  >(undefined);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for services
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.services?.edit;
  const canViewServices = userPermissions?.services?.view;

  const fetchServices = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setLoading(true);
      }
      try {
        // Get selected company from localStorage
        const selectedCompany = localStorage.getItem(
          STORAGE_KEYS.SELECTED_COMPANY
        );
        let companyId: string | undefined;
        if (selectedCompany) {
          try {
            const parsedCompany = JSON.parse(selectedCompany);
            companyId = parsedCompany.id; // UUID from localStorage
          } catch (error) {
            companyId = undefined;
          }
        }

        const response = await apiService.fetchServices({
          page: targetPage,
          limit,
          name: search,
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
    [limit, search, handleAuthError, showErrorToast]
  );

  // Handle company changes
  const refetchServices = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setServices([]);
    fetchServices(1, false);
  }, [fetchServices]);

  useCompanyChange(refetchServices);

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

  const handleMenuAction = (action: string, idx: number) => {
    const service = services[idx];
    if (!service) return;

    if (action === EDIT) {
      setEditingServiceUuid(service.uuid);
      setSideSheetOpen(true);
    }
    if (action === DELETE) {
      setDeleteIdx(idx);
      setDeleteServiceName(service.name || '');
      setModalOpen(true);
    }
  };

  // Handler for deleting a service
  const handleDeleteService = async (uuid: string) => {
    try {
      const response = await apiService.deleteService(uuid);
      setServices(prev => prev.filter(service => service.uuid !== uuid));
      showSuccessToast(
        extractApiSuccessMessage(response, SERVICE_MESSAGES.DELETE_SUCCESS)
      );
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

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const service = services[deleteIdx];
      if (service) {
        await handleDeleteService(service.uuid);
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateService = async (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => {
    const { serviceName, trades, serviceData } = data;

    // Get selected company from localStorage
    const selectedCompany = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
    let companyId: string | undefined;
    if (selectedCompany) {
      try {
        const parsedCompany = JSON.parse(selectedCompany);
        companyId = parsedCompany.id; // UUID from localStorage
      } catch (error) {
        console.error('Error parsing selected company:', error);
      }
    }

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
        status: ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trades: trades.split(', ').map(trade => ({
          id: Date.now(),
          name: trade.trim(),
          status: ACTIVE,
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
                  status: ACTIVE,
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
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>
            {SERVICE_MESSAGES.SERVICE_MANAGEMENT_TITLE}
          </h2>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                onClick={() => setSideSheetOpen(true)}
              >
                <Add size='24' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {SERVICE_MESSAGES.ADD_SERVICE_BUTTON}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Service Grid */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
        {services.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: 10 }).map((_, idx) => (
            <TradeCardSkeleton key={idx} />
          ))
        ) : services.length === 0 && !loading ? (
          <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
            <NoDataFound
              buttonText={SERVICE_MESSAGES.ADD_SERVICE_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={SERVICE_MESSAGES.NO_SERVICES_FOUND_DESCRIPTION}
              showButton={canEdit ?? false}
            />
          </div>
        ) : (
          services.map((service, idx) => {
            const { uuid, name, trades } = service;
            return (
              <InfoCard
                key={uuid}
                tradeName={name || ''}
                category={`${trades?.length || 0} Trade${(trades?.length || 0) !== 1 ? 's' : ''}`}
                menuOptions={menuOptions}
                onMenuAction={action => handleMenuAction(action, idx)}
                module='services'
              />
            );
          })
        )}
      </div>

      {/* Loading more services */}
      {loading && services.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={SERVICE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={SERVICE_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteServiceName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
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
