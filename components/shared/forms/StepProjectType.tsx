import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import {
  Category,
  StepProjectTypeData,
  StepProjectTypeProps,
} from '@/app/(DashboardLayout)/job-management/types';
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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const projectTypeSchema = yup.object({
  selectedType: yup.string().required(STEP_MESSAGES.PROJECT_TYPE_REQUIRED),
});

export function StepProjectType({
  onPrev,
  onSubmit,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
  company_id,
}: StepProjectTypeProps & { company_id: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const form = useForm({
    resolver: yupResolver(projectTypeSchema),
    defaultValues: {
      selectedType: '',
      ...defaultValues,
    },
  });

  const { watch, setValue } = form;
  const selectedType = watch('selectedType');

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
            setValue('selectedType', defaultCategory.id.toString());
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
    onSubmit({ selectedType } as StepProjectTypeData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
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
      <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
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

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {STEP_MESSAGES.PROJECT_TYPE_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {STEP_MESSAGES.PROJECT_TYPE_DESCRIPTION}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='selectedType'
            render={({}) => (
              <FormItem>
                <FormControl>
                  <div className='h-auto md:h-[calc(100vh_-_550px)] md:-mx-4 md:px-4 overflow-y-auto'>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8'>
                      {categories.map((category: Category) => {
                        const { uuid, name, description, is_default, icon } =
                          category;

                        // Map icon string to icon component and colors
                        const iconOption = catIconOptions.find(
                          opt => opt.value === icon
                        ) || {
                          icon: () => null,
                          color: '#EBB402',
                          bgColor: '#EBB4021A',
                        };

                        return (
                          <div
                            key={uuid}
                            className={`flex flex-col items-start border border-[var(--border-dark)] rounded-2xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${selectedType === uuid ? 'bg-[var(--card-hover)] shadow-green-100' : ''}`}
                            onClick={() => setValue('selectedType', uuid || '')}
                          >
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-4`}
                              style={{
                                backgroundColor: iconOption.bgColor,
                                color: iconOption.color,
                              }}
                            >
                              {(() => {
                                const IconComponent = iconOption.icon;
                                if (IconComponent) {
                                  return React.createElement(IconComponent, {
                                    className: 'w-4 h-4 sm:w-5 sm:h-5',
                                  });
                                }
                                return null;
                              })()}
                            </div>
                            <div className='font-bold text-sm sm:text-base mb-2 text-[var(--text-dark)]'>
                              {name || STEP_MESSAGES.UNNAMED_CATEGORY}
                            </div>
                            <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-snug'>
                              {description || STEP_MESSAGES.NO_DESCRIPTION}
                            </div>
                            {is_default && (
                              <div className='mt-2'>
                                <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                                  {STEP_MESSAGES.DEFAULT}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Load More Button */}
                      {hasMore && (
                        <div className='col-span-1 sm:col-span-2 flex justify-center mt-3 sm:mt-4'>
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-full justify-between items-center gap-2'>
            <button
              type='button'
              className={
                cancelButtonClass ||
                'btn-secondary !px-4 md:!px-8 text-sm sm:text-base'
              }
              onClick={onPrev}
            >
              {STEP_MESSAGES.PREVIOUS}
            </button>
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 text-sm sm:text-base'
            >
              {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
