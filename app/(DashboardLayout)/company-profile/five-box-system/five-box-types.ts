export interface FiveBoxItem {
  id: string;
  number: string;
  color: string;
  textColor: string;
  title: string;
  description: string;
  enabled: boolean;
  slug: string;
  isRequired: boolean;
  isCompleted: boolean;
  order: number;
  icon: string;
  formFields: string[];
}

export interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}
