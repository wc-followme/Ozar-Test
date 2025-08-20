'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE_KEYS } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useEffect, useState } from 'react';
import EstimationBox from '../../Templates/EstimationBox';

interface EstimationTemplateFormData {
  templateName: string;
  category: string;
}

interface EstimationTemplateFormProps {
  onSubmit?: (data: EstimationTemplateFormData) => void;
  initialData?: Partial<EstimationTemplateFormData>;
}

export function EstimationTemplateForm({
  onSubmit,
  initialData,
}: EstimationTemplateFormProps) {
  const [formData, setFormData] = useState<EstimationTemplateFormData>({
    templateName: initialData?.templateName || '',
    category: initialData?.category || '',
  });

  // Category dropdown state
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const handleInputChange = (
    field: keyof EstimationTemplateFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get company ID from localStorage
  const getCompanyId = (): string => {
    try {
      const selectedCompany = localStorage.getItem(
        STORAGE_KEYS.SELECTED_COMPANY
      );
      if (selectedCompany) {
        const parsedCompany = JSON.parse(selectedCompany);
        return parsedCompany.id || '';
      }
    } catch (error) {
      console.error('Error parsing selected company:', error);
    }
    return '';
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    const companyId = getCompanyId();
    if (!companyId) {
      setCategoryOptions([]);
      return;
    }

    setIsLoadingCategories(true);
    try {
      const response = await apiService.fetchCategoriesPublic({
        page: 1,
        limit: 50,
        status: 'ACTIVE',
        company_id: companyId,
      });

      if (response.statusCode === 200 && response.data?.data) {
        const categories = response.data.data.map((category: any) => ({
          value: category.uuid || '',
          label: category.name || '',
        }));
        setCategoryOptions(categories);
      } else {
        setCategoryOptions([]);
      }
    } catch (_error) {
      // Gracefully handle errors - show empty dropdown
      setCategoryOptions([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update EstimationBox when category changes
  useEffect(() => {
    // This will trigger the EstimationBox to re-fetch trades with the new categoryId
    // The EstimationBox component will handle this automatically due to the categoryId dependency
  }, [formData.category]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Template Name and Category Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2 col-span-2'>
          <Label htmlFor='templateName' className='field-label'>
            Template Name
          </Label>
          <Input
            id='templateName'
            value={formData.templateName}
            onChange={e => handleInputChange('templateName', e.target.value)}
            placeholder='Enter template name'
            className='input-field'
          />
        </div>
        <div className='space-y-2'>
          <SelectField
            label='Category'
            value={formData.category}
            onValueChange={value => handleInputChange('category', value)}
            options={categoryOptions}
            placeholder={
              isLoadingCategories ? 'Loading categories...' : 'Select Category'
            }
            disabled={isLoadingCategories}
          />
        </div>
      </div>

      {/* Edit Button */}
      {/* <div className='flex justify-end my-4'>
        <Button variant='outline' size='sm' className='btn-secondary'>
          <Edit2 size={16} color='var(--text)' />
          Edit
        </Button>
      </div> */}

      {/* EstimationBox Component */}
      <div className='mb-6'>
        <EstimationBox _onClose={() => {}} categoryId={formData.category} />
      </div>

      {/* Footer */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <span className='text-base font-semibold text-[var(--text-dark)]'>
            Project Total:
          </span>
          <span className='ml-2 text-xl font-bold text-[var(--primary)]'>
            $0.00
          </span>
        </div>
        <Button onClick={handleSubmit} className='btn-primary'>
          Save Template
        </Button>
      </div>
    </div>
  );
}
