import { HelmetIcon } from '@/components/icons/HelmetIcon';
import { PeopleGroupIcon } from '@/components/icons/PeopleGroupIcon';
import { UserCardIcon } from '@/components/icons/UserCardIcon';
import { HomeIcon } from 'lucide-react';

export const roles = [
  {
    title: 'Admin',
    iconSrc: UserCardIcon,
    iconBgColor: 'bg-greenbrand-100',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '',
  },
  {
    title: 'Contractor',
    iconSrc: HelmetIcon,
    iconBgColor: 'bg-redbrand-100',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '',
  },
  {
    title: 'Project Manager',
    iconSrc: PeopleGroupIcon,
    iconBgColor: 'bg-redbrand-100',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '#D43232',
  },
  {
    title: 'Estimator',
    iconSrc: PeopleGroupIcon,
    iconBgColor: '#90C91D26',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '#90C91D',
  },
  {
    title: 'Employee',
    iconSrc: PeopleGroupIcon,
    iconBgColor: 'bg-yellowbrand-200',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '#90C91D',
  },
  {
    title: 'Home Owner',
    iconSrc: HomeIcon,
    iconBgColor: 'bg-cyanwave-light',
    description:
      'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
    permissionCount: 30,
    color: '#00A8BF',
  },
];

export const fiveBoxSystemData = [
  {
    id: '01',
    number: '01',
    color: '#34AD4426', // Green
    textColor: '#34AD44', // Dark green text
    title: 'General Information',
    description:
      'Includes name, email, phone number, and basic contact details.',
    enabled: true,
    slug: 'general-information',
  },
  {
    id: '02',
    number: '02',
    color: '#1A57BF1A', // Blue
    textColor: '#1A57BF', // Dark blue text
    title: 'Property Information',
    description: 'Includes home size, number of BHKs, and floor count.',
    enabled: true,
    slug: 'property-information',
  },
  {
    id: '03',
    number: '03',
    color: '#00A8BF26', // Light blue/cyan
    textColor: '#00A8BF', // Dark cyan text
    title: 'Project Information',
    description:
      'Includes work type (interior, exterior, etc.) and service scope.',
    enabled: true,
    slug: 'project-information',
  },
  {
    id: '04',
    number: '04',
    color: '#90C91D26', // Yellow/light green
    textColor: '#90C91D', // Dark yellow/green text
    title: 'Category',
    description: 'Includes project name, location, and key contacts.',
    enabled: true,
    slug: 'category',
  },
  {
    id: '05',
    number: '05',
    color: '#D4323226', // Red/pink
    textColor: '#D43232', // Dark red text
    title: 'Estimation',
    description: 'Includes pricing based on size, scope, and type of work.',
    enabled: true,
    slug: 'estimation',
  },
];

export const customerReviews = [
  {
    id: '1',
    reviewTitle: 'Transformed Our Home!',
    rating: 5,
    reviewText:
      'We hired [Contractor Name] for a complete home renovation, and they exceeded our expectations! From design to execution, everything was flawless. The team was professional, on time, and ensured quality craftsmanship. Highly recommended!',
    reviewerName: 'Emma & Michael R.',
    reviewDate: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    reviewTitle: 'Outstanding Kitchen Remodel',
    rating: 5,
    reviewText:
      'The kitchen renovation project was completed perfectly. The attention to detail was incredible, and the quality of work exceeded our expectations. The team was punctual and professional throughout.',
    reviewerName: 'Sarah Johnson',
    reviewDate: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    reviewTitle: 'Professional Bathroom Upgrade',
    rating: 4,
    reviewText:
      'Great work on our bathroom renovation. The team was skilled and efficient. The only minor issue was a slight delay in material delivery, but overall very satisfied with the results.',
    reviewerName: 'David Chen',
    reviewDate: '2024-01-05T09:15:00Z',
  },
  {
    id: '4',
    reviewTitle: 'Excellent Exterior Painting',
    rating: 5,
    reviewText:
      'The exterior painting job was done beautifully. The color selection was perfect and the finish is outstanding. The crew was careful and cleaned up thoroughly after completion.',
    reviewerName: 'Lisa Thompson',
    reviewDate: '2023-12-28T16:45:00Z',
  },
  {
    id: '5',
    reviewTitle: 'Quality Roofing Work',
    rating: 4,
    reviewText:
      'The roofing project was completed efficiently and with high quality materials. The team was knowledgeable and addressed all our concerns. Very reliable service.',
    reviewerName: 'Robert Williams',
    reviewDate: '2023-12-20T11:30:00Z',
  },
];

