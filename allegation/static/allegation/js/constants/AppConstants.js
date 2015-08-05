module.exports = {
  SET_ACTIVE_COMPLAINT_LIST_FILTER: 1,

  AVG_COMPLAINTS_NUMBER_GREEN: 20,
  AVG_COMPLAINTS_NUMBER_YELLOW: 60,
  MAX_OFFICER_NAME_LENGTH: 20,

  FILTERS: {
    'all': 'All',
    'disciplined': 'Disciplined',
    'sustained': 'Sustained',
    'not-sustained': 'Not Sustained',
    'exonerated': 'Exonerated',
    'unfounded': 'Unfounded',
    'other': 'Other'
  },

  FILTER_CODES: {
    'sustained': 'SU',
    'not-sustained': 'NS',
    'exonerated': 'EX',
    'unfounded': 'UN',
    'other': ['NC', 'NA', 'DS']
  }
};
