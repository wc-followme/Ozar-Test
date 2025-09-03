'use client';

import { MATERIAL_MESSAGES } from '@/app/(DashboardLayout)/material-management/material-messages';
import SelectField from '@/components/shared/common/SelectField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { calculateMaterialCost } from '@/lib/estimation-calculations';
import { IconDotsVertical } from '@tabler/icons-react';
import { EyeSlash, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { PaintDishIcon } from '../../icons/PaintDishIcon';
import Dropdown from '../common/Dropdown';
import { EstimationItem } from './estimation-types';

interface EstimationItemFormProps {
  item: EstimationItem;
  onItemUpdate?: (updatedItem: EstimationItem) => void;
  onDelete?: () => void;
  serviceId?: string | undefined; // Add service ID prop for fetching materials
  useFixedWidths?: boolean; // New prop to control fixed widths
  containerWidthClass?: string; // New prop to control container width
  disableVariant?: boolean; // Disable the variant SelectField (e.g., for Materials)
  isDisabled?: boolean; // New prop to disable all form fields
  isFromReceivedTrades?: boolean; // New prop to indicate if the item is from received trades
}

export default function EstimationItemForm({
  item,
  onItemUpdate,
  onDelete,
  serviceId, // Add service ID prop
  useFixedWidths = true, // Default to true to maintain current behavior
  containerWidthClass = 'w-full min-w-fit', // Default to responsive width
  disableVariant = false,
  isDisabled = false,
  isFromReceivedTrades = false,
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
    // Early return if required parameters are missing or invalid
    if (!serviceId || !companyUuid || serviceId === '' || companyUuid === '') {
      setMaterialOptions([]);
      return;
    }

    // Ensure serviceId is a UUID; skip if not valid to avoid calls like service_id=default
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId)) {
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
    } catch (_error) {
      // Gracefully degrade to empty options when API fails or returns no data
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
    // Clear material options immediately if serviceId is null/undefined/invalid
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!serviceId || !uuidRegex.test(serviceId)) {
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
    <div
      className={`border border-[var(--border-dark)] rounded-[10px] p-4 bg-[var(--white-background)] ${containerWidthClass}`}
    >
      <div className='flex items-start gap-4 mb-2 flex-wrap'>
        <div
          className={`space-y-2 flex-1 ${useFixedWidths ? 'min-w-[300px]' : ''}`}
        >
          <Label className='field-label text-sm'>Material Name</Label>
          <SelectField
            value={(() => {
              // Prefer matching by UUID when available for pre-selection
              if (item.uuid) {
                const byUuid = materialOptions.find(
                  option => option.value === item.uuid
                );
                if (byUuid) return byUuid.value;
              }
              // Fallback: match by label/name
              const byName = materialOptions.find(
                option => option.label === item.name
              );
              return byName ? byName.value : item.name;
            })()}
            onValueChange={newValue => {
              if (isDisabled || isFromReceivedTrades) return;
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
            disabled={loading || isDisabled || isFromReceivedTrades}
            triggerClassName={
              isDisabled || isFromReceivedTrades
                ? '!bg-[var(--border-light)] !text-[var(--text-dark)] disabled:opacity-100'
                : ''
            }
          />
        </div>
        <div
          className={`space-y-2 flex-1 ${useFixedWidths ? 'min-w-[200px]' : ''}`}
        >
          <Label className='field-label text-sm'>Variant</Label>
          <SelectField
            value={item.variant}
            onValueChange={value => {
              if (isDisabled || isFromReceivedTrades) return;
              handleInputChange('variant', value);
            }}
            options={
              item.variant ? [{ value: item.variant, label: item.variant }] : []
            }
            placeholder='Select variant'
            className='mb-0'
            disabled={disableVariant || isDisabled || isFromReceivedTrades}
            triggerClassName={
              isDisabled || isFromReceivedTrades
                ? '!bg-[var(--border-light)] !text-[var(--text-dark)] disabled:opacity-100'
                : ''
            }
          />
        </div>
        <div className={`space-y-2 w-[100px] min-w-[100px]`}>
          <Label className='field-label text-sm'>Qty</Label>
          <Input
            type='text'
            value={item.qty.toString()}
            onChange={e => {
              if (isDisabled || isFromReceivedTrades) return;
              const value = e.target.value;
              // Only allow numbers
              if (/^\d*$/.test(value)) {
                const numericValue = value === '' ? 0 : parseInt(value) || 0;
                handleInputChange('qty', numericValue);
              }
            }}
            onKeyDown={e => {
              if (isDisabled || isFromReceivedTrades) return;
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
            disabled={isDisabled || isFromReceivedTrades}
            style={
              isDisabled || isFromReceivedTrades
                ? {
                    backgroundColor: 'var(--border-light)',
                    color: 'var(--text-dark)',
                    opacity: 1,
                  }
                : {}
            }
          />
        </div>
        <div
          className={`space-y-2 ${useFixedWidths ? 'w-[150px] min-w-[150px]' : ''}`}
        >
          <Label className='field-label text-sm'>Unit</Label>
          <SelectField
            value={item.unit}
            onValueChange={value => {
              if (isDisabled || isFromReceivedTrades) return;
              handleInputChange('unit', value);
            }}
            options={item.unit ? [{ value: item.unit, label: item.unit }] : []}
            placeholder='Select unit'
            className='mb-0'
            disabled={isDisabled || isFromReceivedTrades}
            triggerClassName={
              isDisabled || isFromReceivedTrades
                ? '!bg-[var(--border-light)] !text-[var(--text-dark)] disabled:opacity-100'
                : ''
            }
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
                icon: PaintDishIcon,
              },
              {
                label: 'Delete line item',
                action: 'delete',
                icon: Trash,
              },
            ]}
            onAction={action => {
              if (isDisabled || isFromReceivedTrades) return;
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
        <div className='flex-1 space-y-2 min-w-[300px]'>
          <Label className='field-label text-sm'>Description</Label>
          <Textarea
            value={item.description}
            onChange={e => {
              if (isDisabled || isFromReceivedTrades) return;
              handleInputChange('description', e.target.value);
            }}
            rows={1}
            className='input-field min-h-12'
            disabled={isDisabled || isFromReceivedTrades}
            style={
              isDisabled || isFromReceivedTrades
                ? {
                    backgroundColor: 'var(--border-light)',
                    color: 'var(--text-dark)',
                    opacity: 1,
                  }
                : {}
            }
          />
        </div>
        <div className={`space-y-2 ${useFixedWidths ? 'min-w-[150px]' : ''}`}>
          <Label className='field-label text-sm'>Rate</Label>
          <div className='flex border-2 border-[var(--border-dark)] focus-within:border-[var(--secondary)] rounded-xl'>
            <div className='w-[60px] flex items-center justify-center font-bold text-[var(--text-dark)] select-none border-none bg-[var(--white-background)] rounded-l-[10px]'>
              $
            </div>
            <Input
              type='text'
              inputMode='decimal'
              defaultValue={item.rate.toString()}
              onChange={e => {
                if (isDisabled || isFromReceivedTrades) return;
                const raw = e.target.value;
                const cleaned = raw.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                const next =
                  parts.length > 2
                    ? `${parts[0]}.${parts.slice(1).join('')}`
                    : cleaned;
                (e.target as HTMLInputElement).value = next;

                if (next !== '' && !next.endsWith('.')) {
                  const numeric = parseFloat(next);
                  if (!Number.isNaN(numeric)) {
                    handleInputChange('rate', numeric);
                  }
                }
              }}
              onFocus={e => {
                if (isDisabled || isFromReceivedTrades) return;
                const v = e.currentTarget.value.trim();
                if (v === '0' || v === '0.0' || v === '0.00') {
                  e.currentTarget.value = '';
                }
              }}
              onBlur={e => {
                if (isDisabled || isFromReceivedTrades) return;
                const val = e.currentTarget.value;
                const fallback = val === '' || val === '.' ? '0' : val;
                e.currentTarget.value = fallback;
                const numeric = parseFloat(fallback);
                if (!Number.isNaN(numeric)) {
                  handleInputChange('rate', numeric);
                }
              }}
              placeholder='0.00'
              className='flex-1 rounded-l-none text-left !border-l-0 h-11 border-none bg-[var(--white-background)] rounded-r-[10px] !placeholder-[var(--text-placeholder)]'
              disabled={isDisabled || isFromReceivedTrades}
              style={
                isDisabled || isFromReceivedTrades
                  ? {
                      backgroundColor: 'var(--border-light)',
                      color: 'var(--text-dark)',
                      opacity: 1,
                    }
                  : {}
              }
            />
          </div>
        </div>
        {isFromReceivedTrades ? (
          // Show Offer Rate field for received trades
          <div className={`space-y-2 ${useFixedWidths ? 'min-w-[200px]' : ''}`}>
            <Label className='field-label text-sm'>Offer Rate</Label>
            <Input
              type='text'
              inputMode='decimal'
              defaultValue={item.markup.toString()}
              onChange={e => {
                if (isDisabled) return;
                const raw = e.target.value;
                const cleaned = raw.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                const next =
                  parts.length > 2
                    ? `${parts[0]}.${parts.slice(1).join('')}`
                    : cleaned;
                (e.target as HTMLInputElement).value = next;
                if (next !== '' && !next.endsWith('.')) {
                  const numeric = parseFloat(next);
                  if (!Number.isNaN(numeric)) {
                    handleInputChange('markup', numeric);
                  }
                }
              }}
              onFocus={e => {
                if (isDisabled) return;
                const v = e.currentTarget.value.trim();
                if (v === '0' || v === '0.0' || v === '0.00') {
                  e.currentTarget.value = '';
                }
              }}
              onBlur={e => {
                if (isDisabled) return;
                const val = e.currentTarget.value;
                const fallback = val === '' || val === '.' ? '0' : val;
                e.currentTarget.value = fallback;
                const numeric = parseFloat(fallback);
                if (!Number.isNaN(numeric)) {
                  handleInputChange('markup', numeric);
                }
              }}
              className='w-full border-2 border-orange-500 focus-within:border-orange-600 rounded-xl h-11 px-3 bg-[var(--white-background)] focus:border-orange-600 focus:ring-orange-600 focus-within:border-orange-600'
              disabled={isDisabled}
              style={
                isDisabled
                  ? {
                      backgroundColor: 'var(--border-light)',
                      color: 'var(--text-dark)',
                      opacity: 1,
                    }
                  : {}
              }
            />
          </div>
        ) : null}
        <div
          className={`ml-4 space-y-1 pt-7 whitespace-nowrap ${useFixedWidths ? 'min-w-[150px] flex-shrink-0' : ''}`}
        >
          <Label className='field-label font-medium text-[var(--text-dark)] text-xs'>
            Material Cost
          </Label>
          <p className='text-lg font-semibold text-[var(--primary)]'>
            {formatCurrency(calculateMaterialCost(item))}
          </p>
        </div>
      </div>
    </div>
  );
}
