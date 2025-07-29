// Job management module static messages
export const JOB_MESSAGES = {
  // Success Messages
  CREATE_SUCCESS: 'Job created successfully.',
  UPDATE_SUCCESS: 'Job updated successfully.',
  DELETE_SUCCESS: 'Job deleted successfully.',

  // Error Messages
  CREATE_ERROR: 'Failed to create job.',
  UPDATE_ERROR: 'Failed to update job.',
  DELETE_ERROR: 'Failed to delete job.',
  FETCH_ERROR: 'Failed to fetch jobs.',
  FETCH_DETAILS_ERROR: 'Failed to fetch job details.',
  JOB_NOT_FOUND_ERROR: 'Job UUID not found',

  // Validation Messages
  NAME_REQUIRED: 'Client name is required.',
  EMAIL_REQUIRED: 'Email is required.',
  PHONE_REQUIRED: 'Phone number is required.',

  // Loading Messages
  LOADING: 'Loading...',
  LOADING_MORE: 'Loading more...',

  // Status Messages
  NO_JOBS_FOUND: 'No jobs found.',
  NO_JOBS_FOUND_DESCRIPTION:
    "You haven't created any jobs yet. Start by adding your first one to manage your projects.",
  NO_MORE_JOBS: 'No more jobs to load.',

  // Button Labels
  ADD_JOB_BUTTON: 'Create Job',
  EDIT_JOB_BUTTON: 'Edit Job',
  DELETE_JOB_BUTTON: 'Delete Job',
  CREATE_BUTTON: 'Create',
  UPDATE_BUTTON: 'Update',
  CANCEL_BUTTON: 'Cancel',
  CREATING_BUTTON: 'Creating...',
  UPDATING_BUTTON: 'Updating...',

  // Form Labels
  JOB_NAME_LABEL: 'New to Us / Already with Us',
  PHONE_LABEL: 'Phone Number',
  JOB_TYPE_LABEL: 'Job Type',
  LINK_LABEL: 'Link',

  // Form Placeholders
  ENTER_JOB_NAME: 'Enter client full name',
  ENTER_EMAIL: 'Enter your email',
  ENTER_PHONE: 'Enter your phone number',
  ENTER_LINK: 'Enter your link',

  // Page Titles and Headers
  JOB_MANAGEMENT_TITLE: 'Job Management',
  ADD_JOB_TITLE: 'Create Job',
  EDIT_JOB_TITLE: 'Edit Job',

  // Breadcrumbs
  BREADCRUMB_JOBS: 'Jobs',
  JOB_MANAGEMENT_BREADCRUMB: 'Job Management',
  CREATE_JOB_BREADCRUMB: 'Create Job',
  EDIT_JOB_BREADCRUMB: 'Edit Job',

  // Menu Options
  EDIT_MENU: 'Edit',
  DELETE_MENU: 'Archive',
  CLOSE_JOB_MENU: 'Close job',
  ADD_EMPLOYEE_MENU: 'Add Employee',
  MOVE_TO_ARCHIVE_MENU: 'Move to Archive',
  SETTINGS_MENU: 'Settings',

  // Confirm Modal Messages
  DELETE_CONFIRM_TITLE: 'Are you sure you want to archive?',
  DELETE_CONFIRM_SUBTITLE: 'This action cannot be undone.',

  // Job Details Page Messages
  ARCHIVE_SUCCESS: 'Job moved to archive successfully.',
  ARCHIVE_ERROR: 'Failed to move job to archive.',
  CLOSE_SUCCESS: 'Job closed successfully.',
  CLOSE_ERROR: 'Failed to close job.',
  JOB_NOT_FOUND: 'Job not found',
  MOVE_TO_ARCHIVE_TITLE: 'Move to Archive',
  MOVE_TO_ARCHIVE_SUBTITLE:
    'Are you sure you want to move this job to archive? This action can be undone later.',
  CLOSE_JOB_TITLE: 'Close Job',
  CLOSE_JOB_SUBTITLE:
    'Are you sure you want to close this job? This action can be undone later.',

  // Job Details Page Labels
  PROJECT_ID_LABEL: 'Project ID',
  PROJECT_NAME_LABEL: 'Project Name',
  JOB_CATEGORY_LABEL: 'Job category',
  BUDGET_LABEL: 'Budget',
  CLIENT_NAME_LABEL: 'Client Name',
  EMAIL_LABEL: 'Email',
  PHONE_NUMBER_LABEL: 'Phone Number',
  ADDRESS_LABEL: 'Address',
  ARCHIVED_STATUS: 'Archived',
  CLOSED_STATUS: 'Closed',
};
