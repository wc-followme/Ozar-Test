// Service management messages and constants

export const SERVICE_MESSAGES = {
  // Page titles and headers
  SERVICE_MANAGEMENT_TITLE: 'Service Management',
  ADD_SERVICE_TITLE: 'Add Service',
  EDIT_SERVICE_TITLE: 'Edit Service',

  // Buttons
  ADD_SERVICE_BUTTON: 'Create Service',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form labels and placeholders
  SERVICE_NAME_LABEL: 'Service Name',
  ENTER_SERVICE_NAME: 'Enter Service Name',
  TRADE_LABEL: 'Trade',
  SELECT_TRADE: 'Select Trade',
  LOADING_TRADES: 'Loading trades...',

  // Menu options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',
  RETRIEVE_MENU: 'Retrieve',

  // Success messages
  CREATE_SUCCESS: 'Service created successfully',
  UPDATE_SUCCESS: 'Service updated successfully',
  DELETE_SUCCESS: 'Service deleted successfully',
  RETRIEVE_SUCCESS: 'Service retrieved successfully',

  // Error messages
  CREATE_ERROR: 'Failed to create service',
  UPDATE_ERROR: 'Failed to update service',
  DELETE_ERROR: 'Failed to delete service',
  FETCH_ERROR: 'Failed to fetch services',
  RETRIEVE_ERROR: 'Failed to retrieve service',
  DEFAULT_SERVICE_DELETE_ERROR: 'Cannot archive default service',

  // Delete confirmation
  DELETE_CONFIRM_TITLE: 'Delete Service',
  DELETE_CONFIRM_SUBTITLE:
    'Are you sure you want to delete "{name}"? This action cannot be undone.',

  // Loading and empty states
  LOADING_SERVICES: 'Loading services...',
  LOADING_SERVICES_DROPDOWN: 'Loading services...',
  NO_SERVICES_FOUND: 'No services found',
  NO_SERVICES_FOUND_DESCRIPTION:
    "You haven't created any services yet. Start by adding your first one to organize your services.",
  ARCHIVED_SERVICES_TITLE: 'Archived Services',
  NO_ARCHIVED_SERVICES_FOUND: 'No archived services found',

  // Validation messages
  SERVICE_NAME_REQUIRED: 'Service name is required',
  TRADE_REQUIRED: 'At least one trade is required',
} as const;
