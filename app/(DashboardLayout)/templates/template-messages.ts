// Template management messages and constants

export const TEMPLATE_MESSAGES = {
  // Page titles and headers
  TEMPLATE_MANAGEMENT_TITLE: 'Templates',
  ADD_TEMPLATE_TITLE: 'Add Template',
  EDIT_TEMPLATE_TITLE: 'Edit Template',
  ESTIMATE_TEMPLATES_TITLE: 'Estimate Templates',
  TOOLS_TEMPLATE_TITLE: 'Tools Template',
  DISCLAIMER_TITLE: 'Disclaimer',

  // Buttons
  ADD_TEMPLATE_BUTTON: 'Create Template',
  ADD_FROM_TEMPLATES_BUTTON: 'Add From Templates',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  SAVE_TEMPLATE_BUTTON: 'Save Template',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form labels and placeholders
  TEMPLATE_NAME_LABEL: 'Template Name',
  ENTER_TEMPLATE_NAME: 'Enter template name',
  SERVICE_LABEL: 'Service',
  SELECT_SERVICE: 'Select Service',
  MATERIAL_LABEL: 'Material',
  ENTER_MATERIAL: 'Enter material details',
  DESCRIPTION_LABEL: 'Description',
  ENTER_DESCRIPTION: 'Enter template description',
  WARRANTY_LABEL: 'Warranty',
  ENTER_WARRANTY: 'Enter Warranty',
  DURATION_LABEL: 'Duration',
  SELECT_DURATION: 'Select Duration',
  CATEGORY_LABEL: 'Category',
  SELECT_CATEGORY: 'Select Category',
  TOOLS_LABEL: 'Tools',
  SELECT_TOOLS: 'Select Tools',

  // Menu options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',
  RETRIEVE_MENU: 'Retrieve',

  // Success messages
  CREATE_SUCCESS: 'Template created successfully',
  UPDATE_SUCCESS: 'Template updated successfully',
  DELETE_SUCCESS: 'Template deleted successfully',
  RETRIEVE_SUCCESS: 'Template retrieved successfully',

  // Error messages
  CREATE_ERROR: 'Failed to create template',
  UPDATE_ERROR: 'Failed to update template',
  DELETE_ERROR: 'Failed to delete template',
  FETCH_ERROR: 'Failed to fetch templates',
  RETRIEVE_ERROR: 'Failed to retrieve template',

  // Delete confirmation
  DELETE_CONFIRM_TITLE: 'Archive Template',
  DELETE_CONFIRM_SUBTITLE:
    'Are you sure you want to Archive this template? This action cannot be undone.',

  // Loading and empty states
  LOADING_TEMPLATES: 'Loading templates...',
  NO_TEMPLATES_FOUND: 'No templates found',
  NO_TEMPLATES_FOUND_DESCRIPTION:
    "You haven't created any templates yet. Start by adding your first one to organize your templates.",

  // Validation messages
  TEMPLATE_NAME_REQUIRED: 'Template name is required',
  SERVICE_REQUIRED: 'Service is required',
  CATEGORY_REQUIRED: 'Category is required',

  // Template type names
  ESTIMATE_TEMPLATE: 'Estimate Template',
  TOOLS_TEMPLATE: 'Tools Template',
  DISCLAIMERS_TEMPLATE: 'Disclaimers Template',
  OPTION_BID_TEMPLATE: 'Service Options Template',

  // Category options
  INTERIOR: 'Interior',
  EXTERIOR: 'Exterior',
  GENERAL: 'General',
  FULL_HOME_BUILD: 'Full Home Build/Addition',

  // Service options
  PAINTING: 'Painting',
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  CARPENTRY: 'Carpentry',
  GENERAL_SERVICE: 'General',
  WARRANTY_SERVICE: 'Warranty',

  // Duration options
  ONE_YEAR: '1 Year',
  TWO_YEARS: '2 Years',
  THREE_YEARS: '3 Years',
  FIVE_YEARS: '5 Years',
  LIFETIME: 'Lifetime',

  // Property types
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INDUSTRIAL: 'Industrial',

  // Tool categories
  POWER_TOOLS: 'power-tools',
  MEASURING_TOOLS: 'measuring-tools',
  HAND_TOOLS: 'hand-tools',

  // Tool statuses
  AVAILABLE: 'available',
  IN_USE: 'in-use',
  MAINTENANCE: 'maintenance',

  // Room names
  ROOM_1: 'Room 1',
} as const;
