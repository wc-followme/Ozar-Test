// Material management messages and constants

export const MATERIAL_MESSAGES = {
  // Page titles and headers
  MATERIAL_MANAGEMENT_TITLE: 'Material Management',
  ADD_MATERIAL_TITLE: 'Add Material',
  EDIT_MATERIAL_TITLE: 'Edit Material',

  // Buttons
  ADD_MATERIAL_BUTTON: 'Create Material',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form labels and placeholders
  MATERIAL_NAME_LABEL: 'Material Name',
  ENTER_MATERIAL_NAME: 'Enter Material Name',
  SERVICE_LABEL: 'Service',
  SELECT_SERVICE: 'Select Service',
  LOADING_SERVICES: 'Loading services...',

  // Menu options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',

  // Success messages
  CREATE_SUCCESS: 'Material created successfully',
  UPDATE_SUCCESS: 'Material updated successfully',
  DELETE_SUCCESS: 'Material deleted successfully',

  // Error messages
  CREATE_ERROR: 'Failed to create material',
  UPDATE_ERROR: 'Failed to update material',
  DELETE_ERROR: 'Failed to delete material',
  FETCH_ERROR: 'Failed to fetch materials',

  // Delete confirmation
  DELETE_CONFIRM_TITLE: 'Delete Material',
  DELETE_CONFIRM_SUBTITLE:
    'Are you sure you want to delete "{name}"? This action cannot be undone.',

  // Loading and empty states
  LOADING_MATERIALS: 'Loading materials...',
  LOADING_MATERIALS_DROPDOWN: 'Loading materials...',
  NO_MATERIALS_FOUND: 'No materials found',
  NO_MATERIALS_FOUND_DESCRIPTION:
    "You haven't created any materials yet. Start by adding your first one to organize your materials.",
  // Validation messages
  MATERIAL_NAME_REQUIRED: 'Material name is required',
  SERVICE_REQUIRED: 'At least one service is required',
} as const;
