// Centralized table column configurations for Tools Management pages

// Columns for app/(DashboardLayout)/tools-management/tool-detail/page.tsx
export const TOOL_DETAIL_AVAILABLE_COLUMNS = [
  {
    key: 'toolId',
    label: 'Tool ID / Barcode',
    type: 'combined' as const,
    subKey: 'barcode',
  },
  {
    key: 'returnedBy',
    label: 'Returned By',
    type: 'avatar' as const,
    avatarKey: 'returnedBy',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    type: 'date' as const,
  },
  {
    key: 'returnedDate',
    label: 'Returned Date',
    type: 'date' as const,
  },
  {
    key: 'condition',
    label: 'Condition',
    type: 'status' as const,
  },
];

export const TOOL_DETAIL_ASSIGNED_COLUMNS = [
  {
    key: 'toolId',
    label: 'Tool ID / Barcode',
    type: 'combined' as const,
    subKey: 'barcode',
  },
  {
    key: 'returnedBy',
    label: 'Assigned to',
    type: 'avatar' as const,
    avatarKey: 'returnedBy',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'returnedDate',
    label: 'Assigned Date',
    type: 'date' as const,
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    type: 'date' as const,
  },
  {
    key: 'condition',
    label: 'Condition',
    type: 'status' as const,
  },
  {
    key: 'assignedStatus',
    label: 'Assigned Status',
    type: 'status' as const,
  },
];

export const TOOL_DETAIL_MAINTENANCE_COLUMNS = [
  {
    key: 'toolId',
    label: 'Tool ID / Barcode',
    type: 'combined' as const,
    subKey: 'barcode',
  },
  {
    key: 'returnedBy',
    label: 'Assigned to',
    type: 'avatar' as const,
    avatarKey: 'returnedBy',
    subtitleKey: 'employeeType',
  },

  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'returnedDate',
    label: 'Returned Date',
    type: 'date' as const,
  },
  {
    key: 'issue',
    label: 'Issue',
    type: 'text' as const,
  },
];

export const TOOL_DETAIL_LOST_COLUMNS = [
  {
    key: 'toolId',
    label: 'Tool ID / Barcode',
    type: 'combined' as const,
    subKey: 'barcode',
  },
  {
    key: 'returnedBy',
    label: 'Assigned to',
    type: 'avatar' as const,
    avatarKey: 'returnedBy',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'returnedDate',
    label: 'Lost Date',
    type: 'date' as const,
  },
];

// Columns for app/(DashboardLayout)/tools-management/tool-detail/[slug]/page.tsx
export const TOOL_HISTORY_BORROWED_COLUMNS = [
  {
    key: 'borrowedBy',
    label: 'Borrowed By',
    type: 'avatar' as const,
    avatarKey: 'borrowedBy',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'borrowedDate',
    label: 'Borrowed Date',
    type: 'date' as const,
  },
  {
    key: 'returnedDate',
    label: 'Returned Date',
    type: 'date' as const,
  },
];

export const TOOL_HISTORY_MAINTENANCE_COLUMNS = [
  {
    key: 'returnedBy',
    label: 'Returned By',
    type: 'avatar' as const,
    avatarKey: 'returnedBy',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'assignedDate',
    label: 'Assigned Date',
    type: 'date' as const,
  },
  {
    key: 'returnedDate',
    label: 'Returned Date',
    type: 'date' as const,
  },
  {
    key: 'issue',
    label: 'Issue',
    type: 'text' as const,
  },
];
