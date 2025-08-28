export const FIVE_BOX_SLUGS = {
  GENERAL_INFORMATION: 'general-information',
  PROPERTY_INFORMATION: 'property-information',
  PROJECT_INFORMATION: 'project-information',
  CATEGORY: 'category',
  ESTIMATION: 'estimation',
} as const;

export const PET_TYPES = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'fish', label: 'Fish' },
  { value: 'other', label: 'Other' },
];

export const CONTACT_METHOD_OPTIONS_ARRAY = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
];

// Property Information Option Arrays
export const PROPERTY_TYPE_ARRAY = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
];

// Conditional Property Type Options based on Property Selection
export const RESIDENTIAL_PROPERTY_TYPE_OPTIONS = [
  { value: 'APARTMENT_FLAT', label: 'Apartment / Flat' },
  { value: 'VILLA_BUNGALOW', label: 'Villa / Bungalow' },
  { value: 'ROW_HOUSE', label: 'Row House' },
  { value: 'FARMHOUSE', label: 'Farmhouse' },
  { value: 'COOP_HOUSING', label: 'Co-op Housing / Society' },
];

export const COMMERCIAL_PROPERTY_TYPE_OPTIONS = [
  { value: 'OFFICE_SPACE', label: 'Office Space' },
  { value: 'RETAIL_SHOP', label: 'Retail Shop' },
  { value: 'SHOWROOM', label: 'Showroom' },
  { value: 'MALL_SHOPPING', label: 'Mall / Shopping Complex Unit' },
  { value: 'RESTAURANT_HOTEL', label: 'Restaurant / Hotel' },
  { value: 'COWORKING_SPACE', label: 'Co-working Space' },
];

export const INDUSTRIAL_PROPERTY_TYPE_OPTIONS = [
  { value: 'WAREHOUSE_GODOWN', label: 'Warehouse / Godown' },
  {
    value: 'FACTORY_MANUFACTURING',
    label: 'Factory / Manufacturing Unit',
  },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'DATA_CENTER', label: 'Data Center' },
  { value: 'COLD_STORAGE', label: 'Cold Storage' },
];

export const BHK_OPTIONS_ARRAY = [
  { value: '1', label: '1 Room' },
  { value: '2', label: '2 Rooms' },
  { value: '3', label: '3 Rooms' },
  { value: '4', label: '4 Rooms' },
  { value: '5', label: '5 Rooms' },
  { value: '6', label: '6+ Rooms' },
];

export const FLOOR_OPTIONS_ARRAY = [
  { value: 'ground', label: 'Ground Floor' },
  { value: '1', label: '1 Floor' },
  { value: '2', label: '2 Floor' },
  { value: '3', label: '3 Floor' },
  { value: '4', label: '4 Floor' },
  { value: '5', label: '5+ Floor' },
];

export const SQUARE_FOOTAGE_OPTIONS_ARRAY = [
  { value: '<500', label: '< 500 sq ft' },
  { value: '500-1000', label: '500 – 1000 sq ft' },
  { value: '1000-2000', label: '1000 – 2000 sq ft' },
  { value: '2000-5000', label: '2000 – 5000 sq ft' },
  { value: '5000-10000', label: '5000 – 10,000 sq ft' },
  { value: '10000+', label: '10,000+ sq ft' },
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
