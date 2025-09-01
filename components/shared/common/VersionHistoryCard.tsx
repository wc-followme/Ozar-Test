import {
  ChevronDown,
  ChevronRight,
  Minus,
  MoreVertical,
  Plus,
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { Dropdown } from './Dropdown';

interface ChangeItem {
  type: 'removed' | 'added';
  label: string;
  value: string;
}

interface ChangeSection {
  id: string;
  title: string;
  subtitle?: string;
  changes: ChangeItem[];
}

interface VersionHistoryCardProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  sections: ChangeSection[];
}

const VersionHistoryCard: React.FC<VersionHistoryCardProps> = ({
  user,
  timestamp,
  sections,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDropdownAction = (action: string) => {
    console.log('Dropdown action:', action);
    // Add your dropdown action functionality here
  };

  return (
    <div className='bg-[#F5F7FA] rounded-[10px] shadow-sm p-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <button
          onClick={toggleExpanded}
          className='flex items-center flex-1 gap-3 text-left cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors'
        >
          <Avatar
            name={user.name}
            height={30}
            width={30}
            className='flex-shrink-0 rounded-full text-xs'
          />
          <div>
            <div className='font-medium text-[var(--text-dark)] text-sm'>
              {user.name}
            </div>
            <div className='text-xs text-[var(--text-dark)] font-medium'>
              {user.role}
            </div>
          </div>
          <span className='text-sm text-[var(--text-secondary)] ml-auto'>
            {timestamp}
          </span>
        </button>
        <div className='flex items-center gap-2'>
          <Dropdown
            trigger={
              <button className='p-1 hover:bg-gray-100 rounded'>
                <MoreVertical
                  size={22}
                  className='text-[var(--text-secondary)]'
                  color='var(--text-dark)'
                />
              </button>
            }
            menuOptions={[
              {
                label: 'View Details',
                action: 'view-details',
                icon: ChevronRight,
              },
              {
                label: 'Compare Changes',
                action: 'compare-changes',
                icon: ChevronDown,
              },
              {
                label: 'Export',
                action: 'export',
                icon: Plus,
              },
            ]}
            onAction={handleDropdownAction}
          />
        </div>
      </div>

      {/* Content Sections */}
      {isExpanded && (
        <div className='space-y-3 bg-[var(--card-background)] border-[#E8EAED] rounded-md p-3 mt-4'>
          {sections.map(section => (
            <div
              key={section.id}
              className='rounded border border-[var(--border-dark)] p-[10px]'
            >
              {/* Section Header */}
              <div className='mb-3'>
                <div className='text-xs text-[var(--text-secondary)]'>
                  {section.title}
                </div>
                {section.subtitle && (
                  <div className='text-sm text-[var(--text-secondary)]'>
                    {section.subtitle}
                  </div>
                )}
              </div>

              {/* Section Content */}
              <div className=''>
                {section.changes.map((change, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 ${
                      change.type === 'removed'
                        ? 'bg-[#D4323226]'
                        : 'bg-[#34AD4426]'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        change.type === 'removed'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {change.type === 'removed' ? (
                        <Minus size={12} className='text-white' />
                      ) : (
                        <Plus size={12} className='text-white' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <span className='text-sm font-medium text-[var(--text-dark)]'>
                        {change.label}:
                      </span>
                      <span className='text-sm text-[var(--text-dark)] ml-1'>
                        {change.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryCard;
