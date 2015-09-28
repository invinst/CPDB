module.exports = {
  CHANGE_EVENT: 0,
  SET_ACTIVE_NAV_ITEM: 1,
  RECEIVED_SEARCH_TRAFFIC_DATA: 2,
  SET_ACTIVE_QUERY_ITEM: 3,
  SET_PERIOD: 4,
  WINDOW_SIZE_CHANGED: 5,

  RECEIVED_SEARCH_RESULTS_DATA: 6,

  SHOW_ADD_ALIAS_MODAL: 7,
  HIDE_ADD_ALIAS_MODAL: 8,
  RECEIVED_ALIAS_CREATION_RESULT: 9,
  FAILED_TO_CREATE_ALIAS: 10,

  SET_QUERY_LIST_ACTIVE_ITEM: 11,
  SEARCH_FOR_SUGGESTIONS: 12,
  LOAD_MORE_SEARCH_RESULTS_DATA: 13,
  LOCK_SCROLL: 14,
  SORT_QUERY_LIST: 15,

  SEARCH_OFFICER_WITH_QUERY: 15,
  RECEIVED_OFFICER_LIST: 16,
  SET_ACTIVE_OFFICER: 17,
  OFFICE_SECTION_ON_LOAD: 18,
  RECEIVE_OFFICER: 19,
  UPDATE_OFFICER_DATA: 20,
  UPDATED_OFFICER_DATA: 21,
  SET_OFFICER_TAB_ACTIVE: 22,
  UPDATE_STORY_DATA: 23,
  STORY_CREATED: 24,
  RECEIVED_STORY_LIST: 25,
  EDIT_STORY: 26,
  STORY_UPDATED: 27,
  STORY_DELETED: 28,
  SELECT_STORY: 29,
  SELECT_ALL_STORY: 30,
  DELETE_BULK_STORY: 31,
  CLEAR_STORY_FORM: 32,

  RECEIVED_DOCUMENT_LIST: 33,
  SET_DOCUMENT_ACTIVE_TAB: 34,
  RECEIVED_MORE_DOCUMENT_RESULTS_DATA: 35,
  LOCK_SCROLL_DOCUMENT_LIST: 36,

  QUERY_LIST_FILTERS: {
    'all': 'All',
    'fail-attempts': 'Fail attempts',
    'alias': 'Alias'
  },

  PERIODS: {
    'day': 'Daily',
    'week': 'Weekly',
    'month': 'Monthly'
  },

  RACES: [
    'Black',
    'Hispanic',
    'White',
    'Asian',
    'Unknown',
    'Native American'
  ],

  NAVIGATION_ITEMS: [
    { page: '/', icon: 'bar-chart', text: 'Overview'},
    { page: '/search', icon: 'tags', text: 'Search Results' },
    { page: '/officer', icon: 'user', text: 'Officer Profiles' },
    { page: '/document', icon: 'folder-open-o', text: 'Investigation Documents' }
  ],

  SEARCH_TRAFFIC_API_ENDPOINT: '/api/dashboard/search-traffic/',
  SEARCH_RESULTS_API_ENDPOINT: '/api/dashboard/query-data/',
  ALIAS_API_ENDPOINT: '/api/dashboard/alias/',
  OFFICER_END_POINT: '/api/dashboard/officers/',
  STORY_END_POINT: '/api/dashboard/stories/',
  DOCUMENT_END_POINT: '/api/dashboard/documents/',
  DOCUMENT_REQUEST_END_POINT: '/api/dashboard/document-requests/',
};
