'use client';

import { Button } from '@/components/ui/button';
import { Trash } from 'iconsax-react';
import ShieldPlusIcon from '../icons/ShieldPlusIcon';
import { ServiceCategory, ServiceOption } from './service-options-types';

interface ServiceOptionsHeaderProps {
  showAddServiceOption: boolean;
  isEditing: boolean;
  editingCategoryName: string;
  setEditingCategoryName: (name: string) => void;
  handleNameSave: () => void;
  handleRoomNameKeyDown: (e: React.KeyboardEvent) => void;
  handleEditClick: () => void;
  selectedCategory: ServiceCategory | undefined;
  showServiceForm: boolean;
  selectedServiceOptionData: ServiceOption | undefined;
  handleAddCategory: () => void;
  handleAddServiceOption: () => void;
  onDeleteClick: () => void;
}

export default function ServiceOptionsHeader({
  showAddServiceOption: _showAddServiceOption,
  isEditing: _isEditing,
  editingCategoryName: _editingCategoryName,
  setEditingCategoryName: _setEditingCategoryName,
  handleNameSave: _handleNameSave,
  handleRoomNameKeyDown: _handleRoomNameKeyDown,
  handleEditClick: _handleEditClick,
  selectedCategory: _selectedCategory,
  showServiceForm: _showServiceForm,
  selectedServiceOptionData: _selectedServiceOptionData,
  handleAddCategory: _handleAddCategory,
  handleAddServiceOption: _handleAddServiceOption,
  onDeleteClick,
}: ServiceOptionsHeaderProps) {
  return (
    <div className='bg-white border-b border-gray-200 p-4 h-[75px] flex items-center'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col items-start'>
          <h1 className='text-xl font-semibold text-gray-900 truncate'>
            Install Tub
          </h1>
          <p className='text-sm text-gray-500'>
            Bed room 1 / Plumbing / Install Tub
          </p>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            className='border-2 border-[var(--border-dark)] h-[42px] w-[42px] rounded-[10px]'
            onClick={() => {
              // Handle shield/plus action
              console.log('Shield action clicked');
            }}
          >
            <ShieldPlusIcon className='!h-5 !w-5' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='border-2 border-[var(--border-dark)] h-[42px] w-[42px] rounded-[10px]'
            onClick={onDeleteClick}
          >
            <Trash className='!h-5 !w-5' size={24} color='var(--text-dark)' />
          </Button>
        </div>
      </div>
    </div>
  );
}
