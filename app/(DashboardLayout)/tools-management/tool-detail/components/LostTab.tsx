import { DynamicTable } from '@/components/shared/common/DynamicTable';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { APP_CONFIG } from '@/constants/common';
import {
  TABLE_ACTION_TRIGGER_ICON,
  TOOL_ACTIONS,
} from '@/constants/tableactions';
import { TOOL_DETAIL_LOST_COLUMNS } from '@/constants/tablecolumns';
import { ToolItemDetail } from '@/lib/api';
import React from 'react';
import TableSkeleton from '../../../../../components/shared/skeleton/TableSkeleton';
import { TransformedRowData } from '../types';

interface LostTabProps {
  data: ToolItemDetail[];
  loading: boolean;
  onDropdownAction: (action: string, row: TransformedRowData) => void;
}

export const LostTab: React.FC<LostTabProps> = ({
  data,
  loading,
  onDropdownAction,
}) => {
  // Transform API data to UI format
  const transformData = (apiData: ToolItemDetail[]) => {
    return apiData.map(item => {
      // Destructure item properties for cleaner access
      const {
        uuid,
        id,
        barcode,
        assignedBy,
        assignedJob,
        due_date,
        condition,
        status,
        issue,
        lost_date,
      } = item;

      // Destructure returnedBy for cleaner access
      const {
        name: assignedByName,
        profile_picture_url,
        designation,
        id: assignedById,
      } = assignedBy || {};

      // Destructure assignedJob for cleaner access
      const { project_id: assignedJobName, uuid: assignedJobId } =
        assignedJob || {};

      // Destructure avatar URL construction for better readability
      const avatarUrl = profile_picture_url
        ? `${APP_CONFIG.CDN_URL}${profile_picture_url}`
        : '';

      // Destructure condition formatting for better readability
      const formattedCondition = condition
        ? condition.charAt(0).toUpperCase() + condition.slice(1)
        : '-';

      // Destructure status formatting for better readability
      const formattedStatus = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : '-';

      return {
        id: uuid || '-',
        toolId: id?.toString() || '-',
        barcode: barcode || '-',
        assignedTo: {
          name: assignedByName || 'Available',
          avatar: avatarUrl,
          id: assignedById,
        },
        employeeType: designation || '',
        assignedJob: assignedJobName || 'Not Assigned',
        assignedJobId: assignedJobId || '-',
        dueDate: due_date || '-',
        lostDate: lost_date || '-',
        condition: formattedCondition,
        assignedStatus: formattedStatus,
        issue: issue || '-',
      };
    });
  };

  const transformedData = transformData(data);

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showActions={true} />;
  }

  if (transformedData.length === 0) {
    return (
      <NoDataFound title='No Lost Tools' description='No lost tools found.' />
    );
  }

  // Destructure table action configuration for better readability
  const lostTableActions = [
    {
      key: 'more',
      icon: TABLE_ACTION_TRIGGER_ICON,
      iconClassName: 'text-gray-600 hover:text-gray-800 !h-5 !w-5',
      isDropdown: true,
      dropdownOptions: TOOL_ACTIONS.lost,
      onDropdownAction: (action: string, row: any) => {
        // The row is already the transformed data
        onDropdownAction(action, row);
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
  ];

  // Destructure table configuration for better readability
  const tableConfig = {
    headerBgColor: 'bg-[var(--background)]',
    borderColor: 'border-[var(--border-dark)]',
    hoverColor: 'hover:bg-[var(--background-light)]',
  };

  const tableClassName =
    'lg:max-w-[calc(100vw_-_192px)] md:max-w-[calc(100vw_-_114px)] max-w-[calc(100vw_-_80px)]';

  return (
    <DynamicTable
      data={transformedData}
      columns={TOOL_DETAIL_LOST_COLUMNS}
      actions={lostTableActions}
      emptyMessage='No lost tools found'
      showRowNumbers={false}
      tableConfig={tableConfig}
      className={tableClassName}
    />
  );
};
