module.exports = {
  CHANGE_EVENT: 0,
  SET_ACTIVE_NAV_ITEM: 1,
  RECEIVED_SEARCH_TRAFFIC_DATA: 2,
  SET_ACTIVE_QUERY_ITEM: 3,
  SET_PERIOD: 4,
  WINDOW_SIZE_CHANGED: 5,

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

  SEARCH_TRAFFIC_ENDPOINT: '/api/admin/search-traffic/',
};
