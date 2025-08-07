import { CatCraneIcon } from '@/components/icons/CatCraneIcon';
import { CatHomeIcon } from '@/components/icons/CatHomeIcon';
import { CatPaintBrushIcon } from '@/components/icons/CatPaintBrushIcon';
import { CatSkrewDriveIcon } from '@/components/icons/CatSkrewDriveIcon';
import { CatToolIcon } from '@/components/icons/CatToolIcon';

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
  {
    value: 'tool',
    icon: CatToolIcon,
    color: '#00A8BF',
    bgColor: '#00A8BF26',
  },
];
