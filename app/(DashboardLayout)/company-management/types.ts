import { Icon } from 'iconsax-react';

// Company interface for UI and API responses
export interface Company {
  id: number;
  uuid: string;
  name: string;
  created_at: string;
  expiry_date: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_default?: boolean;
}

// Company API response structure
export interface CompanyApiResponse {
  statusCode: number;
  message: string;
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Menu option interface
export interface MenuOption {
  label: string;
  action: string;
  icon: Icon;
  variant?: 'default' | 'destructive';
}

// Fetch companies parameters
export interface FetchCompaniesParams {
  page?: number;
  limit?: number;
  status?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// API Error response interface
export interface ApiErrorResponse {
  message: string;
  status?: number;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
