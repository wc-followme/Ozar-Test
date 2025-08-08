import { Home, Icon } from 'iconsax-react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { TemplateIcon } from './../components/icons/TemplateIcon';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

// Common icon options for roles and other modules
import { CircleUsersStarIcon } from '../components/icons/CircleUsersStarIcon';
import { Service } from '../components/icons/Service';

// Sidebar title constants
export const SIDEBAR_TITLES = {
  HOME: 'Home',
  JOBS: 'Jobs',
  ROLE_MANAGEMENT: 'Role Management',
  USER_MANAGEMENT: 'Employee Management',
  COMPANY_MANAGEMENT: 'Company Management',
  CATEGORY_MANAGEMENT: 'Category Management',
  TRADE_MANAGEMENT: 'Trade Management',
  SERVICE_MANAGEMENT: 'Service Management',
  MATERIAL_MANAGEMENT: 'Material Management',
  TOOLS_MANAGEMENT: 'Tools Management',
  TEMPLATES_MANAGEMENT: 'Templates Management',
} as const;

// Permission categories constants
export const PERMISSION_CATEGORIES = {
  CATEGORIES: 'categories',
  ROLES: 'roles',
  USERS: 'users',
  COMPANIES: 'companies',
  TRADES: 'trades',
  SERVICES: 'services',
  MATERIALS: 'materials',
  TOOLS: 'tools',
  JOBS: 'jobs',
  TEMPLATES: 'templates',
} as const;

// Permission actions constants
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
} as const;

type SidebarMenuItem = {
  menu_id: string;
  title: string;
  href: string;
  icon: Icon;
};

export const sidebarItems: SidebarMenuItem[] = [
  {
    menu_id: 'home',
    title: SIDEBAR_TITLES.HOME,
    href: '/',
    icon: Home,
  },
  {
    menu_id: 'jobs',
    title: SIDEBAR_TITLES.JOBS,
    href: '/job-management',
    icon: JobIcon,
  },
  {
    menu_id: 'role-management',
    title: SIDEBAR_TITLES.ROLE_MANAGEMENT,
    href: '/role-management',
    icon: RoleIcon,
  },
  {
    menu_id: 'user-management',
    title: SIDEBAR_TITLES.USER_MANAGEMENT,
    href: '/user-management',
    icon: CircleUsersStarIcon,
  },
  {
    menu_id: 'company-management',
    title: SIDEBAR_TITLES.COMPANY_MANAGEMENT,
    href: '/company-management',
    icon: Company,
  },
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
  {
    menu_id: 'templates-management',
    title: SIDEBAR_TITLES.TEMPLATES_MANAGEMENT,
    href: '/templates',
    icon: TemplateIcon,
  },
];
