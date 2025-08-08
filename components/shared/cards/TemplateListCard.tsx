'use client';

import { ACTIONS } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit2, Trash } from 'iconsax-react';
import React, { useState } from 'react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { Dropdown } from '../common/Dropdown';

// Template types
export type TemplateType = 'disclaimer' | 'tools' | 'option-bid' | 'estimate';

// Base template interface
interface BaseTemplate {
  id: string;
  templateName: string;
  createdDate: string;
}

// Disclaimer template interface
interface DisclaimerTemplate extends BaseTemplate {
  type: 'disclaimer';
  service: string;
  material: string;
}

// Tools template interface
interface ToolsTemplate extends BaseTemplate {
  type: 'tools';
  service: string;
  material: string;
}

// Option bid template interface
interface OptionBidTemplate extends BaseTemplate {
  type: 'option-bid';
  service: string;
  material: string;
}

// Estimate template interface
interface EstimateTemplate extends BaseTemplate {
  type: 'estimate';
  propertyType: string;
  category: string;
  categoryColor: string;
}

// Union type for all template types
export type TemplateData =
  | DisclaimerTemplate
  | ToolsTemplate
  | OptionBidTemplate
  | EstimateTemplate;

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

interface TemplateListCardProps {
  template: TemplateData;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
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
  className = '',
}: TemplateListCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get user permissions for templates
  const userPermissions = getUserPermissionsFromStorage();
  // For now, allow edit and delete by default since templates permissions might not be set up yet
  const canEdit = true; // userPermissions?.templates?.edit || true;
  const canArchive = true; // userPermissions?.templates?.archive || true;

  // Menu options for the dropdown
  const menuOptions: MenuOption[] = [
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

  const renderContent = () => {
    switch (template.type) {
      case 'disclaimer':
      case 'option-bid':
        return (
          <>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Service
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.service}
                </p>
              </div>
              <div className='text-right'>
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
              <div>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Service
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.service}
                </p>
              </div>
              <div className='text-right'>
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
            <div className='flex justify-between items-start mb-3'>
              <div>
                <p className='text-sm text-[var(--text-secondary)] mb-1'>
                  Property Type
                </p>
                <p className='text-sm text-[var(--text-dark)] font-medium'>
                  {template.propertyType}
                </p>
              </div>
              <div className='text-right'>
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
        className={`bg-white rounded-[10px] shadow-sm border border-[var(--border-dark)] p-4 hover:shadow-md transition-shadow ${className}`}
      >
        <div className='flex justify-between items-start mb-4'>
          <h3 className='font-bold text-[var(--text-dark)] text-lg'>
            {template.templateName}
          </h3>

          {showMenu && (
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
          )}
        </div>
        {renderContent()}
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title='Are you sure you want to delete this template?'
        subtitle='This action cannot be undone.'
      />
    </>
  );
}
