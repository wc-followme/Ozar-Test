'use client';

import { DynamicTable } from '@/components/shared/common/DynamicTable';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { APP_CONFIG } from '@/constants/common';
import { TOOL_HISTORY_MAINTENANCE_COLUMNS } from '@/constants/tablecolumns';
import TableSkeleton from '../../../../../components/shared/skeleton/TableSkeleton';

interface MaintenanceHistoryTabProps {
  data: any[];
  loading: boolean;
}

export default function MaintenanceHistoryTab({
  data,
  loading,
}: MaintenanceHistoryTabProps) {
  const transformMaintenanceData = (apiData: any[]) => {
    return apiData.map(item => {
      const {
        uuid,
        assigned_date: assignedDate,
        issue,
        returnedBy,
        assignedJob,
      } = item;

      // Destructure returnedBy for cleaner access
      const {
        name: returnedByName,
        profile_picture_url: profilePictureUrl,
        designation,
      } = returnedBy || {};

      // Destructure assignedJob for cleaner access
      const { project_id: assignedJobName } = assignedJob || {};

      // Destructure avatar URL construction for better readability
      const avatarUrl = profilePictureUrl
        ? `${APP_CONFIG.CDN_URL}${profilePictureUrl}`
        : '';

      return {
        id: uuid || '-',
        returnedBy: {
          name: returnedByName || '',
          avatar: avatarUrl,
        },
        employeeType: designation || 'Employee',
        assignedJob: assignedJobName || 'Not Assigned',
        assignedDate: assignedDate || '-',
        issue: issue || '-',
      };
    });
  };

  const transformedData = transformMaintenanceData(data);

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showActions={false} />;
  }

  if (transformedData.length === 0) {
    return (
      <NoDataFound
        title='No Maintenance History'
        description='No maintenance history found.'
      />
    );
  }

  return (
    <DynamicTable
      columns={TOOL_HISTORY_MAINTENANCE_COLUMNS}
      data={transformedData}
      emptyMessage='No maintenance history found'
      showRowNumbers={false}
      tableConfig={{
        headerBgColor: 'bg-[var(--background)]',
        borderColor: 'border-[var(--border-dark)]',
        hoverColor: 'hover:bg-[var(--background-light)]',
      }}
      className='max-w-[calc(100vw_-_80px)]'
    />
  );
}
