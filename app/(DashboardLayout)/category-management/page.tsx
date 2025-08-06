'use client';

import { CategoryCard } from '@/components/shared/cards/CategoryCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import CategoryForm from '@/components/shared/forms/CategoryForm';
import CategoryCardSkeleton from '@/components/shared/skeleton/CategoryCardSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { catIconOptions } from '@/constants/sidebar-items';
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
import { Add, Edit2, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORY_MESSAGES } from './category-messages';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for categories
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.categories?.edit;
  const canViewCategories = userPermissions?.categories?.view;

  // Memoize menu options to prevent unnecessary re-renders
  const menuOptions = useMemo(
    () => [
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
    ],
    []
  );

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

        const res = await apiService.fetchCategories({
          page: targetPage,
          limit: PAGINATION.CATEGORIES_LIMIT,
          status: CommonStatus.ACTIVE, // Only fetch active categories
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
    [handleAuthError, showErrorToast]
  );

  // Handle company changes
  const refetchCategories = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setCategories([]);
    fetchCategories(1, false);
  }, [fetchCategories]);

  useCompanyChange(refetchCategories);

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

  // Delete handler
  const handleDeleteCategory = async (uuid: string) => {
    try {
      const category = categories.find(c => c.uuid === uuid);

      // Prevent deletion of default categories
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
    <section className='w-full pb-4'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>
            {CATEGORY_MESSAGES.CATEGORY_MANAGEMENT_TITLE}
          </h2>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                onClick={handleOpenCreateForm}
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
              >
                <Add size='24' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
                </span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Categories Grid */}
      {categories.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
          {[...Array(8)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {categories.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                description={CATEGORY_MESSAGES.NO_CATEGORIES_FOUND_DESCRIPTION}
                buttonText={CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
                onButtonClick={handleOpenCreateForm}
                showButton={canEdit ?? false}
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
              {categories.map((category, index) => {
                const iconOption = catIconOptions.find(
                  opt => opt.value === category.icon
                ) || {
                  icon: () => null,
                  color: '#00a8bf',
                };
                return (
                  <CategoryCard
                    key={category.uuid || index}
                    name={category.name}
                    description={category.description}
                    iconSrc={props => {
                      const Icon = iconOption.icon;
                      // Map size prop to Tailwind class, and color to a text color class
                      const sizeClass = props.size
                        ? `w-[${props.size}px] h-[${props.size}px]`
                        : 'w-8 h-8';
                      const colorClass = props.color
                        ? `text-[${props.color}]`
                        : '';
                      return <Icon className={`${sizeClass} ${colorClass}`} />;
                    }}
                    iconColor={iconOption.color}
                    iconBgColor={iconOption.color + '26'}
                    menuOptions={menuOptions}
                    categoryUuid={category.uuid}
                    onDelete={() => handleDeleteCategory(category.uuid)}
                    onEdit={() => handleEditCategory(category.uuid)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {loading && categories.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

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
    </section>
  );
};

export default CategoryManagement;
