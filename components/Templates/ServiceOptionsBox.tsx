'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import ServiceOptionServiceForm from '@/components/shared/forms/ServiceOptionServiceForm';
import { useToast } from '@/components/ui/use-toast';
import {
  calculateServiceTotal,
  calculateServiceTotalMaterialCost,
  formatCurrency,
} from '@/lib/estimation-calculations';
import { extractApiErrorMessage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ServiceOptionsHeader from './ServiceOptionsHeader';
import { ServiceOptionsSidebar } from './ServiceOptionsSidebar';
import { ServiceCategory, ServiceOption } from './service-options-types';

interface ServiceOptionsBoxProps {
  _onClose: () => void;
  templateId?: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: unknown) => void;
  onFormSubmit?: number;
  tradeId?: string; // Add trade ID prop for service filtering
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

// 🎯 CENTRALIZED CALCULATION FUNCTION
// This function handles ALL calculations for service options and should be used everywhere
export const calculateServiceOptionTotals = (serviceOption: {
  rate?: number;
  qty?: number;
  materials?: Array<{
    rate?: number;
    qty?: number;
    is_hidden?: boolean;
    markup?: number;
    markup_type?: string;
  }>;
  finishes?: Array<{
    rate?: number;
    qty?: number;
    is_hidden?: boolean;
    markup?: number;
    markup_type?: string;
  }>;
}) => {
  const rate = serviceOption.rate || 0;
  const qty = serviceOption.qty || 1;
  const materials = (serviceOption.materials || []).map(m => ({
    rate: m.rate || 0,
    qty: m.qty || 0,
    is_hidden: m.is_hidden || false,
    markup: m.markup || 0,
    markup_type:
      (m.markup_type as 'PERCENTAGE' | 'FLAT_AMOUNT') || 'FLAT_AMOUNT',
  }));
  const finishes = (serviceOption.finishes || []).map(f => ({
    rate: f.rate || 0,
    qty: f.qty || 0,
    is_hidden: f.is_hidden || false,
    markup: f.markup || 0,
    markup_type:
      (f.markup_type as 'PERCENTAGE' | 'FLAT_AMOUNT') || 'FLAT_AMOUNT',
  }));

  // Calculate service total (rate * qty)
  const serviceTotal = calculateServiceTotal(rate, qty);

  // Calculate material cost (materials + finishes)
  const materialCost = calculateServiceTotalMaterialCost(materials, finishes);

  // Calculate trade total (service total + material cost)
  const tradeTotal = serviceTotal + materialCost;

  return {
    lineTotal: serviceTotal,
    serviceTotal: serviceTotal,
    tradeTotal: tradeTotal,
    materialCost: materialCost,
    // Formatted versions for display
    formattedLineTotal: formatCurrency(serviceTotal),
    formattedServiceTotal: formatCurrency(serviceTotal),
    formattedTradeTotal: formatCurrency(tradeTotal),
    formattedMaterialCost: formatCurrency(materialCost),
  };
};

// 🎯 SIMPLIFIED CALCULATION FUNCTION FOR PROJECT TOTAL
// This function is used when the rate field already contains the final trade total
export const getServiceOptionTradeTotal = (serviceOption: {
  rate?: number;
  qty?: number;
  materials?: Array<{
    rate?: number;
    qty?: number;
    is_hidden?: boolean;
    markup?: number;
    markup_type?: string;
    lineTotal?: number;
  }>;
  finishes?: Array<{
    rate?: number;
    qty?: number;
    is_hidden?: boolean;
    markup?: number;
    markup_type?: string;
    lineTotal?: number;
  }>;
}) => {
  // For localStorage data, we need to recalculate because the stored lineTotal values might be wrong
  // Always use the centralized calculation function to ensure accuracy
  const totals = calculateServiceOptionTotals(serviceOption);
  console.log('Calculated trade total:', totals.tradeTotal);
  return totals.tradeTotal;
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
  const [formKey, setFormKey] = useState(0);
  const [newlyCreatedServiceOption, setNewlyCreatedServiceOption] =
    useState<ServiceOption | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([
    {
      id: '0',
      uniqueKey: generateUniqueKey('category', '0', 0),
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
    newlyCreatedServiceOption ||
    (selectedServiceOption && selectedCategoryData
      ? selectedCategoryData.serviceOptions.find(
          option => option.id === selectedServiceOption
        )
      : undefined);

  // Clear newlyCreatedServiceOption when the service option is properly stored in categories
  useEffect(() => {
    if (
      newlyCreatedServiceOption &&
      selectedServiceOption &&
      selectedCategoryData
    ) {
      const foundInCategories = selectedCategoryData.serviceOptions.find(
        option => option.id === selectedServiceOption
      );
      if (foundInCategories) {
        setNewlyCreatedServiceOption(null);
      }
    }
  }, [
    categories,
    newlyCreatedServiceOption,
    selectedServiceOption,
    selectedCategoryData,
  ]);

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
    const updatedServiceOptions = (category.serviceOptions || []).map(
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

  // Function to ensure all categories have unique keys
  const ensureUniqueKeys = (
    categoriesList: ServiceCategory[]
  ): ServiceCategory[] => {
    return categoriesList.map((category, index) => ({
      ...category,
      uniqueKey:
        category.uniqueKey || generateUniqueKey('category', category.id, index),
    }));
  };

  // Function to update all calculations
  const updateAllCalculations = (): void => {
    setCategories(prevCategories => {
      const updatedCategories = prevCategories.map(updateCategoryCalculations);
      return ensureUniqueKeys(updatedCategories);
    });
  };

  // Centralized localStorage management function - this is the ONLY function that should update localStorage
  const updateLocalStorage = (sourceCategories?: ServiceCategory[]) => {
    try {
      console.log('=== updateLocalStorage called ===');
      const dataSource = sourceCategories || categories;
      console.log('Current categories state:', dataSource);
      console.log('Categories length:', dataSource.length);

      // Transform the data to match the estimation template service format
      const serviceOptionsData = (dataSource || []).flatMap(category => {
        const mapItemsWithUuidAsId = (items: unknown): unknown[] => {
          if (!Array.isArray(items)) return [];
          return items.map((item: any) => ({
            ...item,
            id: item?.uuid || item?.id,
          }));
        };
        console.log(
          'Processing category:',
          category.name,
          'with',
          category.serviceOptions.length,
          'services'
        );
        return (category.serviceOptions || []).map(serviceOption => {
          console.log('Processing service option:', {
            id: serviceOption.id,
            name: serviceOption.name,
            materials: serviceOption.materials?.length || 0,
            finishes: serviceOption.finishes?.length || 0,
            tools: serviceOption.tools?.length || 0,
          });
          // Debug: Check what materials, finishes, and tools contain
          console.log('serviceOption.materials:', serviceOption.materials);
          console.log('serviceOption.finishes:', serviceOption.finishes);
          console.log('serviceOption.tools:', serviceOption.tools);

          const serviceData = {
            service_id: serviceOption.uuid || serviceOption.id,
            description: serviceOption.description || serviceOption.name,
            qty: serviceOption.qty ?? 1,
            rate: serviceOption.rate, // Use the user's input rate, not the calculated price
            materials: mapItemsWithUuidAsId(serviceOption.materials),
            finishes: mapItemsWithUuidAsId(serviceOption.finishes),
            tools: mapItemsWithUuidAsId(serviceOption.tools),
          };
          console.log('Storing service data:', {
            description: serviceData.description,
            qty: serviceData.qty,
            rate: serviceData.rate,
            price: serviceOption.price,
            materials: serviceData.materials?.length || 0,
            finishes: serviceData.finishes?.length || 0,
          });
          console.log('Materials being stored:', serviceData.materials);
          console.log('Finishes being stored:', serviceData.finishes);
          return serviceData;
        });
      });

      console.log(
        'Final transformed data for localStorage:',
        serviceOptionsData
      );
      console.log('Total services to save:', serviceOptionsData.length);

      // Save ONLY to the single key 'service_options_template' as requested
      localStorage.setItem(
        'service_options_template',
        JSON.stringify(serviceOptionsData)
      );

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('customStorageChange'));

      console.log(
        'LocalStorage updated successfully with key: service_options_template'
      );
      console.log(
        'Current localStorage content:',
        localStorage.getItem('service_options_template')
      );
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };

  // Legacy function for backward compatibility - now just calls the centralized function

  // Function to update localStorage immediately when materials, finishes, or tools change
  // This is now handled by the main updateLocalStorage function below

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load ONLY from the single key 'service_options_template'
      const generalData = localStorage.getItem('service_options_template');
      if (generalData) {
        const parsedGeneralData = JSON.parse(generalData);
        if (Array.isArray(parsedGeneralData) && parsedGeneralData.length > 0) {
          console.log('Loading data from localStorage:', parsedGeneralData);

          // Transform the general format back to categories format
          const transformedCategories: ServiceCategory[] = [
            {
              id: '0',
              uniqueKey: generateUniqueKey('category', '0', 0),
              name: 'General Services',
              total: 0.0,
              isExpanded: true,
              serviceOptions: parsedGeneralData
                .filter(service => service && typeof service === 'object')
                .map((service: any, index: number) => {
                  // Calculate the proper trade total for the price field
                  const totals = calculateServiceOptionTotals({
                    rate: service.rate,
                    qty: service.qty ?? 1,
                    materials: service.materials || [],
                    finishes: service.finishes || [],
                  });

                  return {
                    id: `service-option-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                    uuid: service.service_id,
                    name: service.description,
                    description: service.description,
                    rate: service.rate, // User input rate
                    price: totals.tradeTotal, // Calculated trade total for sidebar
                    qty: service.qty ?? 1,
                    duration: '',
                    category: 'General Services',
                    materials: Array.isArray(service.materials)
                      ? service.materials.map(
                          (material: any, index: number) => ({
                            ...material,
                            id:
                              material.id ||
                              material.uuid ||
                              `material-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                          })
                        )
                      : [],
                    finishes: Array.isArray(service.finishes)
                      ? service.finishes.map((finish: any, index: number) => ({
                          ...finish,
                          id:
                            finish.id ||
                            finish.uuid ||
                            `finish-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                        }))
                      : [],
                    tools: Array.isArray(service.tools)
                      ? service.tools.map((tool: any, index: number) => ({
                          ...tool,
                          id:
                            tool.id ||
                            tool.uuid ||
                            `tool-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                        }))
                      : [],
                  };
                }),
            },
          ];
          setCategories(transformedCategories);
          // Auto-select the loaded category and first service option to avoid creating duplicates
          setSelectedCategoryId('0');
          setSelectedCategory('0');
          setSelectedCategoryUniqueKey(transformedCategories[0]!.uniqueKey);
          const firstLoaded = transformedCategories[0]!.serviceOptions[0];
          if (firstLoaded) {
            setSelectedServiceOption(firstLoaded.id);
            setShowServiceForm(true);
          }
        } else {
          // If no data in localStorage, create initial empty state and save it
          console.log('No data in localStorage, creating initial empty state');
          const initialCategory: ServiceCategory = {
            id: '0',
            uniqueKey: generateUniqueKey('category', '0', 0),
            name: 'General Services',
            total: 0.0,
            serviceOptions: [],
            isExpanded: true,
          };
          setCategories([initialCategory]);

          // Save initial empty state to localStorage
          setTimeout(() => {
            console.log('Saving initial empty state to localStorage');
            updateLocalStorage();
          }, 0);
        }
      } else {
        // If localStorage key doesn't exist, create initial empty state and save it
        console.log(
          'LocalStorage key does not exist, creating initial empty state'
        );
        const initialCategory: ServiceCategory = {
          id: '0',
          uniqueKey: generateUniqueKey('category', '0', 0),
          name: 'General Services',
          total: 0.0,
          serviceOptions: [],
          isExpanded: true,
        };
        setCategories([initialCategory]);
        setSelectedCategoryId('0');
        setSelectedCategory('0');
        setSelectedCategoryUniqueKey(initialCategory.uniqueKey);

        // Save initial empty state to localStorage
        setTimeout(() => {
          console.log('Saving initial empty state to localStorage');
          updateLocalStorage();
        }, 0);
      }
    } catch (error) {
      console.error('Error loading service options from localStorage:', error);

      // If there's an error, create initial empty state and save it
      console.log(
        'Error loading from localStorage, creating initial empty state'
      );
      const initialCategory: ServiceCategory = {
        id: '0',
        uniqueKey: generateUniqueKey('category', '0', 0),
        name: 'General Services',
        total: 0.0,
        serviceOptions: [],
        isExpanded: true,
      };
      setCategories([initialCategory]);
      setSelectedCategoryId('0');
      setSelectedCategory('0');
      setSelectedCategoryUniqueKey(initialCategory.uniqueKey);

      // Save initial empty state to localStorage
      setTimeout(() => {
        console.log('Saving initial empty state to localStorage after error');
        updateLocalStorage();
      }, 0);
    }
  }, []);

  // Save state whenever categories change - REMOVED to prevent infinite loop
  // localStorage is now updated only when explicitly needed (add/update/delete operations)

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
        uniqueKey: generateUniqueKey('category', '0', 0),
        name: 'General Services',
        total: 0.0,
        isExpanded: true,
        serviceOptions: [],
      };

      setCategories(_prev => {
        const updatedCategories = ensureUniqueKeys([defaultCategory]);

        // Update localStorage from within the callback to ensure state is updated
        setTimeout(() => updateLocalStorage(), 0);

        return updatedCategories;
      });
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
      uniqueKey: generateUniqueKey(
        'category',
        categorySequenceNumber.toString(),
        categorySequenceNumber
      ),
      name: `Category ${categories.length + 1}`,
      total: 0.0,
      isExpanded: true,
      serviceOptions: [],
    };

    setCategories(prev => {
      const updatedCategories = ensureUniqueKeys([...prev, newCategory]);

      // Update localStorage from within the callback to ensure state is updated
      setTimeout(() => updateLocalStorage(), 0);

      return updatedCategories;
    });
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

    setCategories(prev => {
      const updatedCategories = ensureUniqueKeys(
        prev.map(category =>
          category.id === selectedCategoryId
            ? {
                ...category,
                serviceOptions: [...category.serviceOptions, newServiceOption],
              }
            : category
        )
      );

      // Update localStorage from within the callback to ensure state is updated
      setTimeout(() => {
        updateAllCalculations();
        updateLocalStorage(); // Update localStorage when adding new service option
      }, 0);

      return updatedCategories;
    });
    setSelectedServiceOption(newServiceOption.id);
    setShowServiceForm(true);
    setNewlyCreatedServiceOption(null); // Clear any previously created service option
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

  const handleServiceOptionUpdate = (updatedServiceOption: ServiceOption) => {
    console.log('handleServiceOptionUpdate called with:', updatedServiceOption);
    console.log('Materials in update:', updatedServiceOption.materials);
    console.log('Finishes in update:', updatedServiceOption.finishes);
    console.log('Tools in update:', updatedServiceOption.tools);
    if (selectedServiceOption) {
      setCategories(prev => {
        console.log('Previous categories state:', prev);
        const updatedCategories = prev.map(category =>
          (
            selectedCategoryUniqueKey
              ? category.uniqueKey === selectedCategoryUniqueKey
              : category.id === selectedCategoryId
          )
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
        console.log('Updated categories state:', updatedCategories);
        const ensured = ensureUniqueKeys(updatedCategories);
        // Update localStorage after state update with latest snapshot
        setTimeout(() => {
          console.log(
            'Calling updateLocalStorage from handleServiceOptionUpdate'
          );
          updateLocalStorage(ensured);
        }, 0);
        return ensured;
      });
    }
  };

  const handleServiceOptionDelete = (serviceOptionId: string) => {
    if (selectedCategory && selectedCategoryUniqueKey) {
      setCategories(prev => {
        const updatedCategories = ensureUniqueKeys(
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

        // Update localStorage from within the callback to ensure state is updated
        setTimeout(() => {
          updateAllCalculations();
          updateLocalStorage(); // Update localStorage when deleting service option
        }, 0);

        return updatedCategories;
      });
    }
  };

  const handleEditClick = () => {
    setEditingCategoryName(selectedCategoryData?.name || 'Category');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (editingCategoryName.trim()) {
      setCategories(prev => {
        const updatedCategories = ensureUniqueKeys(
          prev.map(category =>
            category.id === selectedCategoryId
              ? { ...category, name: editingCategoryName.trim() }
              : category
          )
        );

        // Update localStorage from within the callback to ensure state is updated
        setTimeout(() => updateLocalStorage(), 0);

        return updatedCategories;
      });
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
            uniqueKey: generateUniqueKey('category', '0', 0),
            name: 'General Services',
            total: 0.0,
            serviceOptions: [],
            isExpanded: true,
          };
          setSelectedCategoryId('0');

          // Update localStorage from within the callback to ensure state is updated
          setTimeout(() => updateLocalStorage(), 0);

          return ensureUniqueKeys([defaultCategory]);
        } else {
          if (filteredCategories.length > 0) {
            setSelectedCategoryId(filteredCategories[0]!.id);
          }

          // Update localStorage from within the callback to ensure state is updated
          setTimeout(() => updateLocalStorage(), 0);

          return ensureUniqueKeys(filteredCategories);
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

  const handleSave = async () => {
    try {
      updateLocalStorage();

      if (props.onSaveSuccess) {
        props.onSaveSuccess();
      }
    } catch (error) {
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
        selectedServiceOptionData={selectedServiceOptionData}
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
                key={`${selectedServiceOptionData?.uuid || selectedServiceOptionData?.id || 'default'}-${selectedServiceOptionData?.name || 'new'}-${formKey}`}
                tradeId={props.tradeId} // Pass trade ID for service filtering
                onTotalsChange={({ tradeTotal }) => {
                  // Keep the three purple totals in the header in sync with form
                  // We persist trade total (including materials and finishes) on the selected service option
                  console.log(
                    'onTotalsChange called with tradeTotal:',
                    tradeTotal
                  );
                  if (selectedServiceOption) {
                    setCategories(prev => {
                      // Check if the price actually needs to be updated
                      const targetCategory = prev.find(category =>
                        selectedCategoryUniqueKey
                          ? category.uniqueKey === selectedCategoryUniqueKey
                          : category.id === selectedCategoryId
                      );

                      if (!targetCategory) return prev;

                      const targetService = targetCategory.serviceOptions.find(
                        opt => opt.id === selectedServiceOption
                      );

                      // If price hasn't changed, don't update state
                      if (targetService && targetService.price === tradeTotal) {
                        return prev;
                      }

                      const updated = prev.map(category =>
                        (
                          selectedCategoryUniqueKey
                            ? category.uniqueKey === selectedCategoryUniqueKey
                            : category.id === selectedCategoryId
                        )
                          ? {
                              ...category,
                              serviceOptions: category.serviceOptions.map(
                                opt =>
                                  opt.id === selectedServiceOption
                                    ? {
                                        ...opt,
                                        price: tradeTotal,
                                        // Debug log
                                        _debug: {
                                          oldPrice: opt.price,
                                          newPrice: tradeTotal,
                                        },
                                      }
                                    : opt
                              ),
                              total: category.serviceOptions.reduce(
                                (sum, opt) =>
                                  sum +
                                  (opt.id === selectedServiceOption
                                    ? tradeTotal
                                    : opt.price),
                                0
                              ),
                            }
                          : category
                      );
                      console.log(
                        'Updated categories with new price:',
                        updated
                      );
                      setTimeout(() => updateLocalStorage(updated), 0);
                      return ensureUniqueKeys(updated);
                    });
                  }
                }}
                service={{
                  id:
                    newlyCreatedServiceOption?.uuid ||
                    newlyCreatedServiceOption?.id ||
                    selectedServiceOptionData?.uuid ||
                    selectedServiceOptionData?.id ||
                    'default',
                  name:
                    newlyCreatedServiceOption?.name ||
                    selectedServiceOptionData?.name ||
                    'New Service Option',
                  description:
                    newlyCreatedServiceOption?.description ||
                    selectedServiceOptionData?.description ||
                    '',
                  qty:
                    newlyCreatedServiceOption?.qty ||
                    selectedServiceOptionData?.qty ||
                    1,
                  rate:
                    newlyCreatedServiceOption?.rate ||
                    selectedServiceOptionData?.rate ||
                    (selectedServiceOptionData?.qty &&
                    selectedServiceOptionData?.price
                      ? selectedServiceOptionData.price /
                        selectedServiceOptionData.qty
                      : 0),
                  lineTotal:
                    newlyCreatedServiceOption?.price ||
                    selectedServiceOptionData?.price ||
                    0,
                  serviceTotal:
                    newlyCreatedServiceOption?.price ||
                    selectedServiceOptionData?.price ||
                    0,
                  tradeTotal:
                    newlyCreatedServiceOption?.price ||
                    selectedServiceOptionData?.price ||
                    0,
                  materials: (
                    newlyCreatedServiceOption?.materials ||
                    selectedServiceOptionData?.materials ||
                    []
                  ).map((material: any) => ({
                    ...material,
                    id:
                      material.id ||
                      material.uuid ||
                      `material-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                  })),
                  finishes: (
                    newlyCreatedServiceOption?.finishes ||
                    selectedServiceOptionData?.finishes ||
                    []
                  ).map((finish: any) => ({
                    ...finish,
                    id:
                      finish.id ||
                      finish.uuid ||
                      `finish-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                  })),
                  tools: (
                    newlyCreatedServiceOption?.tools ||
                    selectedServiceOptionData?.tools ||
                    []
                  ).map((tool: any) => ({
                    ...tool,
                    id:
                      tool.id ||
                      tool.uuid ||
                      `tool-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                  })),
                  serviceOptions: [],
                  ...(newlyCreatedServiceOption?.uuid
                    ? { uuid: newlyCreatedServiceOption.uuid }
                    : selectedServiceOptionData?.uuid
                      ? { uuid: selectedServiceOptionData.uuid }
                      : {}),
                }}
                onMaterialAdd={newMaterial => {
                  console.log('onMaterialAdd called with:', newMaterial);
                  // Update the selected service option with the new material
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  console.log('baseOption for material add:', baseOption);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      materials: [...(baseOption.materials || []), newMaterial],
                    } as ServiceOption;
                    console.log(
                      'Updated service option with new material:',
                      updatedServiceOption
                    );
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onFinishAdd={newFinish => {
                  // Update the selected service option with the new finish
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      finishes: [...(baseOption.finishes || []), newFinish],
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onAddTool={newTool => {
                  // Update the selected service option with the new tool
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      tools: [...(baseOption.tools || []), newTool],
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onMaterialUpdate={(materialId, updatedMaterial) => {
                  // Update the specific material in the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      materials: (baseOption.materials || []).map(m =>
                        (m as unknown as { id?: string }).id === materialId
                          ? updatedMaterial
                          : m
                      ),
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onMaterialDelete={materialId => {
                  // Remove the specific material from the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      materials: (baseOption.materials || []).filter(
                        m => (m as unknown as { id?: string }).id !== materialId
                      ),
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onFinishUpdate={(finishId, updatedFinish) => {
                  // Update the specific finish in the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      finishes: (baseOption.finishes || []).map(f =>
                        (f as unknown as { id?: string }).id === finishId
                          ? updatedFinish
                          : f
                      ),
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onFinishDelete={finishId => {
                  // Remove the specific finish from the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      finishes: (baseOption.finishes || []).filter(
                        f => (f as unknown as { id?: string }).id !== finishId
                      ),
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onRemoveTool={toolId => {
                  // Remove the specific tool from the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      tools: (baseOption.tools || []).filter(
                        t => (t as unknown as { id?: string }).id !== toolId
                      ),
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onReplaceTools={newTools => {
                  // Replace all tools in the selected service option
                  const baseOption =
                    selectedServiceOptionData ||
                    (selectedServiceOption && selectedCategoryData
                      ? selectedCategoryData.serviceOptions.find(
                          opt => opt.id === selectedServiceOption
                        ) || null
                      : null);
                  if (baseOption) {
                    const updatedServiceOption = {
                      ...baseOption,
                      tools: newTools,
                    } as ServiceOption;
                    handleServiceOptionUpdate(updatedServiceOption);
                  }
                }}
                onServiceUpdate={updatedService => {
                  console.log('onServiceUpdate called with:', updatedService);
                  if (selectedServiceOptionData) {
                    // Get the current service data from categories state to ensure we have the latest materials, finishes, and tools
                    const currentServiceData = categories
                      .find(cat =>
                        selectedCategoryUniqueKey
                          ? cat.uniqueKey === selectedCategoryUniqueKey
                          : cat.id === selectedCategoryId
                      )
                      ?.serviceOptions.find(
                        opt => opt.id === selectedServiceOption
                      );

                    console.log('currentServiceData:', currentServiceData);
                    console.log(
                      'selectedServiceOptionData:',
                      selectedServiceOptionData
                    );
                    console.log(
                      'currentServiceData materials:',
                      currentServiceData?.materials
                    );
                    console.log(
                      'selectedServiceOptionData materials:',
                      selectedServiceOptionData?.materials
                    );

                    // Update existing service option - preserve materials, finishes, and tools from form
                    const updatedServiceOption: ServiceOption = {
                      ...(currentServiceData || selectedServiceOptionData), // Use current state data if available
                      name: updatedService.name,
                      description: updatedService.description,
                      rate: updatedService.rate,
                      price: updatedService.serviceTotal, // Store the calculated service total as price
                      qty:
                        updatedService.qty ??
                        (currentServiceData?.qty ||
                          selectedServiceOptionData?.qty ||
                          1),
                      // Use materials, finishes, and tools from the form's updatedService
                      materials: updatedService.materials || [],
                      finishes: updatedService.finishes || [],
                      tools: updatedService.tools || [],
                    };
                    console.log(
                      'updatedServiceOption materials:',
                      updatedServiceOption.materials
                    );
                    if (updatedService.uuid) {
                      (
                        updatedServiceOption as unknown as { uuid?: string }
                      ).uuid = updatedService.uuid;
                    }
                    handleServiceOptionUpdate(updatedServiceOption);
                  } else {
                    // Create new service option
                    const uniqueId = `service-option-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
                    const newServiceOption: ServiceOption = {
                      id: uniqueId,
                      name: updatedService.name,
                      description: updatedService.description,
                      rate: updatedService.rate,
                      price: updatedService.serviceTotal, // Store the calculated service total as price
                      qty: updatedService.qty ?? 1,
                      duration: '',
                      category: selectedCategoryData?.name || 'General',
                    };
                    if (updatedService.uuid) {
                      (newServiceOption as unknown as { uuid?: string }).uuid =
                        updatedService.uuid;
                    }

                    // Add to categories and update localStorage from within the callback
                    setCategories(prev => {
                      const updatedCategories = ensureUniqueKeys(
                        prev.map(category =>
                          category.id === selectedCategoryId
                            ? {
                                ...category,
                                // Replace instead of append to ensure only one service option exists
                                serviceOptions: [newServiceOption],
                              }
                            : category
                        )
                      );

                      // Update localStorage from within the callback to ensure state is updated
                      setTimeout(() => {
                        console.log(
                          'Calling updateLocalStorage for new service option from setCategories callback'
                        );
                        updateLocalStorage(updatedCategories);
                      }, 0);

                      return updatedCategories;
                    });

                    // Set as selected
                    setSelectedServiceOption(newServiceOption.id);

                    // Force re-render by updating the form key
                    setFormKey(prev => prev + 1);

                    // Store the new service option data for immediate use
                    setNewlyCreatedServiceOption(newServiceOption);
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
