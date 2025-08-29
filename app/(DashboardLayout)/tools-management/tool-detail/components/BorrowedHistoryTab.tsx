'use client';

import { DynamicTable } from '@/components/shared/common/DynamicTable';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { APP_CONFIG } from '@/constants/common';
import TableSkeleton from '../../../../../components/shared/skeleton/TableSkeleton';
import { TOOL_HISTORY_BORROWED_COLUMNS } from '../../../../../constants/tablecolumns';

interface BorrowedHistoryTabProps {
  data: any[];
  loading: boolean;
}

export default function BorrowedHistoryTab({
  data,
  loading,
}: BorrowedHistoryTabProps) {
  const transformBorrowedData = (apiData: any[]) => {
    return apiData.map(item => {
      // Destructure item properties for cleaner access
      const {
        uuid,
        borrowed_date: borrowedDate,
        borrowedBy,
        assignedJob,
      } = item;

      // Destructure borrowedBy for cleaner access
      const {
        name: borrowedByName,
        profile_picture_url: profilePictureUrl,
        designation,
      } = borrowedBy || {};

      // Destructure assignedJob for cleaner access
      const { project_id: assignedJobName } = assignedJob || {};

      // Destructure avatar URL construction for better readability
      const avatarUrl = profilePictureUrl
        ? `${APP_CONFIG.CDN_URL}${profilePictureUrl}`
        : '';

      return {
        id: uuid || '-',
        borrowedBy: {
          name: borrowedByName || 'Unknown',
          avatar: avatarUrl,
        },
        employeeType: designation || 'Employee',
        assignedJob: assignedJobName || 'Not Assigned',
        borrowedDate: borrowedDate || '-',
      };
    });
  };

  const transformedData = transformBorrowedData(data);

  if (loading) {
    return <TableSkeleton columns={3} rows={6} showActions={false} />;
  }

  if (transformedData.length === 0) {
    return (
      <NoDataFound
        title='No Borrowed History'
        description='No borrowed history found.'
      />
    );
  }

  return (
    <DynamicTable
      columns={TOOL_HISTORY_BORROWED_COLUMNS}
      data={transformedData}
      emptyMessage='No borrowed history found'
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
