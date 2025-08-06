// Service management type definitions

// Service interface for UI and API responses
export interface Service {
  id: number;
  uuid: string;
  name: string;
  description: string;
  is_default: boolean;
  is_active: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  company_id?: string;
  trades: Array<{
    id: number | string;
    name: string;
    status: string;
  }>;
}

// Service API response structure
export interface ServiceApiResponse {
  statusCode: number;
  message: string;
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service form data interface for create operations
export interface ServiceCreateFormData {
  name: string;
  description: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  trade_ids: string;
}

// Service initial data for form (for edit mode)
export interface ServiceInitialData {
  name?: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  trades?: string[];
}

// Form error interface
export interface ServiceFormErrors {
  name?: string;
  trades?: string;
  description?: string;
  general?: string;
}

// Fetch services parameters
export interface FetchServicesParams {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  status?: string;
  trade_id?: string | number;
  company_id?: string;
}

// Props interface for service form component
export interface ServiceFormProps {
  onSubmit?: (data: {
    serviceName: string;
    trades: string;
    serviceData?: Service;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialServiceUuid?: string | undefined;
}

// Trade interface for dropdown options
export interface Trade {
  id: number | string;
  name: string;
  status: string;
}

// Dummy service interface for demo data
export interface DummyService {
  initials: string;
  initialsBg: string;
  serviceName: string;
  trade: string;
}
