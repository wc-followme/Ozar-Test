// Common application constants

// API Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10, // Standard limit for most listing pages
  USERS_LIMIT: 20, // Higher limit for user listing to improve infinite scroll UX
  ROLES_DROPDOWN_LIMIT: 50, // Higher limit for role dropdowns to get complete lists
  TOOLS_LIMIT: 28, // Limit for tools management
  CATEGORIES_LIMIT: 16, // Limit for category management
  MATERIALS_LIMIT: 32, // Limit for material management
  ROLES_LIMIT: 12, // Limit for role management
  COMPANY_LIMIT: 8, // Limit for company management
  JOBS_LIMIT: 8, // Limit for job management
  TRADES_LIMIT: 32, // Limit for trade management
  TEMPLATES_LIMIT: 16, // Limit for templates management with infinite scroll
} as const;

// Role IDs for role-based access control
export const ROLE_IDS = {
  ADMIN: 1,
  CONTRACTOR: 2,
  EMPLOYEE: 3,
  HOMEOWNER: 4,
  VENDOR: 5,
} as const;

// General App Constants
export const APP_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_AUTO_HIDE_MS: 3000,
  // Frontend base URL for generating links (e.g., home-owner links)
  // Set NEXT_PUBLIC_BASE_URL in your .env.local file
  BASE_URL: process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000',
  // CDN URL for static assets (images, files, etc.)
  // Set NEXT_PUBLIC_CDN_URL in your .env.local file
  CDN_URL: process.env['NEXT_PUBLIC_CDN_URL'] || '',
  // Static image paths
  IMAGES: {
    LOGO: '/images/logo.svg',
    PROFILE_BLOCK_BG: '/images/profile-block-bg.png',
    PROJECT_PLACEHOLDER: '/images/project-placeholder.png',
    USER_PLACEHOLDER: '/images/user-img-placeholder.png',
  },
} as const;

// Application Routes
export const ROUTES = {
  HOME_OWNER: '/home-owner',
  JOB_MANAGEMENT: '/job-management',
  DASHBOARD: '/',
  COMPANY_MANAGEMENT: '/company-management',
  ADD_COMPANY: '/company-management/add-company',
  COMPANY_DETAILS: '/company-management/company-details',
  ADD_USER: '/company-management/add-user',
  TOOLS_MANAGEMENT: '/tools-management',
  TOOL_DETAIL: '/tools-management/tool-detail',
  TOOL_VIDEOS_TUTORIAL: '/tools-management/tool-detail/videos-tutorial',
  USER_MANAGEMENT: '/user-management',
  CREATE_USER: '/user-management/create-user',
  USER_PROFILE: '/user-management/profile',
  PORTAL_USERS: '/portal-users',
  ROLE_MANAGEMENT: '/role-management',
  CREATE_ROLE: '/role-management/create-role',
  EDIT_ROLE: '/role-management/edit-role',
  CATEGORY_MANAGEMENT: '/category-management',
  MATERIAL_MANAGEMENT: '/material-management',
  SERVICE_MANAGEMENT: '/service-management',
  TRADE_MANAGEMENT: '/trade-management',
  COMPANY_PROFILE: '/company-profile',
  PUBLIC_COMPANY_PROFILE: '/public-company-profile',
  PUBLIC_USER_PROFILE: '/public-user-profile',
  EDIT_COMPANY_PROFILE: '/company-profile/edit-profile',
  FIVE_BOX_SYSTEM: '/company-profile/five-box-system',
  FIVE_BOX_GENERAL_INFO: '/company-profile/five-box-system/general-information',
  FIVE_BOX_PROPERTY_INFO:
    '/company-profile/five-box-system/property-information',
  FIVE_BOX_PROJECT_INFO: '/company-profile/five-box-system/project-information',
  FIVE_BOX_CATEGORY: '/company-profile/five-box-system/category',
  FIVE_BOX_ESTIMATION: '/company-profile/five-box-system/estimation',
  TEMPLATES_MANAGEMENT: '/templates',
  CREATE_TEMPLATE: '/templates/create',
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

// Action constants for menu options and permissions
export const ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
  ARCHIVE: 'archive',
  RETRIEVE: 'retrieve',
  VIEW: 'view',
  CREATE: 'create',
  CUSTOMIZE: 'customize',
  ASSIGN_USER: 'assign_user',
  HISTORY: 'history',
  COMPLETED: 'completed',
} as const;

