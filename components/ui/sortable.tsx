'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ReactNode } from 'react';

interface SortableProps {
  items: any[];
  onReorder: (items: any[]) => void;
  children: ReactNode;
  idField?: string;
}

// Custom modifier to restrict dragging to vertical axis only
const restrictToVerticalAxis = (args: { transform: any }) => {
  const { transform } = args;
  return {
    ...transform,
    x: 0, // Prevent horizontal movement
  };
};

export function Sortable({
  items,
  onReorder,
  children,
  idField = 'id',
}: SortableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item[idField] === active.id);
      const newIndex = items.findIndex(item => item[idField] === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items.map(item => item[idField])}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
