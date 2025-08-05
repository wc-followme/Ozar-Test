import { SERVICE_MESSAGES } from '@/app/(DashboardLayout)/service-management/service-messages';
import {
  ServiceFormProps,
  Trade,
} from '@/app/(DashboardLayout)/service-management/service-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { serviceFormSchema } from '@/lib/validations/service';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../../ui/use-toast';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

export default function ServiceForm({
  loading,
  onCancel,
  initialServiceUuid,
  onSubmit,
}: ServiceFormProps) {
  const [tradesOption, setTradesOption] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(serviceFormSchema),
    defaultValues: {
      serviceName: '',
      trades: [],
    },
  });

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoadingTrades(true);

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
            console.error('Error parsing selected company:', error);
          }
        }

        const response = await apiService.getTradesDropdown({
          ...(companyId ? { company_id: companyId } : {}),
        });
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          setTradesOption(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch trades:', error);
        setTradesOption([]);
      } finally {
        setLoadingTrades(false);
      }
    };
    fetchTrades();
  }, []);

  useEffect(() => {
    if (!initialServiceUuid || loadingTrades) return;

    const fetchService = async () => {
      try {
        const response = await apiService.getServiceDetails(initialServiceUuid);
        if (response.statusCode === 200 && response.data) {
          const serviceData = response.data;

          // Extract trade IDs from trades array
          const tradeIds = Array.isArray(serviceData.trades)
            ? serviceData.trades.map((trade: any) =>
                trade?.id ? String(trade.id) : null
              )
            : [];

          reset({
            serviceName: serviceData.name || '',
            trades: tradeIds,
          });
        }
      } catch (error) {
        console.error('Failed to fetch service details:', error);
        // Optionally show error toast
      }
    };
    fetchService();
  }, [initialServiceUuid, reset, loadingTrades, tradesOption]);

  const onFormSubmit = async (data: any) => {
    const { serviceName, trades = [] } = data;
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
          console.error('Error parsing selected company:', error);
        }
      }

      const payload = {
        name: serviceName,
        description: '', // You can add a description field to the form if needed
        is_default: false,
        is_active: true,
        status: 'ACTIVE',
        trade_ids: trades.join(','),
        ...(companyId ? { company_id: companyId } : {}),
      };

      if (initialServiceUuid) {
        // Update existing service
        const response = await apiService.updateService(
          initialServiceUuid,
          payload
        );
        const { message, data } = response;
        showSuccessToast(message || SERVICE_MESSAGES.UPDATE_SUCCESS);

        // Call onSubmit with updated service data
        if (onSubmit && data) {
          onSubmit({
            serviceName: data.name || serviceName,
            trades: trades.join(', '),
            serviceData: data,
          });
        }
      } else {
        // Create new service
        const response = await apiService.createService(payload);
        const { message, data } = response;
        showSuccessToast(message || SERVICE_MESSAGES.CREATE_SUCCESS);

        // Call onSubmit with created service data
        if (onSubmit && data) {
          onSubmit({
            serviceName: data.name || serviceName,
            trades: trades.join(', '),
            serviceData: data,
          });
        }
      }

      reset();
      if (onCancel) {
        onCancel();
      }
    } catch (error: unknown) {
      const errorMessage = initialServiceUuid
        ? SERVICE_MESSAGES.UPDATE_ERROR
        : SERVICE_MESSAGES.CREATE_ERROR;

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
        <Label htmlFor='trades' className='field-label text-sm sm:text-base'>
          {SERVICE_MESSAGES.TRADE_LABEL}
        </Label>
        <Controller
          name='trades'
          control={control}
          render={({ field }) => {
            return loadingTrades ? (
              <Input
                disabled
                placeholder={SERVICE_MESSAGES.LOADING_TRADES}
                className='h-12 w-full border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            ) : (
              <MultiSelect
                options={tradesOption}
                getOptionLabel={(option: Trade) => option?.name || ''}
                getOptionValue={(option: Trade) => String(option?.id)}
                value={
                  Array.isArray(field.value)
                    ? field.value.filter(
                        (v): v is string => typeof v === 'string'
                      )
                    : []
                }
                onChange={field.onChange}
                placeholder={SERVICE_MESSAGES.SELECT_TRADE}
                error={errors.trades?.message as string}
                name='trades'
                maxHeight={200}
                maxSelectedItems={1}
              />
            );
          }}
        />
      </div>
      <div className='space-y-1 md:space-y-2'>
        <Label
          htmlFor='serviceName'
          className='field-label text-sm sm:text-base'
        >
          {SERVICE_MESSAGES.SERVICE_NAME_LABEL}
        </Label>
        <Controller
          name='serviceName'
          control={control}
          render={({ field }) => (
            <Input
              id='serviceName'
              {...field}
              placeholder={SERVICE_MESSAGES.ENTER_SERVICE_NAME}
              className={cn(
                'input-field !h-12',
                errors.serviceName
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.serviceName?.message as string} />
      </div>
      <div className='pt-2 flex items-center gap-3 sm:gap-4'>
        <Button
          type='button'
          variant='outline'
          className='btn-secondary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={onCancel}
          disabled={loading}
        >
          {SERVICE_MESSAGES.CANCEL_BUTTON}
        </Button>
        <Button
          type='submit'
          className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={loading}
        >
          {loading
            ? initialServiceUuid
              ? SERVICE_MESSAGES.UPDATING_BUTTON
              : SERVICE_MESSAGES.CREATING_BUTTON
            : initialServiceUuid
              ? SERVICE_MESSAGES.UPDATE_BUTTON
              : SERVICE_MESSAGES.CREATE_BUTTON}
        </Button>
      </div>
    </form>
  );
}
