import { TRADE_MESSAGES } from '@/app/(DashboardLayout)/trade-management/trade-messages';
import {
  Category,
  TradeFormProps,
} from '@/app/(DashboardLayout)/trade-management/trade-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { cn, getCompanyId } from '@/lib/utils';
import { tradeFormSchema, TradeFormSchema } from '@/lib/validations/trade';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../../ui/use-toast';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

export default function TradeForm({
  loading,
  onCancel,
  initialTradeUuid,
  onSubmit,
}: TradeFormProps) {
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TradeFormSchema>({
    resolver: yupResolver(tradeFormSchema),
    defaultValues: {
      tradeName: '',
      categories: [],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        // Get selected company ID using global utility function
        const companyId = getCompanyId();

        const response = await apiService.getCategoriesDropdown({
          ...(companyId ? { company_id: companyId } : {}),
        });
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          setCategoriesOption(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategoriesOption([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialTradeUuid || loadingCategories) return;

    const fetchTrade = async () => {
      try {
        const response = await apiService.getTradeDetails(initialTradeUuid);
        if (response.statusCode === 200 && response.data) {
          const tradeData = response.data;

          // Extract category IDs from categories array
          const categoryIds = Array.isArray(tradeData.categories)
            ? tradeData.categories.map((category: any) =>
                category?.id ? String(category.id) : null
              )
            : [];

          reset({
            tradeName: tradeData.name || '',
            categories: categoryIds,
          });
        }
      } catch (error) {
        console.error('Failed to fetch trade details:', error);
        // Optionally show error toast
      }
    };
    fetchTrade();
  }, [initialTradeUuid, reset, loadingCategories, categoriesOption]);

  const onFormSubmit = async (data: TradeFormSchema) => {
    const { tradeName, categories } = data;
    try {
      // Get selected company ID using global utility function
      const companyId = getCompanyId();

      const payload = {
        name: tradeName,
        description: '', // You can add a description field to the form if needed
        is_default: false,
        is_active: true,
        status: 'ACTIVE',
        category_ids: categories.join(','),
        ...(companyId ? { company_id: companyId } : {}),
      };

      if (initialTradeUuid) {
        // Update existing trade
        const response = await apiService.updateTrade(
          initialTradeUuid,
          payload
        );
        const { message, data } = response;
        showSuccessToast(message || TRADE_MESSAGES.UPDATE_SUCCESS);

        // Call onSubmit with updated trade data
        if (onSubmit && data) {
          onSubmit({
            tradeName: data.name || tradeName,
            category: categories.join(', '),
            tradeData: data, // Pass the complete trade data
          });
        }
      } else {
        // Create new trade
        const response = await apiService.createTrade(payload);
        const { message, data } = response;
        showSuccessToast(message || TRADE_MESSAGES.CREATE_SUCCESS);

        // Call onSubmit with created trade data
        if (onSubmit && data) {
          onSubmit({
            tradeName: data.name || tradeName,
            category: categories.join(', '),
            tradeData: data, // Pass the complete trade data
          });
        }
      }

      reset();
      if (onCancel) {
        onCancel();
      }
    } catch (error: unknown) {
      const errorMessage = initialTradeUuid
        ? TRADE_MESSAGES.UPDATE_ERROR
        : TRADE_MESSAGES.CREATE_ERROR;

      showErrorToast(
        typeof error === 'object' &&
          error &&
          'message' in error &&
          typeof (error as any).message === 'string'
          ? (error as any).message
          : errorMessage
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className='space-y-4 sm:space-y-6 w-full max-w-xl'
    >
      <div className='space-y-1 md:space-y-2'>
        <Label htmlFor='category' className='field-label text-sm sm:text-base'>
          {TRADE_MESSAGES.CATEGORY_LABEL}
        </Label>
        <Controller
          name='categories'
          control={control}
          render={({ field }) => {
            return loadingCategories ? (
              <Input
                disabled
                placeholder={TRADE_MESSAGES.LOADING_CATEGORIES}
                className='h-12 w-full border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            ) : (
              <MultiSelect
                options={categoriesOption}
                getOptionLabel={(option: Category) => option?.name || ''}
                getOptionValue={(option: Category) => String(option?.id)}
                value={
                  Array.isArray(field.value)
                    ? field.value.filter(
                        (v): v is string => typeof v === 'string'
                      )
                    : []
                }
                onChange={field.onChange}
                placeholder={TRADE_MESSAGES.SELECT_CATEGORY}
                error={errors.categories?.message as string}
                name='category'
                maxHeight={200}
                maxSelectedItems={1}
              />
            );
          }}
        />
      </div>
      <div className='space-y-1 md:space-y-2'>
        <Label htmlFor='tradeName' className='field-label text-sm sm:text-base'>
          {TRADE_MESSAGES.TRADE_NAME_LABEL}
        </Label>
        <Controller
          name='tradeName'
          control={control}
          render={({ field }) => (
            <Input
              id='tradeName'
              {...field}
              placeholder={TRADE_MESSAGES.ENTER_TRADE_NAME}
              className={cn(
                'input-field !h-12',
                errors.tradeName
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.tradeName?.message as string} />
      </div>
      <div className='pt-2 flex flex-row items-center gap-2 sm:gap-4'>
        <Button
          type='button'
          variant='outline'
          className='btn-secondary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={onCancel}
          disabled={loading}
        >
          {TRADE_MESSAGES.CANCEL_BUTTON}
        </Button>
        <Button
          type='submit'
          className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={loading}
        >
          {loading
            ? initialTradeUuid
              ? TRADE_MESSAGES.UPDATING_BUTTON
              : TRADE_MESSAGES.CREATING_BUTTON
            : initialTradeUuid
              ? TRADE_MESSAGES.UPDATE_BUTTON
              : TRADE_MESSAGES.CREATE_BUTTON}
        </Button>
      </div>
    </form>
  );
}
