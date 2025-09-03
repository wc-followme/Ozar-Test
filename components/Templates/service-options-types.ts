export interface ServiceOption {
  id: string;
  uuid?: string; // Selected service UUID for API interactions
  name: string;
  description: string;
  qty?: number; // Quantity for the service
  rate?: number; // Rate per unit for the service
  price: number;
  duration: string;
  category: string;
  is_hidden?: boolean;
  materials?: Array<{
    name: string;
    variant: string;
    qty: number;
    unit: string;
    description: string;
    rate: number;
    markup: number;
    markup_type: string;
    lineTotal: number;
  }>;
  finishes?: Array<{
    name: string;
    variant: string;
    qty: number;
    unit: string;
    description: string;
    rate: number;
    markup: number;
    markup_type: string;
    lineTotal: number;
  }>;
  tools?: Array<{
    name: string;
    category: string;
    description: string;
    status: string;
  }>;
}

export interface ServiceCategory {
  id: string;
  uniqueKey: string;
  name: string;
  total: number;
  serviceOptions: ServiceOption[];
  isExpanded: boolean;
}
