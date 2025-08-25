// Category management type definitions

// Category interface for UI and API responses
export interface Category {
  id: number;
  uuid: string;
  name: string;
  description: string;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Menu option interface for category actions
export interface MenuOption {
  label: string;
  action: string;
  icon: any;
  variant: 'default' | 'destructive';
}

// Category API response structure
export interface CategoryApiResponse {
  statusCode: number;
  message: string;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Category form data interface for create operations
export interface CategoryCreateFormData {
  name: string;
  description: string;
  icon: string;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Category initial data for form (for edit mode)
export interface CategoryInitialData {
  name?: string;
  description?: string;
  icon?: string;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Form error interface
export interface CategoryFormErrors {
  name?: string;
  description?: string;
  icon?: string;
  general?: string;
}

// Fetch categories parameters
export interface FetchCategoriesParams {
  page?: number;
  limit?: number;
  status?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Props interface for category form component
export interface CategoryInfoFormProps {
  onSubmit: (data: CategoryCreateFormData) => void;
  loading?: boolean;
  error?: string | undefined;
  initialData?: CategoryInitialData;
  isEditMode?: boolean;
}
