import {
  CategoryItem,
  Material,
  Room,
  Service,
  ServiceOption,
  TemplateData,
  Tool,
  Trade,
} from './template-types';

// Estimate templates data
export const estimateTemplates: TemplateData[] = [
  {
    id: '1',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Interior',
    categoryColor: '#8B5CF6',
    createdDate: '30/12/2024',
  },
  {
    id: '2',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Full Home Build/Addition',
    categoryColor: '#10B981',
    createdDate: '29/12/2024',
  },
  {
    id: '3',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Full Home Build/Addition',
    categoryColor: '#10B981',
    createdDate: '28/12/2024',
  },
  {
    id: '4',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Interior',
    categoryColor: '#8B5CF6',
    createdDate: '27/12/2024',
  },
  {
    id: '5',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Exterior',
    categoryColor: '#F59E0B',
    createdDate: '25/12/2024',
  },
  {
    id: '6',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Single/Multi Trade',
    categoryColor: '#F59E0B',
    createdDate: '20/12/2024',
  },
  {
    id: '7',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Single/Multi Trade',
    categoryColor: '#F59E0B',
    createdDate: '15/12/2024',
  },
  {
    id: '8',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Exterior',
    categoryColor: '#F59E0B',
    createdDate: '10/12/2024',
  },
  {
    id: '9',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Single/Multi Trade',
    categoryColor: '#F59E0B',
    createdDate: '08/12/2024',
  },
  {
    id: '10',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Exterior',
    categoryColor: '#F59E0B',
    createdDate: '07/12/2024',
  },
  {
    id: '11',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Interior',
    categoryColor: '#8B5CF6',
    createdDate: '06/12/2024',
  },
  {
    id: '12',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Interior',
    categoryColor: '#8B5CF6',
    createdDate: '05/12/2024',
  },
  {
    id: '13',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Commercial',
    category: 'Office Space',
    categoryColor: '#3B82F6',
    createdDate: '04/12/2024',
  },
  {
    id: '14',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Commercial',
    category: 'Retail Space',
    categoryColor: '#EF4444',
    createdDate: '03/12/2024',
  },
  {
    id: '15',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Kitchen Remodel',
    categoryColor: '#F97316',
    createdDate: '02/12/2024',
  },
];

// Option bid templates data
export const optionBidTemplates: TemplateData[] = [
  {
    id: '16',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Shower Install',
    material: 'Shower',
    createdDate: '30/12/2024',
  },
  {
    id: '17',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Kitchen Remodel',
    material: 'Cabinets',
    createdDate: '29/12/2024',
  },
  {
    id: '18',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Bathroom Renovation',
    material: 'Tiles',
    createdDate: '28/12/2024',
  },
  {
    id: '19',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Flooring Installation',
    material: 'Hardwood',
    createdDate: '27/12/2024',
  },
  {
    id: '20',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Roofing',
    material: 'Shingles',
    createdDate: '25/12/2024',
  },
  {
    id: '21',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Electrical Work',
    material: 'Wiring',
    createdDate: '20/12/2024',
  },
  {
    id: '22',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Plumbing',
    material: 'Pipes',
    createdDate: '15/12/2024',
  },
  {
    id: '23',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Painting',
    material: 'Paint',
    createdDate: '10/12/2024',
  },
  {
    id: '24',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'HVAC Installation',
    material: 'Ductwork',
    createdDate: '08/12/2024',
  },
  {
    id: '25',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Landscaping',
    material: 'Plants',
    createdDate: '07/12/2024',
  },
  {
    id: '26',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Deck Building',
    material: 'Wood',
    createdDate: '06/12/2024',
  },
  {
    id: '27',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Window Installation',
    material: 'Glass',
    createdDate: '05/12/2024',
  },
];

// Tools templates data
export const toolsTemplates: TemplateData[] = [
  {
    id: '28',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Power Tools',
    material: 'Drills',
    createdDate: '30/12/2024',
  },
  {
    id: '29',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Hand Tools',
    material: 'Screwdrivers',
    createdDate: '29/12/2024',
  },
  {
    id: '30',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Measuring Tools',
    material: 'Tape Measures',
    createdDate: '28/12/2024',
  },
  {
    id: '31',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Safety Equipment',
    material: 'Hard Hats',
    createdDate: '27/12/2024',
  },
  {
    id: '32',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Cutting Tools',
    material: 'Saws',
    createdDate: '25/12/2024',
  },
];

// Disclaimers templates data
export const disclaimersTemplates: TemplateData[] = [
  {
    id: '33',
    type: 'disclaimer',
    templateName: 'Template Name',
    service: 'Liability Waiver',
    material: 'Legal Document',
    createdDate: '30/12/2024',
  },
  {
    id: '34',
    type: 'disclaimer',
    templateName: 'Template Name',
    service: 'Warranty Terms',
    material: 'Contract',
    createdDate: '29/12/2024',
  },
  {
    id: '35',
    type: 'disclaimer',
    templateName: 'Template Name',
    service: 'Safety Notice',
    material: 'Warning',
    createdDate: '28/12/2024',
  },
];

// Archive templates data
export const archiveTemplates: TemplateData[] = [
  {
    id: '36',
    type: 'estimate',
    templateName: 'Template Name',
    propertyType: 'Residential',
    category: 'Interior',
    categoryColor: '#8B5CF6',
    createdDate: '01/12/2024',
  },
  {
    id: '37',
    type: 'option-bid',
    templateName: 'Template Name',
    service: 'Old Service',
    material: 'Old Material',
    createdDate: '30/11/2024',
  },
  {
    id: '38',
    type: 'tools',
    templateName: 'Template Name',
    service: 'Old Tools',
    material: 'Old Equipment',
    createdDate: '29/11/2024',
  },
  {
    id: '39',
    type: 'disclaimer',
    templateName: 'Template Name',
    service: 'Old Disclaimer',
    material: 'Old Document',
    createdDate: '28/11/2024',
  },
];

