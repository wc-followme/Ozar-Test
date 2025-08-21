'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { useToast } from '@/components/ui/use-toast';
import { extractApiErrorMessage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ServiceOptionServiceForm from '../shared/forms/ServiceOptionServiceForm';
import ServiceOptionsHeader from './ServiceOptionsHeader';
import { ServiceOptionsSidebar } from './ServiceOptionsSidebar';
import { ServiceCategory, ServiceOption } from './service-options-types';

interface ServiceOptionsBoxProps {
  _onClose: () => void;
  templateId?: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
  onFormSubmit?: number;
}

// Utility function to generate unique keys
const generateUniqueKey = (
  prefix: string,
  categoryId?: string,
  sequenceNumber?: number
): string => {
  if (
    prefix === 'category' &&
    categoryId !== undefined &&
    sequenceNumber !== undefined
  ) {
    return `category_${categoryId}_${sequenceNumber}`;
  }
  // Fallback for other cases
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
};

export default function ServiceOptionsBox(
  props: Readonly<ServiceOptionsBoxProps>
) {
  const { showErrorToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['0']);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryUniqueKey, setSelectedCategoryUniqueKey] = useState<
    string | null
  >(null);
  const [showAddServiceOption, setShowAddServiceOption] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState<
    string | null
  >(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMainAccordionExpanded, setIsMainAccordionExpanded] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<
    'category' | 'service-option' | null
  >(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([
    {
      id: '0',
      uniqueKey: generateUniqueKey('category'),
      name: 'General Services',
      total: 0.0,
      serviceOptions: [],
      isExpanded: true,
    },
  ]);

  const selectedCategoryData = selectedCategoryUniqueKey
    ? categories.find(
        category => category.uniqueKey === selectedCategoryUniqueKey
      )
    : categories.find(category => category.id === selectedCategoryId);

  const selectedServiceOptionData =
    selectedServiceOption && selectedCategoryData
      ? selectedCategoryData.serviceOptions.find(
          option => option.id === selectedServiceOption
        )
      : undefined;

  // Function to update calculations for a service option
  const updateServiceOptionCalculations = (
    serviceOption: ServiceOption
  ): ServiceOption => {
    return {
      ...serviceOption,
      // Add any calculation logic here if needed
    };
  };

  // Function to update calculations for a category
  const updateCategoryCalculations = (
    category: ServiceCategory
  ): ServiceCategory => {
    const updatedServiceOptions = category.serviceOptions.map(
      updateServiceOptionCalculations
    );
    const categoryTotal = updatedServiceOptions.reduce(
      (total, option) => total + option.price,
      0
    );

    return {
      ...category,
      serviceOptions: updatedServiceOptions,
      total: categoryTotal,
    };
  };

  // Function to update all calculations
  const updateAllCalculations = (): void => {
    setCategories(prevCategories => {
      const updatedCategories = prevCategories.map(updateCategoryCalculations);
      return updatedCategories;
    });
  };

  const saveCurrentState = () => {
    // Save to localStorage or API
    const categoriesData = categories.map(category => ({
      id: category.id,
      name: category.name,
      serviceOptions: category.serviceOptions || [],
    }));

    if (props.templateId) {
      localStorage.setItem(
        `service_options_${props.templateId}`,
        JSON.stringify(categoriesData)
      );
    }
  };

  // Save state whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      // Save to localStorage or API
      saveCurrentState();
    }
  }, [categories]);

  // Update calculations on mount
  useEffect(() => {
    if (categories.length > 0) {
      updateAllCalculations();
    }
  }, []);

  // Listen for form submission and trigger save
  useEffect(() => {
    if (props.onFormSubmit && props.onFormSubmit > 0) {
      handleSave();
    }
  }, [props.onFormSubmit]);

  const handleAddCategory = () => {
    if (categories.length === 0) {
      const defaultCategory: ServiceCategory = {
        id: '0',
        uniqueKey: generateUniqueKey('category'),
        name: 'General Services',
        total: 0.0,
        isExpanded: true,
        serviceOptions: [],
      };

      setCategories([defaultCategory]);
      setExpandedCategories(['0']);
      setSelectedCategoryId('0');
      setSelectedCategory(null);
      setSelectedCategoryUniqueKey(null);
      setShowAddServiceOption(false);
      setShowServiceForm(false);
      setSelectedServiceOption(null);
      return;
    }

    const categorySequenceNumber = categories.length;
    const newCategory: ServiceCategory = {
      id: categorySequenceNumber.toString(),
      uniqueKey: generateUniqueKey('category'),
      name: `Category ${categories.length + 1}`,
      total: 0.0,
      isExpanded: true,
      serviceOptions: [],
    };

    setCategories(prev => [...prev, newCategory]);
    setExpandedCategories(prev => [...prev, newCategory.id]);

    setSelectedCategoryId(newCategory.id);
    setSelectedCategory(null);
    setSelectedCategoryUniqueKey(null);
    setShowAddServiceOption(false);
    setShowServiceForm(false);
    setSelectedServiceOption(null);
  };

  const handleAccordionChange = (value: string[]) => {
    if (!isMainAccordionExpanded) {
      return;
    }
    setExpandedCategories(value);
  };

  const handleAddServiceOption = () => {
    if (!selectedCategoryUniqueKey) {
      handleAddCategory();
      return;
    }

    const uniqueId = `service-option-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newServiceOption: ServiceOption = {
      id: uniqueId,
      name: 'New Service Option',
      description: '',
      price: 0.0,
      duration: '',
      category: selectedCategoryData?.name || 'General',
    };

    setCategories(prev =>
      prev.map(category =>
        category.id === selectedCategoryId
          ? {
              ...category,
              serviceOptions: [...category.serviceOptions, newServiceOption],
            }
          : category
      )
    );

    setTimeout(() => updateAllCalculations(), 0);
    setSelectedServiceOption(newServiceOption.id);
    setShowServiceForm(true);
  };

  const handleCategorySelect = (categoryUniqueKey: string) => {
    let foundCategory: ServiceCategory | null = null;

    for (const category of categories) {
      if (category.uniqueKey === categoryUniqueKey) {
        foundCategory = category;
        break;
      }
    }

    if (foundCategory) {
      setSelectedCategoryId(foundCategory.id);
      setSelectedCategory(foundCategory.id);
      setSelectedCategoryUniqueKey(foundCategory.uniqueKey);

      if (!expandedCategories.includes(foundCategory.id)) {
        setExpandedCategories(prev => [...prev, foundCategory.id]);
      }

      setShowAddServiceOption(true);
      setShowServiceForm(false);
      setSelectedServiceOption(null);
    }
  };

  const handleCategoryNameChange = (newCategoryName: string) => {
    if (selectedCategory && selectedCategoryUniqueKey) {
      setCategories(prev =>
        prev.map(category =>
          category.uniqueKey === selectedCategoryUniqueKey
            ? { ...category, name: newCategoryName }
            : category
        )
      );
    }
  };

  const handleServiceOptionUpdate = (updatedServiceOption: ServiceOption) => {
    if (
      selectedCategory &&
      selectedServiceOption &&
      selectedCategoryUniqueKey
    ) {
      setCategories(prev => {
        const updatedCategories = prev.map(category =>
          category.uniqueKey === selectedCategoryUniqueKey
            ? {
                ...category,
                serviceOptions: category.serviceOptions.map(option =>
                  option.id === selectedServiceOption
                    ? updatedServiceOption
                    : option
                ),
              }
            : category
        );
        return updatedCategories;
      });

      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleServiceOptionDelete = (serviceOptionId: string) => {
    if (selectedCategory && selectedCategoryUniqueKey) {
      setCategories(prev =>
        prev.map(category =>
          category.uniqueKey === selectedCategoryUniqueKey
            ? {
                ...category,
                serviceOptions: category.serviceOptions.filter(
                  option => option.id !== serviceOptionId
                ),
              }
            : category
        )
      );

      setTimeout(() => updateAllCalculations(), 0);
    }
  };

  const handleEditClick = () => {
    setEditingCategoryName(selectedCategoryData?.name || 'Category');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (editingCategoryName.trim()) {
      setCategories(prev =>
        prev.map(category =>
          category.id === selectedCategoryId
            ? { ...category, name: editingCategoryName.trim() }
            : category
        )
      );
    }
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setEditingCategoryName(selectedCategoryData?.name || 'Category');
    setIsEditing(false);
  };

  const handleRoomNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  // Delete handlers
  const handleDeleteClick = () => {
    if (showServiceForm && selectedServiceOption) {
      setDeleteType('service-option');
    } else if (showAddServiceOption && selectedCategory) {
      setDeleteType('category');
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (
      deleteType === 'category' &&
      selectedCategory &&
      selectedCategoryUniqueKey
    ) {
      setCategories(prev => {
        const filteredCategories = prev.filter(
          category => category.id !== selectedCategoryId
        );
        if (filteredCategories.length === 0) {
          const defaultCategory: ServiceCategory = {
            id: '0',
            uniqueKey: generateUniqueKey('category'),
            name: 'General Services',
            total: 0.0,
            serviceOptions: [],
            isExpanded: true,
          };
          setSelectedCategoryId('0');
          return [defaultCategory];
        } else {
          if (filteredCategories.length > 0) {
            setSelectedCategoryId(filteredCategories[0]!.id);
          }
          return filteredCategories;
        }
      });
      setSelectedCategory(null);
      setSelectedCategoryUniqueKey(null);
      setShowAddServiceOption(false);
      setShowServiceForm(false);
      setSelectedServiceOption(null);
    } else if (
      deleteType === 'service-option' &&
      selectedServiceOption &&
      selectedCategory &&
      selectedCategoryUniqueKey
    ) {
      handleServiceOptionDelete(selectedServiceOption);
      setSelectedServiceOption(null);
      setShowServiceForm(false);
    }
    setShowDeleteModal(false);
    setDeleteType(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteType(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProjectTotal = () => {
    return categories.reduce((total, category) => total + category.total, 0);
  };

  const projectTotal = calculateProjectTotal();

  const handleSave = async () => {
    try {
      saveCurrentState();

      if (props.onSaveSuccess) {
        props.onSaveSuccess();
      }
    } catch (error) {
      console.error('Error saving service options:', error);
      showErrorToast(
        extractApiErrorMessage(
          error,
          'Failed to save service options. Please try again.'
        )
      );

      if (props.onSaveError) {
        props.onSaveError(error);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const calculateContentWidth = () => {
    const baseWidth = '100vw';
    const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';
    const serviceOptionsSidebarWidth = '320px';
    const padding = '48px';
    const margins = '32px';

    return `calc(${baseWidth} - ${sidebarWidth} - ${serviceOptionsSidebarWidth} - ${padding} - ${margins})`;
  };

  const toggleMainAccordion = () => {
    const allCategoryIds = categories.map(category => category.id);
    const allCategoriesExpanded = allCategoryIds.every(id =>
      expandedCategories.includes(id)
    );

    if (allCategoriesExpanded) {
      setExpandedCategories([]);
      setIsMainAccordionExpanded(false);
    } else {
      setExpandedCategories(allCategoryIds);
      setIsMainAccordionExpanded(true);
    }
  };

  const handleCategoryReorder = (reorderedCategories: ServiceCategory[]) => {
    setCategories(reorderedCategories);
  };

  const handleServiceOptionReorder = (
    reorderedServiceOptions: ServiceOption[]
  ) => {
    if (selectedCategoryUniqueKey) {
      setCategories(prev =>
        prev.map(category =>
          category.uniqueKey === selectedCategoryUniqueKey
            ? {
                ...category,
                serviceOptions: reorderedServiceOptions,
              }
            : category
        )
      );
    }
  };

  // DynamicTable columns for service options
  const serviceOptionColumns = [
    { key: 'name', label: 'Service Name', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'price', label: 'Price', type: 'number' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const },
    { key: 'category', label: 'Category', type: 'text' as const },
    { key: 'actions', label: 'Actions', type: 'custom' as const },
  ];

  // DynamicTable actions for service options
  const serviceOptionActions = [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'Edit2',
      onClick: (row: any) => {
        setSelectedServiceOption(row.id);
        setShowServiceForm(true);
      },
      variant: 'ghost' as const,
      size: 'sm' as const,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'Trash',
      onClick: (row: any) => handleServiceOptionDelete(row.id),
      variant: 'destructive' as const,
      size: 'sm' as const,
    },
  ];

  return (
    <div className='flex bg-[var(--card-background)] rounded-[20px] w-full border border-[var(--border-dark)] overflow-hidden'>
      {/* Sidebar */}
      <ServiceOptionsSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        handleAddCategory={handleAddCategory}
        expandedCategories={expandedCategories}
        handleAccordionChange={handleAccordionChange}
        categories={categories}
        handleCategorySelect={handleCategorySelect}
        selectedServiceOption={selectedServiceOption}
        formatCurrency={formatCurrency}
        selectedCategoryId={selectedCategoryId}
        toggleMainAccordion={toggleMainAccordion}
      />

      {/* Main Content */}
      <div
        className='flex-1 flex flex-col h-[calc(100vh_-_120px)] min-w-0 overflow-hidden transition-all duration-300 ease-in-out !touch-pan-x !touch-pan-y touch-manipulation'
        style={{ width: calculateContentWidth() }}
      >
        {/* Header */}
        <ServiceOptionsHeader
          showAddServiceOption={showAddServiceOption}
          isEditing={isEditing}
          editingCategoryName={editingCategoryName}
          setEditingCategoryName={setEditingCategoryName}
          handleNameSave={handleNameSave}
          handleRoomNameKeyDown={handleRoomNameKeyDown}
          handleEditClick={handleEditClick}
          selectedCategory={selectedCategoryData}
          showServiceForm={showServiceForm}
          selectedServiceOptionData={selectedServiceOptionData}
          handleAddCategory={handleAddCategory}
          handleAddServiceOption={handleAddServiceOption}
          onDeleteClick={handleDeleteClick}
        />

        {/* Content Area (match EstimationBox scroll behavior) */}
        <div className='flex-1 overflow-hidden bg-[var(--background)]'>
          <div
            className='h-full overflow-x-auto overscroll-contain touch-pan-x touch-pan-y -webkit-overflow-scrolling-touch touch-manipulation scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300'
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              touchAction: 'pan-x pan-y',
              msOverflowStyle: 'auto',
              scrollbarWidth: 'auto',
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            <div className='p-6 min-w-[800px] max-w-none w-full'>
              {/* Service Form */}
              <ServiceOptionServiceForm
                service={{
                  id: selectedServiceOptionData?.id || 'default',
                  name: selectedServiceOptionData?.name || 'New Service Option',
                  description: selectedServiceOptionData?.description || '',
                  qty: 1,
                  rate: selectedServiceOptionData?.price || 0,
                  lineTotal: selectedServiceOptionData?.price || 0,
                  serviceTotal: selectedServiceOptionData?.price || 0,
                  tradeTotal: selectedServiceOptionData?.price || 0,
                  materials: [],
                  finishes: [],
                  tools: [],
                  serviceOptions: [],
                }}
                onServiceUpdate={updatedService => {
                  if (selectedServiceOptionData) {
                    const updatedServiceOption: ServiceOption = {
                      id: updatedService.id,
                      name: updatedService.name,
                      description: updatedService.description,
                      price: updatedService.rate,
                      duration: selectedServiceOptionData.duration,
                      category: selectedServiceOptionData.category,
                      is_hidden: selectedServiceOptionData.is_hidden ?? false,
                    };
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title={
          deleteType === 'category'
            ? 'Delete Category'
            : 'Delete Service Option'
        }
        subtitle={
          deleteType === 'category'
            ? `Are you sure you want to delete "${selectedCategoryData?.name}"? This will also delete all service options within this category.`
            : `Are you sure you want to delete "${selectedServiceOptionData?.name}"? This action cannot be undone.`
        }
        archiveButtonText={'Delete'}
        onCancel={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
