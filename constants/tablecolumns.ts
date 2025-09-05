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
    key: 'assignedTo',
    label: 'Assigned to',
    type: 'avatar' as const,
    avatarKey: 'assignedTo',
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
    key: 'assignedTo',
    label: 'Assigned to',
    type: 'avatar' as const,
    avatarKey: 'assignedTo',
    subtitleKey: 'employeeType',
  },
  {
    key: 'assignedJob',
    label: 'Assigned Job',
    type: 'text' as const,
  },
  {
    key: 'lostDate',
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
    key: 'issue',
    label: 'Issue',
    type: 'text' as const,
  },
];

// Columns for Time Management pages

// Columns for app/(DashboardLayout)/time-management/LeaveTab.tsx
export const PENDING_LEAVE_COLUMNS = [
  {
    key: 'leaveDate',
    label: 'Leave Date',
    width: 'w-40',
    type: 'text' as const,
  },
  {
    key: 'leaveType',
    label: 'Leave Type',
    width: 'w-32',
    type: 'text' as const,
  },
  {
    key: 'status',
    label: 'Status',
    width: 'w-24',
    type: 'text' as const,
  },
  {
    key: 'actionOn',
    label: 'Action on',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'leaveNote',
    label: 'Leave Note',
    width: 'w-48',
    type: 'text' as const,
  },
  {
    key: 'rejectNote',
    label: 'Reject Note',
    width: 'w-32',
    type: 'text' as const,
  },
  {
    key: 'action',
    label: 'Action',
    width: 'w-20',
    type: 'custom' as const,
    align: 'center' as const,
  },
];

export const LEAVE_HISTORY_COLUMNS = [
  {
    key: 'leaveDates',
    label: 'Leave Dates',
    width: 'w-40',
    type: 'text' as const,
  },
  {
    key: 'leaveType',
    label: 'Leave Type',
    width: 'w-32',
    type: 'text' as const,
  },
  {
    key: 'leaveNote',
    label: 'Leave Note',
    width: 'w-48',
    type: 'text' as const,
  },
  {
    key: 'actionOn',
    label: 'Action on',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'status',
    label: 'Status',
    width: 'w-24',
    type: 'custom' as const,
    align: 'center' as const,
  },
  {
    key: 'note',
    label: 'Note',
    width: 'w-48',
    type: 'text' as const,
  },
  {
    key: 'actionBy',
    label: 'Action By',
    width: 'w-36',
    type: 'text' as const,
  },
];

// Columns for app/(DashboardLayout)/time-management/TimeLogTab.tsx
export const TIME_LOG_COLUMNS = [
  {
    key: 'date',
    label: 'Date',
    width: 'w-24',
    type: 'text' as const,
  },
  {
    key: 'attendanceVisual',
    label: 'Attendance Visual',
    width: 'w-32',
    type: 'custom' as const,
  },
  {
    key: 'effectiveHours',
    label: 'Effective Hours',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'grossHours',
    label: 'Gross Hours',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'arrival',
    label: 'Arrival',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'overTime',
    label: 'Over Time',
    width: 'w-28',
    type: 'text' as const,
  },
  {
    key: 'gps',
    label: 'GPS',
    width: 'w-20',
    type: 'custom' as const,
  },
  {
    key: 'log',
    label: 'Log',
    width: 'w-16',
    type: 'custom' as const,
    align: 'center' as const,
  },
];
