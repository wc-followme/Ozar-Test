# Dynamic Width Utilities

This document explains how to use the dynamic width calculation utilities for responsive components.

## Overview

The dynamic width utilities provide a way to calculate responsive widths based on screen size, with automatic resize handling. This is particularly useful for components like ScrollArea that need to adapt to different screen sizes.

## Available Functions

### `calculateDynamicWidth(options?)`

A utility function that calculates the appropriate width based on current screen size.

**Parameters:**
- `options` (optional): Configuration object with the following properties:
  - `mobilePadding` (default: 32): Padding to subtract on mobile devices
  - `tabletPadding` (default: 48): Padding to subtract on tablets
  - `desktopPadding` (default: 64): Padding to subtract on desktop
  - `maxMobileWidth` (default: 640): Maximum width for mobile breakpoint
  - `maxTabletWidth` (default: 768): Maximum width for tablet breakpoint
  - `maxLargeTabletWidth` (default: 1024): Maximum width for large tablet breakpoint
  - `defaultDesktopWidth` (default: 320): Default width for desktop
  - `buttonWidth` (default: 0): Button width to subtract on mobile/tablet
  - `buttonWidthDesktop` (default: 0): Button width to subtract on desktop

**Returns:** Width in pixels as a string (e.g., "320px")

### `useDynamicWidth(options?)`

A React hook that provides dynamic width calculation with automatic resize handling.

**Parameters:** Same as `calculateDynamicWidth`

**Returns:** Current calculated width that updates on window resize

## Usage Examples

### Basic Usage

```tsx
import { useDynamicWidth } from '@/lib/utils';

function MyComponent() {
  const width = useDynamicWidth();
  
  return (
    <div style={{ width }}>
      Content here
    </div>
  );
}
```

### Custom Configuration

```tsx
import { useDynamicWidth } from '@/lib/utils';

function MyComponent() {
  const width = useDynamicWidth({
    mobilePadding: 16,
    tabletPadding: 32,
    defaultDesktopWidth: 400,
  });
  
  return (
    <div style={{ width }}>
      Content here
    </div>
  );
}
```

### Using the DynamicScrollArea Component

```tsx
import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';

function MyComponent() {
  return (
    <DynamicScrollArea
      widthOptions={{
        mobilePadding: 16,
        defaultDesktopWidth: 400,
      }}
    >
      <div>Scrollable content here</div>
    </DynamicScrollArea>
  );
}
```

### Tab List with Button Example

```tsx
import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';

function TabComponent() {
  const canEdit = true; // Your permission check
  
  return (
    <div className='flex items-center gap-2 w-full'>
      <DynamicScrollArea
        widthOptions={{
          buttonWidth: canEdit ? 42 : 0, // Mobile button width
          buttonWidthDesktop: canEdit ? 120 : 0, // Desktop button width
        }}
      >
        <TabsList>
          {/* Your tab triggers */}
        </TabsList>
      </DynamicScrollArea>
      
      {canEdit && (
        <button className='btn-primary w-[42px] sm:w-auto rounded-full'>
          <Add className='sm:hidden' />
          <span className='hidden sm:inline'>Add Item</span>
        </button>
      )}
    </div>
  );
}
```

## Breakpoint Logic

The width calculation follows this logic:

1. **Mobile** (≤ 640px): `screenWidth - mobilePadding`
2. **Small Tablet** (641px - 768px): `min(screenWidth - tabletPadding, 400px)`
3. **Large Tablet** (769px - 1024px): `min(screenWidth - desktopPadding, 500px)`
4. **Desktop** (≥ 1025px): `defaultDesktopWidth`

## Best Practices

1. **Use the hook for React components** that need to respond to resize events
2. **Use the function for one-time calculations** or non-React contexts
3. **Customize padding values** based on your layout requirements
4. **Test on different screen sizes** to ensure optimal behavior
5. **Consider using the DynamicScrollArea component** for scrollable content

## Implementation Details

- The utilities are SSR-safe and handle cases where `window` is undefined
- Resize listeners are automatically cleaned up when components unmount
- The hook uses `useEffect` to manage resize event listeners
- Width calculations are optimized to prevent unnecessary re-renders 