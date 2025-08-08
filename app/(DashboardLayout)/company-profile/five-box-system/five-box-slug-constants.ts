export const FIVE_BOX_SLUGS = {
  GENERAL_INFORMATION: 'general-information',
  PROPERTY_INFORMATION: 'property-information',
  PROJECT_INFORMATION: 'project-information',
  CATEGORY: 'category',
  ESTIMATION: 'estimation',
} as const;

export const SLUG_TITLES = {
  [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: 'General Information',
  [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: 'Property Information',
  [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: 'Project Information',
  [FIVE_BOX_SLUGS.CATEGORY]: 'Category',
  [FIVE_BOX_SLUGS.ESTIMATION]: 'Estimation',
} as const;
