import { PROJECT_MESSAGES } from '@/constants/messages';
import { FormConfig } from './DynamicForm';

export const formConfigs: Record<string, FormConfig> = {
  'general-information': {
    id: '01',
    number: '01',
    color: '#10B981',
    title: 'General information',
    description:
      'Fill out your details to help us contact you and understand your project better.',
    fields: [
      {
        name: 'yourName',
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
        name: 'email',
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
        name: 'phoneNumber',
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
        name: 'address',
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
        name: 'preferredContactMethod',
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
        name: 'bestTimeToContact',
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
        name: 'animalsInHome',
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
        name: 'petType',
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
  'property-information': {
    id: '02',
    number: '02',
    color: '#3B82F6',
    title: 'Property Information',
    description:
      'Share key property details to help us tailor solutions that suit your space and structure.',
    fields: [
      {
        name: 'property',
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
        name: 'propertyType',
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
        name: 'bhk',
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
        name: 'floor',
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
        name: 'approxSqFt',
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
        name: 'ageOfProperty',
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
  'project-information': {
    id: '03',
    number: '03',
    color: '#06B6D4',
    title: PROJECT_MESSAGES.FORM_TITLE,
    description: PROJECT_MESSAGES.FORM_DESCRIPTION,
    fields: [
      {
        name: 'projectName',
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
        name: 'projectStartDate',
        label: PROJECT_MESSAGES.PROJECT_START_DATE_LABEL,
        type: 'date',
        placeholder: PROJECT_MESSAGES.SELECT_START_DATE,
        required: true,
      },
      {
        name: 'projectFinishDate',
        label: PROJECT_MESSAGES.PROJECT_FINISH_DATE_LABEL,
        type: 'date',
        placeholder: PROJECT_MESSAGES.SELECT_FINISH_DATE,
        required: true,
      },
      {
        name: 'ownerPresence',
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
        name: 'weekendWork',
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
        name: 'dailyWorkTiming',
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
        name: 'budget',
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
        name: 'preferredContractor',
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
