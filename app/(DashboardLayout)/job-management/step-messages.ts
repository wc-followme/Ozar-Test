// Step form messages constants

export const STEP_MESSAGES = {
  // General Info Step
  GENERAL_INFO_TITLE: 'General information',
  GENERAL_INFO_DESCRIPTION:
    'Please answer the required questions to start your project. This helps us generate a personalized quote for you.',

  // Optional Details Step
  OPTIONAL_DETAILS_TITLE: 'Optional Details',
  OPTIONAL_DETAILS_DESCRIPTION:
    'Help us understand your needs better. Answer these questions or leave them for later.',

  // Project Type Step
  PROJECT_TYPE_TITLE: 'Which type of project do you need for your home?',
  PROJECT_TYPE_DESCRIPTION:
    'Choose the project category to help us provide accurate planning and estimates.',
  PROJECT_TYPE_REQUIRED: 'Please select a project type',

  // Form Labels
  YOUR_NAME_LABEL: 'Your Name',
  PROJECT_START_DATE_LABEL: 'Project Start Date',
  PROJECT_FINISH_DATE_LABEL: 'Project Finish Date',
  EMAIL_LABEL: 'Email',
  PHONE_NUMBER_LABEL: 'Phone Number',
  YOUR_BUDGET_LABEL: 'Your Budget',
  PREFERRED_CONTRACTOR_LABEL: 'Preferred Contractor',
  ADDRESS_LABEL: 'Address',
  PREFERRED_CONTACT_METHOD_LABEL: 'Preferred contact method',
  BEST_TIME_TO_CONTACT_LABEL: 'Best time to contact',

  // Optional Details Form Labels
  TYPE_OF_PROPERTY_LABEL: 'Type of Property',
  AGE_OF_PROPERTY_LABEL: 'Age of Property',
  APPROX_SQ_FT_LABEL: 'Approx. sq ft',
  NOTIFICATION_STYLE_LABEL: 'Notification Style',
  DAILY_WORK_TIMING_LABEL: 'Daily Work Timing',
  OWNER_PRESENT_LABEL: 'Owner Need to Be Present',
  WEEKEND_WORK_LABEL: 'Weekend Work Availability',
  ANIMALS_IN_HOME_LABEL: 'Animals in the Home',
  PET_TYPE_LABEL: 'Pet type?',

  // Form Placeholders
  ENTER_FULL_NAME: 'Enter your full name',
  ENTER_EMAIL: 'Enter your email',
  ENTER_PHONE_NUMBER: 'Enter your number',
  ENTER_BUDGET: 'Enter your Budget',
  ENTER_ADDRESS: 'Enter your address',
  SELECT_DATE: 'Select Date',
  SELECT_CONTRACTOR: 'Select contractor',
  LOADING_CONTRACTORS: 'Loading contractors...',
  SELECT_CONTACT_METHOD: 'Select contact method',
  SELECT_START_TIME: 'Select start time',
  SELECT_END_TIME: 'Select end time',

  // Optional Details Placeholders
  RESIDENTIAL: 'Residential',
  SELECT_AGE: 'Select age',
  APPROX_SQ_FT_PLACEHOLDER: '2500 Sq / Ft',
  EMAIL_NOTIFICATION: 'Email',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  NO: 'No',
  YES: 'Yes',
  SELECT_PET_TYPE: 'Select pet type',

  // Project Type Placeholders
  LOADING_CATEGORIES: 'Loading categories...',
  LOAD_MORE: 'Load More',
  LOADING: 'Loading...',
  DEFAULT: 'Default',
  UNNAMED_CATEGORY: 'Unnamed Category',
  NO_DESCRIPTION: 'No description available',

  // Validation Messages
  FULL_NAME_REQUIRED: 'Full name is required',
  PROJECT_START_DATE_REQUIRED: 'Please select start date',
  PROJECT_FINISH_DATE_REQUIRED: 'Please select finish date',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  PHONE_REQUIRED: 'Phone number is required',
  BUDGET_REQUIRED: 'Budget is required',
  CONTRACTOR_REQUIRED: 'Contractor preference is required',
  ADDRESS_REQUIRED: 'Address is required',
  PREFERRED_CONTACT_METHOD_REQUIRED: 'Preferred contact method is required',
  CONTACT_START_TIME_REQUIRED: 'Contact start time is required',
  CONTACT_END_TIME_REQUIRED: 'Contact end time is required',

  // Optional Details Validation Messages
  PROPERTY_TYPE_REQUIRED: 'Property type is required',
  PROPERTY_AGE_REQUIRED: 'Property age is required',
  SQUARE_FOOTAGE_REQUIRED: 'Square footage is required',
  NOTIFICATION_STYLE_REQUIRED: 'Notification style is required',
  OWNER_PRESENCE_REQUIRED: 'Owner presence preference is required',
  WEEKEND_WORK_REQUIRED: 'Weekend work preference is required',
  ANIMALS_REQUIRED: 'Animals preference is required',
  PET_TYPE_REQUIRED: 'Pet type is required when animals are present',

  // Button Labels
  NEXT_STEP: 'Next Step',
  SUBMIT: 'Submit',
  PREVIOUS: 'Previous',

  // Error Messages
  FETCH_CONTRACTORS_ERROR: 'Error fetching contractors:',
  FETCH_CATEGORIES_ERROR: 'Error fetching categories:',
  FAILED_TO_LOAD_CATEGORIES: 'Failed to load categories',

  // Property Info Step
  PROPERTY_INFO_TITLE: 'Property Information',
  PROPERTY_INFO_DESCRIPTION:
    'Tell us about your property to help us understand your project better.',

  // Project Category Step
  PROJECT_CATEGORY_TITLE: 'Project Category',
  PROJECT_CATEGORY_DESCRIPTION:
    'Select the type of project you want to undertake.',

  // Project Info Step
  PROJECT_INFO_TITLE: 'Project Information',
  PROJECT_INFO_DESCRIPTION:
    'Provide additional details about your project requirements.',

  // Project Estimates Step
  PROJECT_ESTIMATES_TITLE: 'Project Estimates',
  PROJECT_ESTIMATES_DESCRIPTION:
    'Review your project details and get an estimated quote.',

  // Common Step Messages
  STEP_COMPLETED: 'Step completed successfully',
  STEP_ERROR: 'Error completing step',
  GO_BACK: 'Go Back',
  SAVE_DRAFT: 'Save Draft',
  CONTINUE: 'Continue',

  // Form Field Types
  FIELD_TYPES: {
    TEXT: 'text',
    EMAIL: 'email',
    PHONE: 'tel',
    DATE: 'date',
    SELECT: 'select',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
  },

  // Validation Types
  VALIDATION_TYPES: {
    REQUIRED: 'required',
    EMAIL: 'email',
    PHONE: 'phone',
    DATE: 'date',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    PATTERN: 'pattern',
  },
};
