import { Home, Icon } from 'iconsax-react';
import { CircleUserIcon } from 'lucide-react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { Service } from './../components/icons/Service';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

type SidebarItem = {
  title: string;
  href: string;
  icon: Icon;
};

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Jobs',
    href: '/job-management',
    icon: JobIcon,
  },
  {
    title: 'Role Manag.',
    href: '/role-management',
    icon: RoleIcon,
  },
  {
    title: 'User Manag.',
    href: '/user-management',
    icon: CircleUserIcon,
  },
  {
    title: 'Company Manag.',
    href: '/trade',
    icon: Company,
  },
  {
    title: 'Category Manag.',
    href: '/service',
    icon: Category,
  },
  {
    title: 'Trade Manag.',
    href: '/material',
    icon: Trade,
  },
  {
    title: 'Service Manag.',
    href: '/tools',
    icon: Service,
  },
  {
    title: 'Material Manag.',
    href: '/tools',
    icon: Material,
  },
  {
    title: 'Tools Manag.',
    href: '/tools',
    icon: Tool,
  },
];
