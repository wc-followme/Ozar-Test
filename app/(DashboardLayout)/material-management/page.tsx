'use client';
import AccessDenied from '@/components/shared/common/AccessDenied';
import SideSheet from '@/components/shared/common/SideSheet';
import MaterialForm from '@/components/shared/forms/MaterialForm';
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
import MaterialList from './MaterialList';
import { MATERIAL_MESSAGES } from './material-messages';
import { Material } from './material-types';

// Get menu options based on current tab
const getMenuOptions = (isArchive: boolean) => {
  if (isArchive) {
    // Archive tab - only show retrieve option
    return [
      {
        label: MATERIAL_MESSAGES.RETRIEVE_MENU,
        action: ACTIONS.RETRIEVE,
        icon: Refresh,
        variant: 'default' as const,
      },
    ];
  } else {
    // Active materials tab - show edit and delete options
    return [
      {
        label: MATERIAL_MESSAGES.EDIT_MENU,
        action: ACTIONS.EDIT,
        icon: Edit2,
        variant: 'default' as const,
      },
      {
        label: MATERIAL_MESSAGES.DELETE_MENU,
        action: ACTIONS.DELETE,
        icon: Trash,
        variant: 'destructive' as const,
      },
    ];
  }
};

export default function MaterialManagementPage() {
  // Destructure constants for better readability
  const { MATERIALS_LIMIT } = PAGINATION;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(MATERIALS_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingMaterialUuid, setEditingMaterialUuid] = useState<
    string | undefined
  >(undefined);
  const [selectedTab, setSelectedTab] = useState('material');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for materials
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.catalogue_services?.edit;
  const canViewMaterials = userPermissions?.catalogue_services?.view;

  const fetchMaterials = useCallback(
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

        const response = await apiService.fetchMaterials({
          page: targetPage,
          limit,
          name: search,
          status: statusParam,
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
    [limit, search, handleAuthError, showErrorToast, selectedTab]
  );

  // Handle company changes
  const refetchMaterials = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setMaterials([]);
    fetchMaterials(1, false);
  }, [fetchMaterials]);

  useCompanyChange(refetchMaterials);

  // Refetch when tab changes
  useEffect(() => {
    fetchMaterials(1, false);
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
        fetchMaterials(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchMaterials, page]);

  const handleEditMaterial = (uuid: string) => {
    setEditingMaterialUuid(uuid);
    setSideSheetOpen(true);
  };

  // Archive handler (set material status to inactive)
  const handleArchiveMaterial = async (uuid: string) => {
    try {
      const material = materials.find(m => m.uuid === uuid);

      // Prevent archiving of default materials
      if (material?.is_default) {
        showErrorToast(
          MATERIAL_MESSAGES.DEFAULT_MATERIAL_DELETE_ERROR ||
            'Cannot archive default material'
        );
        return;
      }

      const response = await apiService.updateMaterialStatus(uuid, 'INACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(response, MATERIAL_MESSAGES.DELETE_SUCCESS)
      );
      fetchMaterials(1, false);
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
  };

  // Handler for retrieving a material
  const handleRetrieveMaterial = async (uuid: string) => {
    try {
      const response = await apiService.updateMaterialStatus(uuid, 'ACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(response, MATERIAL_MESSAGES.RETRIEVE_SUCCESS)
      );

      // Remove the retrieved material from the current list immediately
      setMaterials(prev => prev.filter(m => m.uuid !== uuid));

      // Refresh list to reflect latest server state based on current tab
      await fetchMaterials(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        MATERIAL_MESSAGES.RETRIEVE_ERROR
      );
      showErrorToast(message);
    }
  };

  const handleCreateMaterial = async (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => {
    const { materialName, services, materialData } = data;

    // Get selected company ID using common function
    const companyId = getCompanyId();

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
        status: CommonStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        services: services.split(', ').map(service => ({
          id: Date.now(),
          name: service.trim(),
          status: CommonStatus.ACTIVE,
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
                  status: CommonStatus.ACTIVE,
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
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {MATERIAL_MESSAGES.MATERIAL_MANAGEMENT_TITLE}
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
                value='material'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Material
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
                    {MATERIAL_MESSAGES.ADD_MATERIAL_BUTTON}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Material Tab Content */}
          <TabsContent value='material' className='mt-6'>
            <MaterialList
              materials={materials}
              loading={loading}
              noDataDescription={
                MATERIAL_MESSAGES.NO_MATERIALS_FOUND_DESCRIPTION
              }
              menuOptions={getMenuOptions(false)}
              onDelete={handleArchiveMaterial}
              onEdit={handleEditMaterial}
              onCreateMaterial={() => setSideSheetOpen(true)}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              materials={materials}
              loading={loading}
              noDataTitle={MATERIAL_MESSAGES.ARCHIVED_MATERIALS_TITLE}
              noDataDescription={MATERIAL_MESSAGES.NO_ARCHIVED_MATERIALS_FOUND}
              menuOptions={getMenuOptions(true)}
              onRetrieve={handleRetrieveMaterial}
            />
          </TabsContent>
        </Tabs>
      </div>

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
