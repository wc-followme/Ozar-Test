export const HEADER_MESSAGES = {
  SEARCH: {
    PLACEHOLDER: 'What are you looking for?',
    BUTTON_TEXT: 'Search',
  },
  COMPANY_DROPDOWN: {
    PLACEHOLDER: 'Select Company',
    SEARCH_PLACEHOLDER: 'Search here...',
  },
  CHANGE_PASSWORD: {
    TITLE: 'Change Password',
  },
  COMPANY: {
    DEFAULT_NAME: 'Virtual Homes',
    UNKNOWN_COMPANY: 'Unknown Company',
  },
};

export const COMPANY_IMAGES = {
  CDN_URL: process.env['NEXT_PUBLIC_CDN_URL'] || '',
  PLACEHOLDER: '/images/img-placeholder-md.png',
} as const;

export const DEFAULT_COMPANIES = [
  {
    id: '1',
    name: 'Virtual Homes',
    icon: '/images/company-management/company-img-1.png',
    color: '#8B5CF6',
  },
  {
    id: '2',
    name: 'Innovative Dwellings',
    icon: '/images/company-management/company-img-2.png',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'Dream Builders',
    icon: '/images/company-management/company-img-3.png',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Future Foundations',
    icon: '/images/company-management/company-img-4.png',
    color: '#EC4899',
  },
  {
    id: '5',
    name: 'Eco Homes',
    icon: '/images/company-management/company-img-1.png',
    color: '#10B981',
  },
  {
    id: '6',
    name: 'Urban Living',
    icon: '/images/company-management/company-img-2.png',
    color: '#3B82F6',
  },
];