// Menu labels for different categories
export const CATEGORY_MESSAGES = {
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Delete',
  COMPLETED_MENU: 'Completed',
  ARCHIVE_MENU: 'Archive',
  VIEW_MENU: 'View',
  CREATE_MENU: 'Create',
  CUSTOMIZE_MENU: 'Customize',
  ASSIGN_USER_MENU: 'Assign User',
  HISTORY_MENU: 'History',
} as const;

// Country codes and phone number related constants
export const COUNTRY_CODES = {
  // Key-value mapping for easy lookup (country key -> phone code)
  MAP: {
    us: '+1',
    ca: '+1',
    gb: '+44',
    au: '+61',
    de: '+49',
    fr: '+33',
    it: '+39',
    es: '+34',
    nl: '+31',
    ch: '+41',
    se: '+46',
    no: '+47',
    dk: '+45',
    fi: '+358',
    at: '+43',
    be: '+32',
    pt: '+351',
    ie: '+353',
    lu: '+352',
    in: '+91',
    jp: '+81',
    kr: '+82',
    cn: '+86',
    hk: '+852',
    sg: '+65',
    my: '+60',
    th: '+66',
    ph: '+63',
    id: '+62',
    vn: '+84',
    tw: '+886',
    ru: '+7',
    ua: '+380',
    pl: '+48',
    cz: '+420',
    sk: '+421',
    hu: '+36',
    ro: '+40',
    bg: '+359',
    hr: '+385',
    si: '+386',
    ee: '+372',
    lv: '+371',
    lt: '+370',
    is: '+354',
    mt: '+356',
    cy: '+357',
    br: '+55',
    ar: '+54',
    cl: '+56',
    co: '+57',
    pe: '+51',
    mx: '+52',
    za: '+27',
    eg: '+20',
    ma: '+212',
    ng: '+234',
    ke: '+254',
    tz: '+255',
    tr: '+90',
    il: '+972',
    ae: '+971',
    sa: '+966',
    kw: '+965',
    qa: '+974',
    bh: '+973',
    om: '+968',
    jo: '+962',
    lb: '+961',
    iq: '+964',
    ir: '+98',
    af: '+93',
    pk: '+92',
    bd: '+880',
    lk: '+94',
    np: '+977',
    bt: '+975',
    mv: '+960',
    mn: '+976',
  },

  // Array format for dropdowns with additional metadata (avoiding duplicates)
  LIST: [
    { code: '+1', country: 'US', flag: '🇺🇸', key: 'us' }, // Primary for +1
    { code: '+44', country: 'GB', flag: '🇬🇧', key: 'gb' },
    { code: '+91', country: 'IN', flag: '🇮🇳', key: 'in' },
    { code: '+86', country: 'CN', flag: '🇨🇳', key: 'cn' },
    { code: '+81', country: 'JP', flag: '🇯🇵', key: 'jp' },
    { code: '+49', country: 'DE', flag: '🇩🇪', key: 'de' },
    { code: '+33', country: 'FR', flag: '🇫🇷', key: 'fr' },
    { code: '+61', country: 'AU', flag: '🇦🇺', key: 'au' },
    { code: '+55', country: 'BR', flag: '🇧🇷', key: 'br' },
    { code: '+7', country: 'RU', flag: '🇷🇺', key: 'ru' },
    { code: '+39', country: 'IT', flag: '🇮🇹', key: 'it' },
    { code: '+34', country: 'ES', flag: '🇪🇸', key: 'es' },
    { code: '+31', country: 'NL', flag: '🇳🇱', key: 'nl' },
    { code: '+41', country: 'CH', flag: '🇨🇭', key: 'ch' },
    { code: '+46', country: 'SE', flag: '🇸🇪', key: 'se' },
    { code: '+47', country: 'NO', flag: '🇳🇴', key: 'no' },
    { code: '+45', country: 'DK', flag: '🇩🇰', key: 'dk' },
    { code: '+358', country: 'FI', flag: '🇫🇮', key: 'fi' },
    { code: '+43', country: 'AT', flag: '🇦🇹', key: 'at' },
    { code: '+32', country: 'BE', flag: '🇧🇪', key: 'be' },
    { code: '+351', country: 'PT', flag: '🇵🇹', key: 'pt' },
    { code: '+353', country: 'IE', flag: '🇮🇪', key: 'ie' },
    { code: '+82', country: 'KR', flag: '🇰🇷', key: 'kr' },
    { code: '+852', country: 'HK', flag: '🇭🇰', key: 'hk' },
    { code: '+65', country: 'SG', flag: '🇸🇬', key: 'sg' },
    { code: '+60', country: 'MY', flag: '🇲🇾', key: 'my' },
    { code: '+66', country: 'TH', flag: '🇹🇭', key: 'th' },
    { code: '+63', country: 'PH', flag: '🇵🇭', key: 'ph' },
    { code: '+62', country: 'ID', flag: '🇮🇩', key: 'id' },
    { code: '+84', country: 'VN', flag: '🇻🇳', key: 'vn' },
    { code: '+886', country: 'TW', flag: '🇹🇼', key: 'tw' },
    { code: '+380', country: 'UA', flag: '🇺🇦', key: 'ua' },
    { code: '+48', country: 'PL', flag: '🇵🇱', key: 'pl' },
    { code: '+27', country: 'ZA', flag: '🇿🇦', key: 'za' },
    { code: '+20', country: 'EG', flag: '🇪🇬', key: 'eg' },
    { code: '+90', country: 'TR', flag: '🇹🇷', key: 'tr' },
    { code: '+971', country: 'AE', flag: '🇦🇪', key: 'ae' },
    { code: '+966', country: 'SA', flag: '🇸🇦', key: 'sa' },
    { code: '+92', country: 'PK', flag: '🇵🇰', key: 'pk' },
    { code: '+880', country: 'BD', flag: '🇧🇩', key: 'bd' },
    { code: '+52', country: 'MX', flag: '🇲🇽', key: 'mx' },
    { code: '+976', country: 'MN', flag: '🇲🇳', key: 'mn' },
  ],

  // Helper functions
  getCountryFromCode: (code: string): string => {
    const entry = Object.entries(COUNTRY_CODES.MAP).find(
      ([, value]) => value === code
    );
    return entry ? entry[0] : 'us'; // Default to US if not found
  },

  getCodeFromCountry: (countryKey: string): string => {
    return (
      COUNTRY_CODES.MAP[countryKey as keyof typeof COUNTRY_CODES.MAP] || '+1'
    );
  },
} as const;

