import { Home, Icon } from 'iconsax-react';
import { Category } from './../components/icons/Category';
import { Company } from './../components/icons/Company';
import { JobIcon } from './../components/icons/JobIcon';
import { Material } from './../components/icons/Material';
import { RoleIcon } from './../components/icons/RoleIcon';
import { Tool } from './../components/icons/Tool';
import { Trade } from './../components/icons/Trade';

// Common icon options for roles and other modules
import { CircleUsersStarIcon } from '../components/icons/CircleUsersStarIcon';
import { Service } from '../components/icons/Service';

// Sidebar title constants
export const SIDEBAR_TITLES = {
  HOME: 'Home',
  PROJECTS: 'Projects',
  ROLES_ACCOUNTS: 'Roles & Accounts',
  COMPANY_MANAGEMENT: 'Company Management',
  CATALOGUE_MANAGEMENT: 'Catalogue Management',
  TEMPLATES_MANAGEMENT: 'Templates Management',
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
  CATEGORIES: 'categories',
  ROLES: 'roles',
  USERS: 'users',
  COMPANIES: 'companies',
  TRADES: 'trades',
  SERVICES: 'services',
  MATERIALS: 'materials',
  TOOLS: 'tools',
  JOBS: 'jobs',
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
  icon: Icon;
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
    icon: CircleUsersStarIcon,
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
        icon: PeopleGroupIcon,
      },
      {
        menu_id: 'portal-users',
        title: SIDEBAR_TITLES.PORTAL_USERS,
        href: '/users',
        icon: UserCardIcon,
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
    icon: CatPaintBrushIcon,
  },
];
