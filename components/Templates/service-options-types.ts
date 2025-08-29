export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  is_hidden?: boolean;
}

export interface ServiceCategory {
  id: string;
  uniqueKey: string;
  name: string;
  total: number;
  serviceOptions: ServiceOption[];
  isExpanded: boolean;
}