export const JOB_TYPE = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];

export enum CommonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum JobStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
}

export enum JobFilterType {
  ALL = 'ALL',
  NEED_ATTENTION = 'NEED_ATTENTION',
  NEW_LEADS = 'NEW_LEADS',
  WAITING_ON_CLIENT = 'WAITING_ON_CLIENT',
  ONGOING = 'ONGOING',
  ARCHIVED = 'ARCHIVED',
}

// Job Management Tab Values
export const JOB_TABS = {
  NEW_LEADS: 'newLeads',
  INFO: 'info',
  ONGOING_JOB: 'ongoingJob',
  WAITING_ON_CLIENT: 'waitingOnClient',
  ARCHIVE: 'archive',
  CLOSED: 'closed',
} as const;

// Appointment form constants
export const APPOINTMENT_MESSAGES = {
  AGENDA_LABEL: 'Agenda',
  AGENDA_PLACEHOLDER: 'Enter Title',
  AGENDA_REQUIRED: 'Agenda is required',

  EMPLOYEES_LABEL: 'Select Employees',
  EMPLOYEES_PLACEHOLDER: 'Select employees',
  EMPLOYEES_REQUIRED: 'At least one employee is required',

  APPOINTMENT_WITH_LABEL: 'Appointment with',
  APPOINTMENT_WITH_PLACEHOLDER: 'Enter Name',
  APPOINTMENT_WITH_REQUIRED: 'Appointment with is required',

  DATE_LABEL: 'Date',
  DATE_PLACEHOLDER: 'Select Date',
  DATE_REQUIRED: 'Date is required',
  DATE_FUTURE_REQUIRED: 'Only Future date should be allowed',

  STARTS_LABEL: 'Starts',
  STARTS_PLACEHOLDER: 'Select Time',
  STARTS_REQUIRED: 'Start time is required',

  ENDS_LABEL: 'Ends',
  ENDS_PLACEHOLDER: 'Select Time',
  ENDS_REQUIRED: 'End time is required',
  ENDS_GREATER_THAN_STARTS: 'End time should be greater than start time',

  ADDRESS_LABEL: 'Address',
  ADDRESS_PLACEHOLDER: 'Enter Address',
  ADDRESS_REQUIRED: 'Address is required',

  NOTES_LABEL: 'Notes',
  NOTES_PLACEHOLDER: 'Enter Notes',

  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
  SAVING_BUTTON: 'Saving...',
} as const;

