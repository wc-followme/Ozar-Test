export interface EstimationItem {
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

export interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface Service {
  id: string;
  uuid?: string; // Add UUID field for database service UUID
  name: string;
  description: string;
  qty: number;
  rate: number;
  lineTotal: number;
  serviceTotal: number;
  tradeTotal: number;
  serviceOptions: ServiceOption[];
  materials: EstimationItem[];
  finishes: EstimationItem[];
  tools: Tool[];
}
