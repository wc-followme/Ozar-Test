// Trade management type definitions

// Trade interface for UI and API responses
export interface Trade {
  id: number;
  uuid: string;
  name: string;
  description: string;
  is_default: boolean;
  is_active: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  categories: Array<{
    id: number | string;
    name: string;
    status: string;
  }>;
}

// Trade API response structure
export interface TradeApiResponse {
  statusCode: number;
  message: string;
  data: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Trade form data interface for create operations
export interface TradeCreateFormData {
  name: string;
  description: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  category_ids: string;
}

// Trade initial data for form (for edit mode)
export interface TradeInitialData {
  name?: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  categories?: string[];
}

// Form error interface
export interface TradeFormErrors {
  name?: string;
  categories?: string;
  description?: string;
  general?: string;
}

// Fetch trades parameters
export interface FetchTradesParams {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  status?: string;
  category_id?: string | number;
}

// Props interface for trade form component
export interface TradeFormProps {
  onSubmit?: (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialTradeUuid?: string | undefined;
}

// Category interface for dropdown options
export interface Category {
  id: number | string;
  name: string;
  status: string;
}

// Dummy trade interface for demo data
export interface DummyTrade {
  initials: string;
  initialsBg: string;
  tradeName: string;
  category: string;
}

// Menu option interface for trade actions
export interface MenuOption {
  label: string;
  action: string;
  icon: any;
  variant: 'default' | 'destructive';
}
