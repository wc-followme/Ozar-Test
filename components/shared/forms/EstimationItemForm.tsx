'use client';

import { MATERIAL_MESSAGES } from '@/app/(DashboardLayout)/material-management/material-messages';
import SelectField from '@/components/shared/common/SelectField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { calculateLineTotal } from '@/lib/estimation-calculations';
import { IconDotsVertical } from '@tabler/icons-react';
import { EyeSlash, Paintbucket, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import Dropdown from '../common/Dropdown';
import { EstimationItem } from './estimation-types';

interface EstimationItemFormProps {
  item: EstimationItem;
  onItemUpdate?: (updatedItem: EstimationItem) => void;
  onDelete?: () => void;
  serviceId?: string | undefined; // Add service ID prop for fetching materials
}

export default function EstimationItemForm({
  item,
  onItemUpdate,
  onDelete,
  serviceId, // Add service ID prop
}: EstimationItemFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    item.markup_type === 'PERCENTAGE' ? '%' : '$'
  );
  const [materialOptions, setMaterialOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch materials from API based on service ID and company UUID
  const fetchMaterials = async (
    serviceId: string | null,
    companyUuid: string | null
  ) => {
    // Early return if required parameters are missing
    if (!serviceId || !companyUuid || serviceId === '' || companyUuid === '') {
      setMaterialOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.fetchMaterialsPublic({
        page: 1,
        limit: 50,
        company_id: companyUuid,
        service_id: serviceId,
      });

      type MaterialItem = {
        id?: string | number;
        uuid?: string;
        name?: string;
      };
      const payload = response as unknown as {
        data?: MaterialItem[] | { data?: MaterialItem[] };
      };
      const list: MaterialItem[] = Array.isArray(payload?.data)
        ? (payload.data as MaterialItem[])
        : Array.isArray((payload?.data as { data?: MaterialItem[] })?.data)
          ? ((payload.data as { data?: MaterialItem[] }).data as MaterialItem[])
          : [];

      const options = list
        .filter(m => !!m?.name)
        .map(m => ({
          value: String(m.uuid || m.id || m.name),
          label: String(m.name),
        }));

      setMaterialOptions(options);
    } catch (error) {
      // Only log error if we actually made an API call (i.e., parameters were valid)
      // and if it's not an expected error due to missing parameters
      if (
        serviceId &&
        companyUuid &&
        serviceId !== '' &&
        companyUuid !== '' &&
        error &&
        typeof error === 'object' &&
        Object.keys(error).length > 0 // Don't log empty error objects
      ) {
        console.error('Error fetching materials:', error);
        console.error('Service ID:', serviceId);
        console.error('Company UUID:', companyUuid);
      }
      setMaterialOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Update selectedCurrency when item changes
  useEffect(() => {
    setSelectedCurrency(item.markup_type === 'PERCENTAGE' ? '%' : '$');
  }, [item.markup_type]);

  // Load materials when component mounts or when service/company changes
  useEffect(() => {
    // Clear material options immediately if serviceId is null or undefined
    if (!serviceId) {
      setMaterialOptions([]);
      return;
    }

    const selectedCompanyRaw =
      typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY)
        : null;
    const companyUuid = selectedCompanyRaw
      ? (() => {
          try {
            const parsed: { uuid?: string; id?: string | number } =
              JSON.parse(selectedCompanyRaw);
            return parsed?.uuid || (parsed?.id ? String(parsed.id) : '');
          } catch {
            return '';
          }
        })()
      : '';

    fetchMaterials(serviceId, companyUuid);
  }, [serviceId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const currencyOptions = [
    { value: '$', label: '$' },
    { value: '%', label: '%' },
  ];

  const handleInputChange = (
    field: keyof EstimationItem,
    value: string | number
  ) => {
    if (onItemUpdate) {
      onItemUpdate({
        ...item,
        [field]: value,
        markup_type: selectedCurrency === '%' ? 'PERCENTAGE' : 'FLAT_AMOUNT',
      });
    }
  };

  return (
    <div className='border border-[var(--border-dark)] rounded-[10px] p-4 bg-[var(--white-background)]'>
      <div className='flex items-start gap-4 mb-2'>
        <div className='space-y-2 flex-1'>
          <Label className='field-label text-sm'>Material Name</Label>
          <SelectField
            value={(() => {
              // Find the option that matches the current material name
              const matchingOption = materialOptions.find(
                option => option.label === item.name
              );
              return matchingOption ? matchingOption.value : item.name;
            })()}
            onValueChange={newValue => {
              // Find the selected option to get the display name and UUID
              const selectedOption = materialOptions.find(
                option => option.value === newValue
              );
              const newName = selectedOption ? selectedOption.label : newValue;
              const materialUuid = selectedOption
                ? selectedOption.value
                : undefined;

              // Update both name and UUID
              if (onItemUpdate) {
                onItemUpdate({
                  ...item,
                  name: newName,
                  ...(materialUuid && { uuid: materialUuid }), // Only add uuid if it exists
                  markup_type:
                    selectedCurrency === '%' ? 'PERCENTAGE' : 'FLAT_AMOUNT',
                });
              }
            }}
            options={materialOptions}
            placeholder={
              loading
                ? MATERIAL_MESSAGES.LOADING_MATERIALS_DROPDOWN
                : 'Select material'
            }
            className='mb-0'
            disabled={loading}
          />
        </div>
        <div className='space-y-2 flex-1'>
          <Label className='field-label text-sm'>Variant</Label>
          <SelectField
            value={item.variant}
            onValueChange={value => handleInputChange('variant', value)}
            options={[{ value: item.variant, label: item.variant }]}
            placeholder='Select variant'
            className='mb-0'
          />
        </div>
        <div className='space-y-2 w-[150px]'>
          <Label className='field-label text-sm'>Qty</Label>
          <Input
            type='text'
            value={item.qty.toString()}
            onChange={e => {
              const value = e.target.value;
              // Only allow numbers
              if (/^\d*$/.test(value)) {
                const numericValue = value === '' ? 0 : parseInt(value) || 0;
                handleInputChange('qty', numericValue);
              }
            }}
            onKeyDown={e => {
              // Allow: backspace, delete, tab, escape, enter, and numbers
              const allowedKeys = [
                'Backspace',
                'Delete',
                'Tab',
                'Escape',
                'Enter',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
              ];

              if (allowedKeys.includes(e.key) || /^[0-9]$/.test(e.key)) {
                return;
              }

              e.preventDefault();
            }}
            className='input-field'
          />
        </div>
        <div className='space-y-2 w-[150px]'>
          <Label className='field-label text-sm'>Unit</Label>
          <SelectField
            value={item.unit}
            onValueChange={value => handleInputChange('unit', value)}
            options={[{ value: item.unit, label: item.unit }]}
            placeholder='Select unit'
            className='mb-0'
          />
        </div>
        <div className='self-center pt-8'>
          <Dropdown
            menuOptions={[
              {
                label: 'Hide Line Item',
                action: 'hide',
                icon: EyeSlash,
              },
              {
                label: 'Send to Finishes',
                action: 'send-to-finishes',
                icon: Paintbucket,
              },
              {
                label: 'Delete line item',
                action: 'delete',
                icon: Trash,
              },
            ]}
            onAction={action => {
              switch (action) {
                case 'hide':
                  // Handle hide line item
                  break;
                case 'send-to-finishes':
                  // Handle send to finishes
                  break;
                case 'delete':
                  // Handle delete
                  if (onDelete) onDelete();
                  break;
                default:
                  break;
              }
            }}
            trigger={
              <button
                className='text-[var(--text-secondary)] hover:text-[var(--text-dark)] transition-colors'
                type='button'
              >
                <IconDotsVertical size={24} color='var(--text-dark)' />
              </button>
            }
            align='end'
          />
        </div>
      </div>
      <div className='flex items-start gap-4 justify-between mt-4'>
        <div className='flex-1 space-y-2'>
          <Label className='field-label text-sm'>Description</Label>
          <Textarea
            value={item.description}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={1}
            className='input-field min-h-12'
          />
        </div>
        <div className='space-y-2'>
          <Label className='field-label text-sm'>Rate</Label>
          <Input
            type='text'
            value={formatCurrency(item.rate)}
            onChange={e => {
              const numericValue =
                parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
              handleInputChange('rate', numericValue);
            }}
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <Label className='field-label text-sm'>Markup </Label>
          <div className='flex focus-within:ring-2 focus-within:ring-[var(--secondary)] focus-within:ring-opacity-50'>
            <div className='w-[60px]'>
              <SelectField
                value={selectedCurrency}
                onValueChange={value => {
                  setSelectedCurrency(value);
                  // Update the item's markup_type when currency changes
                  if (onItemUpdate) {
                    onItemUpdate({
                      ...item,
                      markup_type: value === '%' ? 'PERCENTAGE' : 'FLAT_AMOUNT',
                    });
                  }
                }}
                options={currencyOptions}
                placeholder='$'
                className='mb-0'
                triggerClassName='rounded-l-[10px] font-bold !border-r-0 !rounded-r-none h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] focus-within:border-[var(--secondary)]'
              />
            </div>
            <Input
              type='text'
              value={item.markup.toString()}
              onChange={e => {
                const numericValue =
                  parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                handleInputChange('markup', numericValue);
              }}
              className='flex-1 rounded-l-none text-right !border-l-0 h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)] focus-within:border-[var(--secondary)]'
            />
          </div>
        </div>
        <div className='ml-4 space-y-1 pt-7'>
          <Label className='field-label font-medium text-[var(--text-dark)] text-xs'>
            Line Total
          </Label>
          <p className='text-lg font-semibold text-[var(--primary)]'>
            {formatCurrency(calculateLineTotal(item.rate, item.qty))}
          </p>
        </div>
      </div>
    </div>
  );
}
