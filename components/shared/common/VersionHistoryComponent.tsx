import React from 'react';
import VersionHistoryCard from './VersionHistoryCard';

const VersionHistoryComponent: React.FC = () => {
  // Sample version history data
  const versionHistoryData = [
    {
      user: {
        name: 'Guy Hawkins',
        role: 'Employee',
      },
      timestamp: 'Today at 7:15 PM',
      sections: [
        {
          id: 'trade-1',
          title: 'Trade Name',
          changes: [
            {
              type: 'removed' as const,
              label: 'Start Date',
              value: '20/03/2024',
            },
            {
              type: 'added' as const,
              label: 'Start Date',
              value: '30/03/2024',
            },
          ],
        },
        {
          id: 'trade-2',
          title: 'Trade Name / Service Name',
          changes: [
            {
              type: 'removed' as const,
              label: 'Material Name',
              value: 'Shut of valve',
            },
            {
              type: 'added' as const,
              label: 'Material Name',
              value: 'Supply line',
            },
          ],
        },
        {
          id: 'trade-3',
          title: 'Trade Name / Service Name',
          changes: [
            {
              type: 'removed' as const,
              label: 'Material Name',
              value: 'Drain pipe',
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className='w-full h-full'>
      {/* Version History List */}
      <div className='space-y-4'>
        {versionHistoryData.map((entry, index) => (
          <VersionHistoryCard
            key={index}
            user={entry.user}
            timestamp={entry.timestamp}
            sections={entry.sections}
          />
        ))}
      </div>
    </div>
  );
};

export default VersionHistoryComponent;