// Mock employees data
export const MOCK_EMPLOYEES = [
  {
    value: '1',
    label: 'John Doe',
    image: '/images/profile.jpg',
  },
  {
    value: '2',
    label: 'Jane Smith',
    image: '/images/profile.jpg',
  },
  {
    value: '3',
    label: 'Mike Johnson',
    image: '/images/profile.jpg',
  },
  {
    value: '4',
    label: 'Sarah Wilson',
    image: '/images/profile.jpg',
  },
  {
    value: '5',
    label: 'David Brown',
    image: '/images/profile.jpg',
  },
];

// Todo form constants
export const TODO_MESSAGES = {
  JOB_LABEL: 'Job',
  JOB_PLACEHOLDER: 'Select Job',
  JOB_REQUIRED: 'Job is required',

  DATE_LABEL: 'Date',
  DATE_PLACEHOLDER: 'Select Date',
  DATE_REQUIRED: 'Date is required',
  DATE_FUTURE_REQUIRED: 'Only Future date should be allowed',

  EMPLOYEES_LABEL: 'Select Employees',
  EMPLOYEES_PLACEHOLDER: 'Select employees',
  EMPLOYEES_REQUIRED: 'At least one employee must be selected',

  TITLE_LABEL: 'Title',
  TITLE_PLACEHOLDER: 'Enter Title',
  TITLE_REQUIRED: 'Title is required',

  LIST_ITEM_LABEL: 'List Item',
  LIST_ITEM_PLACEHOLDER: 'Enter Item',
  LIST_ITEM_REQUIRED: 'List item cannot be empty',
  LIST_ITEMS_REQUIRED: 'At least one list item is required',

  ADD_ANOTHER_BUTTON: '+ Add Another',

  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
  SAVING_BUTTON: 'Saving...',

  EDIT_TODO_TITLE: 'Edit Todo',
  JOB_NAME_PLACEHOLDER: 'Job Name Here',
} as const;

// Mock jobs data
export const MOCK_JOBS = [
  { value: 'job-1', label: 'Kitchen Renovation' },
  { value: 'job-2', label: 'Bathroom Remodel' },
  { value: 'job-3', label: 'Living Room Painting' },
];

// File Upload Purpose Constants
export const UPLOAD_PURPOSES = {
  COMPANY_COVER_IMAGE: 'company-cover-image',
  COMPANY_PROJECT: 'company-project',
  USER_COVER_IMAGE: 'user-cover-image',
  USER_PROJECT: 'user-project',
  TOOL: 'tool',
  TOOL_TUTORIAL: 'tool-tutorial',
} as const;

// Project Management Messages
export const PROJECT_MESSAGES = {
  CREATE_SUCCESS: 'Project created successfully',
  CREATE_ERROR: 'Failed to create project',
  UPDATE_SUCCESS: 'Project updated successfully',
  UPDATE_ERROR: 'Failed to update project',
  DELETE_SUCCESS: 'Project deleted successfully',
  DELETE_ERROR: 'Failed to delete project',
  FETCH_ERROR: 'Failed to load projects',
  UPLOAD_ERROR: 'Failed to upload one or more project images',
  COMPANY_ID_REQUIRED: 'Company ID is required',
} as const;

// Share/Copy Messages
export const SHARE_MESSAGES = {
  URL_COPIED_SUCCESS: 'Company profile URL copied to clipboard!',
  COPY_FAILED_ERROR: 'Failed to copy URL to clipboard',
  SHARE_URL_ALERT: 'Share this URL:',
  CLIPBOARD_ERROR_LOG: 'Failed to copy URL to clipboard',
} as const;

