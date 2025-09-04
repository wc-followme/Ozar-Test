'use client';

import SelectField from '@/components/shared/common/SelectField';

export interface EditJobCategoryData {
  category: string;
}

interface EditJobCategoryFormProps {
  data: EditJobCategoryData;
  onChange: (field: keyof EditJobCategoryData, value: string) => void;
}

export const EditJobCategoryForm: React.FC<EditJobCategoryFormProps> = ({
  data,
  onChange,
}) => {
  const categoryOptions = [
    { value: 'renovation', label: 'Renovation' },
    { value: 'construction', label: 'New Construction' },
    { value: 'repair', label: 'Repair & Maintenance' },
    { value: 'interior', label: 'Interior Design' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'hvac', label: 'HVAC' },
  ];

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <SelectField
          label='Project Category'
          value={data.category}
          onValueChange={value => onChange('category', value)}
          options={categoryOptions}
          placeholder='Select project category'
        />
      </div>
    </div>
  );
};

export default EditJobCategoryForm;
