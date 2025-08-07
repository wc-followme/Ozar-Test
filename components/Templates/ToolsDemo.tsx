'use client';

import ToolsAccordion from '@/components/shared/common/ToolsAccordion';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export default function ToolsDemo() {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'tool-1',
      name: 'Nail Master 3000',
      category: 'power-tools',
      description: 'Professional nail gun for construction projects',
      status: 'available',
    },
    {
      id: 'tool-2',
      name: 'Drill Wizard',
      category: 'power-tools',
      description: 'High-performance cordless drill',
      status: 'in-use',
    },
    {
      id: 'tool-3',
      name: 'Saw Xpert',
      category: 'power-tools',
      description: 'Precision circular saw for cutting',
      status: 'available',
    },
    {
      id: 'tool-4',
      name: 'Level Right',
      category: 'measuring-tools',
      description: 'Digital level for accurate measurements',
      status: 'maintenance',
    },
  ]);

  const handleAddTool = (newTool: Tool) => {
    setTools(prev => [...prev, newTool]);
  };

  const handleRemoveTool = (toolId: string) => {
    setTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-dark)] mb-2'>
          Tools Management Demo
        </h1>
        <p className='text-[var(--text-secondary)]'>
          This demo shows the ToolsAccordion component with tag-based tool
          display and sidesheet for adding new tools.
        </p>
      </div>

      <ToolsAccordion
        title='Tools'
        tools={tools}
        onAddTool={handleAddTool}
        onRemoveTool={handleRemoveTool}
        defaultExpanded={true}
      />

      <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-semibold text-[var(--text-dark)] mb-2'>
          Current Tools ({tools.length}):
        </h3>
        <div className='text-sm text-[var(--text-secondary)]'>
          {tools.map(tool => (
            <div key={tool.id} className='mb-1'>
              • {tool.name} ({tool.category}) - {tool.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