export const portfolioProjects = [
  {
    id: '1',
    title: 'Modern Kitchen Renovation',
    type: 'Interior',
    year: '2024',
    image: '/images/company-management/company-img-1.png',
    imageCount: 20,
    videoCount: 2,
  },
  {
    id: '2',
    title: 'Luxury Bathroom Design',
    type: 'Interior',
    year: '2023',
    image: '/images/company-management/company-img-2.png',
    imageCount: 15,
    videoCount: 1,
  },
  {
    id: '3',
    title: 'Custom Home Build',
    type: 'Full Home',
    year: '2023',
    image: '/images/company-management/company-img-3.png',
    imageCount: 35,
    videoCount: 3,
  },
  {
    id: '4',
    title: 'Outdoor Kitchen Project',
    type: 'Exterior',
    year: '2023',
    image: '/images/company-management/company-img-4.png',
    imageCount: 12,
    videoCount: 0,
  },
  {
    id: '5',
    title: 'Office Renovation',
    type: 'Commercial',
    year: '2022',
    imageCount: 8,
    videoCount: 1,
  },
  {
    id: '6',
    title: 'Basement Finishing',
    type: 'Interior',
    year: '2022',
    imageCount: 18,
    videoCount: 2,
  },
  {
    id: '7',
    title: 'Deck Construction',
    type: 'Exterior',
    year: '2022',
    imageCount: 10,
    videoCount: 0,
  },
  {
    id: '8',
    title: 'Garage Addition',
    type: 'Addition',
    year: '2021',
    imageCount: 6,
    videoCount: 1,
  },
];

export const warranties = [
  {
    id: '1',
    title: 'Workmanship Warranty',
    duration: '2 Years',
    description:
      'Covers all workmanship and installation quality. Ensures that all work performed meets industry standards and specifications.',
    type: 'Workmanship',
  },
  {
    id: '2',
    title: 'Timeframe Warranty',
    duration: '5 Years',
    description:
      'Covers warranty periods and time-based guarantees. Ensures coverage for specified time periods.',
    type: 'Timeframe',
  },
  {
    id: '3',
    title: 'Product Warranty',
    duration: '3 Years',
    description:
      'Covers product quality and manufacturing defects. Ensures products meet quality standards.',
    type: 'Product',
  },
  {
    id: '4',
    title: 'Brand Warranty',
    duration: '1 Year',
    description:
      'Covers brand-specific guarantees and manufacturer warranties. Ensures brand quality assurance.',
    type: 'Brand',
  },
  {
    id: '5',
    title: 'Extended Workmanship Warranty',
    duration: '10 Years',
    description:
      'Extended coverage for workmanship quality. Provides long-term protection for installation work.',
    type: 'Workmanship',
  },
  {
    id: '6',
    title: 'Premium Timeframe Warranty',
    duration: '15 Years',
    description:
      'Premium time-based warranty coverage. Offers extended protection periods.',
    type: 'Timeframe',
  },
  {
    id: '7',
    title: 'Standard Product Warranty',
    duration: '2 Years',
    description:
      'Standard product warranty coverage. Ensures basic product quality protection.',
    type: 'Product',
  },
  {
    id: '8',
    title: 'Premium Brand Warranty',
    duration: '5 Years',
    description:
      'Premium brand warranty with extended coverage. Ensures comprehensive brand protection.',
    type: 'Brand',
  },
];

export const warrantyTabs = [
  {
    id: 'workmanship',
    label: 'Workmanship',
    value: 'workmanship',
  },
  {
    id: 'timeframe',
    label: 'Timeframe',
    value: 'timeframe',
  },
  {
    id: 'product',
    label: 'Product',
    value: 'product',
  },
  {
    id: 'brand',
    label: 'Brand',
    value: 'brand',
  },
];

