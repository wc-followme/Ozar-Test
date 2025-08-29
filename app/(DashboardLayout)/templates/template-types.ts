// Template management type definitions

// API Response Types
export interface TemplateApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: TemplateApiData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TemplateApiData {
  id: number;
  uuid: string;
  name: string;
  category_id: string;
  template_type: string;
  service_id: string | null;
  disclaimer: string | null;
  warranty: string | null;
  warranty_duration: string | null;
  company_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  status: string;
  category: {
    id: string;
    uuid: string;
    name: string;
    description: string;
    icon: string;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
  };
  service: any | null;
  company: {
    id: string;
    uuid: string;
    name: string;
    tagline: string;
    about: string;
    email: string;
    phone_number: string;
    communication: string;
    website: string;
    expiry_date: string;
    preferred_communication_method: string;
    city: string;
    pincode: string;
    country_code: string;
    projects: string;
    image: string;
    cover_image: string | null;
    is_default: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
  };
  templateTools: any[];
  templateRooms: TemplateRoom[];
}

export interface TemplateRoom {
  id: number;
  uuid: string;
  template_id: number;
  room_name: string;
  room_description: string | null;
  room_type: string | null;
  room_area: string | null;
  room_area_unit: string | null;
  room_height: string | null;
  room_height_unit: string | null;
  room_width: string | null;
  room_width_unit: string | null;
  room_length: string | null;
  room_length_unit: string | null;
  room_notes: string | null;
  room_priority: number;
  room_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  status: string;
  templateRoomTrades: TemplateRoomTrade[];
}

export interface TemplateRoomTrade {
  id: number;
  uuid: string;
  template_room_id: number;
  trade_id: number;
  trade_notes: string | null;
  trade_priority: number;
  trade_order: number;
  start_date: string;
  end_date: string;
  disclaimer: string | null;
  markup: string;
  markup_type: string;
  labor_cost: string | null;
  material_cost: string | null;
  trade_total: string | null;
  offer_trade_amount: string | null;
  warranty_type_id: string | null;
  warranty_description: string | null;
  warranty_start_date: string | null;
  warranty_end_date: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  status: string;
  trade: {
    id: number;
    uuid: string;
    name: string;
    description: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    status: string;
  };
  templateRoomTradeServices: any[];
}

// Base template interface
export interface BaseTemplate {
  id: string;
  templateName: string;
  createdDate: string;
}

// Disclaimer template interface
export interface DisclaimerTemplate extends BaseTemplate {
  type: 'disclaimer';
  service: string;
  material: string;
}

// Tools template interface
export interface ToolsTemplate extends BaseTemplate {
  type: 'tools';
  service: string;
  material: string;
}

// Service option template interface
export interface ServiceOptionTemplate extends BaseTemplate {
  type: 'service-option';
  service: string;
  material: string;
}

// Estimate template interface
export interface EstimateTemplate extends BaseTemplate {
  type: 'estimate';
  propertyType: string;
  category: string;
  categoryColor: string;
}

// Union type for all template types
export type TemplateData =
  | DisclaimerTemplate
  | ToolsTemplate
  | ServiceOptionTemplate
  | EstimateTemplate;

// Template types
export type TemplateType =
  | 'disclaimer'
  | 'tools'
  | 'service-option'
  | 'estimate';

// Tool interface for tools templates
export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

// Material interface for estimation
export interface Material {
  id: string;
  name: string;
  variant: string;
  qty: number;
  unit: string;
  description: string;
  rate: number;
  markup: number;
  lineTotal: number;
}

// Service option interface
export interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

// Service interface for estimation
export interface Service {
  id: string;
  name: string;
  description: string;
  qty: number;
  rate: number;
  lineTotal: number;
  serviceTotal: number;
  tradeTotal: number;
  serviceOptions: ServiceOption[];
  materials: Material[];
  finishes: Material[];
  tools: Tool[];
}

// Trade interface for estimation
export interface Trade {
  id: string;
  name: string;
  services: number;
  dateRange: string;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
  serviceList: Service[];
  isExpanded: boolean;
}

// Room interface for estimation
export interface Room {
  id: string;
  name: string;
  total: number;
  trades: Trade[];
  isExpanded: boolean;
}

// Category item interface
export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Template form data interface
export interface TemplateFormData {
  templateName: string;
  service: string;
  material: string;
  propertyType: string;
  category: string;
  description: string;
  tools: string;
  warranty: string;
  duration: string;
}

// Template selection props
export interface TemplateSelectionProps {
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (templateId: string, selected: boolean) => void;
}

// Template card props
export interface TemplateCardProps {
  template: TemplateData;
  onEdit?: () => void;
  onDelete?: () => void;
  onRetrieve?: () => void;
  isArchived?: boolean;
  className?: string;
}

// Template list card props
export interface TemplateListCardProps
  extends TemplateCardProps,
    TemplateSelectionProps {}

// Estimation box props
export interface EstimationBoxProps {
  _onClose: () => void;
}

// Estimate component props
export interface EstimateComponentProps {
  breadcrumbData: Array<{ name: string; href?: string }>;
  onAddRoom: () => void;
}
