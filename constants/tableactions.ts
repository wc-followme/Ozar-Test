import { AssignIcon } from '@/components/icons/AssignIcons';
import { DetailsIcon } from '@/components/icons/DetailsIcon';
import { ReturnIcon } from '@/components/icons/ReturnIcon';
import { IconDotsVertical } from '@tabler/icons-react';
import { Danger, Edit2, Setting2, ShieldTick } from 'iconsax-react';
import React from 'react';

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
}>;

export interface TableActionOption {
  label: string;
  action: string;
  icon: IconComponent;
}

export const TABLE_ACTION_TRIGGER_ICON: IconComponent = IconDotsVertical;

export const TOOL_ACTIONS: Record<
  'available' | 'assigned' | 'maintenance' | 'lost',
  TableActionOption[]
> = {
  available: [
    { label: 'Assign', action: 'assign', icon: AssignIcon },
    { label: 'Maintenance', action: 'maintenance', icon: Setting2 },
    { label: 'Lost', action: 'lost', icon: Danger },
    { label: 'Details', action: 'details', icon: DetailsIcon },
  ],
  assigned: [
    { label: 'Return', action: 'return', icon: ReturnIcon },
    { label: 'Maintenance', action: 'maintenance', icon: Setting2 },
    { label: 'Lost', action: 'lost', icon: Danger },
    { label: 'Details', action: 'details', icon: DetailsIcon },
  ],
  maintenance: [
    { label: 'Available', action: 'available', icon: ShieldTick },
    { label: 'Lost', action: 'lost', icon: Danger },
    { label: 'Details', action: 'details', icon: DetailsIcon },
  ],
  lost: [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Details', action: 'details', icon: DetailsIcon },
  ],
};
