module.exports = {
  CHANGE_EVENT: 'CHANGE_EVENT',
  SET_ACTIVE_COMPLAINT_LIST_FILTER: 1,
  RECEIVED_OUTCOME_FILTER_ANALYSIS: 2,
  COMPLAINT_LIST_RECEIVED_DATA: 3,
  COMPLAINT_LIST_RECEIVED_MORE_DATA: 4,
  COMPLAINT_LIST_GET_DATA: 5,
  COMPLAINT_LIST_GET_MORE_DATA: 6,

  OFFICER_COMPLAINT_LIST_RECEIVED_DATA: 7,
  OFFICER_MOUSE_OUT: 8,

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
  },

  MAP_MARKER_ICON_URL: 'http://data.invisible.institute/static/img/64x_map_marker.png'
};
