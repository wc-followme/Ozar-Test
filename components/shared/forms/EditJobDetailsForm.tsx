'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  FormAccordion,
  FormAccordionContent,
  FormAccordionItem,
} from '../common/FormAccordion';
import EditJobCategoryForm, {
  EditJobCategoryData,
} from './EditJobCategoryForm';
import EditJobGeneralInfoForm, {
  EditJobGeneralInfoData,
} from './EditJobGeneralInfoForm';
import EditJobProjectInfoForm, {
  EditJobProjectInfoData,
} from './EditJobProjectInfoForm';
import EditJobPropertyInfoForm, {
  EditJobPropertyInfoData,
} from './EditJobPropertyInfoForm';

interface EditJobDetailsFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: any;
}

export const EditJobDetailsForm: React.FC<EditJobDetailsFormProps> = ({
  onSave,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
}) => {
  const [generalInfo, setGeneralInfo] = useState<EditJobGeneralInfoData>({
    fullName: defaultValues.generalInfo?.fullName || '',
    email: defaultValues.generalInfo?.email || '',
    phone: defaultValues.generalInfo?.phone || '',
    address: defaultValues.generalInfo?.address || '',
    preferredContactMethod:
      defaultValues.generalInfo?.preferredContactMethod || '',
    contactStartTime: defaultValues.generalInfo?.contactStartTime || '',
    contactEndTime: defaultValues.generalInfo?.contactEndTime || '',
    animals: defaultValues.generalInfo?.animals || 'No',
    petType: defaultValues.generalInfo?.petType || '',
    expectations: defaultValues.generalInfo?.expectations || '',
  });

  const [propertyInfo, setPropertyInfo] = useState<EditJobPropertyInfoData>({
    propertyType: defaultValues.propertyInfo?.propertyType || '',
    bhk: defaultValues.propertyInfo?.bhk || '',
    floor: defaultValues.propertyInfo?.floor || '',
    squareFootage: defaultValues.propertyInfo?.squareFootage || '',
    propertyAge: defaultValues.propertyInfo?.propertyAge || '',
  });

  const [projectInfo, setProjectInfo] = useState<EditJobProjectInfoData>({
    projectName: defaultValues.projectInfo?.projectName || '',
    projectStartDate: defaultValues.projectInfo?.projectStartDate || '',
    projectEndDate: defaultValues.projectInfo?.projectEndDate || '',
    ownerPresence: defaultValues.projectInfo?.ownerPresence || '',
    weekendWork: defaultValues.projectInfo?.weekendWork || '',
    dailyWorkStart: defaultValues.projectInfo?.dailyWorkStart || '',
    dailyWorkEnd: defaultValues.projectInfo?.dailyWorkEnd || '',
    budget: defaultValues.projectInfo?.budget || '',
    preferredContractor: defaultValues.projectInfo?.preferredContractor || '',
  });

  const [category, setCategory] = useState<EditJobCategoryData>({
    category: defaultValues.category?.category || '',
  });

  const handleSave = () => {
    onSave({ generalInfo, propertyInfo, projectInfo, category });
  };

  return (
    <div className='space-y-6'>
      <div className=''>
        <FormAccordion>
          {/* General Information */}
          <FormAccordionItem value='general-info' title='General Information'>
            <FormAccordionContent>
              <EditJobGeneralInfoForm
                data={generalInfo}
                onChange={(field, value) =>
                  setGeneralInfo(prev => ({ ...prev, [field]: value }))
                }
              />
            </FormAccordionContent>
          </FormAccordionItem>

          {/* Property Information */}
          <FormAccordionItem value='property-info' title='Property Information'>
            <FormAccordionContent>
              <EditJobPropertyInfoForm
                data={propertyInfo}
                onChange={(field, value) =>
                  setPropertyInfo(prev => ({ ...prev, [field]: value }))
                }
              />
            </FormAccordionContent>
          </FormAccordionItem>

          {/* Project Information */}
          <FormAccordionItem value='project-info' title='Project Information'>
            <FormAccordionContent>
              <EditJobProjectInfoForm
                data={projectInfo}
                onChange={(field, value) =>
                  setProjectInfo(prev => ({ ...prev, [field]: value }))
                }
              />
            </FormAccordionContent>
          </FormAccordionItem>

          {/* Project Category */}
          <FormAccordionItem value='category' title='Project Category'>
            <FormAccordionContent>
              <EditJobCategoryForm
                data={category}
                onChange={(field, value) =>
                  setCategory(prev => ({ ...prev, [field]: value }))
                }
              />
            </FormAccordionContent>
          </FormAccordionItem>
        </FormAccordion>

        {/* Action Buttons */}
        <div className='pt-6 flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};
