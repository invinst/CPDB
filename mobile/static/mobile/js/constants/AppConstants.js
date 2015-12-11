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
    'UN': 'Unfounded',
    'EX': 'Exonerated',
    'NS': 'Not Sustained',
    'SU': 'Sustained',
    'NC': 'No Cooperation',
    'NA': 'No Affidavit',
    'DS': 'Discharged',
  },

  // API endpoints
  ALLEGATION_API_ENDPOINT: '/api/allegation'
}
;
