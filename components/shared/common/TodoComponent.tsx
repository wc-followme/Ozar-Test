'use client';

import { useToast } from '@/components/ui/use-toast';
import { TODO_MESSAGES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Edit2 } from 'iconsax-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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

export interface TodoComponentRef {
  refresh: () => void;
}

export const TodoComponent = forwardRef<TodoComponentRef, TodoComponentProps>(
  ({ className }, ref) => {
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [taskSections, setTaskSections] = useState<TaskSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    const [editingTodoList, setEditingTodoList] = useState<TodoList | null>(
      null
    );
    const [editLoading, setEditLoading] = useState(false);
    const { showSuccessToast, showErrorToast } = useToast();

    // Fetch todo lists function
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

    // Fetch single todo list for editing
    const fetchTodoListForEdit = async (todoUuid: string) => {
      setEditLoading(true);
      try {
        const response = await apiService.fetchTodoListById(todoUuid);

        if (response.statusCode === 200 && response.data) {
          setEditingTodoList(response.data);
          setIsEditSheetOpen(true);
        } else {
          showErrorToast('Failed to fetch todo list details');
        }
      } catch (error) {
        console.error('Error fetching todo list for edit:', error);
        showErrorToast('Failed to fetch todo list details');
      } finally {
        setEditLoading(false);
      }
    };

    // Initial fetch
    useEffect(() => {
      fetchTodoLists();
    }, []);

    // Expose refresh function to parent component
    useImperativeHandle(ref, () => ({
      refresh: fetchTodoLists,
    }));

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

    const handleTaskToggle = async (
      sectionId: string,
      todoId: string,
      itemId: string
    ) => {
      // Find the current item to get its current completion status
      const currentSection = taskSections.find(
        section => section.id === sectionId
      );
      const currentTodo = currentSection?.todos.find(
        todo => todo.uuid === todoId
      );
      const currentItem = currentTodo?.items.find(item => item.uuid === itemId);

      if (!currentItem) return;

      const newCompletionStatus = !currentItem.is_completed;

      // Add item to updating state
      setUpdatingItems(prev => new Set(prev).add(itemId));

      // Optimistically update the UI
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
                            ? { ...item, is_completed: newCompletionStatus }
                            : item
                        ),
                      }
                    : todo
                ),
              }
            : section
        )
      );

      try {
        // Call the API to update the completion status
        const response = await apiService.updateTodoItemCompletion(
          itemId,
          newCompletionStatus
        );

        if (response.statusCode !== 200 && response.statusCode !== 201) {
          // If API call fails, revert the optimistic update
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
                                ? {
                                    ...item,
                                    is_completed: currentItem.is_completed,
                                  }
                                : item
                            ),
                          }
                        : todo
                    ),
                  }
                : section
            )
          );
          console.error('Failed to update todo item completion:', response);
          showErrorToast('Failed to update item completion status');
        } else {
          showSuccessToast(
            newCompletionStatus
              ? 'Item marked as completed'
              : 'Item marked as incomplete'
          );
        }
      } catch (error) {
        // If API call fails, revert the optimistic update
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
                              ? {
                                  ...item,
                                  is_completed: currentItem.is_completed,
                                }
                              : item
                          ),
                        }
                      : todo
                  ),
                }
              : section
          )
        );
        console.error('Error updating todo item completion:', error);
        showErrorToast('Failed to update item completion status');
      } finally {
        // Remove item from updating state
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    };

    const handleEditSection = (sectionId: string) => {
      // Find the todo list in the section
      const section = taskSections.find(s => s.id === sectionId);
      if (section && section.todos.length > 0) {
        // For now, edit the first todo in the section
        // In a real implementation, you might want to show a list of todos to choose from
        const todoToEdit = section.todos[0];
        if (todoToEdit) {
          fetchTodoListForEdit(todoToEdit.uuid);
        }
      }
    };

    const handleFormSubmit = () => {
      // Handle form submission for editing the section
      // Here you would typically update the section data
      // For now, just close the sidesheet and refresh the data
      setIsEditSheetOpen(false);
      setEditingTodoList(null);
      fetchTodoLists(); // Refresh the data
      showSuccessToast('Todo list updated successfully!');
    };

    const handleFormCancel = () => {
      setIsEditSheetOpen(false);
      setEditingTodoList(null);
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
                          ${updatingItems.has(item.uuid) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        checked={item.is_completed}
                        disabled={updatingItems.has(item.uuid)}
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
          title={
            editingTodoList ? 'Edit Todo List' : TODO_MESSAGES.EDIT_TODO_TITLE
          }
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          size='600px'
        >
          <div className='space-y-4'>
            {editLoading ? (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
                <span className='ml-2 text-[var(--text-secondary)]'>
                  Loading todo list...
                </span>
              </div>
            ) : (
              <TodoForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={false}
                editingTodoList={editingTodoList}
              />
            )}
          </div>
        </SideSheet>
      </div>
    );
  }
);

TodoComponent.displayName = 'TodoComponent';
