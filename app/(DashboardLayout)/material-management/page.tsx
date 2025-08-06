'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import MaterialForm from '@/components/shared/forms/MaterialForm';
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
import { MATERIAL_MESSAGES } from './material-messages';
import { Material } from './material-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: MATERIAL_MESSAGES.EDIT_MENU,
    action: ACTIONS.EDIT,
    icon: Edit2,
    variant: 'default',
  },
  {
    label: MATERIAL_MESSAGES.DELETE_MENU,
    action: ACTIONS.DELETE,
    icon: Trash,
    variant: 'destructive',
  },
];

export default function MaterialManagementPage() {
  // Destructure constants for better readability
  const { EDIT, DELETE } = ACTIONS;
  const { ACTIVE } = CommonStatus;
  const { MATERIALS_LIMIT } = PAGINATION;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(MATERIALS_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingMaterialUuid, setEditingMaterialUuid] = useState<
    string | undefined
  >(undefined);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for materials
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.materials?.edit;
  const canViewMaterials = userPermissions?.materials?.view;

  const fetchMaterials = useCallback(
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
          } catch {
            companyId = undefined;
          }
        }

        const response = await apiService.fetchMaterials({
          page: targetPage,
          limit,
          name: search,
          ...(companyId ? { company_id: companyId } : {}),
        });

        // Handle different possible response structures
        let newMaterials: Material[] = [];
        let total = 0;
        const { data: materialsData } = response;
        if (materialsData) {
          // If data is directly an array
          if (Array.isArray(materialsData)) {
            newMaterials = materialsData;
            total = materialsData.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (materialsData.data && Array.isArray(materialsData.data)) {
            newMaterials = materialsData.data;
            total = materialsData.total || materialsData.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(materialsData)) {
            newMaterials = materialsData;
            total = materialsData.length;
          }
        }

        setMaterials(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(material => material.uuid));
            const uniqueNewMaterials = newMaterials.filter(
              material => !existingUuids.has(material.uuid)
            );
            return [...prev, ...uniqueNewMaterials];
          } else {
            return newMaterials;
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
          MATERIAL_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setMaterials([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast]
  );

  // Handle company changes
  const refetchMaterials = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setMaterials([]);
    fetchMaterials(1, false);
  }, [fetchMaterials]);

  useCompanyChange(refetchMaterials);

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
        fetchMaterials(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchMaterials, page]);

  const handleMenuAction = (action: string, idx: number) => {
    const material = materials[idx];
    if (!material) return;

    if (action === EDIT) {
      setEditingMaterialUuid(material.uuid);
      setSideSheetOpen(true);
    }
    if (action === DELETE) {
      setDeleteIdx(idx);
      setDeleteMaterialName(material.name || '');
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const material = materials[deleteIdx];
      if (material) {
        const { uuid } = material;
        try {
          const response = await apiService.deleteMaterial(uuid);
          showSuccessToast(
            extractApiSuccessMessage(response, MATERIAL_MESSAGES.DELETE_SUCCESS)
          );
          // Remove the material from local state instead of fetching again
          setMaterials(prevMaterials =>
            prevMaterials.filter((_, index) => index !== deleteIdx)
          );
        } catch (err: unknown) {
          // Handle auth errors first (will redirect to login if 401)
          if (handleAuthError(err)) {
            return; // Don't show toast if it's an auth error
          }

          const message = extractApiErrorMessage(
            err,
            MATERIAL_MESSAGES.DELETE_ERROR
          );
          showErrorToast(message);
        }
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateMaterial = async (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => {
    const { materialName, services, materialData } = data;

    // Get selected company from localStorage
    const selectedCompany = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
    let companyId: string | undefined;
    if (selectedCompany) {
      try {
        const parsedCompany = JSON.parse(selectedCompany);
        companyId = parsedCompany.id; // UUID from localStorage
      } catch {
        // Silently fail if company data is invalid
      }
    }

    // Use the actual material data from API response if available
    if (materialData) {
      // Add the new material to the beginning of the materials list
      setMaterials(prevMaterials => [materialData, ...prevMaterials]);
    } else {
      // Fallback: Create a new material object to add to local state
      const newMaterial: Material = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: materialName,
        description: '',
        is_default: false,
        is_active: true,
        status: ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        services: services.split(', ').map(service => ({
          id: Date.now(),
          name: service.trim(),
          status: ACTIVE,
        })),
        ...(companyId ? { company_id: companyId } : {}),
      };

      // Add the new material to the beginning of the materials list
      setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);
    }
  };

  const handleUpdateMaterial = async (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => {
    const { materialName, services, materialData } = data;

    // Use the actual material data from API response if available
    if (materialData) {
      // Update the material in local state with the actual API response data
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.uuid === editingMaterialUuid ? materialData : material
        )
      );
    } else {
      // Fallback: Update the material in local state manually
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.uuid === editingMaterialUuid
            ? {
                ...material,
                name: materialName,
                services: services.split(', ').map(service => ({
                  id: Date.now(),
                  name: service.trim(),
                  status: ACTIVE,
                })),
                updated_at: new Date().toISOString(),
              }
            : material
        )
      );
    }
  };

  // Check if user has permission to view materials
  if (userPermissions && !canViewMaterials) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.MATERIAL_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.MATERIAL_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.MATERIAL_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>
            {MATERIAL_MESSAGES.MATERIAL_MANAGEMENT_TITLE}
          </h2>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                onClick={() => setSideSheetOpen(true)}
              >
                <Add size='24' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {MATERIAL_MESSAGES.ADD_MATERIAL_BUTTON}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Material Grid */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
        {materials.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: MATERIALS_LIMIT }).map((_, idx) => (
            <TradeCardSkeleton key={idx} />
          ))
        ) : materials.length === 0 && !loading ? (
          <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
            <NoDataFound
              buttonText={MATERIAL_MESSAGES.ADD_MATERIAL_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={MATERIAL_MESSAGES.NO_MATERIALS_FOUND_DESCRIPTION}
              showButton={canEdit ?? false}
            />
          </div>
        ) : (
          materials.map((material, idx) => (
            <InfoCard
              key={material.uuid}
              tradeName={material.name || ''}
              category={`${material.services?.length || 0} Service${(material.services?.length || 0) !== 1 ? 's' : ''}`}
              menuOptions={menuOptions}
              onMenuAction={action => handleMenuAction(action, idx)}
              module='materials'
            />
          ))
        )}
      </div>

      {/* Loading more materials */}
      {loading && materials.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={MATERIAL_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={MATERIAL_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteMaterialName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title={
          editingMaterialUuid
            ? MATERIAL_MESSAGES.EDIT_MATERIAL_TITLE
            : MATERIAL_MESSAGES.ADD_MATERIAL_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingMaterialUuid(undefined);
          }
        }}
        size='600px'
      >
        <MaterialForm
          onSubmit={
            editingMaterialUuid ? handleUpdateMaterial : handleCreateMaterial
          }
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingMaterialUuid(undefined);
          }}
          initialMaterialUuid={editingMaterialUuid}
        />
      </SideSheet>
    </div>
  );
}
