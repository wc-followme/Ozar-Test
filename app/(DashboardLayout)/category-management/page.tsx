'use client';

import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import CategoryForm from '@/components/shared/forms/CategoryForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';
import { catIconOptions } from '@/constants/icon-options';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { STATUS_CODES } from '@/constants/status-codes';
import { useCompanyChange } from '@/hooks/use-company-change';
import {
  apiService,
  Category,
  CreateCategoryRequest,
  GetCategoryResponse,
  UpdateCategoryRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import {
  CreateCategoryFormData,
  createCategorySchema,
} from '@/lib/validations/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { Add, Edit2, Refresh, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ArchiveList from './ArchiveList';
import CategoryList from './CategoryList';
import { CATEGORY_MESSAGES } from './category-messages';
import { MenuOption } from './category-types';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState('category');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for categories
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.catalogue_services?.edit;
  const canViewCategories = userPermissions?.catalogue_services?.view;

  // Get menu options based on current tab
  const getMenuOptions = (isArchive: boolean): MenuOption[] => {
    if (isArchive) {
      // Archive tab - only show retrieve option
      return [
        {
          label: CATEGORY_MESSAGES.RETRIEVE_MENU,
          action: ACTIONS.RETRIEVE,
          icon: Refresh,
          variant: 'default' as const,
        },
      ];
    } else {
      // Active categories tab - show edit and delete options
      return [
        {
          label: CATEGORY_MESSAGES.EDIT_MENU,
          action: ACTIONS.EDIT,
          icon: Edit2,
          variant: 'default' as const,
        },
        {
          label: CATEGORY_MESSAGES.DELETE_MENU,
          action: ACTIONS.DELETE,
          icon: Trash,
          variant: 'destructive' as const,
        },
      ];
    }
  };

  // Form management with react-hook-form
  const defaultIconOption = useMemo(() => catIconOptions[0], []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setLoading(true);
      }

      try {
        // Get selected company ID using global utility function
        const companyId = getCompanyId();

        // Determine status based on selected tab
        const statusParam =
          selectedTab === 'archive'
            ? CommonStatus.INACTIVE
            : CommonStatus.ACTIVE;

        const res = await apiService.fetchCategories({
          page: targetPage,
          limit: PAGINATION.CATEGORIES_LIMIT,
          status: statusParam,
          ...(companyId ? { company_id: companyId } : {}),
        });

        // Handle different possible response structures
        let newCategories: Category[] = [];
        let total = 0;

        if (res && res.data) {
          const { data } = res;

          // If data is directly an array
          if (Array.isArray(data)) {
            newCategories = data;
            total = data.length;
          }
          // If data is nested under data.data
          else if (data.data && Array.isArray(data.data)) {
            newCategories = data.data;
            total = data.total || data.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(res)) {
            newCategories = res;
            total = res.length;
          }
        }

        setCategories(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(category => category.uuid));
            const uniqueNewCategories = newCategories.filter(
              category => !existingUuids.has(category.uuid)
            );
            return [...prev, ...uniqueNewCategories];
          } else {
            return newCategories;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * PAGINATION.CATEGORIES_LIMIT < total); // Use PAGINATION.LIMIT
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          CATEGORY_MESSAGES.FETCH_ERROR
        );
        showErrorToast(message);
        if (!append) setCategories([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, showErrorToast, selectedTab]
  );

  // Handle company changes
  const refetchCategories = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setCategories([]);
    fetchCategories(1, false);
  }, [fetchCategories]);

  useCompanyChange(refetchCategories);

  // Refetch when tab changes
  useEffect(() => {
    fetchCategories(1, false);
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
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchCategories(nextPage, true);
          return nextPage;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchCategories]);

  // Archive handler (delete category)
  const handleArchiveCategory = async (uuid: string) => {
    try {
      const category = categories.find(c => c.uuid === uuid);

      // Prevent archiving of default categories
      if (category?.is_default) {
        showErrorToast(CATEGORY_MESSAGES.DEFAULT_CATEGORY_DELETE_ERROR);
        return;
      }

      const response = await apiService.deleteCategory(uuid);
      showSuccessToast(
        extractApiSuccessMessage(response, CATEGORY_MESSAGES.DELETE_SUCCESS)
      );
      fetchCategories(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.DELETE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (
    uuid: string,
    currentStatus: 'ACTIVE' | 'INACTIVE'
  ) => {
    try {
      const category = categories.find(c => c.uuid === uuid);
      if (!category || !category.uuid)
        throw new Error(CATEGORY_MESSAGES.CATEGORY_NOT_FOUND_ERROR);

      // Prevent status changes for default categories
      if (category.is_default) {
        showErrorToast(CATEGORY_MESSAGES.DEFAULT_CATEGORY_STATUS_ERROR);
        return;
      }

      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await apiService.updateCategoryStatus(
        category.uuid,
        newStatus
      );
      setCategories(categories =>
        categories.map(c =>
          c.uuid === category.uuid ? { ...c, status: newStatus } : c
        )
      );
      showSuccessToast(
        extractApiSuccessMessage(
          response,
          CATEGORY_MESSAGES.STATUS_UPDATE_SUCCESS
        )
      );
      // Refresh list to reflect latest server state based on current tab
      await fetchCategories(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.STATUS_UPDATE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Handler for retrieving a category
  const handleRetrieveCategory = async (uuid: string) => {
    try {
      
      const response = await apiService.updateCategoryStatus(uuid, 'ACTIVE');
     

      showSuccessToast(
        extractApiSuccessMessage(response, CATEGORY_MESSAGES.RETRIEVE_SUCCESS)
      );

      // Remove the retrieved category from the current list immediately
      setCategories(prev => prev.filter(c => c.uuid !== uuid));

      // Refresh list to reflect latest server state based on current tab
      await fetchCategories(1, false);
    } catch (err: unknown) {
      console.error('Retrieve error:', err); // Debug log
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.RETRIEVE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Fetch category details for editing
  const fetchCategoryDetails = async (uuid: string) => {
    setIsLoadingCategory(true);
    try {
      const response: GetCategoryResponse =
        await apiService.getCategoryDetails(uuid);

      if (response.statusCode === STATUS_CODES.OK && response.data) {
        const { name, description, icon } = response.data;
        setEditingCategory(response.data);

        // Reset form with category data
        reset({
          name,
          description,
          icon,
        });

        setOpen(true);
      } else {
        throw new Error(
          response.message || CATEGORY_MESSAGES.FETCH_DETAILS_ERROR
        );
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.FETCH_DETAILS_ERROR
      );
      showErrorToast(message);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Handle edit category
  const handleEditCategory = (uuid: string) => {
    fetchCategoryDetails(uuid);
  };

  // Handle form submission
  const onSubmit = async (data: CreateCategoryFormData) => {
    setIsSubmitting(true);
    try {
      const { name, description, icon } = data;

      if (editingCategory) {
        // Update existing category
        const { uuid } = editingCategory;
        const updateData: UpdateCategoryRequest = {
          name,
          description,
          icon,
        };

        // Get selected company ID using global utility function
        const companyId = getCompanyId();
        if (companyId) {
          updateData.company_id = companyId;
        }

        const response = await apiService.updateCategory(uuid, updateData);
        if (
          response.statusCode === STATUS_CODES.OK ||
          response.statusCode === STATUS_CODES.CREATED
        ) {
          showSuccessToast(
            extractApiSuccessMessage(response, CATEGORY_MESSAGES.UPDATE_SUCCESS)
          );

          // Update the category in the list
          setCategories(categories =>
            categories.map(c => (c.uuid === uuid ? { ...c, ...updateData } : c))
          );

          // Reset form and close modal
          reset({
            name: '',
            description: '',
            icon: defaultIconOption?.value ?? '',
          });
          setEditingCategory(null);
          setOpen(false);
        } else {
          throw new Error(response.message || CATEGORY_MESSAGES.UPDATE_ERROR);
        }
      } else {
        // Create new category
        const categoryData: CreateCategoryRequest = {
          name,
          description,
          icon,
          status: CommonStatus.ACTIVE, // Default to ACTIVE when creating
          is_default: false, // New categories are not default
        };

        // Get selected company ID using global utility function
        const companyId = getCompanyId();
        if (companyId) {
          categoryData.company_id = companyId;
        }

        const response = await apiService.createCategory(categoryData);
        if (
          response.statusCode === STATUS_CODES.OK ||
          response.statusCode === STATUS_CODES.CREATED
        ) {
          showSuccessToast(
            extractApiSuccessMessage(response, CATEGORY_MESSAGES.CREATE_SUCCESS)
          );

          // Reset form and close modal
          reset({
            name: '',
            description: '',
            icon: defaultIconOption?.value ?? '',
          });
          setOpen(false);

          // Refresh categories list
          fetchCategories(1, false);
        } else {
          throw new Error(response.message || CATEGORY_MESSAGES.CREATE_ERROR);
        }
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        editingCategory
          ? CATEGORY_MESSAGES.UPDATE_ERROR
          : CATEGORY_MESSAGES.CREATE_ERROR
      );
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
    });
  };

  const handleOpenCreateForm = () => {
    // Reset all state for create mode
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
    });
    setOpen(true);
  };

  // Check if user has permission to view categories
  if (userPermissions && !canViewCategories) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.CATEGORY_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.CATEGORY_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.CATEGORY_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {CATEGORY_MESSAGES.CATEGORY_MANAGEMENT_TITLE}
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
                value='category'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Category
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
                  onClick={handleOpenCreateForm}
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                >
                  <Add size='24' color='#fff' className='sm:hidden' />
                  <span className='hidden sm:inline'>
                    {CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Category Tab Content */}
          <TabsContent value='category' className='mt-6'>
            <CategoryList
              categories={categories}
              loading={loading}
              noDataDescription={
                CATEGORY_MESSAGES.NO_CATEGORIES_FOUND_DESCRIPTION
              }
              menuOptions={getMenuOptions(false)}
              onToggle={handleToggleStatus}
              onDelete={handleArchiveCategory}
              onEdit={handleEditCategory}
              onCreateCategory={handleOpenCreateForm}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              categories={categories}
              loading={loading}
              noDataTitle={CATEGORY_MESSAGES.ARCHIVED_CATEGORIES_TITLE}
              noDataDescription={CATEGORY_MESSAGES.NO_ARCHIVED_CATEGORIES_FOUND}
              menuOptions={getMenuOptions(true)}
              onRetrieve={handleRetrieveCategory}
              onToggle={handleToggleStatus}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Category Side Sheet */}
      <SideSheet
        title={
          editingCategory
            ? CATEGORY_MESSAGES.EDIT_CATEGORY_TITLE
            : CATEGORY_MESSAGES.ADD_CATEGORY_TITLE
        }
        open={open}
        onOpenChange={open => {
          if (!open) {
            handleClose(); // Reset state when sheet is closed
          }
          setOpen(open);
        }}
        size='600px'
      >
        <div className='space-y-6'>
          {isLoadingCategory ? (
            <LoadingComponent variant='fullscreen' size='sm' />
          ) : (
            <CategoryForm
              key={editingCategory?.uuid || 'create'} // Force re-render when switching modes
              control={control}
              isSubmitting={isSubmitting}
              editingCategory={editingCategory}
              handleClose={handleClose}
              CATEGORY_MESSAGES={CATEGORY_MESSAGES}
              iconOptions={catIconOptions}
              errors={{
                icon: errors.icon?.message || '',
                name: errors.name?.message || '',
                description: errors.description?.message || '',
              }}
              selectedIcon={watch('icon')}
              setSelectedIcon={val => setValue('icon', val)}
              onSubmit={handleSubmit(onSubmit)}
            />
          )}
        </div>
      </SideSheet>
    </div>
  );
};

export default CategoryManagement;
