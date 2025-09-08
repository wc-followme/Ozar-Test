export const NOT_FOUND_MESSAGES = {
  NOTFOUNd:
    "Oops! It seems like something went wrong. We couldn't find the page you were looking for.",
  GO_HOME: 'Back to Home',
  CONSTRUCTION:
    "We're actively building this feature to make your experience even better. Got ideas or feedback? We'd love to hear them!",
};

// Access Denied Messages
export const ACCESS_DENIED_MESSAGES = {
  DEFAULT_TITLE: 'Access Denied',
  DEFAULT_MESSAGE: 'You do not have permission to access this page.',
  DEFAULT_REDIRECT_TEXT: 'Go to Dashboard',

  // Company Management
  COMPANY_DETAILS_TITLE: 'Access Denied',
  COMPANY_DETAILS_MESSAGE:
    'You do not have permission to view company details.',
  COMPANY_DETAILS_REDIRECT_TEXT: 'Go to Company Management',
  COMPANY_CREATE_MESSAGE: 'You do not have permission to create companies.',
  COMPANY_EDIT_MESSAGE: 'You do not have permission to edit companies.',
  COMPANY_DELETE_MESSAGE: 'You do not have permission to delete companies.',

  // User Management
  USER_DETAILS_TITLE: 'Access Denied',
  USER_DETAILS_MESSAGE: 'You do not have permission to view user details.',
  USER_DETAILS_REDIRECT_TEXT: 'Go to User Management',
  USER_CREATE_MESSAGE: 'You do not have permission to create users.',
  USER_EDIT_MESSAGE: 'You do not have permission to edit users.',
  USER_DELETE_MESSAGE: 'You do not have permission to delete users.',

  // Job Management
  JOB_DETAILS_TITLE: 'Access Denied',
  JOB_DETAILS_MESSAGE: 'You do not have permission to view job details.',
  JOB_DETAILS_REDIRECT_TEXT: 'Go to Job Management',

  // Role Management
  ROLE_DETAILS_TITLE: 'Access Denied',
  ROLE_DETAILS_MESSAGE: 'You do not have permission to view role details.',
  ROLE_DETAILS_REDIRECT_TEXT: 'Go to Role Management',
  ROLE_CREATE_MESSAGE: 'You do not have permission to create roles.',
  ROLE_EDIT_MESSAGE: 'You do not have permission to edit roles.',
  ROLE_DELETE_MESSAGE: 'You do not have permission to delete roles.',

  // Tool Management
  TOOL_DETAILS_TITLE: 'Access Denied',
  TOOL_DETAILS_MESSAGE: 'You do not have permission to view tool details.',
  TOOL_DETAILS_REDIRECT_TEXT: 'Go to Tool Management',
  TOOL_CREATE_MESSAGE: 'You do not have permission to create tools.',
  TOOL_EDIT_MESSAGE: 'You do not have permission to edit tools.',

  // Organization Management
  ORGANIZATION_DETAILS_TITLE: 'Access Denied',
  ORGANIZATION_DETAILS_MESSAGE:
    'You do not have permission to view organization details.',
  ORGANIZATION_DETAILS_REDIRECT_TEXT: 'Go to Organization',
  TOOL_DELETE_MESSAGE: 'You do not have permission to delete tools.',

  // Trade Management
  TRADE_DETAILS_TITLE: 'Access Denied',
  TRADE_DETAILS_MESSAGE: 'You do not have permission to view trade details.',
  TRADE_DETAILS_REDIRECT_TEXT: 'Go to Trade Management',

  // Material Management
  MATERIAL_DETAILS_TITLE: 'Access Denied',
  MATERIAL_DETAILS_MESSAGE:
    'You do not have permission to view material details.',
  MATERIAL_DETAILS_REDIRECT_TEXT: 'Go to Material Management',

  // Service Management
  SERVICE_DETAILS_TITLE: 'Access Denied',
  SERVICE_DETAILS_MESSAGE:
    'You do not have permission to view service details.',
  SERVICE_DETAILS_REDIRECT_TEXT: 'Go to Service Management',

  // Category Management
  CATEGORY_DETAILS_TITLE: 'Access Denied',
  CATEGORY_DETAILS_MESSAGE:
    'You do not have permission to view category details.',
  CATEGORY_DETAILS_REDIRECT_TEXT: 'Go to Category Management',
};

// Thank You Messages
export const THANK_YOU_MESSAGES = {
  DEFAULT_TITLE: 'Thank You!',
  DEFAULT_MESSAGE:
    'Your project details have been successfully submitted. We will review your information and get back to you soon.',
  GO_TO_LOGIN_BUTTON: 'Go to Log in',
};

// Skip to Estimation Messages
export const SKIP_MESSAGES = {
  SKIP_TO_ESTIMATION: 'Skip to Estimation',
};

// Profile Details Messages
export const PROFILE_DETAILS_MESSAGES = {
  BUSINESS_NAME: 'Business name',
  EMAIL: 'Email',
  PHONE_NUMBER: 'Phone number',
  COMMUNICATION: 'Communication',
  PROJECTS: 'Projects',
  WEBSITE: 'Website',
  ADDRESS: 'Address',
  VIEW_COMPANY_PROFILE: 'View company profile',
  COMPANY_NAME_NOT_AVAILABLE: 'Company name not available',
};

// Login Messages
export const LOGIN_MESSAGES = {
  SUCCESS: 'Welcome back! You have been logged in successfully.',
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    GENERIC: 'Login failed. Please try again.',
  },
  FORM: {
    TITLE: 'Join us to start turning your vision into reality!',
    SUBTITLE: 'Login now to get started!',
    BUTTON: 'Login',
    BUTTON_LOADING: 'Logging in...',
    SIGNUP_LINK: "Don't have an account?",
    SIGNUP_LINK_TEXT: 'Sign up here',
    FORGOT_PASSWORD_LINK: 'Forgot Password?',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  },
  LABELS: {
    EMAIL: 'Email *',
    PASSWORD: 'Password *',
  },
  PLACEHOLDERS: {
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
  },
};

