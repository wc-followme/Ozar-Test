'use client';

import { TODO_MESSAGES } from '@/constants/common';
import { Edit2 } from 'iconsax-react';
import React, { useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { TodoForm } from '../forms/TodoForm';
import SideSheet from './SideSheet';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskSection {
  id: string;
  title: string;
  date: string;
  tasks: Task[];
}

interface TodoComponentProps {
  className?: string;
}

export const TodoComponent: React.FC<TodoComponentProps> = ({ className }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: 'today',
      title: 'Today',
      date: 'Today',
      tasks: [
        {
          id: 'task-1',
          title: 'Essential Tasks',
          description: 'Get ready for the build.',
          completed: true,
        },
      ],
    },
    {
      id: 'tomorrow-1',
      title: 'Tomorrow',
      date: 'Tomorrow',
      tasks: [
        {
          id: 'task-2',
          title: 'Project Overview',
          description: 'Confirm contractor availability.',
          completed: false,
        },
        {
          id: 'task-3',
          title: 'Project Overview',
          description: 'Schedule the site inspection.',
          completed: false,
        },
        {
          id: 'task-4',
          title: 'Project Overview',
          description: 'Order safety equipment.',
          completed: false,
        },
        {
          id: 'task-5',
          title: 'Project Overview',
          description: 'Prepare materials for the project.',
          completed: false,
        },
      ],
    },
    {
      id: 'tomorrow-2',
      title: 'Tomorrow',
      date: 'Tomorrow',
      tasks: [
        {
          id: 'task-6',
          title: 'Project Overview',
          description: 'Confirm contractor availability.',
          completed: false,
        },
        {
          id: 'task-7',
          title: 'Project Overview',
          description: 'Schedule the site inspection.',
          completed: false,
        },
        {
          id: 'task-8',
          title: 'Project Overview',
          description: 'Order safety equipment.',
          completed: false,
        },
        {
          id: 'task-9',
          title: 'Project Overview',
          description: 'Prepare materials for the project.',
          completed: false,
        },
      ],
    },
    {
      id: 'future',
      title: '20/03/2024',
      date: '20/03/2024',
      tasks: [
        {
          id: 'task-10',
          title: 'Project Overview',
          description: 'Confirm contractor availability.',
          completed: false,
        },
        {
          id: 'task-11',
          title: 'Project Overview',
          description: 'Schedule the site inspection.',
          completed: false,
        },
      ],
    },
  ]);

  const handleTaskToggle = (sectionId: string, taskId: string) => {
    setTaskSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : section
      )
    );
  };

  const handleEditSection = (_: string) => {
    setIsEditSheetOpen(true);
  };

  const handleFormSubmit = () => {
    // Handle form submission for editing the section
    // Here you would typically update the section data
    // For now, just close the sidesheet
    setIsEditSheetOpen(false);
  };

  const handleFormCancel = () => {
    setIsEditSheetOpen(false);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {taskSections.map(({ id: sectionId, title, tasks }) => (
        <div
          key={sectionId}
          className=' bg-[var(--background)] p-3 rounded-[10px]'
        >
          {/* Section Header */}
          <h4 className='text-[var(--text-secondary)] uppercase font-medium text-[12px] leading-[100%] tracking-[0%] mb-2'>
            {title}
          </h4>
          <div className='flex items-center gap-2 w-full mb-4'>
            <div className='flex-1 mr-auto'>
              <p
                className='text-[var(--text-secondary)] font-medium text-[14px] leading-[22px] tracking-[0px] mb-1'
                style={{ fontFamily: 'Inter' }}
              >
                {TODO_MESSAGES.JOB_NAME_PLACEHOLDER}
              </p>
              <p
                className='text-[var(--text-dark)] font-medium text-[16px] leading-[100%] tracking-[0%]'
                style={{ fontFamily: 'Inter' }}
              >
                {tasks[0]?.title}
              </p>
            </div>
            <button
              onClick={() => handleEditSection(sectionId)}
              className='p-1 hover:bg-gray-100 rounded transition-colors'
            >
              <Edit2
                size={20}
                color='var(--text-dark)'
                className='text-gray-500'
              />
            </button>
          </div>

          {/* Tasks */}
          <div className='flex flex-col gap-4'>
            {tasks.map(({ id: taskId, description, completed }) => (
              <Label
                key={taskId}
                className='flex items-center gap-2 cursor-pointer'
              >
                <Checkbox
                  id={taskId}
                  className={`
                     rounded-[6px] 
                     border-2 
                     border-[var(--dark-border-other)]
                     data-[state=checked]:bg-[--primary]
                     data-[state=checked]:border-[var(--primary)]
                     data-[state=checked]:text-white
                     text-[var(--text-dark)] 
                     w-6 h-6
                     flex items-center justify-center -mt-0.4
                     ${completed ? 'bg-blue-600 border-blue-600' : ''}
                   `}
                  checked={completed}
                  onCheckedChange={() => handleTaskToggle(sectionId, taskId)}
                />
                <div className='flex-1'>
                  <p
                    className={`text-sm font-semibold text-[var(--text-dark)] ${
                      completed ? 'line-through' : ''
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </Label>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Toolbar SideSheet */}
      <SideSheet
        title={TODO_MESSAGES.EDIT_TODO_TITLE}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        size='600px'
      >
        <div className='space-y-4'>
          <TodoForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={false}
          />
        </div>
      </SideSheet>
    </div>
  );
};
