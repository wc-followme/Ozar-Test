import { CatCraneIcon } from '@/components/icons/CatCraneIcon';
import { CatHomeIcon } from '@/components/icons/CatHomeIcon';
import { CatPaintBrushIcon } from '@/components/icons/CatPaintBrushIcon';
import { CatSkrewDriveIcon } from '@/components/icons/CatSkrewDriveIcon';
import { CatToolIcon } from '@/components/icons/CatToolIcon';
import { HelmetIcon } from '@/components/icons/HelmetIcon';
import { PeopleGroupIcon } from '@/components/icons/PeopleGroupIcon';
import { UserCardIcon } from '@/components/icons/UserCardIcon';

export type CatIconOption = {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
};

export type RoleIconOption = {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
};

export const catIconOptions: CatIconOption[] = [
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
  {
    value: 'tool',
    icon: CatToolIcon,
    color: '#00A8BF',
    bgColor: '#00A8BF26',
  },
];

export const roleIconOptions: RoleIconOption[] = [
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
];
