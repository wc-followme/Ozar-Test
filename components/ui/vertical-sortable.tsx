'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { ReactNode } from 'react';

interface VerticalSortableProps {
  items: any[];
  onReorder: (items: any[]) => void;
  children: ReactNode;
  idField?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function VerticalSortable({
  items,
  onReorder,
  children,
  idField = 'id',
  onDragStart,
  onDragEnd,
}: VerticalSortableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    if (onDragStart) {
      onDragStart();
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    if (onDragEnd) {
      onDragEnd();
    }

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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items.map(item => item[idField])}
        strategy={rectSortingStrategy}
      >
        <div className='relative'>{children}</div>
      </SortableContext>
    </DndContext>
  );
}