// Job/Quote Messages
export const JOB_MESSAGES = {
  QUOTE_CREATE_SUCCESS: 'Job created successfully for quote request!',
  QUOTE_CREATE_ERROR: 'Failed to create job for quote request',
} as const;

// Job Privacy Constants
export const JOB_PRIVACY = {
  //PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;

export const JOB_PRIVACY_OPTIONS = [
  { label: 'Public Job', value: 'PUBLIC' },
  { label: 'Private Job', value: 'PRIVATE' },
];

// Profile Top Block Constants
export const PROFILE_DEFAULTS = {
  COMPANY_NAME: 'Envision Construction',
  TAGLINE: 'Construction Company',
  RATING: 0,
  REVIEW_COUNT: 0,
  IS_REVIEWED: false,
  IS_USER_PROFILE: false,
  SHOW_REVIEW_BUTTON: true,
  SHOW_EDIT_BUTTON: true,
  SHOW_REQUEST_QUOTE_BUTTON: true,
  SHOW_SHARE_BUTTON: true,
  SHOW_CHANGE_COVER_BUTTON: true,
  SHOW_FIVE_BOX_SYSTEM_BUTTON: true,
  // Links - Using route constants
  EDIT_PROFILE_LINK: ROUTES.EDIT_COMPANY_PROFILE,
  FIVE_BOX_SYSTEM_LINK: ROUTES.FIVE_BOX_SYSTEM,
  COMPANY_PROFILE_LINK: ROUTES.COMPANY_PROFILE,
} as const;

// Profile Button Labels
export const PROFILE_BUTTON_LABELS = {
  WRITE_REVIEW: 'Write a Review',
  FIVE_BOX_SYSTEM: '5-box system',
  SHARE: 'Share',
  EDIT_PROFILE: 'Edit Profile',
  REQUEST_QUOTE: 'Request Quote',
  ADD_TO_NETWORK: 'Add to Network',
  CHANGE_COVER: 'Change Cover',
} as const;

// Future constants can be added here
// export const OTHER_CONSTANTS = {
//   // Add new constants as needed
// } as const;

// Local Storage Keys
// Template Type Constants
export const TEMPLATE_TYPES = {
  ESTIMATE_TEMPLATES: 'ESTIMATE_TEMPLATES',
  OPTION_BID_TEMPLATES: 'OPTION_BID_TEMPLATES',
  TOOL_TEMPLATES: 'TOOL_TEMPLATES',
  DISCLAIMER_TEMPLATES: 'DISCLAIMER_TEMPLATES',
} as const;

export type TemplateType = (typeof TEMPLATE_TYPES)[keyof typeof TEMPLATE_TYPES];

export const STORAGE_KEYS = {
  SELECTED_COMPANY: 'selected_company',
  IS_AUTHENTICATED: 'isAuthenticated',
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  DEVICE_ID: 'device_id',
  USER_PERMISSIONS: 'user_permissions',
  // Cookie keys (different from localStorage keys)
  USER_DATA: 'user_data',
  IS_AUTHENTICATED_COOKIE: 'is_authenticated',
} as const;

export const CUSTOM_EVENTS = {
  COMPANY_CHANGED: 'company-changed',
  COMPANY_CREATED: 'COMPANY_CREATED',
  STORAGE: 'storage',
} as const;

// Company Profile Tab Constants
export const COMPANY_TABS = {
  COMPANY_INFO: 'company-info',
  TEAM: 'team',
  REVIEW: 'review',
  PORTFOLIO: 'portfolio',
  WARRANTIES: 'warranties',
} as const;

export const COMPANY_TAB_ITEMS = [
  {
    value: COMPANY_TABS.COMPANY_INFO,
    label: 'Company info',
    className: 'pt-6 max-w-full',
  },
  {
    value: COMPANY_TABS.TEAM,
    label: 'Team',
    className: 'pt-6',
  },
  {
    value: COMPANY_TABS.REVIEW,
    label: 'Review',
    className: 'pt-6',
  },
  {
    value: COMPANY_TABS.PORTFOLIO,
    label: 'Portfolio',
    className: 'pt-6',
  },
  {
    value: COMPANY_TABS.WARRANTIES,
    label: 'Warranties',
    className: 'pt-6',
  },
];
