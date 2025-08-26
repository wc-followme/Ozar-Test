'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Stickynote } from 'iconsax-react';

interface NoteListFormProps {
  onSave: (note: { id: string; content: string; timestamp: Date }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const NoteListForm: React.FC<NoteListFormProps> = ({
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: noteContent.trim(),
        timestamp: new Date(),
      };
      onSave(newNote);
      setNoteContent('');
    }
  };

  const handleCancel = () => {
    setNoteContent('');
    onCancel();
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Stickynote className='w-6 h-6 text-[#EBB402]' />
          <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
            Add Note
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='note-content' className='text-sm font-medium text-[var(--text-secondary)]'>
              Note Content
            </label>
            <Textarea
              id='note-content'
              placeholder='Enter your note here...'
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className='min-h-[120px] resize-none border-[var(--border-dark)] focus:border-[var(--primary)]'
              required
            />
          </div>

          <div className='flex items-center gap-3 pt-4'>
            <Button
              type='submit'
              className='btn-primary flex-1'
              disabled={!noteContent.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding Note...' : 'Add Note'}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='btn-secondary flex-1'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
