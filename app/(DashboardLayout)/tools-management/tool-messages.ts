// Tool management module static messages
export const TOOL_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'Tool created successfully.',
  UPDATE_SUCCESS: 'Tool updated successfully.',
  DELETE_SUCCESS: 'Tool deleted successfully.',
  STATUS_UPDATE_SUCCESS: 'Tool status updated successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create tool.',
  UPDATE_ERROR: 'Failed to update tool.',
  DELETE_ERROR: 'Failed to delete tool.',
  FETCH_ERROR: 'Failed to fetch tools.',
  FETCH_DETAILS_ERROR: 'Failed to fetch tool details.',
  STATUS_UPDATE_ERROR: 'Failed to update tool status.',
  TOOL_NOT_FOUND_ERROR: 'Tool UUID not found',
  TOOL_NOT_FOUND: 'Tool not found',
  UPLOAD_ERROR: 'Failed to upload tool image.',

  // Validation Messages
  NAME_REQUIRED: 'Tool name is required.',
  MANUFACTURER_REQUIRED: 'Manufacturer is required.',
  QUANTITY_REQUIRED: 'Quantity is required.',
  QUANTITY_MIN: 'Quantity must be at least 1.',
  SERVICES_REQUIRED: 'At least one service is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',
  LOADING_SERVICES: 'Loading services...',
  LOADING_TOOLS_DROPDOWN: 'Loading tools...',

  // Status Messages
  NO_TOOLS_FOUND: 'No tools found.',
  NO_TOOLS_FOUND_DESCRIPTION:
    "You haven't created any tools yet. Start by adding your first one to organize your tools.",

  // Button Labels
  ADD_TOOL_BUTTON: 'Create Tool',
  EDIT_TOOL_BUTTON: 'Edit Tool',
  DELETE_TOOL_BUTTON: 'Delete Tool',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form Labels
  TOOL_NAME_LABEL: 'Tool Name',
  MANUFACTURER_LABEL: 'Manufacturer',
  QUANTITY_LABEL: 'Total Quantity',
  SERVICES_LABEL: 'Services',
  TOOL_IMAGE_LABEL: 'Tool Image',

  // Form Placeholders
  ENTER_TOOL_NAME: 'Enter Tool Name',
  ENTER_MANUFACTURER: 'Enter Manufacturer',
  ENTER_QUANTITY: 'Enter Quantity',
  SELECT_SERVICES: 'Select Services',

  // Page Titles and Headers
  TOOL_MANAGEMENT_TITLE: 'Tools Management',
  ADD_TOOL_TITLE: 'Create Tool',
  EDIT_TOOL_TITLE: 'Edit Tool',

  // Breadcrumbs
  BREADCRUMB_TOOLS: 'Tools',
  TOOL_MANAGEMENT_BREADCRUMB: 'Tools Management',
  CREATE_TOOL_BREADCRUMB: 'Create Tool',
  EDIT_TOOL_BREADCRUMB: 'Edit Tool',

  // Menu Options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Archive Tool',
  DELETE_CONFIRM_SUBTITLE:
    'Are you sure you want to Archive "{name}"? This action cannot be undone.',
};
