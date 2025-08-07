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
  status: string;
  created_at: string;
  updated_at: string;
  date_of_joining?: string;
  designation?: string;
  preferred_communication_method?: string;
  address?: string;
  city?: string;
  pincode?: string;
  role: {
    id?: number | string; // Not provided in login response
    uuid: string;
    name: string;
  };
  company: {
    id?: number | string;
    uuid: string;
    name: string;
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
  categories: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  trades: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  services: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  materials: {
    view: boolean;
    edit: boolean;
    archive: boolean;
  };
  tools: {
    view: boolean;
    edit: boolean;
    archive: boolean;
    history: boolean;
  };
  jobs: {
    view: boolean;
    edit: boolean;
    archive: boolean;
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
  company_id?: string;
  services: Array<{
    id: number | string;
    name: string;
    status: string;
  }>;
  assets?: ToolAsset[];
}

export interface FetchToolsResponse {
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

export interface CreateToolRequest {
  name: string;
  available_quantity: number;
  manufacturer: string;
  tool_assets: string;
  service_ids: string;
  company_id?: string | number;
}

export interface CreateToolResponse {
  statusCode: number;
  message: string;
  data?: Tool;
}

export interface UpdateToolRequest {
  name?: string;
  available_quantity?: number;
  manufacturer?: string;
  tool_assets?: string;
  service_ids?: string;
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
  }: {
    page?: number;
    limit?: number;
    role_id?: string | number;
    company_id?: string | number;
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE' | '';
  }): Promise<FetchUsersResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (role_id) params.append('role_id', String(role_id));
    if (company_id) params.append('company_id', String(company_id));
    if (search) params.append('search', search);
    if (status) params.append('status', status);
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
    page = 1,
    limit = 10,
  }: {
    name?: string;
    phone_number?: string;
    email?: string;
    role_id?: string | number;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (phone_number) params.append('phone_number', phone_number);
    if (email) params.append('email', email);
    if (role_id) params.append('role_id', String(role_id));
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
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
    status?: string;
    trade_id?: string | number;
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
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
    status?: string;
    service_id?: string | number;
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
    status = 'ACTIVE',
    company_id = '',
  }: {
    page?: number;
    limit?: number;
    name?: string;
    service_id?: string | number;
    status?: 'ACTIVE' | 'INACTIVE' | '';
    company_id?: string | number;
  }): Promise<FetchToolsResponse> {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (name) params.append('name', name);
    if (service_id) params.append('service_id', String(service_id));
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
    client_name: string;
    client_email: string;
    client_phone_number: string;
    job_boxes_step: string;
    job_privacy: string;
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

  async getCompaniesDropdown(): Promise<any> {
    return this.makeRequest('/companies/dropdown', {
      headers: this.getRoleHeaders(),
    });
  }

  // Removed testConnection and all debug code
}

export const apiService = new ApiService();
export type { ApiError, CreateRoleRequest, CreateRoleResponse, LoginResponse };
