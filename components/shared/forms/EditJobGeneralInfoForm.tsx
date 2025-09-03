'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '../common/TimePicker';

export interface EditJobGeneralInfoData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  preferredContactMethod: string;
  contactStartTime: string;
  contactEndTime: string;
  animals: string; // 'Yes' | 'No'
  petType: string;
  expectations: string;
}

interface EditJobGeneralInfoFormProps {
  data: EditJobGeneralInfoData;
  onChange: (field: keyof EditJobGeneralInfoData, value: string) => void;
}

const contactMethodOptions = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text' },
];

const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const petTypeOptions = [
  { value: 'Dog', label: 'Dog' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Other', label: 'Other' },
];

export const EditJobGeneralInfoForm: React.FC<EditJobGeneralInfoFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className='space-y-5'>
      {/* Your Name */}
      <div className='space-y-2'>
        <Label htmlFor='fullName' className='field-label'>
          Your Name
        </Label>
        <Input
          id='fullName'
          value={data.fullName}
          onChange={e => onChange('fullName', e.target.value)}
          className='input-field'
          placeholder='Enter your full name'
        />
      </div>

      {/* Email | Phone */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='field-label'>
            Email
          </Label>
          <Input
            id='email'
            type='email'
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            className='input-field'
            placeholder='Enter your email'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='phone' className='field-label'>
            Phone Number
          </Label>
          <Input
            id='phone'
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            className='input-field'
            placeholder='Enter your phone number'
          />
        </div>
      </div>

      {/* Another Email | Another Phone */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='anotherEmail' className='field-label'>
            Another Email
          </Label>
          <Input
            id='anotherEmail'
            type='email'
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            className='input-field'
            placeholder='Enter another email'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='anotherPhone' className='field-label'>
            Another Phone Number
          </Label>
          <Input
            id='anotherPhone'
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            className='input-field'
            placeholder='Enter another phone number'
          />
        </div>
      </div>

      {/* Address */}
      <div className='space-y-2'>
        <Label htmlFor='address' className='field-label'>
          Address
        </Label>
        <Input
          id='address'
          value={data.address}
          onChange={e => onChange('address', e.target.value)}
          className='input-field'
          placeholder='Enter your address'
        />
      </div>

      {/* Best Time to Contact (Start | End) */}
      <div className='space-y-2'>
        <Label className='field-label'>Best time to contact</Label>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <TimePicker
              value={data.contactStartTime}
              onChange={val => onChange('contactStartTime', val)}
            />
          </div>
          <div className='space-y-2'>
            <TimePicker
              value={data.contactEndTime}
              onChange={val => onChange('contactEndTime', val)}
            />
          </div>
        </div>
      </div>

      {/* Preferred Contact Method | Animals */}
      <div className='grid grid-cols-1 gap-4'>
        <SelectField
          label='Preferred Contact Method'
          value={data.preferredContactMethod}
          onValueChange={val => onChange('preferredContactMethod', val)}
          options={contactMethodOptions}
          placeholder='Select contact method'
        />
      </div>

      {/* Pet Type (only if animals Yes) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SelectField
          label='Animals in the Home'
          value={data.animals}
          onValueChange={val => onChange('animals', val)}
          options={yesNoOptions}
          placeholder='Select option'
        />
        {data.animals === 'Yes' && (
          <SelectField
            label='Pet type'
            value={data.petType}
            onValueChange={val => onChange('petType', val)}
            options={petTypeOptions}
            placeholder='Select pet type'
          />
        )}
      </div>

      {/* Expectations (textarea) */}
      <div className='space-y-2'>
        <Label htmlFor='expectations' className='field-label'>
          What are your expectations for the project?
        </Label>
        <Textarea
          id='expectations'
          value={data.expectations}
          onChange={e => onChange('expectations', e.target.value)}
          className='input-field min-h-[100px]'
          placeholder='Describe your project expectations...'
        />
      </div>
    </div>
  );
};

export default EditJobGeneralInfoForm;
