import React from 'react';

interface OtherQuestionComponentProps {
  onClose?: () => void;
}

const OtherQuestionComponent: React.FC<OtherQuestionComponentProps> = () => {
  const questions = [
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'What are your expectations for the project?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  return (
    <div className='w-full h-full'>
      {/* Header */}

      {/* Questions List */}
      <div className='space-y-4'>
        {questions.map((item, index) => (
          <div key={index} className=''>
            <h3 className='font-bold text-[var(--text-dark)] text-sm mb-2'>
              {item.question}
            </h3>
            <p className='text-[var(--text-secondary)] text-base leading-relaxed'>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherQuestionComponent;
