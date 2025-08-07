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
