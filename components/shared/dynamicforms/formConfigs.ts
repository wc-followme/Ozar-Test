import {
  FIVE_BOX_SLUGS,
  GENERAL_INFORMATION_FIELDS,
  PROJECT_INFORMATION_FIELDS,
  PROPERTY_INFORMATION_FIELDS,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import { PROJECT_MESSAGES } from '@/constants/messages';
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
        label: 'Your Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
        className: 'md:col-span-6', // Full width
      },
      {
        name: GENERAL_INFORMATION_FIELDS.EMAIL,
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        className: 'md:col-span-3', // Half width (left column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PHONE_NUMBER,
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter your number',
        required: true,
        validation: {
          pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$',
        },
        className: 'md:col-span-3', // Half width (right column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.ADDRESS,
        label: 'Address',
        type: 'textarea',
        placeholder: 'Enter your address',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 200,
        },
        className: 'md:col-span-6', // Full width
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PREFERRED_CONTACT_METHOD,
        label: 'Preferred contact method',
        type: 'select',
        placeholder: 'Select contact method',
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
        label: 'Best time to contact',
        type: 'timerange',
        placeholder: 'Start time',
        required: true,
        validation: {
          startTime: 'bestTimeToContactStart',
          endTime: 'bestTimeToContactEnd',
        },
        className: 'md:col-span-3', // Half width (right column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.ANIMALS_IN_HOME,
        label: 'Animals in the Home',
        type: 'select',
        placeholder: 'Select option',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        className: 'md:col-span-3', // Half width (left column)
      },
      {
        name: GENERAL_INFORMATION_FIELDS.PET_TYPE,
        label: 'Pet type?',
        type: 'select',
        placeholder: 'Select pet type',
        required: false,
        options: [
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat' },
          { value: 'bird', label: 'Bird' },
          { value: 'fish', label: 'Fish' },
          { value: 'other', label: 'Other' },
        ],
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
        label: 'Property',
        type: 'select',
        placeholder: 'Select property type',
        required: true,
        options: [
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'industrial', label: 'Industrial' },
          { value: 'mixed', label: 'Mixed Use' },
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE,
        label: 'Type of Property',
        type: 'select',
        placeholder: 'Select property type',
        required: true,
        options: [
          { value: 'house-villa', label: 'House/Villa' },
          { value: 'apartment', label: 'Apartment' },
          { value: 'condo', label: 'Condo' },
          { value: 'townhouse', label: 'Townhouse' },
          { value: 'penthouse', label: 'Penthouse' },
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.BHK,
        label: 'BHK',
        type: 'select',
        placeholder: 'Select BHK',
        required: true,
        options: [
          { value: '1', label: '1 BHK' },
          { value: '2', label: '2 BHK' },
          { value: '3', label: '3 BHK' },
          { value: '4', label: '4 BHK' },
          { value: '5', label: '5 BHK' },
          { value: '6+', label: '6+ BHK' },
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.FLOOR,
        label: 'Floor',
        type: 'select',
        placeholder: 'Select floor',
        required: true,
        options: [
          { value: 'ground', label: 'Ground Floor' },
          { value: '1', label: '1 Floor' },
          { value: '2', label: '2 Floor' },
          { value: '3', label: '3 Floor' },
          { value: '4', label: '4 Floor' },
          { value: '5+', label: '5+ Floor' },
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT,
        label: 'Approx. sq ft',
        type: 'select',
        placeholder: 'Select square footage',
        required: true,
        options: [
          { value: '500-1000', label: '500-1000 Sq / Ft' },
          { value: '1000-1500', label: '1000-1500 Sq / Ft' },
          { value: '1500-2000', label: '1500-2000 Sq / Ft' },
          { value: '2000-2500', label: '2000-2500 Sq / Ft' },
          { value: '2500-3000', label: '2500 Sq / Ft' },
          { value: '3000+', label: '3000+ Sq / Ft' },
        ],
      },
      {
        name: PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY,
        label: 'Age of Property',
        type: 'select',
        placeholder: 'Select property age',
        required: true,
        options: [
          { value: '0-5', label: '0-5 years' },
          { value: '5-10', label: '5-10 years' },
          { value: '10-15', label: '10-15 years' },
          { value: '15-20', label: '15-20 years' },
          { value: '20-25', label: '20 years' },
          { value: '25+', label: '25+ years' },
        ],
      },
    ],
  },
  [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: {
    id: '03',
    number: '03',
    color: '#06B6D4',
    title: PROJECT_MESSAGES.FORM_TITLE,
    description: PROJECT_MESSAGES.FORM_DESCRIPTION,
    fields: [
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_NAME,
        label: PROJECT_MESSAGES.PROJECT_NAME_LABEL,
        type: 'text',
        placeholder: PROJECT_MESSAGES.PROJECT_NAME_PLACEHOLDER,
        required: true,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_START_DATE,
        label: PROJECT_MESSAGES.PROJECT_START_DATE_LABEL,
        type: 'date',
        placeholder: PROJECT_MESSAGES.SELECT_START_DATE,
        required: true,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PROJECT_FINISH_DATE,
        label: PROJECT_MESSAGES.PROJECT_FINISH_DATE_LABEL,
        type: 'date',
        placeholder: PROJECT_MESSAGES.SELECT_FINISH_DATE,
        required: true,
      },
      {
        name: PROJECT_INFORMATION_FIELDS.OWNER_PRESENCE,
        label: PROJECT_MESSAGES.OWNER_PRESENCE_LABEL,
        type: 'select',
        placeholder: PROJECT_MESSAGES.SELECT_OWNER_PRESENCE,
        required: true,
        options: [
          { value: 'yes', label: PROJECT_MESSAGES.YES_OPTION },
          { value: 'no', label: PROJECT_MESSAGES.NO_OPTION },
        ],
      },
      {
        name: PROJECT_INFORMATION_FIELDS.WEEKEND_WORK,
        label: PROJECT_MESSAGES.WEEKEND_WORK_LABEL,
        type: 'select',
        placeholder: PROJECT_MESSAGES.SELECT_WEEKEND_WORK,
        required: true,
        options: [
          { value: 'yes', label: PROJECT_MESSAGES.YES_OPTION },
          { value: 'no', label: PROJECT_MESSAGES.NO_OPTION },
        ],
      },
      {
        name: PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING,
        label: PROJECT_MESSAGES.DAILY_WORK_TIMING_LABEL,
        type: 'timerange',
        placeholder: PROJECT_MESSAGES.START_TIME_PLACEHOLDER,
        required: true,
        validation: {
          startTime: 'dailyWorkTimingStart',
          endTime: 'dailyWorkTimingEnd',
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.BUDGET,
        label: PROJECT_MESSAGES.BUDGET_LABEL,
        type: 'text',
        placeholder: PROJECT_MESSAGES.BUDGET_PLACEHOLDER,
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50,
        },
      },
      {
        name: PROJECT_INFORMATION_FIELDS.PREFERRED_CONTRACTOR,
        label: PROJECT_MESSAGES.PREFERRED_CONTRACTOR_LABEL,
        type: 'select',
        placeholder: PROJECT_MESSAGES.SELECT_CONTRACTOR,
        required: true,
        options: [
          { value: 'any', label: PROJECT_MESSAGES.ANY_CONTRACTOR },
          { value: 'specific', label: PROJECT_MESSAGES.SPECIFIC_CONTRACTOR },
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
