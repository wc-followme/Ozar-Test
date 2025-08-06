'use client';

import { TODO_MESSAGES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Edit2 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { TodoForm } from '../forms/TodoForm';
import SideSheet from './SideSheet';

interface TodoItem {
  id: string;
  uuid: string;
  description: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  completions: any[];
  currentUserCompleted: boolean;
}

interface TodoEmployee {
  id: string;
  uuid: string;
  user_id: number;
  user: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  };
}

interface TodoList {
  id: string;
  uuid: string;
  job_id: number;
  title: string;
  date: string;
  is_completed: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  project_name: string;
  items: TodoItem[];
  employees: TodoEmployee[];
  progressPercentage: number;
  totalItems: number;
  completedItems: number;
}

interface TaskSection {
  id: string;
  title: string;
  date: string;
  todos: TodoList[];
}

interface TodoComponentProps {
  className?: string;
}

export const TodoComponent: React.FC<TodoComponentProps> = ({ className }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [taskSections, setTaskSections] = useState<TaskSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todo lists
  useEffect(() => {
    const fetchTodoLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.fetchTodoLists({
          page: 1,
          limit: 50,
        });

        if (response.statusCode === 200 && response.data?.data) {
          const todoLists: TodoList[] = response.data.data;

          // Group todos by date
          const groupedTodos = groupTodosByDate(todoLists);
          setTaskSections(groupedTodos);
        } else {
          setError('Failed to fetch todo lists');
        }
      } catch (error) {
        console.error('Error fetching todo lists:', error);
        setError('Failed to fetch todo lists');
      } finally {
        setLoading(false);
      }
    };

    fetchTodoLists();
  }, []);

  // Group todos by date (Today, Tomorrow, Other dates)
  const groupTodosByDate = (todoLists: TodoList[]): TaskSection[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTodos: TodoList[] = [];
    const tomorrowTodos: TodoList[] = [];
    const otherTodos: TodoList[] = [];

    todoLists.forEach(todo => {
      const todoDate = parseISO(todo.date);

      if (isToday(todoDate)) {
        todayTodos.push(todo);
      } else if (isTomorrow(todoDate)) {
        tomorrowTodos.push(todo);
      } else {
        otherTodos.push(todo);
      }
    });

    const sections: TaskSection[] = [];

    // Add Today section if there are todos
    if (todayTodos.length > 0) {
      sections.push({
        id: 'today',
        title: 'Today',
        date: 'Today',
        todos: todayTodos,
      });
    }

    // Add Tomorrow section if there are todos
    if (tomorrowTodos.length > 0) {
      sections.push({
        id: 'tomorrow',
        title: 'Tomorrow',
        date: 'Tomorrow',
        todos: tomorrowTodos,
      });
    }

    // Add other dates sections
    otherTodos.forEach(todo => {
      const todoDate = parseISO(todo.date);
      const formattedDate = format(todoDate, 'dd/MM/yyyy');

      sections.push({
        id: `date-${todo.uuid}`,
        title: formattedDate,
        date: formattedDate,
        todos: [todo],
      });
    });

    return sections;
  };

  const handleTaskToggle = (
    sectionId: string,
    todoId: string,
    itemId: string
  ) => {
    setTaskSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              todos: section.todos.map(todo =>
                todo.uuid === todoId
                  ? {
                      ...todo,
                      items: todo.items.map(item =>
                        item.uuid === itemId
                          ? { ...item, is_completed: !item.is_completed }
                          : item
                      ),
                    }
                  : todo
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

  if (loading) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className='bg-[var(--background)] p-3 rounded-[10px]'>
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-6 bg-gray-200 rounded mb-4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className='bg-red-50 border border-red-200 rounded-[10px] p-3'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (taskSections.length === 0) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className='bg-[var(--background)] p-3 rounded-[10px]'>
          <p className='text-gray-500 text-sm text-center'>
            No todo lists found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {taskSections.map(({ id: sectionId, title, todos }) => (
        <div
          key={sectionId}
          className='bg-[var(--background)] p-3 rounded-[10px]'
        >
          {/* Section Header */}
          <h4 className='text-[var(--text-secondary)] uppercase font-medium text-[12px] leading-[100%] tracking-[0%] mb-2'>
            {title}
          </h4>

          {/* Todo Lists */}
          {todos.map(todo => (
            <div key={todo.uuid} className='mb-4 last:mb-0'>
              <div className='flex items-center gap-2 w-full mb-4'>
                <div className='flex-1 mr-auto'>
                  <p
                    className='text-[var(--text-secondary)] font-medium text-[14px] leading-[22px] tracking-[0px] mb-1'
                    style={{ fontFamily: 'Inter' }}
                  >
                    {todo.project_name}
                  </p>
                  <p
                    className='text-[var(--text-dark)] font-medium text-[16px] leading-[100%] tracking-[0%]'
                    style={{ fontFamily: 'Inter' }}
                  >
                    {todo.title}
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

              {/* Todo Items */}
              <div className='flex flex-col gap-4'>
                {todo.items.map(item => (
                  <Label
                    key={item.uuid}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <Checkbox
                      id={item.uuid}
                      className={`
                         rounded-[6px] 
                         border-2 
                         border-[#BFBFBF]
                         data-[state=checked]:bg-[--primary]
                         data-[state=checked]:border-[var(--primary)]
                         data-[state=checked]:text-white
                         text-[var(--text-dark)] 
                         w-6 h-6
                         flex items-center justify-center -mt-0.4
                         ${item.is_completed ? 'bg-blue-600 border-blue-600' : ''}
                       `}
                      checked={item.is_completed}
                      onCheckedChange={() =>
                        handleTaskToggle(sectionId, todo.uuid, item.uuid)
                      }
                    />
                    <div className='flex-1'>
                      <p
                        className={`text-sm font-semibold text-[var(--text-dark)] ${
                          item.is_completed ? 'line-through' : ''
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Label>
                ))}
              </div>
            </div>
          ))}
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
