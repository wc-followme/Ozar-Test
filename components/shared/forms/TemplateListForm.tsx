'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TemplateCard } from '../cards/TemplateCard';

interface Template {
  id: string;
  name: string;
  propertyType: string;
  createdOn: string;
  category: string;
}

interface TemplateListFormProps {
  onSave: (selectedTemplates: string[]) => void;
  onCancel: () => void;
}

// Mock template data - replace with actual API call
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Kitchen Renovation',
    propertyType: 'Residential',
    createdOn: '30/12/2024',
    category: 'Interior',
  },
  {
    id: '2',
    name: 'Bathroom Remodel',
    propertyType: 'Residential',
    createdOn: '29/12/2024',
    category: 'Interior',
  },
  {
    id: '3',
    name: 'New Home Construction',
    propertyType: 'Residential',
    createdOn: '28/12/2024',
    category: 'Full Home Build/Addition',
  },
  {
    id: '4',
    name: 'Living Room Design',
    propertyType: 'Residential',
    createdOn: '27/12/2024',
    category: 'Interior',
  },
  {
    id: '5',
    name: 'House Extension',
    propertyType: 'Residential',
    createdOn: '26/12/2024',
    category: 'Full Home Build/Addition',
  },
  {
    id: '6',
    name: 'Master Bedroom',
    propertyType: 'Residential',
    createdOn: '25/12/2024',
    category: 'Interior',
  },
  {
    id: '7',
    name: 'Complete Home Renovation',
    propertyType: 'Residential',
    createdOn: '24/12/2024',
    category: 'Full Home Build/Addition',
  },
  {
    id: '8',
    name: 'Dining Room',
    propertyType: 'Residential',
    createdOn: '23/12/2024',
    category: 'Interior',
  },
  {
    id: '9',
    name: 'Home Addition',
    propertyType: 'Residential',
    createdOn: '22/12/2024',
    category: 'Full Home Build/Addition',
  },
  {
    id: '10',
    name: 'Study Room',
    propertyType: 'Residential',
    createdOn: '21/12/2024',
    category: 'Interior',
  },
];

export function TemplateListForm({ onSave, onCancel }: TemplateListFormProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  const handleAddSelected = () => {
    onSave(selectedTemplates);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Template Grid */}
      <div className='flex-1 overflow-y-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {mockTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplates.includes(template.id)}
              onToggle={() => handleTemplateToggle(template.id)}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-6 border-t border-[var(--border-dark)]'>
        <Button onClick={onCancel} className='!h-12 !px-8 btn-secondary'>
          Cancel
        </Button>
        <Button
          onClick={handleAddSelected}
          disabled={selectedTemplates.length === 0}
          className='btn-primary !h-12 !px-8'
        >
          Add Selected ({selectedTemplates.length})
        </Button>
      </div>
    </div>
  );
}
