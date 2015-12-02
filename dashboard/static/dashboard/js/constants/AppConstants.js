var c = 0;

module.exports = {
  CHANGE_EVENT: c++,
  SET_ACTIVE_NAV_ITEM: c++,
  RECEIVED_SEARCH_TRAFFIC_DATA: c++,
  SET_ACTIVE_QUERY_ITEM: c++,
  SET_PERIOD: c++,
  WINDOW_SIZE_CHANGED: c++,

  RECEIVED_SEARCH_RESULTS_DATA: c++,

  SHOW_ADD_ALIAS_MODAL: c++,
  HIDE_ADD_ALIAS_MODAL: c++,
  RECEIVED_ALIAS_CREATION_RESULT: c++,
  FAILED_TO_CREATE_ALIAS: c++,
  ALIAS_MODAL_FORM_DATA_CHANGED: c++,

  SET_QUERY_LIST_ACTIVE_ITEM: c++,
  SEARCH_FOR_SUGGESTIONS: c++,
  LOAD_MORE_SEARCH_RESULTS_DATA: c++,
  LOCK_SCROLL: c++,
  SORT_QUERY_LIST: c++,

  SEARCH_OFFICER_WITH_QUERY: c++,
  RECEIVED_OFFICER_LIST: c++,
  SET_ACTIVE_OFFICER: c++,
  OFFICE_SECTION_ON_LOAD: c++,
  RECEIVE_OFFICER: c++,
  UPDATE_OFFICER_DATA: c++,
  UPDATED_OFFICER_DATA: c++,
  RESET_OFFICER_DATA: c++,
  SET_OFFICER_TAB_ACTIVE: c++,
  UPDATE_STORY_DATA: c++,
  STORY_CREATED: c++,
  RECEIVED_STORY_LIST: c++,
  EDIT_STORY: c++,
  STORY_UPDATED: c++,
  STORY_DELETED: c++,
  SELECT_STORY: c++,
  SELECT_ALL_STORY: c++,
  DELETE_BULK_STORY: c++,
  CLEAR_STORY_FORM: c++,

  RECEIVED_DOCUMENT_LIST: c++,
  SET_DOCUMENT_ACTIVE_TAB: c++,
  RECEIVED_MORE_DOCUMENT_RESULTS_DATA: c++,
  LOCK_SCROLL_DOCUMENT_LIST: c++,
  SHOW_ADD_DOCUMENT_LINK_MODAL: c++,
  DOCUMENT_LINK_MODAL_FORM_DATA_CHANGED: c++,
  DOCUMENT_LINK_ADDED: c++,
  FAILED_ADD_DOCUMENT_LINK: c++,
  HIDE_ADD_DOCUMENT_LINK_MODAL: c++,
  SET_ACTIVE_ALLEGATION: c++,
  RECEIVED_DOCUMENT: c++,
  DOCUMENT_REQUEST_CANCEL: c++,
  RECEIVED_DOCUMENT_CRID: c++,
  DOCUMENT_PUT_TO_PENDING: c++,
  DOCUMENT_PUT_TO_REQUESTING: c++,
  DOCUMENT_SORT_LIST: c++,
  RECEIVED_DOCUMENT_REQUEST_ANALYSIS: c++,

  RECEIVED_SESSIONS_DATA: c++,
  RECEIVED_MORE_SESSIONS_DATA: c++,
  LOCK_SESSION_PAGE_SCROLL: c++,
  SEARCH_FOR_SESSION: c++,
  RECEIVED_SESSIONS_ALIAS_DATA: c++,
  RECEIVED_MORE_SESSIONS_ALIAS_DATA: c++,
  LOCK_SESSION_ALIAS_PAGE_SCROLL: c++,
  SEARCH_FOR_SESSION_ALIAS: c++,
  SET_SESSION_ACTIVE_TAB: c++,

  RECEIVED_SETTINGS_DATA: c++,
  UPDATE_SETTING_DATA: c++,
  UPDATED_SETTING_DATA: c++,
  FAILED_TO_UPDATE_SETTING_DATA: c++,

  RECEIVED_NEW_SESSIONS_DATA: c++,

  SHOW_ADD_SESSION_ALIAS_MODAL: c++,
  HIDE_ADD_SESSION_ALIAS_MODAL: c++,
  SESSION_ALIAS_MODAL_FORM_DATA_CHANGED: c++,
  RECEIVED_SESSION_ALIAS_CREATION_RESULT: c++,
  FAILED_TO_CREATE_SESSION_ALIAS: c++,
  DELETED_SESSION_ALIAS: c++,

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

  RANKS: [
      ['FTO', 'Field Training Officer'],
      ['LT', 'Lieutenant'],
      ['ET', 'Evidence Technician'],
      ['DET', 'Detective'],
      ['PO', 'Police Officer'],
      ['Cpt', 'Captain'],
      ['SGT', 'Sergeant'],
      ['CMDR', 'Commander'],
      ['Agent', 'Police Agent'],
      ['Chief', 'Chief']
  ],

  DOCUMENT_STATUS: {
    'all': {
      'text': 'All'
    },
    'fulfilled': {
      'text': 'Fulfilled',
      'icon': 'check'
    },
    'missing': {
      'text': 'Missing',
      'icon': 'exclamation-circle'
    },
    'requesting': {
      'text': 'Requested',
      'icon': 'circle-o-notch'
    },
    'pending': {
      'text': 'Pending',
      'icon': 'spinner'
    }
  },

  SESSION_TABS: {
    'all': 'All',
    'alias': 'Alias'
  },

  LINE_CHART_COLOR_OPTIONS: {
    fillColor: "rgba(220,220,220,0.2)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(220,220,220,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)",
  },

  LINE_CHART_OPTIONS: { responsive: true, aspectRatio: true },

  NAVIGATION_ITEMS: [
    { page: '/', icon: 'bar-chart', text: 'Overview'},
    { page: '/search', icon: 'tags', text: 'Search Results' },
    { page: '/officer', icon: 'user', text: 'Officer Profiles' },
    { page: '/document', icon: 'folder-open', text: 'Investigation Documents' },
    { page: '/session', icon: 'history', text: 'Sessions' },
    { page: '/setting', icon: 'cogs', text: 'Settings' }
  ],

  DATE_ONLY_FORMAT: 'YYYY-M-DD',
  HUMAN_READABLE_FORMAT: 'hh:mm a, DD MMM YYYY',
  NUMBER_OF_DAYS_SHOWN_IN_NEW_SESSION_CHART: 30,

  SEARCH_TRAFFIC_API_ENDPOINT: '/api/dashboard/search-traffic/',
  SEARCH_RESULTS_API_ENDPOINT: '/api/dashboard/query-data/',
  ALIAS_API_ENDPOINT: '/api/dashboard/alias/',
  OFFICER_END_POINT: '/api/dashboard/officers/',
  STORY_END_POINT: '/api/dashboard/stories/',
  STORY_TYPE_END_POINT: '/api/dashboard/story_types/',
  DOCUMENT_END_POINT: '/api/dashboard/documents/',
  DOCUMENT_REQUEST_END_POINT: '/api/dashboard/document-requests/',
  DOCUMENT_REQUEST_STATUS_END_POINT: '/api/dashboard/document-request-status/',
  DOCUMENT_REQUEST_ANALYSIS_END_POINT: '/api/dashboard/document-requests-analysis/',
  DOCUMENT_LINK_END_POINT: '/api/dashboard/document-link/',
  SESSIONS_API_ENDPOINT: '/api/dashboard/sessions/',
  SESSION_ALIAS_API_ENDPOINT: '/api/dashboard/session-alias/',
  SESSION_ALIAS2_API_ENDPOINT: '/api/dashboard/session-alias2/',
  SETTINGS_API_ENDPOINT: '/api/dashboard/settings/',
  NEW_SESSION_ANALYTICS_API_ENDPOINT: '/api/dashboard/new-sessions-analytics/',
};
