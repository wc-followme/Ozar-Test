// Step form messages constants

export const STEP_MESSAGES = {
  // General Info Step
  GENERAL_INFO_TITLE: 'General information',
  GENERAL_INFO_DESCRIPTION:
    'Please answer the required questions to start your project. This helps us generate a personalized quote for you.',

  // Project Type Step
  PROJECT_TYPE_TITLE: 'Which type of project do you need for your home?',
  PROJECT_TYPE_DESCRIPTION:
    'Choose the project category to help us provide accurate planning and estimates.',
  PROJECT_TYPE_REQUIRED: 'Please select a project type',

  // Form Labels
  YOUR_NAME_LABEL: 'Your name',
  EMAIL_LABEL: 'Email',
  PHONE_NUMBER_LABEL: 'Phone number',
  PREFERRED_CONTRACTOR_LABEL: 'Preferred contractor',
  ADDRESS_LABEL: 'Address',
  PREFERRED_CONTACT_METHOD_LABEL: 'Preferred contact method',
  BEST_TIME_TO_CONTACT_LABEL: 'Best time to contact',

  // Optional Details Form Labels
  ANIMALS_IN_HOME_LABEL: 'Animals in the home',
  PET_TYPE_LABEL: 'Pet type?',

  // Property Information Form Labels
  PROPERTY_LABEL: 'Property',
  PROPERTY_TYPE_LABEL: 'Type of property',
  BHK_LABEL: 'No. of rooms',
  FLOOR_LABEL: 'Floor',
  APPROX_SQ_FT_PROPERTY_LABEL: 'Approx. sq ft',
  AGE_OF_PROPERTY_PROPERTY_LABEL: 'Age of property',

  // Property Information Placeholders
  SELECT_PROPERTY: 'Select property',
  SELECT_PROPERTY_TYPE: 'Select property type',
  SELECT_BHK: 'Select no. of rooms',
  SELECT_FLOOR: 'Select floor',
  SELECT_SQUARE_FOOTAGE: 'Select square footage',
  SELECT_PROPERTY_AGE: 'Select property age',

  // Form Placeholders
  ENTER_FULL_NAME: 'Enter your full name',
  ENTER_EMAIL: 'Enter your email',
  ENTER_PHONE_NUMBER: 'Enter your phone number',
  ENTER_ADDRESS: 'Enter your address',
  SELECT_CONTACT_METHOD: 'Select contact method',
  SELECT_BEST_TIME_TO_CONTACT: 'Select best time to contact',
  SELECT_ANIMALS_IN_HOME: 'Select animals in the home',
  SELECT_PET_TYPE: 'Select pet type',
  ENTER_ANSWER_HERE: 'Type your answer here...',

  // Project Type Placeholders
  LOADING_CATEGORIES: 'Loading categories...',
  LOAD_MORE: 'Load More',
  LOADING: 'Loading...',
  UNNAMED_CATEGORY: 'Unnamed Category',
  NO_DESCRIPTION: 'No description available',

  // Validation Messages
  FULL_NAME_REQUIRED: 'Full name is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_NUMBER_REQUIRED: 'Phone number must contain only numbers',
  ADDRESS_REQUIRED: 'Address is required',
  PREFERRED_CONTACT_METHOD_REQUIRED: 'Preferred contact method is required',
  CONTACT_START_TIME_REQUIRED: 'Contact start time is required',

  // Optional Details Validation Messages
  ANIMALS_REQUIRED: 'Animals preference is required',
  PET_TYPE_REQUIRED: 'Pet type is required when animals are present',

  // Button Labels
  NEXT_STEP: 'Next Step',
  SUBMIT: 'Submit',
  PREVIOUS: 'Previous',

  // Error Messages
  FETCH_CATEGORIES_ERROR: 'Error fetching categories:',
  FAILED_TO_LOAD_CATEGORIES: 'Failed to load categories',
};

// Project Information Messages
export const STEP_PROJECT_INFO_CONSTANTS = {
  // Form Labels
  PROJECT_NAME_LABEL: 'Project name',
  PROJECT_START_DATE_LABEL: 'Project start date',
  PROJECT_FINISH_DATE_LABEL: 'Project finish date',
  OWNER_PRESENCE_LABEL: 'Owner presence',
  WEEKEND_WORK_LABEL: 'Weekend work',
  SHIFT_FROM_LABEL: 'Shift from',
  SHIFT_TIME_LABEL: 'Shift time',
  SHIFT_TO_LABEL: 'Shift to',
  BUDGET_LABEL: 'Your budget',
  PREFERRED_CONTRACTOR_LABEL: 'Preferred contractor',

  // Placeholders
  PROJECT_NAME_PLACEHOLDER: 'Name your project',
  SELECT_START_DATE: 'Select date',
  SELECT_FINISH_DATE: 'Select date',
  SELECT_OWNER_PRESENCE: 'Select option',
  SELECT_WEEKEND_WORK: 'Select option',
  SELECT_SHIFT_FROM: 'Select shift from',
  SELECT_SHIFT_TO: 'Select shift to',
  SELECT_CONTRACTOR: 'Select contractor',
  BUDGET_PLACEHOLDER: 'Enter your budget',
  LOADING_CONTRACTORS: 'Loading contractors...',

  // Options
  ANY_CONTRACTOR: 'Any',
  SPECIFIC_CONTRACTOR: 'Specific Contractor',

  // Validation Messages
  PROJECT_NAME_REQUIRED: 'Project name is required',
  START_DATE_REQUIRED: 'Project start date is required',
  FINISH_DATE_REQUIRED: 'Project finish date is required',
  OWNER_PRESENCE_REQUIRED: 'Owner presence is required',
  WEEKEND_WORK_REQUIRED: 'Weekend work preference is required',
  DAILY_WORK_TIMING_REQUIRED: 'Daily work timing is required',
  BUDGET_REQUIRED: 'Budget is required',
  PREFERRED_CONTRACTOR_REQUIRED: 'Preferred contractor is required',

  // Form Title and Description
  FORM_TITLE: 'Project Information',
  FORM_DESCRIPTION:
    'Tell us more about your project goals and constraints so we can plan efficiently and connect you with the right professionals.',

  // Success Messages
  FORM_SAVED_SUCCESS: 'Project information saved successfully',
  FORM_UPDATED_SUCCESS: 'Project information updated successfully',

  // Error Messages
  FORM_SAVE_ERROR: 'Failed to save project information',
  FORM_LOAD_ERROR: 'Failed to load project information',
  VALIDATION_ERROR: 'Please check the form for errors',
};
