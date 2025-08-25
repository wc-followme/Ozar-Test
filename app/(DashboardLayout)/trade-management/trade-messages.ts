// Trade management module static messages
export const TRADE_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'Trade created successfully.',
  UPDATE_SUCCESS: 'Trade updated successfully.',
  DELETE_SUCCESS: 'Trade deleted successfully.',
  STATUS_UPDATE_SUCCESS: 'Trade status updated successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create trade.',
  UPDATE_ERROR: 'Failed to update trade.',
  DELETE_ERROR: 'Failed to delete trade.',
  FETCH_ERROR: 'Failed to fetch trades.',
  FETCH_DETAILS_ERROR: 'Failed to fetch trade details.',
  STATUS_UPDATE_ERROR: 'Failed to update trade status.',
  TRADE_NOT_FOUND_ERROR: 'Trade UUID not found',
  DEFAULT_TRADE_STATUS_ERROR: 'Default trade status cannot be changed.',
  DEFAULT_TRADE_DELETE_ERROR: 'Default trade cannot be deleted.',
  TRADE_NOT_FOUND: 'Trade not found',

  // Validation Messages
  NAME_REQUIRED: 'Trade name is required.',
  CATEGORY_REQUIRED: 'At least one category is required.',
  DESCRIPTION_REQUIRED: 'Description is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',
  LOADING_CATEGORIES: 'Loading categories...',

  // Status Messages
  NO_TRADES_FOUND: 'No trades found.',
  NO_TRADES_FOUND_DESCRIPTION:
    "You haven't created any trades yet. Start by adding your first one to organize your trades.",

  // Button Labels
  ADD_TRADE_BUTTON: 'Create Trade',
  EDIT_TRADE_BUTTON: 'Edit Trade',
  DELETE_TRADE_BUTTON: 'Delete Trade',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form Labels
  TRADE_NAME_LABEL: 'Trade Name',
  CATEGORY_LABEL: 'Category',
  DESCRIPTION_LABEL: 'Description',

  // Form Placeholders
  ENTER_TRADE_NAME: 'Enter Trade Name',
  SELECT_CATEGORY: 'Select Category',
  ENTER_DESCRIPTION: 'Enter description',

  // Page Titles and Headers
  TRADE_MANAGEMENT_TITLE: 'Trade Management',
  ADD_TRADE_TITLE: 'Create Trade',
  EDIT_TRADE_TITLE: 'Edit Trade',

  // Breadcrumbs
  BREADCRUMB_TRADES: 'Trades',
  TRADE_MANAGEMENT_BREADCRUMB: 'Trade Management',
  CREATE_TRADE_BREADCRUMB: 'Create Trade',
  EDIT_TRADE_BREADCRUMB: 'Edit Trade',

  // Menu Options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Archive Trade',
  DELETE_CONFIRM_SUBTITLE:
    'Are you sure you want to Archive "{name}"? This action cannot be undone.',

  // Archive and Retrieve Messages
  RETRIEVE_SUCCESS: 'Trade retrieved successfully.',
  RETRIEVE_ERROR: 'Failed to retrieve trade.',
  NO_ARCHIVED_TRADES_FOUND: 'No archived trades found.',
  ARCHIVED_TRADES_TITLE: 'Archived Trades',
  RETRIEVE_MENU: 'Retrieve',
};
