'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { BoxCard } from '@/components/shared/cards/BoxCard';
import { ACTIONS } from '@/constants/common';
import { fiveBoxSystemData } from '@/constants/dummy-data';
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

  const [boxData, setBoxData] = useState(fiveBoxSystemData);

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
    setBoxData(prev => prev.filter(box => box.id !== id));
  };

  const handleToggle = (id: string) => {
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
        {boxData.map(
          ({ id, number, color, textColor, title, description, enabled }) => (
            <BoxCard
              key={id}
              id={id}
              number={number}
              color={color}
              textColor={textColor}
              title={title}
              description={description}
              enabled={enabled}
              menuOptions={getMenuOptions()}
              onEdit={() => handleEdit(id)}
              onDelete={() => handleDelete(id)}
              onToggle={() => handleToggle(id)}
              onClick={() => handleCardClick(id)}
            />
          )
        )}
      </div>
    </section>
  );
};

export default FiveBoxSystem;
