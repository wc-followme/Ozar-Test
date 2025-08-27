'use client';

import {
  BHK_OPTIONS_ARRAY,
  FLOOR_OPTIONS_ARRAY,
  PROPERTY_AGE_OPTIONS_ARRAY,
  PROPERTY_TYPE_ARRAY,
  PROPERTY_TYPE_OPTIONS_ARRAY,
  SQUARE_FOOTAGE_OPTIONS_ARRAY,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import SelectField from '@/components/shared/common/SelectField';

export interface EditJobPropertyInfoData {
  property?: string; // e.g., Apartment/House (high-level)
  propertyType: string; // e.g., Type of Property
  bhk: string;
  floor: string;
  squareFootage: string; // keep for backward-compatibility
  approxSqFt?: string; // new to match StepPropertyInfo
  propertyAge: string;
}

interface EditJobPropertyInfoFormProps {
  data: EditJobPropertyInfoData;
  onChange: (field: keyof EditJobPropertyInfoData, value: string) => void;
}

export const EditJobPropertyInfoForm: React.FC<
  EditJobPropertyInfoFormProps
> = ({ data, onChange }) => {
  return (
    <div className='space-y-5'>
      {/* Property | Type of Property */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SelectField
          label='Property'
          value={data.property || ''}
          onValueChange={val => onChange('property', val)}
          options={PROPERTY_TYPE_ARRAY}
          placeholder='Select property type'
        />
        <SelectField
          label='Type of Property'
          value={data.propertyType}
          onValueChange={val => onChange('propertyType', val)}
          options={PROPERTY_TYPE_OPTIONS_ARRAY}
          placeholder='Select property type'
        />
      </div>

      {/* BHK | Floor */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SelectField
          label='BHK'
          value={data.bhk}
          onValueChange={val => onChange('bhk', val)}
          options={BHK_OPTIONS_ARRAY}
          placeholder='Select BHK'
        />
        <SelectField
          label='Floor'
          value={data.floor}
          onValueChange={val => onChange('floor', val)}
          options={FLOOR_OPTIONS_ARRAY}
          placeholder='Select floor'
        />
      </div>

      {/* Approx. sq ft | Age of Property */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SelectField
          label='Approx. sq ft'
          value={data.approxSqFt || data.squareFootage || ''}
          onValueChange={val => {
            onChange('approxSqFt', val);
            onChange('squareFootage', val); // keep legacy in sync
          }}
          options={SQUARE_FOOTAGE_OPTIONS_ARRAY}
          placeholder='Select square footage'
        />
        <SelectField
          label='Age of Property'
          value={data.propertyAge}
          onValueChange={val => onChange('propertyAge', val)}
          options={PROPERTY_AGE_OPTIONS_ARRAY}
          placeholder='Select property age'
        />
      </div>
    </div>
  );
};

export default EditJobPropertyInfoForm;
