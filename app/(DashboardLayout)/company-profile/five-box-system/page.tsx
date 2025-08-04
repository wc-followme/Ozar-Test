'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { BoxCard } from '@/components/shared/cards/BoxCard';
import { ACTIONS } from '@/constants/common';
import { Edit2, Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuOption {
  label: string;
  action: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
  }>;
}

const FiveBoxSystem = () => {
  const router = useRouter();

  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Company Profile', href: '/company-profile' },
    { name: '5-box system' }, // current page
  ];

  const [boxData, setBoxData] = useState([
    {
      id: '01',
      number: '01',
      color: '#34AD4426', // Green
      textColor: '#34AD44', // Dark green text
      title: 'General Information',
      description:
        'Includes name, email, phone number, and basic contact details.',
      enabled: true,
      slug: 'general-information',
    },
    {
      id: '02',
      number: '02',
      color: '#1A57BF1A', // Blue
      textColor: '#1A57BF', // Dark blue text
      title: 'Property Information',
      description: 'Includes home size, number of BHKs, and floor count.',
      enabled: true,
      slug: 'property-information',
    },
    {
      id: '03',
      number: '03',
      color: '#00A8BF26', // Light blue/cyan
      textColor: '#00A8BF', // Dark cyan text
      title: 'Project Information',
      description:
        'Includes work type (interior, exterior, etc.) and service scope.',
      enabled: true,
      slug: 'project-information',
    },
    {
      id: '04',
      number: '04',
      color: '#90C91D26', // Yellow/light green
      textColor: '#90C91D', // Dark yellow/green text
      title: 'Category',
      description: 'Includes project name, location, and key contacts.',
      enabled: true,
      slug: 'category',
    },
    {
      id: '05',
      number: '05',
      color: '#D4323226', // Red/pink
      textColor: '#D43232', // Dark red text
      title: 'Estimation',
      description: 'Includes pricing based on size, scope, and type of work.',
      enabled: true,
      slug: 'estimation',
    },
  ]);

  const getMenuOptions = (): MenuOption[] => {
    return [
      {
        label: 'Edit',
        action: ACTIONS.EDIT,
        icon: Edit2,
      },
      {
        label: 'Delete',
        action: ACTIONS.DELETE,
        icon: Trash,
      },
    ];
  };

  const handleEdit = (id: string) => {
    const box = boxData.find(b => b.id === id);
    if (box) {
      // Redirect to the dynamic page based on slug
      router.push(`/company-profile/five-box-system/${box.slug}`);
    }
  };

  const handleCardClick = (id: string) => {
    const box = boxData.find(b => b.id === id);
    if (box) {
      // Redirect to the dynamic page based on slug
      router.push(`/company-profile/five-box-system/${box.slug}`);
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete box:', id);
    setBoxData(prev => prev.filter(box => box.id !== id));
  };

  const handleToggle = (id: string) => {
    console.log('Toggle box:', id);
    setBoxData(prev =>
      prev.map(box => (box.id === id ? { ...box, enabled: !box.enabled } : box))
    );
  };

  return (
    <section className=''>
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbData} />
      </div>

      {/* 5-box System Grid */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl w-full gap-3 xl:gap-6'>
        {boxData.map(box => (
          <BoxCard
            key={box.id}
            id={box.id}
            number={box.number}
            color={box.color}
            textColor={box.textColor}
            title={box.title}
            description={box.description}
            enabled={box.enabled}
            menuOptions={getMenuOptions()}
            onEdit={() => handleEdit(box.id)}
            onDelete={() => handleDelete(box.id)}
            onToggle={() => handleToggle(box.id)}
            onClick={() => handleCardClick(box.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default FiveBoxSystem;
