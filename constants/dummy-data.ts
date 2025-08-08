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
