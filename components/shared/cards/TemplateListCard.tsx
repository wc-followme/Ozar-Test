'use client';

import { TemplateListCardProps } from '@/app/(DashboardLayout)/templates/template-types';
import { Checkbox } from '@/components/ui/checkbox';
import { ACTIONS } from '@/constants/common';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit2, Refresh, Trash } from 'iconsax-react';
import React, { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { Dropdown } from '../common/Dropdown';

interface MenuOption {
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
    className?: string;
  }>;
}

// Function to get background color based on category text
const getCategoryBackgroundColor = (category: string): string => {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('interior')) {
    return '#24338C26'; // Light blue for Interior
  } else if (categoryLower.includes('exterior')) {
    return '#F58B1E26'; // Light orange for Exterior
  } else {
    return '#34AD4426'; // Default light gray
  }
};

export function TemplateListCard({
  template,
  onEdit,
  onDelete,
  onRetrieve,
  isArchived = false,
  className = '',
  isSelectionMode = false,
  isSelected = false,
  onSelectionChange,
}: TemplateListCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // For now, allow edit and delete by default since templates permissions might not be set up yet
  const canEdit = true; // userPermissions?.templates?.edit || true;
  const canArchive = true; // userPermissions?.templates?.archive || true;

  // Menu options for the dropdown - different for archived vs active templates
  const menuOptions: MenuOption[] = isArchived
    ? [
        {
          label: 'Retrieve',
          action: 'retrieve',
          icon: Refresh,
        },
      ]
    : [
        {
          label: 'Edit',
          action: ACTIONS.EDIT,
          icon: Edit2,
        },
        {
          label: 'Archive',
          action: ACTIONS.DELETE,
          variant: 'destructive',
          icon: Trash,
        },
      ];

  // Filter menu options based on permissions
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  const handleMenuAction = (action: string) => {
    switch (action) {
      case ACTIONS.EDIT:
        if (onEdit) {
          onEdit();
        }
        break;
      case ACTIONS.DELETE:
        setShowDeleteModal(true);
        break;
      case 'retrieve':
        if (onRetrieve) {
          onRetrieve();
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteModal(false);
  };

  const handleCardClick = () => {
    if (isSelectionMode && onSelectionChange) {
      onSelectionChange(template.id, !isSelected);
    }
  };

  const renderContent = () => {
    switch (template.type) {
      case 'disclaimer':
      case 'option-bid':
        return (
          <>
            <div className='flex justify-between items-start'>
              <div className='flex-1 max-w-[60%]'>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Service
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium truncate'>
                  {template.service}
                </p>
              </div>
              <div className='ml-auto'>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Created on
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.createdDate}
                </p>
              </div>
            </div>
          </>
        );

      case 'tools':
        return (
          <>
            <div className='flex justify-between items-start mb-3'>
              <div className='max-w-[60%] flex-1'>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Service
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium truncate'>
                  {template.service}
                </p>
              </div>
              <div className='ml-auto'>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Created on
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.createdDate}
                </p>
              </div>
            </div>
            <div>
              <p className='text-sm text-[var(--text-secondary)] mb-1'>
                Material
              </p>
              <p className='text-sm text-[var(--text-dark)] font-medium'>
                {template.material}
              </p>
            </div>
          </>
        );

      case 'estimate':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Property Type
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium truncate'>
                  {template.propertyType}
                </p>
              </div>
              <div className='ml-auto'>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Created on
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.createdDate}
                </p>
              </div>
            </div>
            <div className='flex justify-start mt-auto'>
              <span
                className='px-3 py-2 rounded-full text-sm font-medium w-full text-center text-[var(--text-dark)]'
                style={{
                  backgroundColor: getCategoryBackgroundColor(
                    template.category
                  ),
                }}
              >
                {template.category}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`bg-[var(--card-background)] rounded-[10px] shadow-sm border border-[var(--border-dark)] p-4 hover:shadow-md transition-shadow ${
          isSelectionMode ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={handleCardClick}
      >
        <div className='flex justify-between items-start mb-4'>
          <h3 className='font-bold text-[var(--text-dark)] text-lg truncate'>
            {template.templateName}
          </h3>

          {isSelectionMode ? (
            <Checkbox
              id={`template-${template.id}`}
              className='
                rounded-[6px] 
                border-2 
                border-[var(--dark-border-other)]
                data-[state=checked]:bg-[--primary]
                data-[state=checked]:border-[--primary]
                data-[state=checked]:text-white
                text-white 
                w-6 h-6
                flex items-center justify-center -mt-0.4
                ml-auto
              '
              checked={isSelected}
              onCheckedChange={() =>
                onSelectionChange?.(template.id, !isSelected)
              }
            />
          ) : (
            showMenu && (
              <Dropdown
                trigger={
                  <button className='h-8 w-fit p-0 flex-shrink-0 text-[var(--text)] hover:text-[var(--text-dark)] transition-colors'>
                    <IconDotsVertical
                      className='!w-6 !h-6'
                      strokeWidth={2}
                      color='var(--text)'
                    />
                  </button>
                }
                menuOptions={filteredMenuOptions.map(
                  ({ icon: IconComponent, action, label }) => ({
                    label,
                    action,
                    icon: IconComponent,
                  })
                )}
                onAction={handleMenuAction}
                align='end'
                className='bg-[var(--card-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
              />
            )
          )}
        </div>
        {renderContent()}
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title='Are you sure you want to Archive this template?'
        subtitle='This action cannot be undone.'
      />
    </>
  );
}
