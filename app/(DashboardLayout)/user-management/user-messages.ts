// User management module static messages
export const USER_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'User created successfully.',
  UPDATE_SUCCESS: 'User updated successfully.',
  DELETE_SUCCESS: 'User deleted successfully.',
  STATUS_UPDATE_SUCCESS: 'User status updated successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create user.',
  UPDATE_ERROR: 'Failed to update user.',
  DELETE_ERROR: 'Failed to delete user.',
  FETCH_ERROR: 'Failed to fetch users.',
  FETCH_DETAILS_ERROR: 'Failed to fetch user details.',
  STATUS_UPDATE_ERROR: 'Failed to update user status.',
  UPLOAD_ERROR: 'Failed to upload image',
  LOAD_ROLES_ERROR: 'Failed to load roles.',
  USER_NOT_FOUND_ERROR: 'User UUID not found',

  // Validation Messages
  ROLE_REQUIRED: 'Role is required.',
  FULL_NAME_REQUIRED: 'Full name is required.',
  DESIGNATION_REQUIRED: 'Designation is required.',
  DATE_REQUIRED: 'Date of joining is required.',
  EMAIL_REQUIRED: 'Email is required.',
  PHONE_REQUIRED: 'Phone number is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  COMMUNICATION_REQUIRED: 'Preferred communication is required.',
  ADDRESS_REQUIRED: 'Address is required.',
  CITY_REQUIRED: 'City is required.',
  PIN_CODE_REQUIRED: 'Pin code is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',
  LOADING_ROLES: 'Loading roles...',
  UPLOADING: 'Uploading...',

  // Status Messages
  NO_USERS_FOUND: 'No users found.',
  NO_USERS_FOUND_DESCRIPTION:
    "You haven't created any users yet. Start by adding your first one to organize your users.",
  NO_MORE_USERS: 'No more users to load.',
  USER_NOT_FOUND: 'User not found',

  // Form Placeholders
  SELECT_ROLE: 'Select role',
  ENTER_FULL_NAME: 'Enter Full Name',
  ENTER_JOB_TITLE: 'Enter Job Title',
  SELECT_DATE: 'Select Date',
  ENTER_EMAIL: 'Enter Email',
  ENTER_PASSWORD: 'Enter Password',
  ENTER_PASSWORD_OPTIONAL: 'Enter new password (optional)',
  ENTER_NUMBER: 'Enter Number',
  ENTER_ADDRESS: 'Enter Company Address',
  ENTER_CITY: 'Enter City',
  ENTER_PIN_CODE: 'Enter Pin Code',
  SELECT_COMMUNICATION: 'eg. email, phone, etc.',
  PASSWORD_OPTIONAL_HINT: '(leave blank to keep current)',

  // Form Labels
  ROLE_LABEL: 'Role',
  FULL_NAME_LABEL: 'Full Name',
  DESIGNATION_LABEL: 'Designation',
  DATE_OF_JOINING_LABEL: 'Date of Joining',
  EMAIL_LABEL: 'Email',
  PASSWORD_LABEL: 'Password',
  PHONE_LABEL: 'Phone Number',
  COMMUNICATION_LABEL: 'Preferred Method of Communication',
  ADDRESS_LABEL: 'Address',
  CITY_LABEL: 'City',
  PIN_CODE_LABEL: 'Pin Code',

  // Button Labels
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  DELETE_USER_BUTTON: 'Delete User',
  ARCHIVE_BUTTON: 'Archive',
  ADD_ADMIN_USER_BUTTON: 'Create User',
  REMOVE_PHOTO_ARIA: 'Remove photo',

  // Page Titles and Headers
  USER_MANAGEMENT_TITLE: 'Admin / User Management',
  ADD_USER_TITLE: 'Add User',
  EDIT_USER_TITLE: 'Edit User',

  // Breadcrumb
  USER_MANAGEMENT_BREADCRUMB: 'User Management',
  ADD_USER_BREADCRUMB: 'Add User',
  EDIT_USER_BREADCRUMB: 'Edit User',

  // Filter Options
  ALL_USERS: 'All Users',

  // Tab Labels
  INFO_TAB: 'Info',
  PERMISSIONS_TAB: 'Permissions',
  SETTINGS_TAB: 'Settings',
  // Photo Upload
  UPLOAD_PHOTO_LABEL: 'Upload Photo or Drag and Drop',
  UPLOAD_PHOTO_TEXT: 'Supported formats: JPG, PNG, GIF. Max size: 5MB.',

  // Communication Options
  EMAIL_OPTION: 'Email',
  PHONE_OPTION: 'Phone',
  SMS_OPTION: 'SMS',
  SLACK_OPTION: 'Slack',
  TEAMS_OPTION: 'Microsoft Teams',

  // General Messages
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  INVALID_DATA: 'Invalid user data. Please check your input.',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Are you sure you want to archive?',
  DELETE_CONFIRM_SUBTITLE: 'This action cannot be undone.',

  // Permissions Messages
  PERMISSIONS_UPDATE_SUCCESS: 'User permissions updated successfully.',
  PERMISSIONS_UPDATE_ERROR: 'Failed to update user permissions.',
  PERMISSIONS_FETCH_ERROR: 'Failed to fetch user permissions.',
  PERMISSIONS_LOADING: 'Loading permissions...',
};

export const CHANGE_PASSWORD_MESSAGES = {
  CURRENT_PASSWORD_LABEL: 'Current Password',
  CURRENT_PASSWORD_PLACEHOLDER: 'Enter Current Password',
  CURRENT_PASSWORD_REQUIRED: 'Current password is required.',
  NEW_PASSWORD_LABEL: 'New Password',
  NEW_PASSWORD_PLACEHOLDER: 'Enter New Password',
  NEW_PASSWORD_REQUIRED: 'New password is required.',
  NEW_PASSWORD_MIN: 'Password must be at least 8 characters.',
  NEW_PASSWORD_HELP:
    'Use at least 8 characters, with uppercase, lowercase, numbers, and symbols.',
  NEW_PASSWORD_COMPLEXITY:
    'Use at least 8 characters, with uppercase, lowercase, numbers, and symbols.',
  CONFIRM_PASSWORD_LABEL: 'Confirm New Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Enter Confirm Password',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your new password.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  SUBTITLE: 'Update your password to keep your account secure.',
  BUTTON: 'Change Password',
  SUPPORT_TEXT: 'Having trouble?',
  SUPPORT_LINK: 'Contact support',
  CHANGE_PASSWORD_SUCCESS: 'Password has been updated successfully.',
  CHANGE_PASSWORD_ERROR: 'Failed to change password.',
};