// Tool Management Dummy Data
export const toolBorrowedHistoryData = [
  {
    id: '1',
    borrowedBy: {
      name: 'Liam Anderson',
      avatar: '/images/avatars/avatar-3.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '2',
    borrowedBy: {
      name: 'Emma Thompson',
      avatar: '/images/avatars/avatar-4.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '3',
    borrowedBy: {
      name: 'Noah Johnson',
      avatar: '/images/avatars/avatar-5.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '4',
    borrowedBy: {
      name: 'Olivia Martinez',
      avatar: '/images/avatars/avatar-6.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '5',
    borrowedBy: {
      name: 'Ava Robinson',
      avatar: '/images/avatars/avatar-7.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '6',
    borrowedBy: {
      name: 'Ethan Clark',
      avatar: '/images/avatars/avatar-8.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '7',
    borrowedBy: {
      name: 'Sophia Lewis',
      avatar: '/images/avatars/avatar-1.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '8',
    borrowedBy: {
      name: 'Mason Walker',
      avatar: '/images/avatars/avatar-2.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
  {
    id: '9',
    borrowedBy: {
      name: 'Isabella Hall',
      avatar: '/images/avatars/avatar-3.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    borrowedDate: '16/08/2024',
    returnedDate: '30/08/2024',
  },
];

export const toolMaintenanceHistoryData = [
  {
    id: '1',
    returnedBy: {
      name: 'Liam Anderson',
      avatar: '/images/avatars/avatar-3.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Jam',
  },
  {
    id: '2',
    returnedBy: {
      name: 'Emma Thompson',
      avatar: '/images/avatars/avatar-4.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Overheat',
  },
  {
    id: '3',
    returnedBy: {
      name: 'Noah Johnson',
      avatar: '/images/avatars/avatar-5.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Vibration',
  },
  {
    id: '4',
    returnedBy: {
      name: 'Olivia Martinez',
      avatar: '/images/avatars/avatar-6.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Stall',
  },
  {
    id: '5',
    returnedBy: {
      name: 'Ava Robinson',
      avatar: '/images/avatars/avatar-7.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Noise',
  },
  {
    id: '6',
    returnedBy: {
      name: 'Ethan Clark',
      avatar: '/images/avatars/avatar-8.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Leak',
  },
  {
    id: '7',
    returnedBy: {
      name: 'Sophia Lewis',
      avatar: '/images/avatars/avatar-1.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Leak',
  },
  {
    id: '8',
    returnedBy: {
      name: 'Mason Walker',
      avatar: '/images/avatars/avatar-2.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Short',
  },
  {
    id: '9',
    returnedBy: {
      name: 'Isabella Hall',
      avatar: '/images/avatars/avatar-3.png',
    },
    employeeType: 'Employees',
    assignedJob: 'Job#456 Downtown Project',
    assignedDate: '16/08/2024',
    returnedDate: '16/08/2024',
    issue: 'Short',
  },
];

export const tradeSidebarData = [
  {
    id: '1',
    uniqueKey: 'room_1',
    name: 'Bed Room 1',
    total: 2500.0,
    isExpanded: true,
    trades: [
      {
        id: 'trade_1',
        uniqueKey: 'trade_1_1',
        name: 'Plumbing',
        services: 3,
        start_date: '2024-01-15',
        end_date: '2024-01-25',
        type: '2D',
        laborCost: 800.0,
        materialCost: 400.0,
        tradeTotal: 1200.0,
        isExpanded: true,
        serviceList: [
          {
            id: 'service_1',
            name: 'Install Shower',
            description: 'Install new shower unit with fixtures',
            qty: 1,
            rate: 300.0,
            lineTotal: 300.0,
            serviceTotal: 300.0,
            tradeTotal: 300.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_1',
                name: 'Shower Unit',
                variant: 'Standard',
                qty: 1,
                unit: 'piece',
                description: 'Complete shower unit',
                rate: 150.0,
                markup: 20.0,
                lineTotal: 180.0,
              },
            ],
            finishes: [],
            tools: [],
          },
          {
            id: 'service_2',
            name: 'Install Sink',
            description: 'Install bathroom sink with plumbing',
            qty: 1,
            rate: 250.0,
            lineTotal: 250.0,
            serviceTotal: 250.0,
            tradeTotal: 250.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_2',
                name: 'Bathroom Sink',
                variant: 'Ceramic',
                qty: 1,
                unit: 'piece',
                description: 'White ceramic sink',
                rate: 120.0,
                markup: 15.0,
                lineTotal: 138.0,
              },
            ],
            finishes: [],
            tools: [],
          },
          {
            id: 'service_3',
            name: 'Install Toilet',
            description: 'Install new toilet with plumbing',
            qty: 1,
            rate: 250.0,
            lineTotal: 250.0,
            serviceTotal: 250.0,
            tradeTotal: 250.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_3',
                name: 'Toilet Unit',
                variant: 'Standard',
                qty: 1,
                unit: 'piece',
                description: 'Complete toilet unit',
                rate: 200.0,
                markup: 25.0,
                lineTotal: 250.0,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
      {
        id: 'trade_2',
        uniqueKey: 'trade_1_2',
        name: 'Electrical',
        services: 2,
        start_date: '2024-01-20',
        end_date: '2024-01-30',
        type: '2D',
        laborCost: 600.0,
        materialCost: 300.0,
        tradeTotal: 900.0,
        isExpanded: false,
        serviceList: [
          {
            id: 'service_4',
            name: 'Install Lighting',
            description: 'Install ceiling lights and switches',
            qty: 4,
            rate: 75.0,
            lineTotal: 300.0,
            serviceTotal: 300.0,
            tradeTotal: 300.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_4',
                name: 'LED Lights',
                variant: 'Warm White',
                qty: 4,
                unit: 'piece',
                description: '10W LED ceiling lights',
                rate: 25.0,
                markup: 10.0,
                lineTotal: 110.0,
              },
            ],
            finishes: [],
            tools: [],
          },
          {
            id: 'service_5',
            name: 'Install Outlets',
            description: 'Install electrical outlets',
            qty: 6,
            rate: 50.0,
            lineTotal: 300.0,
            serviceTotal: 300.0,
            tradeTotal: 300.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_5',
                name: 'Electrical Outlets',
                variant: 'Standard',
                qty: 6,
                unit: 'piece',
                description: '15A electrical outlets',
                rate: 15.0,
                markup: 5.0,
                lineTotal: 120.0,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    uniqueKey: 'room_2',
    name: 'Living Room',
    total: 1800.0,
    isExpanded: false,
    trades: [
      {
        id: 'trade_3',
        uniqueKey: 'trade_2_1',
        name: 'Painting',
        services: 1,
        start_date: '2024-02-01',
        end_date: '2024-02-05',
        type: '2D',
        laborCost: 400.0,
        materialCost: 200.0,
        tradeTotal: 600.0,
        isExpanded: false,
        serviceList: [
          {
            id: 'service_6',
            name: 'Wall Painting',
            description: 'Paint all walls with premium paint',
            qty: 1,
            rate: 600.0,
            lineTotal: 600.0,
            serviceTotal: 600.0,
            tradeTotal: 600.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_6',
                name: 'Premium Paint',
                variant: 'Eggshell',
                qty: 5,
                unit: 'gallon',
                description: 'Interior wall paint',
                rate: 35.0,
                markup: 15.0,
                lineTotal: 201.25,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
      {
        id: 'trade_4',
        uniqueKey: 'trade_2_2',
        name: 'Flooring',
        services: 1,
        start_date: '2024-02-10',
        end_date: '2024-02-15',
        type: '2D',
        laborCost: 500.0,
        materialCost: 700.0,
        tradeTotal: 1200.0,
        isExpanded: false,
        serviceList: [
          {
            id: 'service_7',
            name: 'Install Hardwood Floor',
            description: 'Install engineered hardwood flooring',
            qty: 200,
            rate: 6.0,
            lineTotal: 1200.0,
            serviceTotal: 1200.0,
            tradeTotal: 1200.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_7',
                name: 'Hardwood Planks',
                variant: 'Oak',
                qty: 200,
                unit: 'sqft',
                description: 'Engineered oak flooring',
                rate: 3.5,
                markup: 20.0,
                lineTotal: 840.0,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    uniqueKey: 'room_3',
    name: 'Kitchen',
    total: 3200.0,
    isExpanded: false,
    trades: [
      {
        id: 'trade_5',
        uniqueKey: 'trade_3_1',
        name: 'Cabinetry',
        services: 1,
        start_date: '2024-02-20',
        end_date: '2024-03-05',
        type: '2D',
        laborCost: 800.0,
        materialCost: 1200.0,
        tradeTotal: 2000.0,
        isExpanded: false,
        serviceList: [
          {
            id: 'service_8',
            name: 'Install Kitchen Cabinets',
            description: 'Install custom kitchen cabinets',
            qty: 1,
            rate: 2000.0,
            lineTotal: 2000.0,
            serviceTotal: 2000.0,
            tradeTotal: 2000.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_8',
                name: 'Kitchen Cabinets',
                variant: 'Custom',
                qty: 1,
                unit: 'set',
                description: 'Custom kitchen cabinet set',
                rate: 1200.0,
                markup: 25.0,
                lineTotal: 1500.0,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
      {
        id: 'trade_6',
        uniqueKey: 'trade_3_2',
        name: 'Appliances',
        services: 1,
        start_date: '2024-03-10',
        end_date: '2024-03-15',
        type: '2D',
        laborCost: 400.0,
        materialCost: 800.0,
        tradeTotal: 1200.0,
        isExpanded: false,
        serviceList: [
          {
            id: 'service_9',
            name: 'Install Kitchen Appliances',
            description: 'Install refrigerator, stove, and dishwasher',
            qty: 1,
            rate: 1200.0,
            lineTotal: 1200.0,
            serviceTotal: 1200.0,
            tradeTotal: 1200.0,
            serviceOptions: [],
            materials: [
              {
                id: 'mat_9',
                name: 'Kitchen Appliances',
                variant: 'Stainless Steel',
                qty: 1,
                unit: 'set',
                description: 'Complete kitchen appliance set',
                rate: 800.0,
                markup: 30.0,
                lineTotal: 1040.0,
              },
            ],
            finishes: [],
            tools: [],
          },
        ],
      },
    ],
  },
];

// Subcontractor data for auction bid mode
export const subContractorData = [
  {
    id: 'sub_1',
    name: 'John Smith',
    company: 'Smith Contracting',
    contact: '+1 (555) 123-4567',
    rating: 4.8,
    trades: [
      {
        id: 'sub_trade_1',
        name: 'Plumbing',
        value: 1200.0,
        services: [
          { id: 'sub_service_1', name: 'Install Shower', value: 300.0 },
          { id: 'sub_service_2', name: 'Install Sink', value: 250.0 },
          { id: 'sub_service_3', name: 'Install Toilet', value: 250.0 },
        ],
      },
      {
        id: 'sub_trade_2',
        name: 'Electrical',
        value: 900.0,
        services: [
          { id: 'sub_service_4', name: 'Install Lighting', value: 300.0 },
          { id: 'sub_service_5', name: 'Install Outlets', value: 300.0 },
        ],
      },
    ],
  },
  {
    id: 'sub_2',
    name: 'Mike Johnson',
    company: 'Johnson Electric',
    contact: '+1 (555) 987-6543',
    rating: 4.6,
    trades: [
      {
        id: 'sub_trade_3',
        name: 'Electrical',
        value: 850.0,
        services: [
          { id: 'sub_service_6', name: 'Install Lighting', value: 280.0 },
          { id: 'sub_service_7', name: 'Install Outlets', value: 270.0 },
        ],
      },
    ],
  },
  {
    id: 'sub_3',
    name: 'David Wilson',
    company: 'Wilson Painting',
    contact: '+1 (555) 456-7890',
    rating: 4.9,
    trades: [
      {
        id: 'sub_trade_4',
        name: 'Painting',
        value: 600.0,
        services: [
          { id: 'sub_service_8', name: 'Wall Painting', value: 600.0 },
        ],
      },
    ],
  },
  {
    id: 'sub_4',
    name: 'Sarah Brown',
    company: 'Brown Carpentry',
    contact: '+1 (555) 789-0123',
    rating: 4.7,
    trades: [
      {
        id: 'sub_trade_5',
        name: 'Cabinetry',
        value: 1800.0,
        services: [
          {
            id: 'sub_service_9',
            name: 'Install Kitchen Cabinets',
            value: 1800.0,
          },
        ],
      },
    ],
  },
  {
    id: 'sub_5',
    name: 'Robert Davis',
    company: 'Davis HVAC',
    contact: '+1 (555) 321-6540',
    rating: 4.5,
    trades: [
      {
        id: 'sub_trade_6',
        name: 'HVAC',
        value: 1500.0,
        services: [
          { id: 'sub_service_10', name: 'Install AC Unit', value: 800.0 },
          { id: 'sub_service_11', name: 'Install Ductwork', value: 700.0 },
        ],
      },
    ],
  },
];
