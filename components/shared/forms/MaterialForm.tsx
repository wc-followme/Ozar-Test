import { MATERIAL_MESSAGES } from '@/app/(DashboardLayout)/material-management/material-messages';
import {
  MaterialFormProps,
  Service,
} from '@/app/(DashboardLayout)/material-management/material-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { materialFormSchema } from '@/lib/validations/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../../ui/use-toast';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

export default function MaterialForm({
  loading,
  onCancel,
  initialMaterialUuid,
  onSubmit,
}: MaterialFormProps) {
  const [servicesOption, setServicesOption] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(materialFormSchema),
    defaultValues: {
      materialName: '',
      services: [],
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);

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
            // Silently fail if company data is invalid
          }
        }

        const response = await apiService.getServicesDropdown({
          ...(companyId ? { company_id: companyId } : {}),
        });
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          setServicesOption(response.data);
        }
      } catch {
        // Silently fail if services fetch fails
        setServicesOption([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!initialMaterialUuid || loadingServices) return;

    const fetchMaterial = async () => {
      try {
        const response =
          await apiService.getMaterialDetails(initialMaterialUuid);
        if (response.statusCode === 200 && response.data) {
          const materialData = response.data;

          // Extract service IDs from services array
          const serviceIds = Array.isArray(materialData.services)
            ? materialData.services.map((service: any) =>
                service?.id ? String(service.id) : null
              )
            : [];

          reset({
            materialName: materialData.name || '',
            services: serviceIds,
          });
        }
      } catch {
        // Silently fail if material details fetch fails
      }
    };
    fetchMaterial();
  }, [initialMaterialUuid, reset, loadingServices, servicesOption]);

  const onFormSubmit = async (data: any) => {
    const { materialName, services = [] } = data;
    try {
      if (initialMaterialUuid) {
        // Update existing material (without company_id)
        const updatePayload = {
          name: materialName,
          description: '', // You can add a description field to the form if needed
          is_default: false,
          is_active: true,
          status: 'ACTIVE',
          service_ids: services.join(','),
        };

        const response = await apiService.updateMaterial(
          initialMaterialUuid,
          updatePayload
        );
        const { message, data } = response;
        showSuccessToast(message || MATERIAL_MESSAGES.UPDATE_SUCCESS);

        // Call onSubmit with updated material data
        if (onSubmit && data) {
          onSubmit({
            materialName: data.name || materialName,
            services: services.join(', '),
            materialData: data,
          });
        }
      } else {
        // Create new material (with company_id)
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
            // Silently fail if company data is invalid
          }
        }

        const createPayload = {
          name: materialName,
          description: '', // You can add a description field to the form if needed
          is_default: false,
          is_active: true,
          status: 'ACTIVE',
          service_ids: services.join(','),
          ...(companyId ? { company_id: companyId } : {}),
        };

        const response = await apiService.createMaterial(createPayload);
        const { message, data } = response;
        showSuccessToast(message || MATERIAL_MESSAGES.CREATE_SUCCESS);

        // Call onSubmit with created material data
        if (onSubmit && data) {
          onSubmit({
            materialName: data.name || materialName,
            services: services.join(', '),
            materialData: data,
          });
        }
      }

      reset();
      if (onCancel) {
        onCancel();
      }
    } catch (error: unknown) {
      const errorMessage = initialMaterialUuid
        ? MATERIAL_MESSAGES.UPDATE_ERROR
        : MATERIAL_MESSAGES.CREATE_ERROR;

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
        <Label htmlFor='services' className='field-label text-sm sm:text-base'>
          {MATERIAL_MESSAGES.SERVICE_LABEL}
        </Label>
        <Controller
          name='services'
          control={control}
          render={({ field }) => {
            return loadingServices ? (
              <Input
                disabled
                placeholder={MATERIAL_MESSAGES.LOADING_SERVICES}
                className='h-12 w-full border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            ) : (
              <MultiSelect
                options={servicesOption}
                getOptionLabel={(option: Service) => option?.name || ''}
                getOptionValue={(option: Service) => String(option?.id)}
                value={
                  Array.isArray(field.value)
                    ? field.value.filter(
                        (v): v is string => typeof v === 'string'
                      )
                    : []
                }
                onChange={field.onChange}
                placeholder={MATERIAL_MESSAGES.SELECT_SERVICE}
                error={errors.services?.message as string}
                name='services'
                maxHeight={200}
                maxSelectedItems={1}
              />
            );
          }}
        />
      </div>
      <div className='space-y-1 md:space-y-2'>
        <Label
          htmlFor='materialName'
          className='field-label text-sm sm:text-base'
        >
          {MATERIAL_MESSAGES.MATERIAL_NAME_LABEL}
        </Label>
        <Controller
          name='materialName'
          control={control}
          render={({ field }) => (
            <Input
              id='materialName'
              {...field}
              placeholder={MATERIAL_MESSAGES.ENTER_MATERIAL_NAME}
              className={cn(
                'input-field !h-12',
                errors.materialName
                  ? '!border-[var(--warning)]'
                  : '!border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.materialName?.message as string} />
      </div>
      <div className='pt-2 flex sm:items-center gap-3 sm:gap-4'>
        <Button
          type='button'
          variant='outline'
          className='btn-secondary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          onClick={onCancel}
          disabled={loading}
        >
          {MATERIAL_MESSAGES.CANCEL_BUTTON}
        </Button>
        <Button
          type='submit'
          className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={loading}
        >
          {loading
            ? initialMaterialUuid
              ? MATERIAL_MESSAGES.UPDATING_BUTTON
              : MATERIAL_MESSAGES.CREATING_BUTTON
            : initialMaterialUuid
              ? MATERIAL_MESSAGES.UPDATE_BUTTON
              : MATERIAL_MESSAGES.CREATE_BUTTON}
        </Button>
      </div>
    </form>
  );
}
