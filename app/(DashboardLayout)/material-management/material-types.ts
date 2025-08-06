// Material management type definitions

// Material interface for UI and API responses
export interface Material {
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
  services: Array<{
    id: number | string;
    name: string;
    status: string;
  }>;
}

// Material API response structure
export interface MaterialApiResponse {
  statusCode: number;
  message: string;
  data: Material[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Material form data interface for create operations
export interface MaterialCreateFormData {
  name: string;
  description: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  service_ids: string;
}

// Material initial data for form (for edit mode)
export interface MaterialInitialData {
  name?: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  services?: string[];
}

// Form error interface
export interface MaterialFormErrors {
  name?: string;
  services?: string;
  description?: string;
  general?: string;
}

// Fetch materials parameters
export interface FetchMaterialsParams {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  status?: string;
  service_id?: string | number;
  company_id?: string;
}

// Props interface for material form component
export interface MaterialFormProps {
  onSubmit?: (data: {
    materialName: string;
    services: string;
    materialData?: Material;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialMaterialUuid?: string | undefined;
}

// Service interface for dropdown options
export interface Service {
  id: number | string;
  name: string;
  status: string;
}

// Dummy material interface for demo data
export interface DummyMaterial {
  initials: string;
  initialsBg: string;
  materialName: string;
  category: string;
}
