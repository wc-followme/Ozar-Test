// Job management type definitions

import { JobType } from '@/constants/common';

export interface Job {
  id: number;
  uuid: string;
  company_id: string;
  client_id: number;
  job_image: string | null;
  project_name: string | null;
  project_id: string;
  category_id: number | null;
  category: string | null;
  budget: number | null;
  client_name: string;
  client_email: string;
  client_phone_number: string;
  client_address: string | null;
  latitude: number | null;
  longitude: number | null;
  job_share_link: string;
  job_boxes_step: string;
  job_status: string;
  job_privacy: string;
  property_type: string | null;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  status: string;
  project_start_date: string | null;
  project_finish_date: string | null;
  preferred_contractor: string | null;
  notification_style: string | null;
  approx_sq_ft: number | null;
  age_of_property: string | null;
  daily_work_start_time: string | null;
  daily_work_end_time: string | null;
  owner_present_need: boolean | null;
  weekend_work: boolean | null;
  has_animals: boolean | null;
  pet_type: string | null;
}

// CreateJobForm related types
export interface SelectBoxOption {
  id: string;
  value: string;
  title: string;
  description: string;
  disabled: boolean;
}

export interface UserOption {
  id: string | number;
  name: string;
  email?: string;
  phone_number?: string;
}

export interface CreateJobFormData {
  client_name: string;
  client_email: string;
  client_phone_number: string;
  job_privacy: JobType;
  job_boxes_step: string[];
  client_id?: string;
}

export interface CreateJobFormProps {
  onSubmit?: (data: CreateJobFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateJobFormData & { link?: string }>;
  onCancel?: () => void;
  generatedLink?: string;
  boxDefaults?: Array<{ id: string; enabled: boolean }> | null;
}

export interface CreateJobFormState {
  userOptions: UserOption[];
  userLoading: boolean;
  showDropdown: boolean;
  userSelected: boolean;
}

export interface JobApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobStatistics {
  all: number;
  need_attention: number;
  new_leads: number;
  ongoing_jobs: number;
  waiting_on_client: number;
  archived: number;
}

export interface JobStatisticsResponse {
  success: boolean;
  message: string;
  data: JobStatistics;
}

export interface CreateJobRequest {
  client_id?: string | number;
  client_name: string;
  client_email: string;
  client_phone_number: string;
  job_boxes_step: string;
  job_privacy: string;
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
}

export interface UpdateJobRequest {
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
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message?: string;
  data?: T;
  success?: boolean;
}

export interface ApiError {
  response?: {
    data: {
      status: number;
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
  status?: number;
}

export interface FetchJobsParams {
  page: number;
  limit: number;
  status?: string;
  type?: string;
  search?: string;
  client_name?: string;
  job_status?: string;
  job_privacy?: string;
}

export interface JobFilterCounts {
  all: number;
  need_attention: number;
  new_leads: number;
  ongoing_jobs: number;
  waiting_on_client: number;
  closed: number;
  archived: number;
}

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    jobId: string;
    progress: number;
    image: string;
    email: string;
    address: string;
    startDate: string;
    daysLeft: number;
  };
}

export interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Outline' | 'Linear' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

// Form validation types
export interface FormValidationError {
  type: string;
  message: string;
}

export interface FormFieldError {
  [key: string]: FormValidationError;
}

// API response types for user dropdown
export interface UserDropdownResponse {
  data: UserOption[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface UserDropdownParams {
  name: string;
  role_id: string;
  page: number;
  limit: number;
}

// Job form step types
export interface JobFormStep {
  id: string;
  value: string;
  title: string;
  description: string;
  disabled: boolean;
}

export interface JobFormStepValidation {
  step: string;
  isValid: boolean;
  errors: string[];
}

// Job form submission types
export interface JobFormSubmissionData extends CreateJobFormData {
  link?: string;
  generatedLink?: string;
}

export interface JobFormSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    job_id: string;
    link?: string;
    generatedLink?: string;
  };
  errors?: Record<string, string[]>;
}

// Step form types
export interface StepGeneralInfoData {
  fullName: string;
  projectStartDate: Date | null;
  projectFinishDate: Date | null;
  email: string;
  phone: string;
  budget: string;
  contractor: string;
  address: string;
}

export interface StepGeneralInfoProps {
  onNext: (data: StepGeneralInfoData) => void;
  defaultValues?: Partial<StepGeneralInfoData>;
  isLastStep?: boolean;
}

export interface StepProjectInfoData {
  projectName: string;
  projectStartDate: string;
  projectFinishDate: string;
  ownerPresence: string;
  weekendWork: string;
  dailyWorkTimingStart: string;
  dailyWorkTimingEnd: string;
  budget: string;
  preferredContractor: string;
  questions?: any[];
}

export interface StepProjectInfoProps {
  onNext: (data: any) => void;
  onPrev?: () => void;
  defaultValues?: any;
  isLastStep?: boolean;
  boxSettings?: any;
  allQuestionJson?: Record<string, any[]>;
  cancelButtonClass?: string;
}

export interface StepCategoryData {
  selectedType: string;
}

export interface StepCategoryProps {
  onPrev?: () => void;
  onSubmit: (data: StepCategoryData) => void;
  cancelButtonClass?: string;
  defaultValues?: Partial<StepCategoryData>;
  isLastStep?: boolean;
}

// Contractor types
export interface Contractor {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
}

export interface ContractorApiResponse {
  data: Contractor[];
  total?: number;
  page?: number;
  limit?: number;
}

// Category types
export interface Category {
  uuid?: string;
  id?: number;
  name: string;
  description?: string;
  is_default?: boolean;
  icon?: string;
}

export interface CategoryApiResponse {
  data: {
    data: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
