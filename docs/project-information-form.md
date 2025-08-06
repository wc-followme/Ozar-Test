# Project Information Form

## Overview

The Project Information form is a dynamic form component that collects detailed project information from users. It's built using the DynamicForm system and includes various field types with proper validation and user experience features.

## Features

### Form Fields

1. **Project Name** (Text Input)
   - Full-width field spanning both columns
   - Required field with validation (3-100 characters)

2. **Project Start Date** (Date Picker)
   - Calendar popup with date selection
   - Required field

3. **Project Finish Date** (Date Picker)
   - Calendar popup with date selection
   - Required field

4. **Owner Presence** (Dropdown)
   - Options: Yes/No
   - Required field

5. **Weekend Work** (Dropdown)
   - Options: Yes/No
   - Required field

6. **Daily Work Timing** (Time Range)
   - Two time inputs side by side (Start Time and End Time)
   - Clock icons for better UX
   - Required field

7. **Your Budget** (Text Input)
   - Required field with validation (3-50 characters)

8. **Preferred Contractor** (Dropdown)
   - Options: Any/Specific Contractor
   - Required field

### Layout

- **Two-column responsive layout** on desktop
- **Single column** on mobile devices
- Project Name spans full width
- Date fields, dropdowns, and time range are in half-width columns
- Budget and Preferred Contractor are in half-width columns

### Technical Implementation

#### Form Configuration
- Located in `components/shared/dynamicforms/formConfigs.ts`
- Uses constants from `constants/messages.ts` for all text content
- Follows the project's pattern of organizing static content

#### DynamicForm Component Updates
- Added support for `date` field type with calendar popup
- Enhanced `timerange` field to work in two-column layout
- Improved grid layout logic for responsive design
- Added proper date picker integration with Popover and Calendar components

#### Constants
All form text is centralized in `constants/messages.ts` under `PROJECT_MESSAGES`:
- Form labels
- Placeholders
- Options
- Validation messages
- Success/error messages

## Usage

### Basic Usage
```tsx
import { DynamicForm, getFormConfig } from '@/components/shared/dynamicforms';

const config = getFormConfig('project-information');

<DynamicForm
  config={config}
  onSave={handleSave}
  onCancel={handleCancel}
  showHeader={true}
  showActions={false}
  titleAlignment='center'
/>
```

### Test Page
A test page is available at `/project-information-test` to demonstrate the form functionality.

## Field Management

The form supports field management through the `enabledFields` prop, allowing you to show/hide specific fields:

```tsx
const enabledFields = ['projectName', 'projectStartDate', 'budget'];

<DynamicForm
  config={config}
  enabledFields={enabledFields}
  // ... other props
/>
```

## Validation

- All required fields are validated
- Text fields have minimum and maximum length validation
- Date fields ensure valid date selection
- Time range fields validate both start and end times

## Styling

The form uses the project's design system:
- Consistent with other forms in the application
- Responsive design for mobile and desktop
- Proper spacing and typography
- Error states with red borders and messages
- Success states with green indicators

## Integration

The form can be integrated into:
- Multi-step forms
- Modal dialogs
- Side sheets
- Full-page forms
- Any other container that supports the DynamicForm component 