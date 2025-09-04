'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

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
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='note-content' className='field-label'>
              Note Content
            </label>
            <Textarea
              id='note-content'
              placeholder='Enter your note here...'
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              className='min-h-[120px] resize-none input-field'
              required
            />
          </div>

          <div className='pt-4 flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
              disabled={!noteContent.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding Note...' : 'Add Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
