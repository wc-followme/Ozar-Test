// Template management type definitions

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
