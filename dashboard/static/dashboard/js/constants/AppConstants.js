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

  NAVIGATION_ITEMS: [
    { page: '/', icon: 'bar-chart', text: 'Overview'},
    { page: '/search', icon: 'tags', text: 'Search Results' },
    { page: '/officer', icon: 'user', text: 'Officer Profiles' }
  ],

  SEARCH_TRAFFIC_API_ENDPOINT: '/api/dashboard/search-traffic/',
  SEARCH_RESULTS_API_ENDPOINT: '/api/dashboard/query-data/',
  ALIAS_API_ENDPOINT: '/api/dashboard/alias/'
};
