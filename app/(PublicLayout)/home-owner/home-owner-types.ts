// Home owner module type definitions

// Step types
export type WizardStep =
  | 'general'
  | 'property'
  | 'optional'
  | 'projectType'
  | 'estimation';

// Job boxes step types
export type JobBoxesStep = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'FIFTH';

// Form data types
export interface GeneralInfoData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  preferredContactMethod: string;
  contactStartTime: string;
  animals: string;
  petType: string;
}

export interface PropertyInfoData {
  property: string;
  propertyType: string;
  bhk: string;
  floor: string;
  approxSqFt: string;
  ageOfProperty: string;
}

export interface ProjectInfoData {
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

export interface CategoryData {
  selectedType: string;
}

export type EstimationData = Record<string, unknown>;

// Combined form data type
export interface HomeOwnerFormData {
  generalInfo?: GeneralInfoData;
  propertyInfo?: PropertyInfoData;
  projectInfo?: ProjectInfoData;
  category?: CategoryData;
  estimation?: EstimationData;
}

// Company data type
export interface CompanyData {
  uuid: string;
  name: string;
}

// Job data type
export interface JobData {
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
  job_boxes_step: JobBoxesStep;
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
  question_json?: Record<string, any>;
  company?: CompanyData;
}

// API response types
export interface JobApiResponse {
  statusCode: number;
  message: string;
  data: JobData;
}

export interface UpdateJobRequest {
  client_name?: string;
  client_email?: string;
  client_phone_number?: string;
  client_address?: string;
  budget?: number;
  preferred_contractor?: number | null;
  project_start_date?: string;
  project_finish_date?: string;
  property_type?: string;
  age_of_property?: string;
  approx_sq_ft?: number;
  notification_style?: string;
  daily_work_start_time?: string;
  daily_work_end_time?: string;
  owner_present_need?: boolean;
  weekend_work?: boolean;
  has_animals?: boolean;
  pet_type?: string;
  category_id?: number | null;
  company_id?: number | null;
  client_id?: number | null;
  job_image?: string;
  project_name?: string;
  latitude?: string;
  longitude?: string;
  job_status?: string;
  job_privacy?: string;
  status?: string;
  job_boxes_step?: JobBoxesStep;
}

export interface UpdateJobResponse {
  statusCode: number;
  message: string;
  data?: JobData;
  success?: boolean;
}

// Step progress types
export interface StepProgress {
  key: WizardStep;
  label: string;
  completed: boolean;
  current: boolean;
}

// Component props types
export interface HomeOwnerWizardProps {
  uuid: string;
}

export interface StepComponentProps {
  onNext: (data: any) => void;
  onPrev?: () => void;
  onSkip?: () => void;
  defaultValues?: any;
  isLastStep?: boolean;
  cancelButtonClass?: string;
}

// Form validation types
export interface FormValidationError {
  type: string;
  message: string;
}

export interface FormFieldError {
  [key: string]: FormValidationError;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormState {
  generalInfo: GeneralInfoData | null;
  projectInfo: ProjectInfoData | null;
  category: CategoryData | null;
  estimation: EstimationData | null;
}

// Navigation types
export interface NavigationHandlers {
  goToGeneral: () => void;
  goToOptional: () => void;
  goToProjectType: () => void;
}

// Form submission types
export interface FormSubmissionHandlers {
  handleGeneralInfoSubmit: (data: GeneralInfoData) => void;
  handleProjectInfoSubmit: (data: ProjectInfoData) => void;
  handleCategorySubmit: (data: CategoryData) => void;
  handleEstimationSubmit: (data: EstimationData) => void;
  handleFinalSubmit: (allData: HomeOwnerFormData) => Promise<void>;
}

// Progress bar types
export interface ProgressStep {
  key: WizardStep;
  label: string;
}

export interface ProgressBarProps {
  steps: ProgressStep[];
  currentStep: WizardStep;
  totalSteps: number;
}

// Toast message types
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// Data transformation types
export interface DataTransformation {
  fromFormToApi: (
    formData: HomeOwnerFormData,
    jobData?: JobData
  ) => UpdateJobRequest;
  fromApiToForm: (jobData: JobData) => {
    generalInfo: GeneralInfoData;
    projectInfo: ProjectInfoData;
    category: CategoryData;
  };
}

// Utility types
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

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message?: string;
  data?: T;
  success?: boolean;
}

// Constants
export const JOB_BOXES_STEPS = {
  FIRST: 'FIRST' as JobBoxesStep,
  SECOND: 'SECOND' as JobBoxesStep,
  THIRD: 'THIRD' as JobBoxesStep,
  FOURTH: 'FOURTH' as JobBoxesStep,
  FIFTH: 'FIFTH' as JobBoxesStep,
} as const;

export const WIZARD_STEPS = {
  GENERAL: 'general' as WizardStep,
  PROPERTY: 'property' as WizardStep,
  OPTIONAL: 'optional' as WizardStep,
  PROJECT_TYPE: 'projectType' as WizardStep,
  ESTIMATION: 'estimation' as WizardStep,
} as const;

// Default values
export const DEFAULT_GENERAL_INFO: GeneralInfoData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  preferredContactMethod: '',
  contactStartTime: '',
  animals: 'No',
  petType: '',
};

export const DEFAULT_PROJECT_INFO: ProjectInfoData = {
  projectName: '',
  projectStartDate: '',
  projectFinishDate: '',
  ownerPresence: '',
  weekendWork: '',
  dailyWorkTimingStart: '',
  dailyWorkTimingEnd: '',
  budget: '',
  preferredContractor: '',
  questions: [],
};

export const DEFAULT_CATEGORY: CategoryData = {
  selectedType: '',
};

export const DEFAULT_ESTIMATION: EstimationData = {
  // Placeholder for future estimation fields
};
