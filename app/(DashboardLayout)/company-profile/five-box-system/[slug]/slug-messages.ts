export const SLUG_MESSAGES = {
  // Page titles
  COMPANY_PROFILE: 'Company Profile',
  FIVE_BOX_SYSTEM: '5-box system',
  CATEGORY: 'Category',
  ESTIMATE: 'Estimate',
  UNKNOWN: 'Unknown',

  // Error messages
  BOX_NOT_FOUND: 'Box Not Found',
  BOX_NOT_FOUND_DESCRIPTION: 'The requested box configuration does not exist.',
  BACK_TO_SYSTEM: 'Back to 5-Box System',

  // Estimation page
  NOTHING_HERE_YET: 'Nothing Here Yet',
  ESTIMATION_DESCRIPTION:
    "You haven't created any estimate yet. Start by adding your first one to organize your estimate.",
  ADD_ROOM: 'Add Room',
  ADD_FROM_TEMPLATE: 'Add From Template',
  PREVIOUS: 'Previous',

  // Form actions
  ADD_QUESTION: 'Add Question',
  MANAGE_FIELDS: 'Manage Fields',

  // Question form
  ADD_QUESTION_TITLE: 'Add Question',
  MANAGE_FIELDS_TITLE: 'Manage Fields',
  ANSWER_PLACEHOLDER: 'Type you answer here..',

  // API messages
  UPDATE_SUCCESS: 'Box settings updated successfully',
  UPDATE_ERROR: 'Failed to update box settings',
  FETCH_ERROR: 'Failed to fetch box settings',
} as const;
