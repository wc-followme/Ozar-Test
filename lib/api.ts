import { PAGINATION } from '@/constants/common';

interface DeviceInfo {
  fcm_token?: string;
  device_id: string;
  device_name: string;
  platform_type: 'Web' | 'Android' | 'iOS';
  api_version: string;
  os_version: string;
  latitude?: number;
  longitude?: number;
  app_version: string;
}

interface LoginRequest {
  email: string;
  password: string;
  device_info: DeviceInfo;
}

interface LoginResponse {
  statusCode: number;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    user: {
      id: number;
      uuid: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      profile_image: string;
      status: string;
      created_at: string;
      updated_at: string;
      created_by: number | null;
      updated_by: number | null;
      device_token: string;
      role: {
        id?: number;
        uuid: string;
        name: string;
      };
      company: {
        id?: number;
        uuid: string;
        name: string;
      };
    };
  };
}

// Refresh token interfaces
interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
  };
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Role management interfaces
interface CreateRoleRequest {
  name: string;
  description: string;
  icon: string;
  status?: 'ACTIVE' | 'INACTIVE';
  permissions?: any;
  company_id?: string | number;
}

interface CreateRoleResponse {
  statusCode: number;
  message: string;
  data?: {
    id: number;
    name: string;
    description: string;
    icon: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

// User management interfaces
export interface User {
  id: number;
  uuid: string;

  name: string;
  email: string;
  country_code: string;
  phone_number: string;
  profile_picture_url: string;
  cover_image?: string;
  status: string;
  created_at: string;
  updated_at: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  averageRating?: number;
  reviewCount?: number;
  isReviewed?: boolean;
  role: {
    id?: number | string; // Not provided in login response
    uuid: string;
    name: string;
  };
  company: {
    id?: number | string;
    uuid: string;
    name: string;
    image?: string;
  };
}

export interface FetchUsersResponse {
  statusCode: number;
  message: string;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User status update response
export interface UpdateUserStatusResponse {
  statusCode: number;
  message: string;
  data?: User;
}

// User delete response
export interface DeleteUserResponse {
  statusCode: number;
  message: string;
}

// User creation types
export interface CreateUserRequest {
  role_id: number;
  name: string;
  email: string;
  password?: string; // Optional - will be generated on backend if not provided
  country_code: string;
  phone_number: string;
  profile_picture_url?: string;
  date_of_joining: string;
  designation: string;
  preferred_communication_method: string;
  address: string;
  city: string;
  pincode: string;
  company_id?: number | string | undefined; // Optional - for creating users within a specific company (numeric ID)
}

export interface CreateUserResponse {
  statusCode: number;
  message: string;
  data: any;
}

// User update types
export interface UpdateUserRequest {
  role_id?: number;
  name?: string;
  email?: string;
  password?: string;
  country_code?: string;
  phone_number?: string;
  profile_picture_url?: string;
  cover_image?: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  is_profile_completed?: boolean;
}

export interface UpdateUserResponse {
  statusCode: number;
  message: string;
  data: any;
}

// User details response
export interface GetUserResponse {
  statusCode: number;
  message: string;
  data: User;
}

// Company interfaces
export interface Company {
  id: number;
  uuid: string;
  name: string;
  created_at: string;
  expiry_date: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_default: boolean;
}

export interface FetchCompaniesResponse {
  statusCode: number;
  message: string;
  data: {
    data: Company[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateCompanyStatusResponse {
  statusCode: number;
  message: string;
  data?: Company;
}

export interface CreateCompanyRequest {
  name: string;
  tagline: string;
  about: string;
  email: string;
  country_code: string;
  phone_number: string;
  communication: string;
  website: string;
  expiry_date?: string;
  preferred_communication_method: string;
  city: string;
  pincode: string;
  projects: string;
  is_default: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string;
  contractor_name?: string;
  contractor_email?: string;
  contractor_phone?: string;
  contractor_profile_url?: string;
}

export interface CreateCompanyResponse {
  statusCode: number;
  message: string;
  data?: Company;
}

export interface UpdateCompanyRequest {
  name?: string;
  tagline?: string;
  about?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
  communication?: string;
  website?: string;
  expiry_date?: string;
  preferred_communication_method?: string;
  city?: string;
  pincode?: string;
  projects?: string;
  image?: string;
  cover_image?: string;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCompanyResponse {
  statusCode: number;
  message: string;
  data?: Company;
}

// Company delete response
export interface DeleteCompanyResponse {
  statusCode: number;
  message: string;
}

// Portfolio/Projects interfaces
export interface PortfolioProject {
  uuid: string;
  name: string;
  images?: string[];
  videos?: string[];
  company_uuid: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  id?: number;
  title?: string;
  type?: string;
  year?: string;
  image?: string;
  imageCount?: number;
  videoCount?: number;
  company_id?: string;
}

export interface FetchPortfolioResponse {
  statusCode: number;
  message: string;
  data: {
    data: PortfolioProject[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectRequest {
  // DTO: name, images[], and videos[]
  name: string;
  images?: string[];
  videos?: string[];
  // Optional: if not provided, server may take from auth context
  company_id?: string;
}

export interface CreatePortfolioResponse {
  statusCode: number;
  message: string;
  data?: PortfolioProject;
}

export interface UpdateProjectRequest {
  name?: string;
  images?: string[];
  videos?: string[];
  company_id?: string;
}

export interface UpdatePortfolioResponse {
  statusCode: number;
  message: string;
  data?: PortfolioProject;
}

export interface DeletePortfolioResponse {
  statusCode: number;
  message: string;
}

// Category interfaces
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

export interface FetchCategoriesResponse {
  statusCode: number;
  message: string;
  data: {
    data: Category[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  icon: string;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  company_id?: string | number;
}

export interface CreateCategoryResponse {
  statusCode: number;
  message: string;
  data?: Category;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  company_id?: string | number;
}

export interface UpdateCategoryResponse {
  statusCode: number;
  message: string;
  data?: Category;
}

export interface UpdateCategoryStatusResponse {
  statusCode: number;
  message: string;
  data?: Category;
}

export interface DeleteCategoryResponse {
  statusCode: number;
  message: string;
}

export interface GetCategoryResponse {
  statusCode: number;
  message: string;
  data: Category;
}

// User permissions interfaces
export interface UserPermissions {
  roles: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    customize: boolean;
    archive: boolean;
  };
  companies: {
    view: boolean;
    assign_user: boolean;
    archive: boolean;
  };
  catalogue_services: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  jobs: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  templates: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  global_settings: {
    view: boolean;
    edit: boolean;
  };
}

export interface GetUserPermissionsResponse {
  statusCode: number;
  message: string;
  data: {
    permissions: UserPermissions;
    [key: string]: any; // Allow other user properties
  };
}

export interface UpdateUserPermissionsResponse {
  statusCode: number;
  message: string;
  data?: UserPermissions;
}

export interface GetCompanyResponse {
  statusCode: number;
  message: string;
  data: Company & {
    tagline: string;
    about: string;
    email: string;
    country_code: string;
    phone_number: string;
    communication: string;
    website: string;
    preferred_communication_method: string;
    city: string;
    pincode: string;
    projects: string;
    contractor_name: string;
    contractor_email: string;
    contractor_phone: string;
    cover_image?: string;
    averageRating?: number;
    reviewCount?: number;
    isReviewed?: boolean;
  };
}

// Tool management interfaces
export interface ToolAsset {
  uuid: string;
  media_url: string;
  available_quantity: number;
  company_id: string;
  condition: string;
  created_at: string;
  created_by: string;
  manufacturer: string;
  name: string;
  status: string;
  updated_at: string;
  updated_by: string;
}

// Services associated with a tool (new response shape)
export interface ToolServiceItem {
  id: number | string;
  uuid?: string;
  name: string;
  description?: string;
  is_active?: boolean;
  status: 'ACTIVE' | 'INACTIVE' | string;
}

// Individual tool item (barcode) in the new response
export interface ToolItem {
  id: number;
  uuid: string;
  barcode: string;
  status: string;
  condition: string;
  created_at: string;
  updated_at: string;
}

// Unified Tool interface that supports both legacy and new API shapes
export interface Tool {
  // Common/new fields
  id?: number;
  uuid: string;
  name: string;
  brand_name?: string;
  image_url?: string;
  total_quantity?: number;
  available_quantity?: number;
  maintenance_quantity?: number;
  lost_quantity?: number;
  assigned_quantity?: number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  company?: { uuid: string; name: string };
  services?: ToolServiceItem[];
  tool_items?: ToolItem[];
  video_tutorial_urls?: string[];
  video_tutorial_link?: string[];
}

// New tools response shape
export interface FetchToolsEnvelopeNew {
  tools: Tool[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Old nested response shape
export interface FetchToolsEnvelopeOld {
  data: Tool[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export type FetchToolsResponseData =
  | Tool[]
  | FetchToolsEnvelopeNew
  | FetchToolsEnvelopeOld;

export interface FetchToolsResponse {
  statusCode: number;
  message: string;
  data: FetchToolsResponseData;
}

export interface CreateToolRequest {
  name: string;
  brand_name?: string;
  video_tutorial_urls?: string[];
  video_tutorial_link?: string[];
  image_url?: string;
  service_ids?: string;
  barcodes?: string[];
  company_id?: string | number;
}

export interface CreateToolResponse {
  statusCode: number;
  message: string;
  data?: Tool;
}

export interface UpdateToolRequest {
  name?: string;
  brand_name?: string;
  video_tutorial_urls?: string[];
  video_tutorial_link?: string[];
  image_url?: string;
  service_ids?: string;
  barcodes?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  company_id?: string | number;
}

export interface UpdateToolResponse {
  statusCode: number;
  message: string;
  data?: Tool;
}

export interface DeleteToolResponse {
  statusCode: number;
  message: string;
}

export interface GetToolResponse {
  statusCode: number;
  message: string;
  data: Tool;
}

export interface GetToolQuantityStatisticsResponse {
  statusCode: number;
  message: string;
  data?: {
    uuid: string;
    name: string;
    available_quantity: number;
    maintenance_quantity: number;
    lost_quantity: number;
    assigned_quantity: number;
    total_quantity: number;
  };
}

// Tool Items API interfaces
export interface ToolItemDetail {
  id: number;
  uuid: string;
  barcode: string;
  status: 'available' | 'assigned' | 'maintenance' | 'lost';
  condition: 'excellent' | 'good' | 'decent' | 'poor';
  assigned_job_id?: number;
  assigned_by_id?: number;
  returned_by_id?: number;
  due_date?: string;
  returned_date?: string;
  assigned_date?: string;
  assigned_status?: 'temporary' | 'permanent';
  issue?: string;
  lost_date?: string;
  created_at: string;
  updated_at: string;
  tool_id?: number;
  tool_uuid?: string;
  tool?: {
    id: number;
    uuid: string;
    company_id: string;
    name: string;
    brand_name: string;
    video_tutorial_urls: string[];
    video_tutorial_link: string[];
    image_url: string;
    total_quantity: number;
    available_quantity: number;
    maintenance_quantity: number;
    lost_quantity: number;
    assigned_quantity: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    status: string;
  };
  returnedBy?: {
    id: number;
    name: string;
    profile_picture_url?: string;
    designation?: string;
  } | null;
  assignedBy?: {
    id: number;
    name: string;
    profile_picture_url?: string;
    designation?: string;
  } | null;
  assignedJob?: {
    id: number;
    name: string;
    project_id?: string | number;
    uuid?: string;
  } | null;
}

export interface FetchToolItemsResponse {
  statusCode: number;
  message: string;
  data: {
    toolItems: ToolItemDetail[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Service interface for dropdown
export interface Service {
  id: number;
  uuid: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface FetchServicesResponse {
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

// Get device information for login
const getDeviceInfo = (): DeviceInfo => {
  const navigator = typeof window !== 'undefined' ? window.navigator : null;

  return {
    device_id:
      typeof window !== 'undefined'
        ? localStorage.getItem('device_id') || generateDeviceId()
        : 'web-device',
    device_name: navigator?.userAgent || 'Unknown Device',
    platform_type: 'Web',
    api_version: '1.0',
    os_version: navigator?.platform || 'Unknown',
    app_version: process.env['NEXT_PUBLIC_APP_VERSION'] || '1.0.0',
  };
};

// Generate a unique device ID
const generateDeviceId = (): string => {
  const deviceId = 'web-' + Math.random().toString(36).substring(2, 15);
  if (typeof window !== 'undefined') {
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:5000';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'app-type': 'mobile', // Changed from 'web' to 'mobile' to match your curl command
        'Accept-Language': 'en',
        ...options.headers, // This will include Authorization when passed from getRoleHeaders()
      },
      ...options,
    };

    const makeApiCall = async (): Promise<T> => {
      try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          throw {
            message: data.message || 'An error occurred',
            status: response.status,
            errors: data.errors,
          } as ApiError;
        }

        return data;
      } catch (error: any) {
        if (error instanceof TypeError) {
          // Network error
          throw {
            message: 'Network error. Please check your connection.',
            status: 0,
          } as ApiError;
        }
        throw error;
      }
    };

    try {
      return await makeApiCall();
    } catch (error: any) {
      // If 401 error and not a refresh endpoint, try to refresh token and retry
      if (
        error.status === 401 &&
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/login')
      ) {
        try {
          const refreshToken =
            typeof window !== 'undefined'
              ? localStorage.getItem('refresh_token')
              : null;

          if (refreshToken) {
            const refreshResponse = await this.refreshToken(refreshToken);
            if (refreshResponse.statusCode === 200 && refreshResponse.data) {
              const { access_token, refresh_token: newRefreshToken } =
                refreshResponse.data;

              // Update stored tokens
              if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', access_token);
                localStorage.setItem('refresh_token', newRefreshToken);
              }

              // Update config with new token and retry
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${access_token}`,
              };

              return await makeApiCall();
            }
          }
        } catch (_refreshError) {
          // If refresh fails, clear tokens and throw 401 error to be handled by auth context
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
          }
          // Re-throw the original 401 error so auth context can handle the redirect
          throw error;
        }
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      password,
      device_info: getDeviceInfo(),
    };

    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  // Add authorization header for authenticated requests
  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Get complete headers for role operations
  private getRoleHeaders(): Record<string, string> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'app-type': 'mobile',
      'Accept-Language': 'en',
    };
    if (token) {
      baseHeaders['Authorization'] = `Bearer ${token}`;
    }
    return baseHeaders;
  }

  // Example of authenticated request
  async getProfile(): Promise<any> {
    return this.makeRequest('/auth/profile', {
      headers: this.getAuthHeaders(),
    });
  }

  // Role management APIs
  async createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
    return this.makeRequest<CreateRoleResponse>('/roles', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(roleData),
    });
  }

  async getRoles(): Promise<any> {
    return this.makeRequest('/roles', {
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch roles with pagination, search, name filter, and status
  async fetchRoles({
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    search = '',
    name = '',
    status = 'ACTIVE',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    company_id?: string | number;
  }) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/roles?${params.toString()}`, {
      headers: this.getRoleHeaders(),
    });
  }

  // Get role details by UUID
  async getRoleDetails(uuid: string) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update role details by UUID
  async updateRoleDetails(uuid: string, data: Partial<CreateRoleRequest>) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  // Delete role by UUID
  async deleteRole(uuid: string) {
    return this.makeRequest(`/roles/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Logout API
  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: this.getRoleHeaders(),
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const refreshData: RefreshTokenRequest = {
      refresh_token: refreshToken,
    };

    return this.makeRequest<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(refreshData),
    });
  }

  // User management API
  async fetchUsers({
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    role_id = '',
    company_id = '',
    search = '',
    status = 'ACTIVE',
    user_type = '',
  }: {
    page?: number;
    limit?: number;
    role_id?: string | number;
    company_id?: string | number;
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    user_type?: string;
  }): Promise<FetchUsersResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (role_id) params.append('role_id', String(role_id));
    if (company_id) params.append('company_id', String(company_id));
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (user_type) params.append('user_type', user_type);
    return this.makeRequest(`/users?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create user
  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    return this.makeRequest('/users', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Get user details
  async getUserDetails(uuid: string): Promise<GetUserResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update user
  async updateUser(
    uuid: string,
    payload: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Update user status
  async updateUserStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<UpdateUserStatusResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Delete user
  async deleteUser(uuid: string): Promise<DeleteUserResponse> {
    return this.makeRequest(`/users/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  /**
   * Get users dropdown for autocomplete
   */
  async getUsersDropdown({
    name = '',
    phone_number = '',
    email = '',
    role_id = '',
    company_id = '',
    page = 1,
    limit = 10,
  }: {
    name?: string;
    phone_number?: string;
    email?: string;
    role_id?: string | number;
    company_id?: string | number;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (phone_number) params.append('phone_number', phone_number);
    if (email) params.append('email', email);
    if (role_id) params.append('role_id', String(role_id));
    if (company_id) params.append('company_id', String(company_id));
    params.append('page', String(page));
    params.append('limit', String(limit));
    return this.makeRequest(`/users/dropdown?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  /**
   * Get users dropdown for forms (simplified version)
   */
  async fetchUsersDropdown({
    company_id,
    page = 1,
    limit = 10,
  }: {
    company_id: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('company_id', company_id);
    params.append('page', String(page));
    params.append('limit', String(limit));

    return this.makeRequest(`/users/dropdown?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch companies with pagination, status, and sortOrder
  async fetchCompanies({
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    status = 'ACTIVE',
    sortOrder = 'ASC',
  }: {
    page?: number;
    limit?: number;
    status?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<FetchCompaniesResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status) params.append('status', status);
    if (sortOrder) params.append('sortOrder', sortOrder);
    return this.makeRequest(`/companies?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create company
  async createCompany(
    payload: CreateCompanyRequest
  ): Promise<CreateCompanyResponse> {
    return this.makeRequest('/companies', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Update company status
  async updateCompanyStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<UpdateCompanyStatusResponse> {
    return this.makeRequest(`/companies/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Projects management methods
  async fetchProjects({
    page = 1,
    limit = 10,
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    company_id?: string;
  }): Promise<FetchPortfolioResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(company_id && { company_id }),
    });

    return this.makeRequest(`/companies/projects?${params}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async createProject(
    data: CreateProjectRequest
  ): Promise<CreatePortfolioResponse> {
    return this.makeRequest('/companies/projects', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updateProject(
    uuid: string,
    data: UpdateProjectRequest
  ): Promise<UpdatePortfolioResponse> {
    return this.makeRequest(`/companies/projects/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteProject(uuid: string): Promise<DeletePortfolioResponse> {
    return this.makeRequest(`/companies/projects/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // User projects management methods
  async fetchUserProjects({
    page = 1,
    limit = 10,
    user_id = '',
  }: {
    page?: number;
    limit?: number;
    user_id?: string;
  }): Promise<FetchPortfolioResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(user_id && { user_id }),
    });

    return this.makeRequest(`/users/projects?${params}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async createUserProject(
    data: CreateProjectRequest
  ): Promise<CreatePortfolioResponse> {
    return this.makeRequest('/users/projects', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updateUserProject(
    uuid: string,
    data: UpdateProjectRequest
  ): Promise<UpdatePortfolioResponse> {
    return this.makeRequest(`/users/projects/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteUserProject(uuid: string): Promise<DeletePortfolioResponse> {
    return this.makeRequest(`/users/projects/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Get company details
  async getCompanyDetails(uuid: string): Promise<GetCompanyResponse> {
    return this.makeRequest(`/companies/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update company
  async updateCompany(
    uuid: string,
    payload: UpdateCompanyRequest
  ): Promise<UpdateCompanyResponse> {
    return this.makeRequest(`/companies/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Delete company
  async deleteCompany(uuid: string): Promise<DeleteCompanyResponse> {
    return this.makeRequest(`/companies/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Category management APIs
  async fetchCategories({
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    search = '',
    name = '',
    status = 'ACTIVE',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    company_id?: string | number;
  }): Promise<FetchCategoriesResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/categories?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async fetchCategoriesPublic({
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    search = '',
    name = '',
    status = 'ACTIVE',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    company_id?: string | number;
  }): Promise<FetchCategoriesResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/categories/public?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async createCategory(
    payload: CreateCategoryRequest
  ): Promise<CreateCategoryResponse> {
    return this.makeRequest('/categories', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  async getCategoryDetails(uuid: string): Promise<GetCategoryResponse> {
    return this.makeRequest(`/categories/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async updateCategory(
    uuid: string,
    payload: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> {
    return this.makeRequest(`/categories/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  async updateCategoryStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<UpdateCategoryStatusResponse> {
    return this.makeRequest(`/categories/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  async deleteCategory(uuid: string): Promise<DeleteCategoryResponse> {
    return this.makeRequest(`/categories/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch categories with services
  async fetchCategoriesWithServices({
    page = 1,
    limit = 10,
    search = '',
    status = 'ACTIVE',
    sortBy = 'name',
    sortOrder = 'ASC',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    company_id?: string | number;
  }): Promise<FetchCategoriesResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (company_id) params.append('company_id', String(company_id));

    return this.makeRequest(`/categories/with-services?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create company review
  async createCompanyReview(payload: {
    company_id: string;
    rating: number;
    review: string;
  }): Promise<{
    statusCode: number;
    message: string;
    data?: any;
  }> {
    return this.makeRequest('/companies/reviews', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Create user review
  async createUserReview(payload: {
    user_id: string;
    rating: number;
    review: string;
  }): Promise<{
    statusCode: number;
    message: string;
    data?: any;
  }> {
    return this.makeRequest('/users/reviews', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Fetch company reviews
  async fetchCompanyReviews({
    page = 1,
    limit = 10,
    company_id = '',
    reviewer_id = '',
    rating,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  }: {
    page?: number;
    limit?: number;
    company_id?: string | number;
    reviewer_id?: string | number;
    rating?: number | string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    statusCode: number;
    message: string;
    data: {
      data: Array<{
        id: number;
        uuid: string;
        company_id: string;
        reviewer_id: string;
        rating: number;
        review: string;
        created_at: string;
        updated_at: string;
        reviewer?: {
          id: number;
          uuid: string;
          first_name: string;
          last_name: string;
          email: string;
          profile_image?: string;
        };
        company?: {
          id: number;
          uuid: string;
          name: string;
        };
      }>;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (company_id) params.append('company_id', String(company_id));
    if (reviewer_id) params.append('reviewer_id', String(reviewer_id));
    if (rating) params.append('rating', String(rating));
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    return this.makeRequest(`/companies/reviews?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch user reviews
  async fetchUserReviews({
    page = 1,
    limit = 10,
    user_id = '',
    reviewer_id = '',
    rating,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  }: {
    page?: number;
    limit?: number;
    user_id?: string | number;
    reviewer_id?: string | number;
    rating?: number | string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    statusCode: number;
    message: string;
    data: {
      data: Array<{
        id: number;
        uuid: string;
        user_id: string;
        reviewer_id: string;
        rating: number;
        review: string;
        created_at: string;
        updated_at: string;
        reviewer?: {
          id: number;
          uuid: string;
          first_name: string;
          last_name: string;
          email: string;
          profile_image?: string;
        };
        user?: {
          id: number;
          uuid: string;
          first_name: string;
          last_name: string;
          email: string;
        };
      }>;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (user_id) params.append('user_id', String(user_id));
    if (reviewer_id) params.append('reviewer_id', String(reviewer_id));
    if (rating) params.append('rating', String(rating));
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    return this.makeRequest(`/users/reviews?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Get categories dropdown
  async getCategoriesDropdown(params?: {
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) {
      queryParams.append('company_id', String(params.company_id));
    }

    const url = queryParams.toString()
      ? `/categories/dropdown?${queryParams.toString()}`
      : '/categories/dropdown';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Change password API
  async changePassword(
    current_password: string,
    new_password: string
  ): Promise<any> {
    return this.makeRequest('/auth/change-password', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ current_password, new_password }),
    });
  }

  // Get user permissions
  async getUserPermissions(
    userUuid: string
  ): Promise<GetUserPermissionsResponse> {
    return this.makeRequest<GetUserPermissionsResponse>(
      `/users/${userUuid}/permissions`,
      {
        method: 'GET',
        headers: this.getRoleHeaders(),
      }
    );
  }

  // Update user permissions
  async updateUserPermissions(
    userUuid: string,
    permissions: UserPermissions
  ): Promise<UpdateUserPermissionsResponse> {
    return this.makeRequest<UpdateUserPermissionsResponse>(
      `/users/${userUuid}/permissions`,
      {
        method: 'PATCH',
        headers: this.getRoleHeaders(),
        body: JSON.stringify(permissions),
      }
    );
  }

  // Fetch current user's permissions
  async getMyPermissions(): Promise<any> {
    return this.makeRequest('/users/my-permissions', {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch trades with filters
  async fetchTrades({
    page = 1,
    limit = 10,
    name = '',
    description = '',
    is_active = true,
    status = 'ACTIVE',
    category_id = '',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
    status?: string;
    category_id?: string | number;
    company_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (name) params.append('name', name);
    if (description) params.append('description', description);
    if (is_active !== undefined) params.append('is_active', String(is_active));
    if (status) params.append('status', status);
    if (category_id) params.append('category_id', String(category_id));
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/trades?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create trade
  async createTrade(payload: {
    name: string;
    description: string;
    is_default: boolean;
    is_active: boolean;
    status: string;
    category_ids: string;
    company_id?: string | number;
  }): Promise<any> {
    return this.makeRequest('/trades', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Get trade details by UUID
  async getTradeDetails(uuid: string): Promise<any> {
    return this.makeRequest(`/trades/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update trade
  async updateTrade(
    uuid: string,
    payload: {
      name: string;
      description: string;
      is_default: boolean;
      is_active: boolean;
      status: string;
      category_ids: string;
      company_id?: string | number;
    }
  ): Promise<any> {
    return this.makeRequest(`/trades/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Delete trade
  async deleteTrade(uuid: string): Promise<any> {
    return this.makeRequest(`/trades/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Update trade status
  async updateTradeStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<any> {
    return this.makeRequest(`/trades/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Get trades dropdown
  async getTradesDropdown(params?: {
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) {
      queryParams.append('company_id', String(params.company_id));
    }

    const url = queryParams.toString()
      ? `/trades/dropdown?${queryParams.toString()}`
      : '/trades/dropdown';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Service management APIs
  async fetchServices({
    page = 1,
    limit = 10,
    name = '',
    description = '',
    is_active = true,
    status = 'ACTIVE',
    trade_id = '',
    trade_uuid = '',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
    status?: string;
    trade_id?: string | number;
    trade_uuid?: string;
    company_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (name) params.append('name', name);
    if (description) params.append('description', description);
    if (is_active !== undefined) params.append('is_active', String(is_active));
    if (status) params.append('status', status);
    if (trade_id) params.append('trade_id', String(trade_id));
    if (trade_uuid) params.append('trade_uuid', trade_uuid);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/services?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create service
  async createService(payload: {
    name: string;
    description: string;
    is_default: boolean;
    is_active: boolean;
    status: string;
    trade_ids: string;
    company_id?: string | number;
  }): Promise<any> {
    return this.makeRequest('/services', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Get service details by UUID
  async getServiceDetails(uuid: string): Promise<any> {
    return this.makeRequest(`/services/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update service status
  async updateServiceStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<any> {
    return this.makeRequest(`/services/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Update service
  async updateService(
    uuid: string,
    payload: {
      name: string;
      description: string;
      is_default: boolean;
      is_active: boolean;
      status: string;
      trade_ids: string;
      company_id?: string | number;
    }
  ): Promise<any> {
    return this.makeRequest(`/services/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Delete service
  async deleteService(uuid: string): Promise<any> {
    return this.makeRequest(`/services/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Get services dropdown
  async getServicesDropdown(params?: {
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) {
      queryParams.append('company_id', String(params.company_id));
    }

    const url = queryParams.toString()
      ? `/services/dropdown?${queryParams.toString()}`
      : '/services/dropdown';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Get services for tool form (with pagination and filters)
  async fetchServicesForTools({
    page = 1,
    limit = 50,
    is_active = true,
  }: {
    page?: number;
    limit?: number;
    is_active?: boolean;
  }): Promise<FetchServicesResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('is_active', String(is_active));
    return this.makeRequest(`/services?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Material management APIs
  async fetchMaterials({
    page = 1,
    limit = 10,
    name = '',
    description = '',
    is_active = true,
    status = 'ACTIVE',
    service_id = '',
    service_uuid = '',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
    status?: string;
    service_id?: string | number;
    service_uuid?: string;
    company_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (name) params.append('name', name);
    if (description) params.append('description', description);
    if (is_active !== undefined) params.append('is_active', String(is_active));
    if (status) params.append('status', status);
    if (service_id) params.append('service_id', String(service_id));
    if (service_uuid) params.append('service_uuid', service_uuid);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/materials?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Create material
  async createMaterial(payload: {
    name: string;
    description: string;
    is_default: boolean;
    is_active: boolean;
    status: string;
    service_ids: string;
    company_id?: string | number;
  }): Promise<any> {
    return this.makeRequest('/materials', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Get material details by UUID
  async getMaterialDetails(uuid: string): Promise<any> {
    return this.makeRequest(`/materials/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update material status
  async updateMaterialStatus(
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<any> {
    return this.makeRequest(`/materials/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({ status }),
    });
  }

  // Update material
  async updateMaterial(
    uuid: string,
    payload: {
      name: string;
      description: string;
      is_default: boolean;
      is_active: boolean;
      status: string;
      service_ids: string;
      company_id?: string | number;
    }
  ): Promise<any> {
    return this.makeRequest(`/materials/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Delete material
  async deleteMaterial(uuid: string): Promise<any> {
    return this.makeRequest(`/materials/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Tool management APIs
  async fetchTools({
    page = 1,
    limit = 10,
    name = '',
    service_id = '',
    service_uuid = '',
    status = 'ACTIVE',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    service_id?: string | number;
    service_uuid?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    company_id?: string | number;
  }): Promise<FetchToolsResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (name) params.append('name', name);
    if (service_id) params.append('service_id', String(service_id));
    if (service_uuid) params.append('service_uuid', service_uuid);
    if (status) params.append('status', status);
    if (company_id) params.append('company_id', String(company_id));
    return this.makeRequest(`/tools?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Job management API
  async createJob(payload: {
    client_id?: string | number;
    client_name?: string;
    client_email?: string;
    client_phone_number?: string;
    job_boxes_step: string[] | string;
    job_privacy: string;
    question_json?: any;
    company_id?: string;
  }): Promise<any> {
    return this.makeRequest('/jobs', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Fetch jobs
  async fetchJobs(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    job_status?: string;
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.job_status) queryParams.append('job_status', params.job_status);
    if (params?.company_id)
      queryParams.append('company_id', params.company_id.toString());
    const url = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch jobs for dropdown (for todo form)
  async fetchJobsDropdown(params?: {
    page?: number;
    limit?: number;
    type?: string;
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.company_id)
      queryParams.append('company_id', params.company_id.toString());
    const url = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async createTool(payload: CreateToolRequest): Promise<CreateToolResponse> {
    return this.makeRequest('/tools', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  async getToolDetails(uuid: string): Promise<GetToolResponse> {
    return this.makeRequest(`/tools/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async getToolQuantityStatistics(
    uuid: string,
    companyId?: string | number
  ): Promise<GetToolQuantityStatisticsResponse> {
    const queryParams = new URLSearchParams();
    if (companyId) {
      queryParams.append('company_id', companyId.toString());
    }

    const url = queryParams.toString()
      ? `/tools/statistics/quantities/${uuid}?${queryParams.toString()}`
      : `/tools/statistics/quantities/${uuid}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async fetchToolItems(params?: {
    page?: number;
    limit?: number;
    barcode?: string;
    search?: string;
    tool_id?: number;
    tool_uuid?: string;
    status?: 'available' | 'assigned' | 'maintenance' | 'lost';
    condition?: 'excellent' | 'good' | 'decent' | 'poor';
    assigned_job_id?: number;
    assigned_by_id?: number;
    returned_by_id?: number;
    assigned_status?: 'temporary' | 'permanent';
    issue?: string;
    company_id?: string | number;
    sort_by?: 'created_at' | 'updated_at' | 'id' | 'barcode' | 'assigned_date';
    sort_order?: 'ASC' | 'DESC';
  }): Promise<FetchToolItemsResponse> {
    const queryParams = new URLSearchParams();

    // Add all optional parameters
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.barcode) queryParams.append('barcode', params.barcode);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tool_id)
      queryParams.append('tool_id', params.tool_id.toString());
    if (params?.tool_uuid) queryParams.append('tool_uuid', params.tool_uuid);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.condition) queryParams.append('condition', params.condition);
    if (params?.assigned_job_id)
      queryParams.append('assigned_job_id', params.assigned_job_id.toString());
    if (params?.assigned_by_id)
      queryParams.append('assigned_by_id', params.assigned_by_id.toString());
    if (params?.returned_by_id)
      queryParams.append('returned_by_id', params.returned_by_id.toString());
    if (params?.assigned_status)
      queryParams.append('assigned_status', params.assigned_status);
    if (params?.issue) queryParams.append('issue', params.issue);
    if (params?.company_id)
      queryParams.append('company_id', params.company_id.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = queryParams.toString()
      ? `/tool-items?${queryParams.toString()}`
      : '/tool-items';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async updateToolItem(
    uuid: string,
    payload: {
      status?: 'available' | 'assigned' | 'maintenance' | 'lost';
      condition?: 'excellent' | 'good' | 'decent' | 'poor';
      assigned_job_id?: number | string;
      assigned_by_id?: number | string;
      returned_by_id?: number | string;
      due_date?: string;
      returned_date?: string;
      assigned_date?: string;
      assigned_status?: 'temporary' | 'permanent';
      issue?: string;
      lost_date?: string;
    }
  ): Promise<any> {
    return this.makeRequest(`/tool-items/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }
  async fetchJobStatistics(params?: {
    company_id?: string | number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) {
      queryParams.append('company_id', params.company_id.toString());
    }

    const url = queryParams.toString()
      ? `/jobs/statistics?${queryParams.toString()}`
      : '/jobs/statistics';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async fetchJobById(uuid: string): Promise<any> {
    return this.makeRequest(`/jobs/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async updateTool(
    uuid: string,
    payload: UpdateToolRequest
  ): Promise<UpdateToolResponse> {
    return this.makeRequest(`/tools/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }
  // Update job
  async updateJob(
    uuid: string,
    payload: {
      client_id?: number;
      client_name?: string;
      client_email?: string;
      client_phone_number?: string;
      job_boxes_step?: string;
      job_privacy?: string;
      project_name?: string;
      budget?: number;
      category_id?: number;
      client_address?: string;
      latitude?: number;
      longitude?: number;
      property_type?: string;
      project_start_date?: string;
      project_finish_date?: string;
      preferred_contractor?: string;
      notification_style?: string;
      approx_sq_ft?: number;
      age_of_property?: string;
      daily_work_start_time?: string;
      daily_work_end_time?: string;
      owner_present_need?: boolean;
      weekend_work?: boolean;
      has_animals?: boolean;
      pet_type?: string;
      company_id?: number;
      job_image?: string;
      job_status?: string;
      status?: string;
    }
  ): Promise<any> {
    return this.makeRequest(`/jobs/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  async deleteTool(uuid: string): Promise<DeleteToolResponse> {
    return this.makeRequest(`/tools/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  async addToolItemBarcodes(
    toolUuid: string,
    payload: { barcodes: string[] }
  ): Promise<any> {
    return this.makeRequest('/tool-items/tool-barcodes', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({
        tool_uuid: toolUuid,
        barcodes: payload.barcodes,
      }),
    });
  }

  async getToolItemByBarcode(
    identifier: string,
    toolUuid: string
  ): Promise<any> {
    return this.makeRequest(
      `/tool-items/find/${identifier}?tool_uuid=${toolUuid}`,
      {
        method: 'GET',
        headers: this.getRoleHeaders(),
      }
    );
  }

  async getToolItemHistory(
    toolItemUuid: string,
    historyType: 'borrowed' | 'maintenance'
  ): Promise<any> {
    return this.makeRequest(
      `/tool-items/${toolItemUuid}/history?type=${historyType}`,
      {
        method: 'GET',
        headers: this.getRoleHeaders(),
      }
    );
  }

  async getBorrowedHistory(params?: {
    page?: number;
    limit?: number;
    toolItemId?: number;
    borrowedById?: number;
    jobId?: number;
    search?: string;
    sort_by?:
      | 'created_at'
      | 'updated_at'
      | 'id'
      | 'assigned_date'
      | 'returned_date';
    sort_order?: 'ASC' | 'DESC';
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.toolItemId)
      queryParams.append('toolItemId', params.toolItemId.toString());
    if (params?.borrowedById)
      queryParams.append('borrowedById', params.borrowedById.toString());
    if (params?.jobId) queryParams.append('jobId', params.jobId.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `/tool-history/borrowed${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async getMaintenanceHistory(params?: {
    page?: number;
    limit?: number;
    toolItemId?: number;
    returnedById?: number;
    jobId?: number;
    search?: string;
    sort_by?:
      | 'created_at'
      | 'updated_at'
      | 'id'
      | 'assigned_date'
      | 'returned_date';
    sort_order?: 'ASC' | 'DESC';
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.toolItemId)
      queryParams.append('toolItemId', params.toolItemId.toString());
    if (params?.returnedById)
      queryParams.append('returnedById', params.returnedById.toString());
    if (params?.jobId) queryParams.append('jobId', params.jobId.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `/tool-history/maintenance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async getToolHistoryStatistics(params?: {
    toolItemId?: number;
    toolId?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.toolItemId)
      queryParams.append('toolItemId', params.toolItemId.toString());
    if (params?.toolId) queryParams.append('toolId', params.toolId.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `/tool-history/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async getToolItemDetail(toolItemUuid: string): Promise<any> {
    return this.makeRequest(`/tool-items/${toolItemUuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async getCompaniesDropdown(): Promise<any> {
    return this.makeRequest('/companies/dropdown', {
      headers: this.getRoleHeaders(),
    });
  }

  // Five-box system API methods
  async getBoxSettings(params?: {
    company_id?: string | number | undefined;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) {
      queryParams.append('company_id', params.company_id.toString());
    }

    const url = queryParams.toString()
      ? `/companies/box-settings?${queryParams.toString()}`
      : '/companies/box-settings';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }
  // Create todo list
  async createTodoList(payload: {
    job_uuid: string;
    title: string;
    date: string;
    user_uuids: string[];
    items: Array<{ description: string }>;
  }): Promise<any> {
    return this.makeRequest('/todo-lists', {
      method: 'POST',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // Fetch todo lists
  async fetchTodoLists(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.makeRequest(`/todo-lists?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async updateBoxSettings(payload: {
    default_selected_json?: Array<{ id: string; enabled: boolean }>;
    field_status_json?: any;
    question_json?: any;
    company_id?: string | number | undefined;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (payload.company_id) {
      queryParams.append('company_id', payload.company_id.toString());
    }

    const url = queryParams.toString()
      ? `/companies/box-settings?${queryParams.toString()}`
      : '/companies/box-settings';

    return this.makeRequest(url, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(payload),
    });
  }

  // Update todo item completion status
  async updateTodoItemCompletion(
    itemUuid: string,
    isCompleted: boolean
  ): Promise<any> {
    return this.makeRequest(`/todo-lists/items/${itemUuid}/set-completion`, {
      method: 'PATCH',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_completed: isCompleted }),
    });
  }

  // Fetch single todo list by ID
  async fetchTodoListById(uuid: string): Promise<any> {
    return this.makeRequest(`/todo-lists/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update todo list
  async updateTodoList(
    uuid: string,
    payload: {
      title: string;
      date: string;
      user_uuids: string[];
      items: Array<{
        uuid?: string; // Optional for new items
        description: string;
      }>;
    }
  ): Promise<any> {
    return this.makeRequest(`/todo-lists/${uuid}`, {
      method: 'PATCH',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // Removed testConnection and all debug code
  // Create appointment
  async createAppointment(payload: {
    agenda: string;
    appointment_with: string;
    date: string;
    start_time: string;
    end_time: string;
    address: string;
    notes: string;
    user_uuids: string;
  }): Promise<any> {
    return this.makeRequest('/appointments', {
      method: 'POST',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // Fetch appointments
  async fetchAppointments(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.makeRequest(`/appointments?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Fetch single appointment by ID
  async fetchAppointmentById(uuid: string): Promise<any> {
    return this.makeRequest(`/appointments/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Update appointment
  async updateAppointment(
    uuid: string,
    payload: {
      agenda: string;
      appointment_with: string;
      date: string;
      start_time: string;
      end_time: string;
      address: string;
      notes: string;
      user_uuids: string;
    }
  ): Promise<any> {
    return this.makeRequest(`/appointments/${uuid}`, {
      method: 'PATCH',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // Mark appointment as completed
  async markAppointmentCompleted(
    uuid: string,
    isCompleted: boolean
  ): Promise<any> {
    return this.makeRequest(`/appointments/${uuid}/completion`, {
      method: 'PATCH',
      headers: {
        ...this.getRoleHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_completed: isCompleted,
      }),
    });
  }

  // Delete appointment
  async deleteAppointment(uuid: string): Promise<any> {
    return this.makeRequest(`/appointments/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Generic request method for custom endpoints
  async makeGenericRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    return this.makeRequest(endpoint, {
      headers: {
        ...this.getRoleHeaders(),
        ...options.headers,
      },
      ...options,
    });
  }

  // Public APIs for estimation (no auth required)
  async fetchTradesPublic({
    page = 1,
    limit = 10,
    company_id,
    category_id,
  }: {
    page?: number;
    limit?: number;
    company_id: string | number;
    category_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('company_id', String(company_id));
    if (category_id) {
      params.append('category_id', String(category_id));
    }

    return this.makeRequest(`/trades/public?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'app-type': 'mobile',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchServicesPublic({
    page = 1,
    limit = 10,
    company_id,
    trade_id,
  }: {
    page?: number;
    limit?: number;
    company_id: string | number;
    trade_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('company_id', String(company_id));
    if (trade_id) {
      params.append('trade_id', String(trade_id));
    }

    return this.makeRequest(`/services/public?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'app-type': 'mobile',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchMaterialsPublic({
    page = 1,
    limit = 10,
    company_id,
    service_id,
  }: {
    page?: number;
    limit?: number;
    company_id: string | number;
    service_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('company_id', String(company_id));
    if (service_id) {
      params.append('service_id', String(service_id));
    }

    return this.makeRequest(`/materials/public?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'app-type': 'mobile',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchToolsPublic({
    page = 1,
    limit = 10,
    company_id,
    service_id,
  }: {
    page?: number;
    limit?: number;
    company_id: string | number;
    service_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('company_id', String(company_id));
    if (service_id) {
      params.append('service_id', String(service_id));
    }

    return this.makeRequest(`/tools/public?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'app-type': 'mobile',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchTemplates({
    page = 1,
    limit = 10,
    company_id,
    status = 'ACTIVE',
    service_id,
  }: {
    page?: number;
    limit?: number;
    company_id: string | number;
    status?: string;
    service_id?: string | number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('company_id', String(company_id));
    params.append('status', status);

    // Add service_id parameter if provided
    if (service_id) {
      params.append('service_id', String(service_id));
    }

    return this.makeRequest(`/templates?${params.toString()}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Archive template
  async archiveTemplate(uuid: string): Promise<any> {
    return this.makeRequest(`/templates/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }

  // Get template by UUID
  async getTemplateById(uuid: string): Promise<any> {
    return this.makeRequest(`/templates/${uuid}`, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  // Warranty Management APIs
  async createCompanyWarranty(data: {
    company_id: string | number;
    name: string;
    warranties_details: Array<{
      id: string;
      category_name: string;
      duration: string;
      description: string;
    }>;
    status?: string;
  }): Promise<any> {
    return this.makeRequest('/companies/warranties', {
      method: 'POST',
      headers: this.getRoleHeaders(),
      body: JSON.stringify({
        ...data,
        status: data.status || 'ACTIVE',
      }),
    });
  }

  async getCompanyWarranties(params?: {
    page?: number;
    limit?: number;
    company_id?: number | string;
    name?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.company_id)
      queryParams.append('company_id', params.company_id.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = queryParams.toString()
      ? `/companies/warranties?${queryParams.toString()}`
      : '/companies/warranties';

    return this.makeRequest(url, {
      method: 'GET',
      headers: this.getRoleHeaders(),
    });
  }

  async updateCompanyWarranty(
    uuid: string,
    data: {
      name?: string;
      warranties_details?: Array<{
        id: string;
        category_name: string;
        duration: string;
        description: string;
      }>;
      status?: string;
    }
  ): Promise<any> {
    return this.makeRequest(`/companies/warranties/${uuid}`, {
      method: 'PATCH',
      headers: this.getRoleHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteCompanyWarranty(uuid: string): Promise<any> {
    return this.makeRequest(`/companies/warranties/${uuid}`, {
      method: 'DELETE',
      headers: this.getRoleHeaders(),
    });
  }
}

export const apiService = new ApiService();
export type { ApiError, CreateRoleRequest, CreateRoleResponse, LoginResponse };
