// Category management module static messages
export const CATEGORY_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'Category created successfully.',
  UPDATE_SUCCESS: 'Category updated successfully.',
  DELETE_SUCCESS: 'Category deleted successfully.',
  STATUS_UPDATE_SUCCESS: 'Category status updated successfully.',
  RETRIEVE_SUCCESS: 'Category retrieved successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create category.',
  UPDATE_ERROR: 'Failed to update category.',
  DELETE_ERROR: 'Failed to delete category.',
  FETCH_ERROR: 'Failed to fetch categories.',
  FETCH_DETAILS_ERROR: 'Failed to fetch category details.',
  STATUS_UPDATE_ERROR: 'Failed to update category status.',
  RETRIEVE_ERROR: 'Failed to retrieve category.',
  CATEGORY_NOT_FOUND_ERROR: 'Category UUID not found',
  DEFAULT_CATEGORY_STATUS_ERROR: 'Default category status cannot be changed.',
  DEFAULT_CATEGORY_DELETE_ERROR: 'Default category cannot be deleted.',
  CATEGORY_NOT_FOUND: 'Category not found',

  // Validation Messages
  NAME_REQUIRED: 'Category name is required.',
  DESCRIPTION_REQUIRED: 'Description is required.',
  ICON_REQUIRED: 'Icon is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',

  // Status Messages
  NO_CATEGORIES_FOUND: 'No categories found.',
  NO_CATEGORIES_FOUND_DESCRIPTION:
    "You haven't created any categories yet. Start by adding your first one to organize your categories.",
  NO_MORE_CATEGORIES: 'No more categories to load.',
  NO_ARCHIVED_CATEGORIES_FOUND: 'No archived categories found.',
  ARCHIVED_CATEGORIES_TITLE: 'Archived Categories',

  // Button Labels
  ADD_CATEGORY_BUTTON: 'Create Category',
  EDIT_CATEGORY_BUTTON: 'Edit Category',
  DELETE_CATEGORY_BUTTON: 'Archive Category',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form Labels
  CATEGORY_NAME_LABEL: 'Category Name',
  DESCRIPTION_LABEL: 'Description',
  ICON_LABEL: 'Icon',

  // Form Placeholders
  ENTER_CATEGORY_NAME: 'Enter category name',
  ENTER_DESCRIPTION: 'Enter description',
  SELECT_ICON: 'Select icon',

  // Page Titles and Headers
  CATEGORY_MANAGEMENT_TITLE: 'Category Management',
  ADD_CATEGORY_TITLE: 'Add Category',
  EDIT_CATEGORY_TITLE: 'Edit Category',

  // Breadcrumbs
  BREADCRUMB_CATEGORIES: 'Categories',
  CATEGORY_MANAGEMENT_BREADCRUMB: 'Category Management',
  CREATE_CATEGORY_BREADCRUMB: 'Create Category',
  EDIT_CATEGORY_BREADCRUMB: 'Edit Category',

  // Menu Options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',
  RETRIEVE_MENU: 'Retrieve',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Are you sure you want to archive?',
  DELETE_CONFIRM_SUBTITLE: 'This action cannot be undone.',
};
