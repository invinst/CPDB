var count = 0;

module.exports = {
  CHANGE_EVENT: count++,
  SET_ACTIVE_NAV_ITEM: count++,
  RECEIVED_SEARCH_TRAFFIC_DATA: count++,
  SET_ACTIVE_QUERY_ITEM: count++,
  SET_PERIOD: count++,
  WINDOW_SIZE_CHANGED: count++,

  RECEIVED_SEARCH_RESULTS_DATA: count++,

  SHOW_ADD_ALIAS_MODAL: count++,
  HIDE_ADD_ALIAS_MODAL: count++,
  RECEIVED_ALIAS_CREATION_RESULT: count++,
  FAILED_TO_CREATE_ALIAS: count++,
  ALIAS_MODAL_FORM_DATA_CHANGED: count++,

  SET_QUERY_LIST_ACTIVE_ITEM: count++,
  SEARCH_FOR_SUGGESTIONS: count++,
  LOAD_MORE_SEARCH_RESULTS_DATA: count++,
  LOCK_SCROLL: count++,
  SORT_QUERY_LIST: count++,

  SEARCH_OFFICER_WITH_QUERY: count++,
  RECEIVED_OFFICER_LIST: count++,
  SET_ACTIVE_OFFICER: count++,
  OFFICE_SECTION_ON_LOAD: count++,
  RECEIVE_OFFICER: count++,
  UPDATE_OFFICER_DATA: count++,
  UPDATED_OFFICER_DATA: count++,
  SET_OFFICER_TAB_ACTIVE: count++,
  UPDATE_STORY_DATA: count++,
  STORY_CREATED: count++,
  RECEIVED_STORY_LIST: count++,
  EDIT_STORY: count++,
  STORY_UPDATED: count++,
  STORY_DELETED: count++,
  SELECT_STORY: count++,
  SELECT_ALL_STORY: count++,
  DELETE_BULK_STORY: count++,
  CLEAR_STORY_FORM: count++,

  RECEIVED_DOCUMENT_LIST: count++,
  SET_DOCUMENT_ACTIVE_TAB: count++,
  RECEIVED_MORE_DOCUMENT_RESULTS_DATA: count++,
  LOCK_SCROLL_DOCUMENT_LIST: count++,
  SHOW_ADD_DOCUMENT_LINK_MODAL: count++,
  DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED: count++,
  DOCUMENT_LINK_ADDED: count++,
  FAILED_ADD_DOCUMENT_LINK: count++,
  HIDE_ADD_DOCUMENT_LINK_MODAL: count++,

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

  DOCUMENT_STATUS: {
    'fulfilled': {
      'text': 'Fulfilled',
      'icon': 'check'
    },
    'missing': {
      'text': 'Missing',
      'icon': 'exclamation-circle'
    },
    'requesting': {
      'text':'Requesting',
      'icon': 'circle-o-notch'
    }
  },

  NAVIGATION_ITEMS: [
    { page: '/', icon: 'bar-chart', text: 'Overview'},
    { page: '/search', icon: 'tags', text: 'Search Results' },
    { page: '/officer', icon: 'user', text: 'Officer Profiles' },
    { page: '/document', icon: 'folder-open', text: 'Investigation Documents' }
  ],

  SEARCH_TRAFFIC_API_ENDPOINT: '/api/dashboard/search-traffic/',
  SEARCH_RESULTS_API_ENDPOINT: '/api/dashboard/query-data/',
  ALIAS_API_ENDPOINT: '/api/dashboard/alias/',
  OFFICER_END_POINT: '/api/dashboard/officers/',
  STORY_END_POINT: '/api/dashboard/stories/',
  DOCUMENT_END_POINT: '/api/dashboard/documents/',
  DOCUMENT_REQUEST_END_POINT: '/api/dashboard/document-requests/',
  DOCUMENT_LINK_END_POINT: '/api/dashboard/document-link/'
};
