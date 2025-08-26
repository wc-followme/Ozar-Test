'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Stickynote } from 'iconsax-react';
import { useState } from 'react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

interface NoteListCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NoteListCard: React.FC<NoteListCardProps> = ({
  note,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(note.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className='border-[var(--border-dark)] bg-[var(--card-background)] hover:shadow-md transition-shadow'>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Note Header */}
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <Stickynote className='w-5 h-5 text-[#EBB402] flex-shrink-0' />
              <span className='text-sm text-[var(--text-secondary)]'>
                {formatDistanceToNow(note.timestamp, { addSuffix: true })}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-[var(--primary)] hover:text-white'
                onClick={() => onEdit(note)}
              >
                <Edit2 className='w-4 h-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-red-500 hover:text-white'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Note Content */}
          <div className='pl-7'>
            <p className='text-[var(--text-dark)] leading-relaxed whitespace-pre-wrap'>
              {note.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
