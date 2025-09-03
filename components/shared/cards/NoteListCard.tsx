'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconDotsVertical } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Avatar } from '../common/Avatar';
import Dropdown from '../common/Dropdown';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  user?: {
    name: string;
    title: string;
    profilePicture?: string;
  };
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

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit(note);
        break;
      case 'delete':
        handleDelete();
        break;
      default:
        break;
    }
  };

  const menuOptions = [
    {
      label: 'Edit Note',
      action: 'edit',
    },
    {
      label: 'Delete Note',
      action: 'delete',
    },
  ];

  return (
    <Card className='border-none bg-[#EBB40226] hover:shadow-md transition-shadow'>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Note Header */}
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <Avatar
                name={note.user?.name || 'Unknown User'}
                {...(note.user?.profilePicture && {
                  image: note.user.profilePicture,
                })}
                height={30}
                width={30}
                className='flex-shrink-0 rounded-full'
              />
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-[var(--text-dark)]'>
                  {note.user?.name || 'Unknown User'}
                </span>
                <span className='text-xs text-[var(--text-secondary)] font-medium'>
                  {note.user?.title || 'User'}
                </span>
              </div>
            </div>

            {/* Timestamp and Menu */}
            <div className='flex items-center gap-2'>
              <span className='text-sm  text-[var(--text-secondary)]'>
                {formatDistanceToNow(note.timestamp, { addSuffix: true })}
              </span>
              <Dropdown
                menuOptions={menuOptions}
                onAction={handleMenuAction}
                trigger={
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-auto  p-0 hover:bg-[var(--border-light)]'
                    disabled={isDeleting}
                  >
                    <IconDotsVertical
                      className='!w-6 !h-6'
                      strokeWidth={2}
                      color='var(--text-dark)'
                    />
                  </Button>
                }
                align='end'
              />
            </div>
          </div>

          {/* Note Content */}
          <div className='pl-0'>
            <p className='text-base text-[var(--text-dark)] leading-relaxed whitespace-pre-wrap'>
              {note.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
