var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');

var TagUtil = require('utils/TagUtil');

var CHANGE_EVENT = 'CHANGE_EVENT';
var CREATE_EVENT = 'CREATE_EVENT';
var ENABLE_EVENT = 'ENABLE_EVENT';
var DISABLE_EVENT = 'DISABLE_EVENT';


var _state = {
  initialized: false,
  filters: {},
}

var FilterTagStore = _.assign(Base(_state), {
  update: function (category, values) {
    _state['filters'][category] = _.union([], _state['filters'][category], values);
  },

  isInFilter: function (category, value) {
    return _.contains(_.pluck(_state['filters'][category], 'value'), value);
  },

  addFilter: function (category, value, filter) {
    _.remove(_state['filters'][category], function (item) {
      return !item.pinned;
    });

    _state['filters'][category] = _state['filters'][category] || [];

    _state['filters'][category].push({
      value: value,
      filter: filter,
      pinned: false
    });
  },

  removeFilter: function (category, value) {
    _.remove(_state['filters'][category], function (item) {
      return item.value == value;
    });
  },

  getFilter: function (category, value) {
    return _.find(_state['filters'][category], function (item) {
      return item.value == value;
    });
  },

  pinFilter: function (category, value) {
    filter = this.getFilter(category, value);
    if (filter) {
      filter.pinned = !filter.pinned;
    }
  },

  isPinned: function (category, value) {
    return _.get(this.getFilter(category, value), 'pinned');
  },

  toggleFilter: function (category, value, filter) {
    if (this.getFilter(category, value)) {
      this.removeFilter(category, value);
    } else {
      this.addFilter(category, value, filter);
      this.pinFilter(category, value);
    }
  },

  getQueryString: function (ignoreCategories) {
    var filters = _.filter(_state['filters'], function (item) {
      return item.length > 0;
    });

    _.each(ignoreCategories, function (category) {
      delete filters[category];
    });

    var query = _.map(filters, function (values, category) {
      return _.pluck(values, 'filter').join('&')
    }).join('&');

    return query;
  },

  // Old interface
  isInitialized: function() {
    return _state['initialized'];
  },

  setInitialized: function(val) {
    _state['initialized'] = val;
  },

  getSession: function () {
    // TODO: clean empty category
    return {
      filters: _state['filters'],
    };
  },

  setSession: function (session) {
    _state['filters'] = session.filters || {};
  },

  getAll: function (category) {
    if (category) {
      return _state['filters'][category];
    }

    return _state['filters'];
  },

  getFilters: function () {
    return _state['filters'];
  },
});


AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.ENTER_EMBED_MODE:
      _state['initialized'] = false;
      FilterTagStore.emitDisable();
      break;

    case AppConstants.LEAVE_EMBED_MODE:
      _state['initialized'] = false;
      FilterTagStore.emitEnable();
      break;

    case AppConstants.ADD_TAG:
      FilterTagStore.addFilter(action.category, action.value, action.filter);
      FilterTagStore.emitChange();
    break;

    case AppConstants.TOGGLE_TAGS:
      // var values = _(action.filters).chain().pluck('value');
      // We do a trick here, first we add it in, then we pin it
      // When adding completely, we pin one more time to `unpin` it
      // This will help us for not adding a new exception to API
      _.each(action.tags, function (tag) {
        FilterTagStore.toggleFilter(action.category, tag.value, tag.filter);
      });

      _.each(action.tags, function (tag) {
        FilterTagStore.pinFilter(action.category, tag.value);
      });

      FilterTagStore.emitChange();
    break;

    case AppConstants.REMOVE_TAG:
      FilterTagStore.removeFilter(action.category, action.value);
      FilterTagStore.emitChange();
      break;

    case AppConstants.PIN_TAG:
      FilterTagStore.pinFilter(action.category, action.value);
      FilterTagStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      session_query = _.get(action.data, 'data.query', {})
      FilterTagStore.setSession(session_query);
      _state['initialized'] = session_query['filters'] || {};
      FilterTagStore.emitChange();
      break;

    default:
      break;
  }
});


module.exports = FilterTagStore;
