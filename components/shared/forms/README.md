# Estimation Components

This directory contains reusable components for estimation forms with accordion functionality.

## Components

### EstimationItemForm
A reusable form component for individual estimation items (materials, finishes, etc.).

**Props:**
- `item: EstimationItem` - The item data to display/edit
- `onItemUpdate?: (updatedItem: EstimationItem) => void` - Callback when item is updated
- `onDelete?: () => void` - Callback when delete button is clicked

### EstimationItemsAccordion
A reusable accordion component that contains multiple EstimationItemForm components.

**Props:**
- `title: string` - The title displayed in the accordion header
- `items: EstimationItem[]` - Array of items to display
- `addButtonText: string` - Text for the add button
- `onAddItem: () => void` - Callback when add button is clicked
- `onItemUpdate: (itemId: string, updatedItem: EstimationItem) => void` - Callback when an item is updated
- `onItemDelete: (itemId: string) => void` - Callback when an item is deleted
- `defaultExpanded?: boolean` - Whether the accordion should be expanded by default

## Usage Example

```tsx
import EstimationItemsAccordion from '@/components/shared/common/EstimationItemsAccordion';

// In your component
<EstimationItemsAccordion
  title="Material"
  items={service.materials}
  addButtonText="+ Material"
  onAddItem={() => handleAddMaterial()}
  onItemUpdate={(itemId, updatedItem) => handleMaterialUpdate(itemId, updatedItem)}
  onItemDelete={(itemId) => handleMaterialDelete(itemId)}
  defaultExpanded={true}
/>
```

## Types

All types are defined in `estimation-types.ts`:

- `EstimationItem` - Interface for individual estimation items
- `ServiceOption` - Interface for service options
- `Service` - Interface for complete service data

## Features

- ✅ Reusable accordion component
- ✅ Common form structure for all estimation items
- ✅ Proper TypeScript typing
- ✅ Currency formatting
- ✅ Responsive design
- ✅ Consistent styling with the existing design system 