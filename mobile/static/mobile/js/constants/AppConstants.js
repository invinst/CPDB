var c = 0;

module.exports = {
  // MainPage events
  ACTIVATE_SEARCH: c++,
  DEACTIVATE_SEARCH: c++,
  SEARCH_FOR: c++,
  GO_FOR_SEARCH_DETAIL: c++,
  CHANGE_TAB: c++,

  // ComplaintPage events
  COMPLAINT_PAGE_RECEIVED_DATA: c++,
  COMPLAINT_PAGE_FAILED_TO_RECEIVED_DATA: c++,

  // Tokens
  MAPBOX_TOKEN: '',

  // Other constants
  FINAL_FINDINGS: {
    'un': 'Unfounded',
    'ex': 'Exonerated',
    'ns': 'Not Sustained',
    'su': 'Sustained',
    'nc': 'No Cooperation',
    'na': 'No Affidavit',
    'ds': 'Discharged'
  },

  // API endpoints
  ALLEGATION_API_ENDPOINT: '/mobile/api/allegation',

  //Time format
  SIMPLE_DATE_FORMAT: 'MMM DD, YYYY',
  FIRST_AVAILABLE_DATE: '01/01/1970'
};
