// Tool management type definitions

// Tool interface for UI and API responses
export interface Tool {
  id: number;
  uuid: string;
  name: string;
  available_quantity: number;
  manufacturer: string;
  tool_assets: string;
  service_ids: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  services: Array<{
    id: number | string;
    name: string;
    status: string;
  }>;
}

// Tool API response structure
export interface ToolApiResponse {
  statusCode: number;
  message: string;
  data: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tool form data interface for create operations
export interface ToolCreateFormData {
  name: string;
  available_quantity: number;
  manufacturer: string;
  tool_assets: string;
  service_ids: string;
}

// Tool initial data for form (for edit mode)
export interface ToolInitialData {
  name?: string;
  available_quantity?: number;
  manufacturer?: string;
  tool_assets?: string;
  services?: string[];
}

// Form error interface
export interface ToolFormErrors {
  name?: string;
  total_quantity?: string;
  manufacturer?: string;
  tool_assets?: string;
  service_ids?: string;
  general?: string;
}

// Fetch tools parameters
export interface FetchToolsParams {
  page?: number;
  limit?: number;
  name?: string;
  manufacturer?: string;
  status?: string;
  service_id?: string | number;
}

// Props interface for tool form component
export interface ToolFormProps {
  onSubmit?: (data: {
    toolName: string;
    manufacturer: string;
    totalQuantity: number;
    toolAssets: string;
    serviceIds: string;
    toolData?: Tool;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialToolUuid?: string | undefined;
}

// Service interface for dropdown options
export interface Service {
  uuid: string;
  name: string;
  status: string;
}

// Dummy tool interface for demo data
export interface DummyTool {
  initials: string;
  initialsBg: string;
  toolName: string;
  manufacturer: string;
  totalQuantity: number;
}

// Tool History Management Types
export interface ToolHistoryData {
  id: string;
  borrowedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  borrowedDate: string;
  returnedDate: string;
}

export interface ToolMaintenanceData {
  id: string;
  returnedBy: {
    name: string;
    avatar: string;
  };
  employeeType: string;
  assignedJob: string;
  assignedDate: string;
  returnedDate: string;
  issue: string;
}
