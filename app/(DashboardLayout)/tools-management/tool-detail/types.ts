// Tool detail data interface
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
  issue?: string;
  assignedStatus:
    | 'Temporary'
    | 'Permanent'
    | 'Available'
    | 'Maintenance'
    | 'Lost';
}