// Tools data from ToolsDemo.tsx
export const demoTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'Nail Master 3000',
    category: 'power-tools',
    description: 'Professional nail gun for construction projects',
    status: 'available',
  },
  {
    id: 'tool-2',
    name: 'Drill Wizard',
    category: 'power-tools',
    description: 'High-performance cordless drill',
    status: 'in-use',
  },
  {
    id: 'tool-3',
    name: 'Saw Xpert',
    category: 'power-tools',
    description: 'Precision circular saw for cutting',
    status: 'available',
  },
  {
    id: 'tool-4',
    name: 'Level Right',
    category: 'measuring-tools',
    description: 'Digital level for accurate measurements',
    status: 'maintenance',
  },
];

// Initial rooms data from EstimationBox.tsx
export const initialRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Home 1',
    total: 0.0,
    trades: [],
    isExpanded: true,
  },
];

// Category data for CategoryComponent.tsx
export const categoryData: CategoryItem[] = [
  {
    id: 'interior',
    name: 'Interior',
    description: 'Indoor renovations and improvements',
    icon: 'interior',
    color: '#8B5CF6',
    bgColor: '#8B5CF61A',
  },
  {
    id: 'exterior',
    name: 'Exterior',
    description: 'Outdoor projects and maintenance',
    icon: 'exterior',
    color: '#F59E0B',
    bgColor: '#F59E0B1A',
  },
  {
    id: 'full-home',
    name: 'Full Home Build/Addition',
    description: 'Complete home construction or major additions',
    icon: 'home',
    color: '#10B981',
    bgColor: '#10B9811A',
  },
  {
    id: 'general',
    name: 'General',
    description: 'General maintenance and repairs',
    icon: 'general',
    color: '#6B7280',
    bgColor: '#6B72801A',
  },
];

// Service options data
export const serviceOptions: ServiceOption[] = [
  {
    id: 'option-1',
    name: 'Basic Service',
    tradeTotal: 1500.0,
  },
  {
    id: 'option-2',
    name: 'Premium Service',
    tradeTotal: 2500.0,
  },
  {
    id: 'option-3',
    name: 'Deluxe Service',
    tradeTotal: 3500.0,
  },
];

// Sample materials data
export const sampleMaterials: Material[] = [
  {
    id: 'material-1',
    name: 'Premium Paint',
    variant: 'Interior Wall Paint',
    qty: 5,
    unit: 'gallons',
    description: 'High-quality interior wall paint',
    rate: 45.0,
    markup: 10,
    lineTotal: 247.5,
  },
  {
    id: 'material-2',
    name: 'Drywall Sheets',
    variant: '4x8 Standard',
    qty: 10,
    unit: 'sheets',
    description: 'Standard 4x8 drywall sheets',
    rate: 12.5,
    markup: 15,
    lineTotal: 143.75,
  },
];

// Sample services data
export const sampleServices: Service[] = [
  {
    id: 'service-1',
    name: 'Wall Painting',
    description: 'Interior wall painting service',
    qty: 1,
    rate: 2.5,
    lineTotal: 2.5,
    serviceTotal: 2.5,
    tradeTotal: 2.5,
    serviceOptions: serviceOptions,
    materials: sampleMaterials,
    finishes: [],
    tools: [],
  },
  {
    id: 'service-2',
    name: 'Drywall Installation',
    description: 'Drywall installation and finishing',
    qty: 1,
    rate: 3.75,
    lineTotal: 3.75,
    serviceTotal: 3.75,
    tradeTotal: 3.75,
    serviceOptions: serviceOptions,
    materials: sampleMaterials,
    finishes: [],
    tools: [],
  },
];

// Sample trades data
export const sampleTrades: Trade[] = [
  {
    id: 'trade-1',
    name: 'Painting',
    services: 2,
    dateRange: 'Jan 15 - Jan 20',
    type: 'Interior',
    laborCost: 800.0,
    materialCost: 400.0,
    tradeTotal: 1200.0,
    serviceList: sampleServices,
    isExpanded: false,
  },
  {
    id: 'trade-2',
    name: 'Carpentry',
    services: 1,
    dateRange: 'Jan 21 - Jan 25',
    type: 'Interior',
    laborCost: 600.0,
    materialCost: 300.0,
    tradeTotal: 900.0,
    serviceList: sampleServices,
    isExpanded: false,
  },
];

// Template form options
export const templateFormOptions = {
  categories: [
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'general', label: 'General' },
    { value: 'full-home-build', label: 'Full Home Build/Addition' },
  ],
  services: [
    { value: 'painting', label: 'Painting' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'general', label: 'General' },
    { value: 'warranty', label: 'Warranty' },
  ],
  durations: [
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' },
    { value: '3-years', label: '3 Years' },
    { value: '5-years', label: '5 Years' },
    { value: 'lifetime', label: 'Lifetime' },
  ],
  propertyTypes: [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
  ],
  toolCategories: [
    { value: 'power-tools', label: 'Power Tools' },
    { value: 'measuring-tools', label: 'Measuring Tools' },
    { value: 'hand-tools', label: 'Hand Tools' },
  ],
};
