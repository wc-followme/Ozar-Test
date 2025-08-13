export const FIVE_BOX_SLUGS = {
  GENERAL_INFORMATION: 'general-information',
  PROPERTY_INFORMATION: 'property-information',
  PROJECT_INFORMATION: 'project-information',
  CATEGORY: 'category',
  ESTIMATION: 'estimation',
} as const;

export const PET_TYPES = {
  DOG: 'Dog',
  CAT: 'Cat',
} as const;

// Property Information Option Arrays
export const PROPERTY_TYPE_ARRAY = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed', label: 'Mixed Use' },
];

export const PROPERTY_TYPE_OPTIONS_ARRAY = [
  { value: 'house-villa', label: 'House/Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
];

export const BHK_OPTIONS_ARRAY = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5 BHK' },
  { value: '6+', label: '6+ BHK' },
];

export const FLOOR_OPTIONS_ARRAY = [
  { value: 'ground', label: 'Ground Floor' },
  { value: '1', label: '1 Floor' },
  { value: '2', label: '2 Floor' },
  { value: '3', label: '3 Floor' },
  { value: '4', label: '4 Floor' },
  { value: '5+', label: '5+ Floor' },
];

export const SQUARE_FOOTAGE_OPTIONS_ARRAY = [
  { value: '500-1000', label: '500-1000 Sq / Ft' },
  { value: '1000-1500', label: '1000-1500 Sq / Ft' },
  { value: '1500-2000', label: '1500-2000 Sq / Ft' },
  { value: '2000-2500', label: '2000-2500 Sq / Ft' },
  { value: '2500-3000', label: '2500 Sq / Ft' },
  { value: '3000+', label: '3000+ Sq / Ft' },
];

export const PROPERTY_AGE_OPTIONS_ARRAY = [
  { value: '0-5', label: '0-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10-15', label: '10-15 years' },
  { value: '15-20', label: '15-20 years' },
  { value: '20-25', label: '20 years' },
  { value: '25+', label: '25+ years' },
];

export const GENERAL_INFORMATION_FIELDS = {
  YOUR_NAME: 'yourName',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
  ADDRESS: 'address',
  PREFERRED_CONTACT_METHOD: 'preferredContactMethod',
  BEST_TIME_TO_CONTACT: 'bestTimeToContact',
  ANIMALS_IN_HOME: 'animalsInHome',
  PET_TYPE: 'petType',
} as const;

export const PROPERTY_INFORMATION_FIELDS = {
  PROPERTY: 'property',
  PROPERTY_TYPE: 'propertyType',
  BHK: 'bhk',
  FLOOR: 'floor',
  APPROX_SQ_FT: 'approxSqFt',
  AGE_OF_PROPERTY: 'ageOfProperty',
} as const;

export const PROJECT_INFORMATION_FIELDS = {
  PROJECT_NAME: 'projectName',
  PROJECT_START_DATE: 'projectStartDate',
  PROJECT_FINISH_DATE: 'projectFinishDate',
  OWNER_PRESENCE: 'ownerPresence',
  WEEKEND_WORK: 'weekendWork',
  DAILY_WORK_TIMING: 'dailyWorkTiming',
  BUDGET: 'budget',
  PREFERRED_CONTRACTOR: 'preferredContractor',
} as const;

export const SLUG_TITLES = {
  [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: 'General Information',
  [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: 'Property Information',
  [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: 'Project Information',
  [FIVE_BOX_SLUGS.CATEGORY]: 'Category',
  [FIVE_BOX_SLUGS.ESTIMATION]: 'Estimation',
} as const;
