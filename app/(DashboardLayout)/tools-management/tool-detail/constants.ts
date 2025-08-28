// Tool Detail Page Constants

// Static Values
export const TOOL_DETAIL_STATIC = {
  DEFAULT_TOOL_NAME: 'Drill Machine',
  DEFAULT_JOB: 'Job#456 Downtown Project',
  TAB_COUNTS: {
    AVAILABLE: 50,
    ASSIGNED: 16,
    MAINTENANCE: 9,
    LOST: 10,
  },
} as const;

// Labels
export const TOOL_DETAIL_LABELS = {
  TABS: {
    AVAILABLE: 'Available',
    ASSIGNED: 'Assigned',
    MAINTENANCE: 'Maintenance',
    LOST: 'Lost',
  },
  ACTIONS: {
    ASSIGN: 'Assign',
    RETURN: 'Return Tool',
    MAINTENANCE: 'Maintenance',
    LOST: 'Lost',
    ADD_MORE: 'Add More Tools',
    EDIT: 'Edit',
    MARK_AVAILABLE: 'Mark as available',
  },
  FIELDS: {
    TOOL_NAME: 'Tool Name',
    TOOL_ID: 'Tool ID',
    BARCODE: 'Barcode',
    CONDITION: 'Condition',
    ASSIGN_DATE: 'Assign Date',
    DUE_DATE: 'Due Date',
    ASSIGNEE: 'Assignee',
    JOB: 'Job',
    RETURNED_DATE: 'Returned Date',
    RETURNED_BY: 'Returned By',
    ISSUES: 'Issues',
    ACKNOWLEDGE_DATE: 'Acknowledge Date',
    SUBS_EMPLOYEES: 'Subs Employees',
    REASON: 'Reason',
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    ADD: 'Add',
    SUBMIT: 'Submit',
  },
  MESSAGES: {
    LOADING: 'Loading tool details...',
    NO_AVAILABLE_TOOLS: 'No available tools found',
    NO_ASSIGNED_TOOLS: 'No assigned tools found',
    NO_MAINTENANCE_TOOLS: 'No tools under maintenance found',
    NO_LOST_TOOLS: 'No lost tools found',
    SEARCH_PLACEHOLDER: 'Search here...',
  },
} as const;

// Messages
export const TOOL_DETAIL_MESSAGES = {
  SUCCESS: {
    TOOL_ASSIGNED: 'Tool assigned successfully',
    TOOL_RETURNED: 'Tool returned successfully',
    TOOL_MAINTENANCE: 'Tool marked for maintenance',
    TOOL_LOST: 'Tool marked as lost',
    TOOL_ADDED: 'More tools added successfully',
    BARCODES_ADDED: 'Barcodes added successfully',
    BARCODES_PARTIAL:
      'barcode(s) added successfully. Some barcodes failed (already exist).',
    BARCODES_ALL_EXIST: 'All barcodes already exist.',
  },
  ERROR: {
    FETCH_FAILED: 'Failed to fetch tool details',
    ASSIGN_FAILED: 'Failed to assign tool',
    RETURN_FAILED: 'Failed to return tool',
    MAINTENANCE_FAILED: 'Failed to mark tool for maintenance',
    LOST_FAILED: 'Failed to mark tool as lost',
    ADD_FAILED: 'Failed to add more tools',
    ADD_BARCODE_REQUIRED: 'Please add at least one barcode',
    TOOL_ID_NOT_FOUND: 'Tool ID not found',
    ADD_BARCODE_FAILED: 'Failed to add barcodes',
  },
  CONFIRMATION: {
    ASSIGN_TITLE: 'Assign Tool',
    RETURN_TITLE: 'Return Tool',
    MAINTENANCE_TITLE: 'Maintenance',
    LOST_TITLE: 'Lost Tool',
    ADD_MORE_TITLE: 'Add More Tools',
  },
} as const;

// Form Default Values
export const TOOL_DETAIL_DEFAULTS = {
  ASSIGN: {
    toolName: TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME as string,
    toolId: '',
    barcode: '',
    condition: '',
    assignDate: '',
    dueDate: '',
    assignee: '',
    assigneeId: '',
    job: '',
    assignedStatus: '',
    isBarcodeEnabled: false,
    isScanMode: false,
  },
  RETURN: {
    toolName: TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME as string,
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    returnedDate: new Date().toISOString(),
    returnedById: '',
    job: '',
  },
  MAINTENANCE: {
    toolName: TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME as string,
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    returnedDate: new Date().toISOString(),
    returnedBy: '',
    returnedById: '',
    job: '',
    issues: '', // Default value since it's now required
  },
  LOST: {
    toolName: TOOL_DETAIL_STATIC.DEFAULT_TOOL_NAME as string,
    dueDate: '',
    toolId: '',
    barcode: '',
    condition: '',
    acknowledgeDate: '',
    subsEmployees: '',
    subsEmployeesId: '',
    job: '',
    reason: '',
  },
};

// Breadcrumb Data
export const TOOL_DETAIL_BREADCRUMB = {
  TOOLS: 'Tools',
  LOADING: 'Loading...',
} as const;

// Tab Status Constants for API
export const TOOL_DETAIL_TAB_STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  MAINTENANCE: 'maintenance',
  LOST: 'lost',
} as const;

// Videos Tutorial Page Constants

// Labels
export const VIDEOS_TUTORIAL_LABELS = {
  PAGE_TITLE: 'Videos Tutorial',
  ADD_VIDEOS: 'Add Videos',
  CANCEL: 'Cancel',
  ADD: 'Add',
  ADDING: 'Adding...',
  DELETE: 'Delete',
  LOADING: 'Loading tool details...',
  NO_VIDEOS_TITLE: 'No Video Tutorials',
  NO_VIDEOS_DESCRIPTION:
    'No video tutorials found for this tool. Add your first video tutorial to help users understand how to use this tool.',
  ADD_VIDEOS_BUTTON: 'Add Videos',
} as const;

// Messages
export const VIDEOS_TUTORIAL_MESSAGES = {
  SUCCESS: {
    VIDEOS_ADDED: 'Videos added successfully',
    VIDEO_DELETED: 'Video deleted successfully',
    NO_VIDEOS_TO_ADD: 'No videos or links to add',
  },
  ERROR: {
    FETCH_FAILED: 'Failed to fetch tool details',
    ADD_FAILED: 'Failed to add videos',
    DELETE_FAILED: 'Failed to delete video',
  },
} as const;

// SideSheet Configuration
export const VIDEOS_TUTORIAL_SIDESHEET = {
  TITLE_PREFIX: 'Add Videos - ',
  SIZE: '600px',
} as const;

// Action Keys for Dropdown Actions
export const TOOL_DETAIL_ACTION_KEYS = {
  ASSIGN: 'assign',
  RETURN: 'return',
  MAINTENANCE: 'maintenance',
  LOST: 'lost',
  AVAILABLE: 'available',
  EDIT: 'edit',
  DETAILS: 'details',
  ADD_MORE: 'addMore',
} as const;
