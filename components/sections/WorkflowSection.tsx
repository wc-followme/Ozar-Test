'use client';

import { Search } from '@/components/icons/Search';
import { WorkflowListCard } from '@/components/shared/cards/WorkflowListCard';
import { Dropdown } from '@/components/shared/common/Dropdown';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowDown2, Clock, Play, TickCircle, Warning2 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DraftIcon } from '../icons/DraftIcon';
import { UserCheckedIcon } from '../icons/UserCheckedIcon';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  description: string;
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedDuration?: string;
}

interface WorkflowItem {
  id: string;
  roomName: string;
  trade: string;
  startDate: string;
  endDate: string;
  status: 'Done' | 'InProgress' | 'Pending';
  servicesCount: number;
  assignedUsers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  isSelected: boolean;
  isExpanded?: boolean;
  subServices?: Array<{
    id: string;
    name: string;
    assignedUsers: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  }>;
}

interface WorkflowSectionProps {
  workflowSteps: WorkflowStep[];
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  onAddStep?: () => void;
  onEditStep?: (stepId: string) => void;
  onCompleteStep?: (stepId: string) => void;
  onPauseStep?: (stepId: string) => void;
  onResumeStep?: (stepId: string) => void;
}

const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  workflowSteps,
  currentStep,
  onStepClick,
  onAddStep,
  onEditStep,
  onCompleteStep,
  onPauseStep,
  onResumeStep,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflowItems, setSelectedWorkflowItems] = useState<
    Set<string>
  >(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock workflow data based on the image
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([
    {
      id: '1',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Done',
      servicesCount: 3,
      isSelected: true,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
    },
    {
      id: '2',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Done',
      servicesCount: 5,
      isSelected: true,
      isExpanded: true,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
      subServices: [
        {
          id: '1',
          name: 'Install Shower',
          assignedUsers: [
            {
              id: '1',
              name: 'John Doe',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Jane Smith',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'Mike Johnson',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: '2',
          name: 'Install Tub',
          assignedUsers: [
            {
              id: '1',
              name: 'John Doe',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Jane Smith',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'Mike Johnson',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: '3',
          name: 'Install Toilet',
          assignedUsers: [
            {
              id: '1',
              name: 'John Doe',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Jane Smith',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'Mike Johnson',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: '4',
          name: 'Install Toilet',
          assignedUsers: [
            {
              id: '1',
              name: 'John Doe',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Jane Smith',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'Mike Johnson',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Done',
      servicesCount: 3,
      isSelected: false,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
    },
    {
      id: '4',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'InProgress',
      servicesCount: 3,
      isSelected: false,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
    },
    {
      id: '5',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Done',
      servicesCount: 3,
      isSelected: false,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
    },
    {
      id: '6',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Done',
      servicesCount: 3,
      isSelected: false,
      assignedUsers: [
        { id: '1', name: 'John Doe', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mike Johnson',
          image: '/images/placeholder-user.jpg',
        },
      ],
    },
  ]);

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <TickCircle className='w-5 h-5 text-green-500' />;
      case 'in-progress':
        return <Play className='w-5 h-5 text-blue-500' />;
      case 'pending':
        return <Clock className='w-5 h-5 text-gray-400' />;
      case 'blocked':
        return <Warning2 className='w-5 h-5 text-red-500' />;
      default:
        return <Clock className='w-5 h-5 text-gray-400' />;
    }
  };

  const getStatusBadge = (status: WorkflowStep['status']) => {
    const statusConfig = {
      completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800',
      },
      'in-progress': {
        label: 'In Progress',
        className: 'bg-blue-100 text-blue-800',
      },
      pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800' },
      blocked: { label: 'Blocked', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.className} text-xs font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getProgressPercentage = () => {
    if (workflowSteps.length === 0) return 0;
    const completedSteps = workflowSteps.filter(
      step => step.status === 'completed'
    ).length;
    return Math.round((completedSteps / workflowSteps.length) * 100);
  };

  const handleSelectionChange = (id: string, selected: boolean) => {
    setWorkflowItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isSelected: selected } : item
      )
    );
  };

  const handleToggleExpand = (id: string) => {
    setWorkflowItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    // Handle quick actions here
    switch (action) {
      case 'draft-pole':
        // Handle draft pole action
        console.log('Draft pole clicked');
        break;
      case 'pole-planning':
        // Navigate to poll planning page
        router.push('/job-management/poll-planning');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Filter workflow items based on search
  const filteredWorkflowItems = workflowItems.filter(
    item =>
      item.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      {/* Header Section with Search and Quick Actions */}
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
        <div className='relative sm:flex-initial'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]' />
          <Input
            placeholder='Search here...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 lg:w-[360px] w-full h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
          />
        </div>

        {/* Quick Actions Dropdown */}
        <div className='flex justify-end'>
          <Dropdown
            trigger={
              <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-base text-[var(--text-dark)] hover:border-gray-300 hover:shadow-sm cursor-pointer w-auto transition-all duration-200'>
                <span className='font-medium'>Quick Actions</span>
                <ArrowDown2
                  className='w-4 h-4 [&>path]:stroke-2'
                  color='var(--text-dark)'
                />
              </div>
            }
            menuOptions={[
              {
                label: 'Draft Pole',
                action: 'draft-pole',
                icon: DraftIcon,
              },
              {
                label: 'Pole Planning',
                action: 'pole-planning',
                icon: UserCheckedIcon,
              },
            ]}
            onAction={handleQuickAction}
          />
        </div>
      </div>

      {/* Workflow List */}
      <div className='space-y-4'>
        {filteredWorkflowItems.length === 0 ? (
          <Card className='p-8 text-center bg-[var(--card-background)] border border-[var(--border-dark)]'>
            <Clock className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-[var(--text-secondary)] mb-4'>
              No workflow items found
            </p>
          </Card>
        ) : (
          <div className='space-y-3'>
            {filteredWorkflowItems.map(item => (
              <div key={item.id} className='flex items-center gap-4'>
                {/* Selection Checkbox */}
                <div className='flex-shrink-0'>
                  <Checkbox
                    id={`workflow-${item.id}`}
                    checked={item.isSelected}
                    onCheckedChange={checked =>
                      handleSelectionChange(item.id, checked as boolean)
                    }
                    className='rounded-full border-2 border-[#90C91D] data-[state=checked]:bg-[#90C91D] data-[state=checked]:border-[#90C91D] data-[state=checked]:text-white text-white w-5 h-5 flex items-center justify-center'
                  />
                </div>

                {/* Workflow Card */}
                <div className='flex-1'>
                  <WorkflowListCard
                    workflowItem={item}
                    onToggleExpand={handleToggleExpand}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowSection;
