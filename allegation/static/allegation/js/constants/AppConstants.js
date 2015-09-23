var count = 0;
module.exports = {
  CHANGE_EVENT: count++,
  SET_ACTIVE_COMPLAINT_LIST_FILTER: count++,
  RECEIVED_OUTCOME_FILTER_ANALYSIS: count++,
  COMPLAINT_LIST_RECEIVED_DATA: count++,
  COMPLAINT_LIST_RECEIVED_MORE_DATA: count++,
  COMPLAINT_LIST_GET_DATA: count++,
  COMPLAINT_LIST_GET_MORE_DATA: count++,

  OFFICER_COMPLAINT_LIST_RECEIVED_DATA: count++,
  OFFICER_MOUSE_OUT: count++,
  MAP_CHANGE_FILTER: count++,
  MAP_REPLACE_FILTERS: count++,
  MAP_ADD_FILTER: count++,
  SET_SUMMARY: count++,
  OFFICER_VIEW_MORE: count++,
  SET_ACTIVE_OFFICER: count++,
  SET_OFFICER_LIST_FILTER: count++,
  INIT: count++,
  SAVE_SESSION:'SAVE_SESSION',
  ENTER_EMBED_MODE: count++,
  LEAVE_EMBED_MODE: count++,


  AVG_COMPLAINTS_NUMBER_GREEN: 20,
  AVG_COMPLAINTS_NUMBER_YELLOW: 60,
  MAX_OFFICER_NAME_LENGTH: 20,

  MAP_TOKEN: 'pk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiVnBNOEp4byJ9.7i2N7gTV-t_QtAA-kAAlFA',
  MAP_TYPE: 'mapbox.streets',

  NUMERAL_FORMAT: '0,0',

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
