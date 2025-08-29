import { Home, SecurityUser, Setting3 } from 'iconsax-react';
import { ComponentType } from 'react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { TemplateIcon } from './../components/icons/TemplateIcon';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

// Common icon options for roles and other modules
import { CatCraneIcon } from '../components/icons/CatCraneIcon';
import { CatHomeIcon } from '../components/icons/CatHomeIcon';
import { CatPaintBrushIcon } from '../components/icons/CatPaintBrushIcon';
import { CatSkrewDriveIcon } from '../components/icons/CatSkrewDriveIcon';
import { CatToolIcon } from '../components/icons/CatToolIcon';
import { CircleUsersStarIcon } from '../components/icons/CircleUsersStarIcon';
import { HelmetIcon } from '../components/icons/HelmetIcon';
import { PeopleGroupIcon } from '../components/icons/PeopleGroupIcon';
import { Service } from '../components/icons/Service';
import { UserCardIcon } from '../components/icons/UserCardIcon';

// Sidebar title constants
export const SIDEBAR_TITLES = {
  HOME: 'Home',
  PROJECTS: 'Projects',
  ROLES_ACCOUNTS: 'Roles & Accounts',
  COMPANY_MANAGEMENT: 'Company Management',
  CATALOGUE_MANAGEMENT: 'Catalogue Management',
  TEMPLATES_MANAGEMENT: 'Templates Management',
  SETTINGS: 'Settings',
  // Submenu items
  ROLE_MANAGEMENT: 'Role Management',
  STAFF_MANAGEMENT: 'Staff Management',
  PORTAL_USERS: 'Portal Users',
  CATEGORY_MANAGEMENT: 'Category Management',
  TRADE_MANAGEMENT: 'Trade Management',
  SERVICE_MANAGEMENT: 'Service Management',
  MATERIAL_MANAGEMENT: 'Material Management',
  TOOLS_MANAGEMENT: 'Tools Management',
} as const;

// Permission categories constants
export const PERMISSION_CATEGORIES = {
  CATALOGUE_SERVICES: 'catalogue_services',
  ROLES: 'roles',
  USERS: 'users',
  COMPANIES: 'companies',
  JOBS: 'jobs',
  TEMPLATES: 'templates',
  GLOBAL_SETTINGS: 'global_settings',
} as const;

// Permission actions constants
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
} as const;

type SidebarMenuItem = {
  menu_id: string;
  title: string;
  href?: string;
  icon: ComponentType<any>;
  submenu?: SidebarMenuItem[];
};

export const sidebarItems: SidebarMenuItem[] = [
  {
    menu_id: 'home',
    title: SIDEBAR_TITLES.HOME,
    href: '/',
    icon: Home,
  },
  {
    menu_id: 'projects',
    title: SIDEBAR_TITLES.PROJECTS,
    href: '/job-management',
    icon: JobIcon,
  },
  {
    menu_id: 'roles-accounts',
    title: SIDEBAR_TITLES.ROLES_ACCOUNTS,
    icon: RoleIcon,
    submenu: [
      {
        menu_id: 'role-management',
        title: SIDEBAR_TITLES.ROLE_MANAGEMENT,
        href: '/role-management',
        icon: RoleIcon,
      },
      {
        menu_id: 'staff-management',
        title: SIDEBAR_TITLES.STAFF_MANAGEMENT,
        href: '/user-management',
        icon: CircleUsersStarIcon,
      },
      {
        menu_id: 'portal-users',
        title: SIDEBAR_TITLES.PORTAL_USERS,
        href: '/portal-users',
        icon: SecurityUser,
      },
    ],
  },
  {
    menu_id: 'company-management',
    title: SIDEBAR_TITLES.COMPANY_MANAGEMENT,
    href: '/company-management',
    icon: Company,
  },
  {
    menu_id: 'catalogue-management',
    title: SIDEBAR_TITLES.CATALOGUE_MANAGEMENT,
    icon: Category,
    submenu: [
      {
        menu_id: 'category-management',
        title: SIDEBAR_TITLES.CATEGORY_MANAGEMENT,
        href: '/category-management',
        icon: Category,
      },
      {
        menu_id: 'trade-management',
        title: SIDEBAR_TITLES.TRADE_MANAGEMENT,
        href: '/trade-management',
        icon: Trade,
      },
      {
        menu_id: 'service-management',
        title: SIDEBAR_TITLES.SERVICE_MANAGEMENT,
        href: '/service-management',
        icon: Service,
      },
      {
        menu_id: 'material-management',
        title: SIDEBAR_TITLES.MATERIAL_MANAGEMENT,
        href: '/material-management',
        icon: Material,
      },
      {
        menu_id: 'tools-management',
        title: SIDEBAR_TITLES.TOOLS_MANAGEMENT,
        href: '/tools-management',
        icon: Tool,
      },
    ],
  },
  {
    menu_id: 'templates-management',
    title: SIDEBAR_TITLES.TEMPLATES_MANAGEMENT,
    href: '/templates',
    icon: TemplateIcon,
  },
  {
    menu_id: 'settings',
    title: SIDEBAR_TITLES.SETTINGS,
    href: '/company-profile/five-box-system',
    icon: Setting3,
  },
];

export const catIconOptions = [
  { value: 'home', icon: CatHomeIcon, color: '#F58B1E', bgColor: '#F58B1E1A' },
  {
    value: 'crane',
    icon: CatCraneIcon,
    color: '#90C91D',
    bgColor: '#90C91D26',
  },
  {
    value: 'paint',
    icon: CatPaintBrushIcon,
    color: '#24338C',
    bgColor: '#1A57BF1A',
  },
  {
    value: 'skrew',
    icon: CatSkrewDriveIcon,
    color: '#EBB402',
    bgColor: '#EBB4021A',
  },
  { value: 'tool', icon: CatToolIcon, color: '#00A8BF', bgColor: '#00A8BF26' },
];
export const roleIconOptions = [
  { value: 'helmet', icon: HelmetIcon, color: '#24338C', bgColor: '#1A57BF1A' },
  {
    value: 'group',
    icon: PeopleGroupIcon,
    color: '#90C91D',
    bgColor: '#90C91D26',
  },
  {
    value: 'identification-badge',
    icon: UserCardIcon,
    color: '#34AD44',
    bgColor: '#34AD4426',
  },
  {
    value: 'home',
    icon: CatHomeIcon,
    color: '#00A8BF',
    bgColor: '#00A8BF26',
  },
  {
    menu_id: 'templates-management',
    title: SIDEBAR_TITLES.TEMPLATES_MANAGEMENT,
    href: '/templates',
    icon: TemplateIcon,
  },
];
