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
    title: 'Project Information',
    description:
      'Includes work type (interior, exterior, etc.) and service scope.',
    fields: [
      {
        name: 'workType',
        label: 'Work Type',
        type: 'text',
        placeholder: 'e.g., Interior, Exterior, etc.',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50,
        },
      },
      {
        name: 'serviceScope',
        label: 'Service Scope',
        type: 'textarea',
        placeholder: 'Describe the scope of work',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 500,
        },
      },
      {
        name: 'projectDuration',
        label: 'Project Duration',
        type: 'text',
        placeholder: 'e.g., 3 months',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: 'specialRequirements',
        label: 'Special Requirements',
        type: 'textarea',
        placeholder: 'Any special requirements',
        validation: {
          maxLength: 300,
        },
      },
      {
        name: 'budget',
        label: 'Budget Range',
        type: 'text',
        placeholder: 'Enter budget range',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50,
        },
      },
    ],
  },
  category: {
    id: '04',
    number: '04',
    color: '#EAB308',
    title: 'Category',
    description: 'Includes project name, location, and key contacts.',
    fields: [
      {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        placeholder: 'Enter project name',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        name: 'projectLocation',
        label: 'Project Location',
        type: 'text',
        placeholder: 'Enter project location',
        required: true,
        validation: {
          minLength: 5,
          maxLength: 100,
        },
      },
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        placeholder: 'Enter client name',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: 'clientContact',
        label: 'Client Contact',
        type: 'tel',
        placeholder: 'Enter client contact',
        required: true,
        validation: {
          pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$',
        },
      },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'date',
        placeholder: 'Select start date',
        required: true,
      },
    ],
  },
  estimation: {
    id: '05',
    number: '05',
    color: '#EF4444',
    title: 'Estimation',
    description: 'Includes pricing based on size, scope, and type of work.',
    fields: [
      {
        name: 'basePrice',
        label: 'Base Price',
        type: 'number',
        placeholder: 'Enter base price',
        required: true,
        validation: {
          min: 0,
          max: 1000000,
        },
      },
      {
        name: 'additionalCosts',
        label: 'Additional Costs',
        type: 'number',
        placeholder: 'Enter additional costs',
        validation: {
          min: 0,
          max: 500000,
        },
      },
      {
        name: 'totalAmount',
        label: 'Total Amount',
        type: 'number',
        placeholder: 'Total amount',
        required: true,
        validation: {
          min: 0,
          max: 2000000,
        },
      },
      {
        name: 'paymentTerms',
        label: 'Payment Terms',
        type: 'textarea',
        placeholder: 'Enter payment terms',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 200,
        },
      },
      {
        name: 'validityPeriod',
        label: 'Quotation Validity',
        type: 'text',
        placeholder: 'e.g., 30 days',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50,
        },
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
