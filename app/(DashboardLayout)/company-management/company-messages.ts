// Company management module static messages
export const COMPANY_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'Company created successfully.',
  UPDATE_SUCCESS: 'Company updated successfully.',
  DELETE_SUCCESS: 'Company archived successfully.',
  RETRIEVE_SUCCESS: 'Company retrieved successfully.',
  STATUS_UPDATE_SUCCESS: 'Company status updated successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create company.',
  UPDATE_ERROR: 'Failed to update company.',
  DELETE_ERROR: 'Failed to archive company.',
  RETRIEVE_ERROR: 'Failed to retrieve company.',
  FETCH_ERROR: 'Failed to fetch companies.',
  FETCH_DETAILS_ERROR: 'Failed to fetch company details.',
  STATUS_UPDATE_ERROR: 'Failed to update company status.',
  COMPANY_NOT_FOUND_ERROR: 'Company UUID not found',
  DEFAULT_COMPANY_STATUS_ERROR: 'Default company status cannot be changed.',
  DEFAULT_COMPANY_DELETE_ERROR: 'Default company cannot be deleted.',
  UPLOAD_ERROR: 'Failed to upload image',
  COMPANY_NOT_FOUND: 'Company not found',

  // Validation Messages
  NAME_REQUIRED: 'Company name is required.',
  TAGLINE_REQUIRED: 'Tagline is required.',
  ABOUT_REQUIRED: 'About is required.',
  EMAIL_REQUIRED: 'Email is required.',
  PHONE_REQUIRED: 'Phone number is required.',
  COMMUNICATION_REQUIRED: 'Communication method is required.',
  WEBSITE_REQUIRED: 'Website is required.',
  EXPIRY_DATE_REQUIRED: 'Expiry date is required.',
  PREFERRED_COMMUNICATION_REQUIRED: 'Preferred communication is required.',
  CITY_REQUIRED: 'City is required.',
  PINCODE_REQUIRED: 'Pin code is required.',
  PROJECTS_REQUIRED: 'Projects description is required.',
  CONTRACTOR_NAME_REQUIRED: 'Contractor name is required.',
  CONTRACTOR_EMAIL_REQUIRED: 'Contractor email is required.',
  CONTRACTOR_PHONE_REQUIRED: 'Contractor phone is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',

  // Status Messages
  NO_COMPANIES_FOUND: 'No companies found.',
  NO_COMPANIES_FOUND_DESCRIPTION:
    "You haven't created any companies yet. Start by adding your first one to organize your companies.",
  NO_MORE_COMPANIES: 'No more companies to load.',

  // Button Labels
  ADD_COMPANY_BUTTON: 'Add Company',
  EDIT_COMPANY_BUTTON: 'Edit Company',
  DELETE_COMPANY_BUTTON: 'Delete Company',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  UPLOADING: 'Uploading...',

  // Form Labels
  COMPANY_NAME_LABEL: 'Company Name',
  TAGLINE_LABEL: 'Tagline',
  ABOUT_LABEL: 'About',
  EMAIL_LABEL: 'Email',
  PHONE_LABEL: 'Phone Number',
  COMMUNICATION_LABEL: 'Communication',
  WEBSITE_LABEL: 'Website',
  EXPIRY_DATE_LABEL: 'Expiry Date',
  PREFERRED_COMMUNICATION_LABEL: 'Preferred Communication Method',
  CITY_LABEL: 'City',
  PINCODE_LABEL: 'Pin Code',
  PROJECTS_LABEL: 'Projects',
  CONTRACTOR_NAME_LABEL: 'Contractor Name',
  CONTRACTOR_EMAIL_LABEL: 'Contractor Email',
  CONTRACTOR_PHONE_LABEL: 'Contractor Phone',

  // Form Placeholders
  ENTER_COMPANY_NAME: 'Enter company name',
  ENTER_TAGLINE: 'Enter tagline',
  ENTER_ABOUT: 'Enter about company',
  ENTER_EMAIL: 'Enter email',
  ENTER_PHONE: 'Enter phone number',
  ENTER_COMMUNICATION: 'Enter communication method',
  ENTER_WEBSITE: 'Enter website URL',
  SELECT_EXPIRY_DATE: 'Select expiry date',
  SELECT_PREFERRED_COMMUNICATION: 'Select preferred communication',
  ENTER_CITY: 'Enter city',
  ENTER_PINCODE: 'Enter pin code',
  ENTER_PROJECTS: 'Enter projects description',
  ENTER_CONTRACTOR_NAME: 'Enter contractor name',
  ENTER_CONTRACTOR_EMAIL: 'Enter contractor email',
  ENTER_CONTRACTOR_PHONE: 'Enter contractor phone',

  // Photo Upload
  UPLOAD_PHOTO_LABEL: 'Upload Company Logo',
  ENTER_CONTRACTOR_PHOTO: 'Upload Contractor Photo',
  UPLOAD_PHOTO_TEXT:
    '1600 x 1200 (4:3) recommended. PNG and JPG files are allowed.',

  // Communication Options
  EMAIL_OPTION: 'Email',
  PHONE_OPTION: 'Phone',
  SMS_OPTION: 'SMS',
  SLACK_OPTION: 'Slack',
  TEAMS_OPTION: 'Microsoft Teams',

  // Page Titles and Headers
  COMPANY_MANAGEMENT_TITLE: 'Company Management',
  ADD_COMPANY_TITLE: 'Add Company',
  EDIT_COMPANY_TITLE: 'Edit Company',
  COMPANY_DETAILS_TITLE: 'Company Details',

  // Breadcrumbs
  BREADCRUMB_COMPANIES: 'Companies',

  // Tabs
  TAB_COMPANY_INFO: 'Company Info',
  TAB_PHOTO: 'Photo',
  TAB_ABOUT: 'About',
  TAB_USER_MANAGEMENT: 'User Management',

  // Menu Options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',
  RETRIEVE_MENU: 'Retrieve',

  // Company Details Labels
  COMPANY_TYPE_LABEL: 'Construction Company',
  INDUSTRY_LABEL: 'Industry',
  INDUSTRY_VALUE: 'Construction',
  CREATED_ON_LABEL: 'Created on',
  SUBSCRIPTION_ENDS_LABEL: 'Subscription Ends',
  ENABLE_LABEL: 'Enable',
  DISABLE_LABEL: 'Disable',
  EDIT_DETAILS_BUTTON: 'Edit Details',
  ADD_USER_BUTTON: 'Add User',
  NO_IMAGE_LABEL: 'No Image',
  NO_DESCRIPTION_LABEL: 'No description available.',
  ADDRESS_LABEL: 'Address',
  SEARCH_PLACEHOLDER: 'Search here...',
  N_A_LABEL: 'N/A',

  // General Messages
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  UNAUTHORIZED: 'You are not authorized to perform this action.',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Are you sure you want to archive?',
  DELETE_CONFIRM_SUBTITLE: 'This action cannot be undone.',
  
  // Archive related messages
  ARCHIVED_COMPANIES_TITLE: 'Archived Companies',
  NO_ARCHIVED_COMPANIES_FOUND: 'No archived companies found',
};