// Signup Messages
export const SIGNUP_MESSAGES = {
  SUCCESS: 'Account created successfully! Welcome to our platform.',
  ERROR: {
    PASSWORDS_MISMATCH: 'Passwords do not match. Please try again.',
    EMAIL_EXISTS: 'Email already exists. Please use a different email.',
    INVALID_INPUT: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    GENERIC: 'Failed to create account. Please try again.',
    UNEXPECTED: 'An unexpected error occurred. Please try again.',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_STRENGTH:
      'Password must contain uppercase, lowercase, numbers, and special characters',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    PASSWORDS_MISMATCH: 'Passwords do not match',
    FIRST_NAME_REQUIRED: 'Full name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    PHONE_INVALID: 'Please enter a valid phone number',
    ROLE_REQUIRED: 'Role is required',
  },
  LABELS: {
    FULL_NAME: 'Full name *',
    EMAIL: 'Email *',
    PHONE_NUMBER: 'Phone number',
    PASSWORD: 'Password *',
    CONFIRM_PASSWORD: 'Confirm password *',
  },
  PLACEHOLDERS: {
    FULL_NAME: 'Enter your full name',
    EMAIL: 'Enter your email',
    PHONE_NUMBER: 'Enter your phone number (optional)',
    PASSWORD: 'Enter your password',
    CONFIRM_PASSWORD: 'Confirm your password',
  },
  FORM: {
    TITLE: 'Create Account',
    SUBTITLE: 'Join us to start turning your vision into reality!',
    DESCRIPTION: 'Create your account to get started!',
    BUTTON: 'Create Account',
    BUTTON_LOADING: 'Creating Account...',
    LOGIN_LINK: 'Already have an account?',
    LOGIN_LINK_TEXT: 'Login here',
    REDIRECT_MESSAGE: 'You need to signup to access',
  },
};
// Forgot Password Messages
export const FORGOT_PASSWORD_MESSAGES = {
  SUCCESS:
    'Password reset link has been sent to your email. Please check your inbox.',
  ERROR: {
    EMAIL_NOT_FOUND: 'Email not found. Please check your email address.',
    GENERIC: 'Failed to send reset link. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
  },
  LABELS: {
    EMAIL: 'Email *',
  },
  PLACEHOLDERS: {
    EMAIL: 'Enter your email',
  },
  FORM: {
    TITLE: 'Forgot Password',
    SUBTITLE:
      'Enter your email address and we will send you a link to reset your password.',
    BUTTON: 'Send Reset Link',
    BUTTON_LOADING: 'Sending...',
    LOGIN_LINK: 'Remember your password?',
    LOGIN_LINK_TEXT: 'Login here',
  },
  API: {
    SUCCESS_MESSAGE: 'Password reset email sent successfully',
    INVALID_EMAIL: 'Invalid email format',
    INTERNAL_ERROR: 'Internal server error',
  },
};

// Estimation Messages
export const ESTIMATION_MESSAGES = {
  NO_TRADE_OPTIONS_AVAILABLE: 'No trade options available',
  DEFAULT_TRADE_NAME: 'Default Trade',
};

// Warranty Messages
export const WARRANTY_MESSAGES = {
  SUCCESS: 'Warranty saved successfully!',
  ERROR: {
    GENERIC: 'Failed to save warranty. Please try again.',
    VALIDATION: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },
  VALIDATION: {
    TYPE_REQUIRED: 'Type of warranty is required',
    CATEGORY_REQUIRED: 'Category is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    DURATION_REQUIRED: 'Duration is required',
  },
  LABELS: {
    TYPE: 'Type of warranty',
    CATEGORY: 'Category',
    DESCRIPTION: 'Description',
    DURATION: 'Duration',
  },
  PLACEHOLDERS: {
    TYPE: 'Enter warranty type (e.g., Workmanship, Product, Brand)',
    CATEGORY: 'Enter category (e.g., Interior, Exterior, Structural)',
    DESCRIPTION: 'Enter Description',
    DURATION: 'Enter duration (e.g., 1 Year, 2 Years, Lifetime)',
  },
  FORM: {
    TITLE: 'Warranty Form',
    SUBTITLE: 'Add or edit warranty information',
    BUTTON_SAVE: 'Save',
    BUTTON_CANCEL: 'Cancel',
    TYPE_DISABLED_MESSAGE:
      'Type cannot be changed when editing an existing warranty',
  },
};

// Organization Messages
export const ORGANIZATION_MESSAGES = {
  TITLE: 'Work Profile',
  TABS: {
    PROMOTION: 'Promotion',
    DOCUMENT: 'Document',
    DISCIPLINARY: 'Disciplinary',
  },
  DOCUMENT: {
    SEARCH_PLACEHOLDER: 'Search here...',
    UPLOAD_BUTTON: 'Upload Document',
    UPLOAD_TITLE: 'Add Documents',
    SUCCESS: {
      UPLOAD: 'Document uploaded successfully',
      DELETE: 'Document deleted successfully',
      UPDATE: 'Document updated successfully',
    },
    ERROR: {
      UPLOAD: 'Failed to upload document',
      DELETE: 'Failed to delete document',
      UPDATE: 'Failed to update document',
      FETCH: 'Failed to fetch documents',
    },
    VALIDATION: {
      NAME_REQUIRED: 'Document name is required',
      FILE_REQUIRED: 'Please select a file to upload',
    },
  },
};
