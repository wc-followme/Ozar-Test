import { Icon } from 'iconsax-react';

// Role interface for dropdowns and API responses
export interface Role {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  total_permissions?: number;
  uuid: string;
}

// Role API response structure
export interface RoleApiResponse {
  data: {
    data: Role[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Form error interface
export interface FormErrors {
  roleCategory?: string;
  fullName?: string;
  designation?: string;
  date?: string;
  email?: string;
  phone?: string;
  password?: string;
  communication?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  general?: string;
}

// User form data interface for create operations
export interface UserCreateFormData {
  role_id: number;
  name: string;
  email: string;
  password: string; // Required for create
  country_code: string;
  phone_number: string;
  profile_picture_url?: string;
  date_of_joining: string; // Required for create
  designation: string;
  preferred_communication_method: string;
  address: string;
  city: string;
  pincode: string;
}

// User form data interface for update operations
export interface UserUpdateFormData {
  role_id?: number;
  name?: string;
  email?: string;
  password?: string; // Optional for updates
  country_code?: string;
  phone_number?: string;
  profile_picture_url?: string;
  date_of_joining?: string; // Optional for updates
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

// General form data interface for the form component
export interface UserFormData {
  role_id: number; // Required for form validation
  name: string; // Required for form validation
  email: string; // Required for form validation
  country_code: string; // Required for form validation
  phone_number: string; // Required for form validation
  designation: string; // Required for form validation
  preferred_communication_method: string; // Required for form validation
  address: string; // Required for form validation
  city: string; // Required for form validation
  pincode: string; // Required for form validation
  date_of_joining?: string | undefined; // Optional, allow undefined explicitly
  password?: string | undefined; // Optional, allow undefined explicitly
  profile_picture_url?: string | undefined; // Optional, allow undefined explicitly
}

// User initial data for form (for edit mode)
export interface UserInitialData {
  role_id?: number;
  role?: {
    uuid: string;
    name?: string;
  };
  name?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  profile_picture_url?: string;
}

// Error types for API responses
export interface ApiErrorResponse {
  message: string;
  status?: number;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Menu option interface for user cards (matching UserCard's interface)
export interface MenuOption {
  label: string;
  action: string;
  icon: Icon;
  variant?: 'default' | 'destructive';
}
