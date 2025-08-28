// Shared types for tool detail components

// Type for transformed row data used in dropdown actions
export interface TransformedRowData {
  id: string;
  toolId: string;
  barcode: string;
  condition: string;
  assignedJob: string;
  dueDate: string;
  assignedTo: {
    id: string | number;
    name: string;
    avatar: string;
  };
  assignedJobId: string;
}

// Type for tool detail data used in dummy data
export interface ToolDetailData {
  id: string;
  toolId: string;
  barcode: string;
  returnedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  dueDate: string;
  returnedDate: string;
  condition: string;
  assignedStatus: string;
  issue?: string;
}
