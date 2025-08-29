'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { WorkflowListCard } from '@/components/shared/cards/WorkflowListCard';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sortable } from '@/components/ui/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

// Poll Planning Tab Values
const POLL_TABS = {
  PENDING_POLL: 'pendingPoll',
  AWAITING_RESPONSE: 'awaitingResponse',
} as const;

interface PollEntry {
  id: string;
  roomName: string;
  trade: string;
  startDate: string;
  endDate: string;
  status: 'Done' | 'InProgress' | 'Pending';
  servicesCount: number;
  isExpanded?: boolean;
  assignedUsers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
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

export default function PollPlanning() {
  const [selectedTab, setSelectedTab] = useState<string>(
    POLL_TABS.PENDING_POLL
  );
  const [pollName, setPollName] = useState<string>('');
  const [expandedPolls, setExpandedPolls] = useState<Set<string>>(
    new Set(['2'])
  ); // Second poll expanded by default
  const [isDragging, setIsDragging] = useState(false);

  // Mock data for poll entries
  const [pollEntries, setPollEntries] = useState<PollEntry[]>([
    {
      id: '1',
      roomName: 'Bed Room 1',
      trade: 'Plumbing',
      startDate: '05/03/2024',
      endDate: '16/08/2024',
      status: 'Pending',
      servicesCount: 3,
      assignedUsers: [
        { id: '1', name: 'John Deo', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Max Henry', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mark Morris',
          image: '/images/placeholder-user.jpg',
        },
        {
          id: '4',
          name: 'Peter Mark',
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
      status: 'Pending',
      servicesCount: 5,
      isExpanded: true,
      assignedUsers: [
        { id: '1', name: 'John Deo', image: '/images/placeholder-user.jpg' },
        { id: '2', name: 'Max Henry', image: '/images/placeholder-user.jpg' },
        {
          id: '3',
          name: 'Mark Morris',
          image: '/images/placeholder-user.jpg',
        },
        {
          id: '4',
          name: 'Peter Mark',
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
          ],
        },
        {
          id: '4',
          name: 'Install Sink',
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
          ],
        },
        {
          id: '5',
          name: 'Install Faucet',
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
      status: 'Pending',
      servicesCount: 3,
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
      status: 'Pending',
      servicesCount: 3,
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
      status: 'Pending',
      servicesCount: 3,
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

  // Mock data for awaited response entries (different data)
  const [awaitedResponseEntries, setAwaitedResponseEntries] = useState<
    PollEntry[]
  >([
    {
      id: 'awaiting-1',
      roomName: 'Kitchen',
      trade: 'Electrical',
      startDate: '10/03/2024',
      endDate: '20/03/2024',
      status: 'InProgress',
      servicesCount: 4,
      assignedUsers: [
        {
          id: '1',
          name: 'Alex Johnson',
          image: '/images/placeholder-user.jpg',
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          image: '/images/placeholder-user.jpg',
        },
        { id: '3', name: 'David Brown', image: '/images/placeholder-user.jpg' },
      ],
      subServices: [
        {
          id: 'awaiting-service-1',
          name: 'Install Outlets',
          assignedUsers: [
            {
              id: '1',
              name: 'Alex Johnson',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Sarah Wilson',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: 'awaiting-service-2',
          name: 'Install Lighting',
          assignedUsers: [
            {
              id: '2',
              name: 'Sarah Wilson',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'David Brown',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: 'awaiting-service-3',
          name: 'Install Switches',
          assignedUsers: [
            {
              id: '1',
              name: 'Alex Johnson',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'David Brown',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: 'awaiting-service-4',
          name: 'Install Panel',
          assignedUsers: [
            {
              id: '1',
              name: 'Alex Johnson',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '2',
              name: 'Sarah Wilson',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '3',
              name: 'David Brown',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
      ],
    },
    {
      id: 'awaiting-2',
      roomName: 'Living Room',
      trade: 'HVAC',
      startDate: '12/03/2024',
      endDate: '25/03/2024',
      status: 'Pending',
      servicesCount: 3,
      assignedUsers: [
        { id: '4', name: 'Emily Davis', image: '/images/placeholder-user.jpg' },
        {
          id: '5',
          name: 'Michael Chen',
          image: '/images/placeholder-user.jpg',
        },
      ],
      subServices: [
        {
          id: 'awaiting-service-5',
          name: 'Install Ductwork',
          assignedUsers: [
            {
              id: '4',
              name: 'Emily Davis',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: 'awaiting-service-6',
          name: 'Install Vents',
          assignedUsers: [
            {
              id: '5',
              name: 'Michael Chen',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
        {
          id: 'awaiting-service-7',
          name: 'Install Thermostat',
          assignedUsers: [
            {
              id: '4',
              name: 'Emily Davis',
              image: '/images/placeholder-user.jpg',
            },
            {
              id: '5',
              name: 'Michael Chen',
              image: '/images/placeholder-user.jpg',
            },
          ],
        },
      ],
    },
  ]);

  const togglePollExpansion = (pollId: string) => {
    setExpandedPolls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pollId)) {
        newSet.delete(pollId);
      } else {
        newSet.add(pollId);
      }
      return newSet;
    });
  };

  const handleSaveAsDraft = () => {
    // Handle save as draft action
    console.log('Save as Draft clicked');
  };

  const handleStartPollPlanning = () => {
    // Handle start poll planning action
    console.log('Start Poll Planning clicked');
  };

  const handleEditService = (serviceId: string) => {
    // Handle edit service action
    console.log('Edit service clicked:', serviceId);
  };

  const handleApproveService = (serviceId: string) => {
    // Handle approve service action
    console.log('Approve service clicked:', serviceId);
  };

  const handleServiceReorder = (
    pollId: string,
    reorderedServices:
      | Array<{
          id: string;
          name: string;
          assignedUsers: Array<{
            id: string;
            name: string;
            image: string;
          }>;
        }>
      | undefined
  ) => {
    // Handle service reordering for a specific poll
    console.log('Services reordered for poll:', pollId, reorderedServices);

    if (!reorderedServices) return;

    // Update the poll entries with the reordered services
    setPollEntries(prevEntries =>
      prevEntries.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            subServices: reorderedServices,
          };
        }
        return poll;
      })
    );
  };

  const handleAwaitedServiceReorder = (
    pollId: string,
    reorderedServices:
      | Array<{
          id: string;
          name: string;
          assignedUsers: Array<{
            id: string;
            name: string;
            image: string;
          }>;
        }>
      | undefined
  ) => {
    // Handle service reordering for awaited response polls
    console.log(
      'Awaited services reordered for poll:',
      pollId,
      reorderedServices
    );

    if (!reorderedServices) return;

    // Update the awaited response entries with the reordered services
    setAwaitedResponseEntries(prevEntries =>
      prevEntries.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            subServices: reorderedServices,
          };
        }
        return poll;
      })
    );
  };

  const handlePollReorder = (reorderedPolls: PollEntry[]) => {
    // Handle poll reordering for pending polls
    console.log('Polls reordered:', reorderedPolls);
    setPollEntries(reorderedPolls);
  };

  const handleAwaitedPollReorder = (reorderedPolls: PollEntry[]) => {
    // Handle poll reordering for awaited response polls
    console.log('Awaited polls reordered:', reorderedPolls);
    setAwaitedResponseEntries(reorderedPolls);
  };

  // Use all poll entries since search is removed
  const filteredPollEntries = pollEntries;

  // Breadcrumb data
  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Projects', href: '/projects' },
    { name: 'Job#789', href: '/job-management' },
    { name: 'Poll Planning' }, // current page
  ];

  // Global drag state listener
  useEffect(() => {
    const handleGlobalDragStart = () => {
      setIsDragging(true);
      alert('Drag started! DetailBoxComponent sub-services should be hidden.');
    };

    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      alert(
        'Drag ended! DetailBoxComponent sub-services should be visible again.'
      );
    };

    // Listen for drag events on the document
    document.addEventListener('dragstart', handleGlobalDragStart);
    document.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart);
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, []);

  return (
    <div className=''>
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbData} className='mb-6' />

      {/* Main Content Card */}
      <div className='bg-[var(--white-background)] rounded-xl border border-[var(--border-light)] p-6'>
        {/* Header with Poll Name and Tabs */}
        <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex-1 max-w-md'>
            <Label
              htmlFor='pollName'
              className='text-sm font-medium text-[var(--text-dark)] mb-2 block'
            >
              Poll Name
            </Label>
            <Input
              id='pollName'
              value={pollName}
              onChange={e => setPollName(e.target.value)}
              placeholder='Enter name'
              className='input-field border-[var(--border-dark)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'
            />
          </div>

          {/* Tabs moved to the right */}
          <div className='flex-shrink-0'>
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className='w-full'
            >
              <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                <TabsTrigger
                  value={POLL_TABS.PENDING_POLL}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm xl:text-base'>Pending Poll</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={POLL_TABS.AWAITING_RESPONSE}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm xl:text-base'>
                      Awaiting Response
                    </span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tabs Component with Content */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          {/* Tab Content */}
          <TabsContent value={POLL_TABS.PENDING_POLL} className='mt-6'>
            <div className='space-y-4'>
              {filteredPollEntries.length === 0 ? (
                <NoDataFound
                  title='No Polls Found'
                  description='No polls have been created yet. Start by creating your first poll.'
                  showButton={false}
                />
              ) : (
                <div className='relative'>
                  <Sortable
                    items={filteredPollEntries}
                    onReorder={handlePollReorder}
                    idField='id'
                  >
                    <div className='space-y-4 pl-8'>
                      {filteredPollEntries.map((poll, index) => (
                        <SortableItem key={poll.id} id={poll.id}>
                          {(dragHandleProps: any) => (
                            <div className='relative'>
                              {/* Sectioned Vertical Green Bar for each poll - hidden for last child */}
                              {index < filteredPollEntries.length - 1 && (
                                <div className='absolute -left-[34px] top-10 w-2 bg-[#34AD44] h-[calc(100%+10px)]'></div>
                              )}

                              {/* Bigger Green Circle on the bar */}
                              <div className='absolute -left-10 top-6 w-5 h-5 bg-[#34AD44] rounded-full border-3 border-white shadow-md'></div>

                              <WorkflowListCard
                                workflowItem={{
                                  id: poll.id,
                                  roomName: poll.roomName,
                                  trade: poll.trade,
                                  startDate: poll.startDate,
                                  endDate: poll.endDate,
                                  status: poll.status,
                                  servicesCount: poll.servicesCount,
                                  assignedUsers: poll.assignedUsers,
                                  isSelected: false,
                                  isExpanded: expandedPolls.has(poll.id),
                                  subServices: poll.subServices || [],
                                }}
                                onToggleExpand={togglePollExpansion}
                                showDragHandle={true}
                                onServiceReorder={reorderedServices =>
                                  handleServiceReorder(
                                    poll.id,
                                    reorderedServices
                                  )
                                }
                                showCardDragHandle={true}
                                cardDragHandleProps={dragHandleProps}
                                isDragging={isDragging}
                              />
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </div>
                  </Sortable>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={POLL_TABS.AWAITING_RESPONSE} className='mt-6'>
            <div className='space-y-4'>
              {awaitedResponseEntries.length === 0 ? (
                <NoDataFound
                  title='No Polls Found'
                  description='No polls have been created yet. Start by creating your first poll.'
                  showButton={false}
                />
              ) : (
                <div className='relative'>
                  <Sortable
                    items={awaitedResponseEntries}
                    onReorder={handleAwaitedPollReorder}
                    idField='id'
                  >
                    <div className='pl-8'>
                      {awaitedResponseEntries.map((poll, index) => (
                        <SortableItem key={poll.id} id={poll.id}>
                          {(dragHandleProps: any) => (
                            <div className='relative'>
                              {/* Sectioned Vertical Green Bar for each poll - hidden for last child */}
                              {index < awaitedResponseEntries.length - 1 && (
                                <div className='absolute -left-[34px] top-10 w-2 bg-[#34AD44] h-[calc(100%)]'></div>
                              )}

                              {/* Bigger Green Circle on the bar */}
                              <div className='absolute -left-10 top-6 w-5 h-5 bg-[#34AD44] rounded-full border-3 border-white'></div>

                              <WorkflowListCard
                                workflowItem={{
                                  id: poll.id,
                                  roomName: poll.roomName,
                                  trade: poll.trade,
                                  startDate: poll.startDate,
                                  endDate: poll.endDate,
                                  status: poll.status,
                                  servicesCount: poll.servicesCount,
                                  assignedUsers: poll.assignedUsers,
                                  isSelected: false,
                                  isExpanded: expandedPolls.has(poll.id),
                                  subServices: poll.subServices || [],
                                }}
                                onToggleExpand={togglePollExpansion}
                                showDragHandle={true}
                                onServiceReorder={reorderedServices =>
                                  handleAwaitedServiceReorder(
                                    poll.id,
                                    reorderedServices
                                  )
                                }
                                showCardDragHandle={true}
                                cardDragHandleProps={dragHandleProps}
                              />
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </div>
                  </Sortable>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Action Buttons */}
        <div className='mt-6 flex justify-end gap-3'>
          <Button
            onClick={handleSaveAsDraft}
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100'
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleStartPollPlanning}
            className='btn-primary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100'
          >
            Start Poll Planning
          </Button>
        </div>
      </div>
    </div>
  );
}
