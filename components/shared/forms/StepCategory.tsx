import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import {
  Category,
  StepCategoryData,
  StepCategoryProps,
} from '@/app/(DashboardLayout)/job-management/types';
import { CategoryItem } from '@/app/(DashboardLayout)/templates/template-types';
import CategoryComponent from '@/components/Templates/CategoryComponent';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CommonStatus } from '@/constants/common';
import { catIconOptions } from '@/constants/icon-options';
import { apiService } from '@/lib/api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const categorySchema = yup.object({
  selectedType: yup.string().required(STEP_MESSAGES.PROJECT_TYPE_REQUIRED),
});

export function StepCategory({
  onPrev,
  onSubmit,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
  company_id,
}: StepCategoryProps & { company_id: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const form = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      selectedType: '',
      ...defaultValues,
    },
  });

  const { watch, setValue } = form;
  const selectedType = watch('selectedType');

  // Transform Category[] to CategoryItem[] for CategoryComponent
  const transformCategoriesToCategoryItems = (
    categories: Category[]
  ): CategoryItem[] => {
    return categories.map(category => {
      const { uuid, name, description, icon } = category;

      // Find icon option to get color and bgColor
      const iconOption = catIconOptions.find(opt => opt.value === icon) || {
        icon: () => null,
        color: '#EBB402',
        bgColor: '#EBB4021A',
      };

      return {
        id: uuid || '',
        name: name || STEP_MESSAGES.UNNAMED_CATEGORY,
        description: description || STEP_MESSAGES.NO_DESCRIPTION,
        icon: icon || '',
        color: iconOption.color,
        bgColor: iconOption.bgColor,
      };
    });
  };

  // Fetch categories from API using the existing method
  const fetchCategories = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await apiService.fetchCategoriesPublic({
        page,
        limit: 50,
        status: CommonStatus.ACTIVE,
        company_id, // company_id is required
      });

      const { statusCode, data } = response;

      if (statusCode === 200) {
        const { data: newCategories, totalPages } = data;

        if (append) {
          setCategories(prev => [...prev, ...newCategories]);
        } else {
          setCategories(newCategories);
        }

        setHasMore(page < totalPages);
        setCurrentPage(page);

        // Set default category if it's the first page and no category is selected
        if (page === 1 && !selectedType) {
          const defaultCategory = newCategories.find(
            (cat: Category) => cat.is_default
          );
          if (defaultCategory) {
            setValue('selectedType', defaultCategory.uuid || '');
          }
        }
      }
    } catch (err) {
      console.error(STEP_MESSAGES.FETCH_CATEGORIES_ERROR, err);
      setError(STEP_MESSAGES.FAILED_TO_LOAD_CATEGORIES);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more categories
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchCategories(currentPage + 1, true);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (data: any) => {
    const { selectedType } = data;
    onSubmit({ selectedType } as StepCategoryData);
  };

  // Handle category selection from CategoryComponent
  const handleCategorySelect = (categoryId: string) => {
    setValue('selectedType', categoryId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
        <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
          {STEP_MESSAGES.PROJECT_TYPE_TITLE}
        </h2>
        <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
          {STEP_MESSAGES.PROJECT_TYPE_DESCRIPTION}
        </p>
        <div className='w-full flex items-center justify-center h-64'>
          <div className='text-lg text-gray-600'>
            {STEP_MESSAGES.LOADING_CATEGORIES}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
        <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
          {STEP_MESSAGES.PROJECT_TYPE_TITLE}
        </h2>
        <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
          {STEP_MESSAGES.PROJECT_TYPE_DESCRIPTION}
        </p>
        <div className='w-full flex items-center justify-center h-64'>
          <div className='text-lg text-red-600'>{error}</div>
        </div>
      </div>
    );
  }

  const categoryItems = transformCategoriesToCategoryItems(categories);

  return (
    <div className='w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='selectedType'
            render={({}) => (
              <FormItem>
                <FormControl>
                  <div className='h-auto md:h-[calc(100vh_-_300px)] md:-mx-4 md:px-4 overflow-y-auto'>
                    <CategoryComponent
                      categoryData={categoryItems}
                      selectedCategory={selectedType}
                      onCategorySelect={handleCategorySelect}
                    />

                    {/* Load More Button */}
                    {hasMore && (
                      <div className='flex justify-center mt-6'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={loadMore}
                          disabled={isLoadingMore}
                          className='text-white border-0 bg-[var(--success)] rounded-full py-3'
                        >
                          {isLoadingMore
                            ? STEP_MESSAGES.LOADING
                            : STEP_MESSAGES.LOAD_MORE}
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-full items-center gap-2'>
            {onPrev && (
              <Button
                type='button'
                className={
                  cancelButtonClass ||
                  'btn-secondary !px-4 md:!px-8 text-sm sm:text-base'
                }
                onClick={onPrev}
              >
                {STEP_MESSAGES.PREVIOUS}
              </Button>
            )}
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 text-sm sm:text-base ml-auto'
            >
              {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
