module.exports = {
  CHANGE_EVENT: 0,
  SET_ACTIVE_NAV_ITEM: 1,
  RECEIVED_SEARCH_TRAFFIC_DATA: 2,
  SET_ACTIVE_QUERY_ITEM: 3,
  SET_PERIOD: 4,
  WINDOW_SIZE_CHANGED: 5,

  RECEIVED_QUERIES_DATA: 6,

  RECEIVED_QUERY_TRAFFIC_DATA: 7,

  SHOW_ADD_ALIAS_MODAL: 8,
  HIDE_ADD_ALIAS_MODAL: 9,
  RECEIVED_ALIAS_CREATION_RESULT: 10,
  FAILED_TO_CREATE_ALIAS: 11,

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

  SEARCH_TRAFFIC_ENDPOINT: '/api/dashboard/search-traffic/',
  QUERIES_DATA_ENDPOINT: '/api/dashboard/query-data/',
  ALIAS_ENDPOINT: '/api/dashboard/alias/'
};
