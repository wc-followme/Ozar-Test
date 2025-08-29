import {
  ANIMALS_IN_HOME_OPTIONS_ARRAY,
  BHK_OPTIONS_ARRAY,
  COMMERCIAL_PROPERTY_TYPE_OPTIONS,
  FIVE_BOX_SLUGS,
  FLOOR_OPTIONS_ARRAY,
  GENERAL_INFORMATION_FIELDS,
  INDUSTRIAL_PROPERTY_TYPE_OPTIONS,
  OWNER_PRESENCE_OPTIONS_ARRAY,
  PET_TYPES,
  PROJECT_INFORMATION_FIELDS,
  PROPERTY_AGE_OPTIONS_ARRAY,
  PROPERTY_INFORMATION_FIELDS,
  PROPERTY_TYPE_ARRAY,
  RESIDENTIAL_PROPERTY_TYPE_OPTIONS,
  SQUARE_FOOTAGE_OPTIONS_ARRAY,
  WEEKEND_WORK_OPTIONS_ARRAY,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import {
  STEP_MESSAGES,
  STEP_PROJECT_INFO_CONSTANTS,
} from '@/app/(DashboardLayout)/job-management/step-messages';
import { FormConfig } from './DynamicForm';

export const formConfigs: Record<string, FormConfig> = {
  [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: {
    id: '01',
    number: '01',
    color: '#10B981',
    title: 'General information',
    description:
      'Fill out your details to help us contact you and understand your project better.',
    fields: [
      {
        name: GENERAL_INFORMATION_FIELDS.YOUR_NAME,
        label: STEP_MESSAGES.YOUR_NAME_LABEL,
        type: 'text',
        placeholder: STEP_MESSAGES.ENTER_FULL_NAME,
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
        className: 'md:col-span-6', // Full width
      },
      {
        name: GENERAL_INFORMATION_FIELDS.EMAIL,
        label: STEP_MESSAGES.EMAIL_LABEL,
        type: 'email',
        placeholder: STEP_MESSAGES.ENTER_EMAIL,
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        className: 'md:col-span-3', // Half width (left column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PHONE_NUMBER,
        label: STEP_MESSAGES.PHONE_NUMBER_LABEL,
        type: 'tel',
        placeholder: STEP_MESSAGES.ENTER_PHONE_NUMBER,
        required: true,
        validation: {
          pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$',
        },
        className: 'md:col-span-3', // Half width (right column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.ADDRESS,
        label: STEP_MESSAGES.ADDRESS_LABEL,
        type: 'textarea',
        placeholder: STEP_MESSAGES.ENTER_ADDRESS,
        required: true,
        validation: {
          minLength: 10,
          maxLength: 200,
        },
        className: 'md:col-span-6', // Full width
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PREFERRED_CONTACT_METHOD,
        label: STEP_MESSAGES.PREFERRED_CONTACT_METHOD_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_CONTACT_METHOD,
        required: true,
        options: [
          { value: 'phone', label: 'Phone' },
          { value: 'email', label: 'Email' },
          { value: 'text', label: 'Text' },
        ],
        className: 'md:col-span-3', // Half width (left column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.BEST_TIME_TO_CONTACT,
        label: STEP_MESSAGES.BEST_TIME_TO_CONTACT_LABEL,
        type: 'time',
        placeholder: STEP_MESSAGES.SELECT_BEST_TIME_TO_CONTACT,
        required: true,
        className: 'md:col-span-3', // Half width (right column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.ANIMALS_IN_HOME,
        label: STEP_MESSAGES.ANIMALS_IN_HOME_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_ANIMALS_IN_HOME,
        required: true,
        options: ANIMALS_IN_HOME_OPTIONS_ARRAY,
        className: 'md:col-span-3', // Half width (left column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PET_TYPE,
        label: STEP_MESSAGES.PET_TYPE_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_PET_TYPE,
        required: false,
        options: PET_TYPES,
        className: 'md:col-span-3', // Half width (right column)
      },
    ],
  },
  [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: {
    id: '02',
    number: '02',
    color: '#3B82F6',
    title: 'Property Information',
    description:
      'Share key property details to help us tailor solutions that suit your space and structure.',
    fields: [
      {
        name: PROPERTY_INFORMATION_FIELDS.PROPERTY,
        label: STEP_MESSAGES.PROPERTY_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_PROPERTY,
        required: true,
        options: PROPERTY_TYPE_ARRAY,
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE,
        label: STEP_MESSAGES.PROPERTY_TYPE_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_PROPERTY_TYPE,
        required: true,
        options: [
          ...RESIDENTIAL_PROPERTY_TYPE_OPTIONS,
          ...COMMERCIAL_PROPERTY_TYPE_OPTIONS,
          ...INDUSTRIAL_PROPERTY_TYPE_OPTIONS,
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.BHK,
        label: STEP_MESSAGES.BHK_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_BHK,
        required: true,
        options: BHK_OPTIONS_ARRAY,
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.FLOOR,
        label: STEP_MESSAGES.FLOOR_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_FLOOR,
        required: true,
        options: FLOOR_OPTIONS_ARRAY,
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT,
        label: STEP_MESSAGES.APPROX_SQ_FT_PROPERTY_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_SQUARE_FOOTAGE,
        required: true,
        options: SQUARE_FOOTAGE_OPTIONS_ARRAY,
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY,
        label: STEP_MESSAGES.AGE_OF_PROPERTY_PROPERTY_LABEL,
        type: 'select',
        placeholder: STEP_MESSAGES.SELECT_PROPERTY_AGE,
        required: true,
        options: PROPERTY_AGE_OPTIONS_ARRAY,
      },
    ],
  },
  [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: {
    id: '03',
    number: '03',
    color: '#06B6D4',
    title: STEP_PROJECT_INFO_CONSTANTS.FORM_TITLE,
    description: STEP_PROJECT_INFO_CONSTANTS.FORM_DESCRIPTION,
    fields: [
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_NAME,
        label: STEP_PROJECT_INFO_CONSTANTS.PROJECT_NAME_LABEL,
        type: 'text',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.PROJECT_NAME_PLACEHOLDER,
        required: true,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_START_DATE,
        label: STEP_PROJECT_INFO_CONSTANTS.PROJECT_START_DATE_LABEL,
        type: 'date',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_START_DATE,
        required: true,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_FINISH_DATE,
        label: STEP_PROJECT_INFO_CONSTANTS.PROJECT_FINISH_DATE_LABEL,
        type: 'date',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_FINISH_DATE,
        required: true,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.OWNER_PRESENCE,
        label: STEP_PROJECT_INFO_CONSTANTS.OWNER_PRESENCE_LABEL,
        type: 'select',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_OWNER_PRESENCE,
        required: true,
        options: OWNER_PRESENCE_OPTIONS_ARRAY,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.WEEKEND_WORK,
        label: STEP_PROJECT_INFO_CONSTANTS.WEEKEND_WORK_LABEL,
        type: 'select',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_WEEKEND_WORK,
        required: true,
        options: WEEKEND_WORK_OPTIONS_ARRAY,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING,
        label: STEP_PROJECT_INFO_CONSTANTS.SHIFT_TIME_LABEL,
        type: 'timerange',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_SHIFT_FROM,
        required: true,
        validation: {
          startTime: 'dailyWorkTimingStart',
          endTime: 'dailyWorkTimingEnd',
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.BUDGET,
        label: STEP_PROJECT_INFO_CONSTANTS.BUDGET_LABEL,
        type: 'text',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.BUDGET_PLACEHOLDER,
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50,
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PREFERRED_CONTRACTOR,
        label: STEP_PROJECT_INFO_CONSTANTS.PREFERRED_CONTRACTOR_LABEL,
        type: 'select',
        placeholder: STEP_PROJECT_INFO_CONSTANTS.SELECT_CONTRACTOR,
        required: true,
        options: [
          { value: 'any', label: STEP_PROJECT_INFO_CONSTANTS.ANY_CONTRACTOR },
          {
            value: 'specific',
            label: STEP_PROJECT_INFO_CONSTANTS.SPECIFIC_CONTRACTOR,
          },
        ],
      },
    ],
  },
};

export const getFormConfig = (slug: string): FormConfig | null => {
  return formConfigs[slug] || null;
};

export const getAllFormConfigs = (): Record<string, FormConfig> => {
  return formConfigs;
};
