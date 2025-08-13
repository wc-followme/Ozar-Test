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
