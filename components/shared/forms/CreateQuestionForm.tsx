'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash } from 'iconsax-react';
import { useState } from 'react';

export interface QuestionFormData {
  questions: string[];
}

interface CreateQuestionFormProps {
  onSave: (data: QuestionFormData) => void;
  onCancel: () => void;
  existingQuestions?: string[];
}

export const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
  onSave,
  onCancel,
  existingQuestions = [],
}) => {
  const [questions, setQuestions] = useState<string[]>(
    existingQuestions.length > 0 ? [...existingQuestions, ''] : ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);

    // Clear error when user starts typing
    if (errors[`question${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`question${index}`]: '',
      }));
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Only save non-empty questions
      const validQuestions = questions.filter(q => q.trim());
      onSave({ questions: validQuestions });
    }
  };

  return (
    <Card className='border-0 shadow-none'>
      <CardHeader className='p-0 mb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='!text-[14px] font-semibold text-[var(--text-dark)]'>
            Question
          </CardTitle>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleAddQuestion}
              className='bg-transparent text-[var(--secondary)]'
            >
              + Add Another
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-0 space-y-4'>
        {questions.map((question, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Input
              placeholder='Type your Question here...'
              value={question}
              onChange={e => handleQuestionChange(index, e.target.value)}
              className='flex-1 input-field bg-white '
            />
            {questions.length > 1 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleRemoveQuestion(index)}
                className='h-10 w-10 p-0 border border-[var(--border-dark)] rounded-xl'
              >
                <Trash
                  size='32'
                  color='var(--text-secondary)'
                  className='!h-6 !w-6'
                />
              </Button>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className='flex gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={onCancel}
            className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
