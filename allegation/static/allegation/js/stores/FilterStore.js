var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var TagUtil = require('utils/TagUtil');

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'change';
var ENABLE_EVENT = 'enable';
var DISABLE_EVENT = 'disable';

var _initialized = false;
var _filters = {};
var _pinned = {};


function update(id, updates) {
  _filters[id] = assign({}, _filters[id], updates);

}

function create(id, filter) {
  _filters[id] = {
    'items': filter,
    'value': "Select a " + id
  };
}

var FilterStore = assign({}, EventEmitter.prototype, {
  isInitialized: function() {
    return _initialized;
  },

  setInitialized: function(val) {
    _initialized = val;
  },

  getSession: function () {
    return {
      filters: _filters,
      pinned: _pinned
    };
  },

  setSession: function (session) {
    _filters = session.filters || {};
    _pinned = session.pinned || {};
    return _filters;
  },

  getAll: function (type) {
    if (type) {
      return _filters[type];
    }
    return _filters;
  },

  getFilters: function() {
    return _filters;
  },

  update: function (id, updates) {
    update(id, updates);
    this.emit(CHANGE_EVENT);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  emitEnable: function () {
    this.emit(ENABLE_EVENT);
  },

  emitDisable: function () {
    this.emit(DISABLE_EVENT);
  },

  emitCreate: function () {
    this.emit(CHANGE_EVENT);

  },

  tagsInputRemoveItemObject: function (tagValue) {
    var search = $('#cpdb-search');
    var items = search.tagsinput("items");
    if (!items) {
      return;
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.value[0] == tagValue.value[0] && item.value[1] == tagValue.value[1]) {
        search.tagsinput("remove", item);
        break;
      }
    }
  },

  isPinned: function (category, value) {
    return _pinned[category] && _pinned[category].indexOf(value) != -1;
  },

  removeFilterInCategory: function (category) {
    if (!_filters[category]) {
      return;
    }

    var pinned = [];
    var values = _filters[category].value;
    for (i in values) {
      if (FilterStore.isPinned(category, values[i])) {
        pinned.push(values[i]);
      }
    }

    _filters[category].value = pinned;
  },

  addFilter: function (category, filterValue) {
    this.removeFilterInCategory(category);

    if (_filters[category]) {
      _filters[category]['value'].push(filterValue);
    } else {
      _filters[category] = {'value': [filterValue]};
    }
  },

  removeFilter: function (category, filterValue) {
    if (!_filters[category]) {
      return;
    }
    var index = _filters[category].value.indexOf(filterValue);
    if (index > -1) {
      _filters[category].value.splice(index, 1);
    }
  },

  pinFilter: function (category, filterValue) {
    if (!_pinned[category]) {
      _pinned[category] = [];
    }

    if (FilterStore.isPinned(category, filterValue)) {
      _pinned[category].splice(_pinned[category].indexOf(filterValue));
    } else {
      _pinned[category].push(filterValue);
    }

    this.emitChange();
  },

  replaceFilters: function (filters) {
    _filters = {};

    $.each(filters, function () {
      var value = this.value[1];
      if (this.value[0] in _filters) {
        _filters[this.value[0]]['value'].push(value);
      }
      else {
        _filters[this.value[0]] = {'value': [value]};
      }
    });
    this.emitChange();
  },

  toogleFiltersFor: function (category) {
    return function(value) {
      if (!TagUtil.isATagIn(_filters)(category, value)) {
        FilterStore.addFilter(category, value);
        FilterStore.pinFilter(category, value);
      } else {
        FilterStore.removeFilter(category, value);
      }
    };
  },

  justUnpinFor: function (category) {
    var self = this;
    return function(value) {
      if (self.isPinned(category, value)) {
        self.pinFilter(category, value);
      }
    };
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addEnableListener: function (callback) {
    this.on(ENABLE_EVENT, callback);
  },
  removeEnableListener: function(callback) {
    this.removeListener(ENABLE_EVENT, callback);
  },

  addDisableListener: function (callback) {
    this.on(DISABLE_EVENT, callback);
  },

  removeDisableListener: function(callback) {
    this.removeListener(DISABLE_EVENT, callback);
  },

  addCreateListener: function (callback) {
    this.on(CREATE_EVENT, callback);
  },
  removeCreateListener: function(callback) {
    this.removeListener(CREATE_EVENT, callback);
  },

  getQueryString: function (ignoreFilters) {
    var query = "";
    for (var filterName in _filters) {
      if (ignoreFilters && ignoreFilters.indexOf(filterName) > -1) {
        continue;
      }
      var filter = _filters[filterName];

      if (filter['value']) {
        for (var i = 0; i < filter['value'].length; i++) {
          if (filter['value'][i] && (typeof(filter['value'][i]) == 'object')) {
            query += filterName + "=" + filter['value'][i][1] + "&";
          } else {
            query += filterName + "=" + filter['value'][i] + "&";
          }
        }
      }
    }
    return query;
  }
});


AppDispatcher.register(function (action) {
  switch (action.actionType) {
    // case AppConstants.MAP_REPLACE_FILTERS:
    //   _initialized = false;
    //   FilterStore.replaceFilters(action.filters);
    //   break;

    // case AppConstants.MAP_CHANGE_FILTER:
    //   _initialized = false;
    //   update(action.key, action.value);
    //   FilterStore.emitChange();
    //   break;

    // case AppConstants.MAP_ADD_FILTER:
    //   _initialized = false;
    //   create(action.key, action.value);
    //   FilterStore.emitCreate();
    //   break;

    // case AppConstants.ENTER_EMBED_MODE:
    //   _initialized = false;
    //   FilterStore.emitDisable();
    //   break;

    // case AppConstants.LEAVE_EMBED_MODE:
    //   _initialized = false;
    //   FilterStore.emitEnable();
    //   break;

    // case AppConstants.ADD_TAG:
    //   FilterStore.addFilter(action.category, action.filter.value);
    //   FilterStore.emitChange();
    // break;

    // case AppConstants.TOGGLE_TAGS:
    //   var values = _(action.filters).chain().pluck('value');
    //   // We do a trick here, first we add it in, then we pin it
    //   // When adding completely, we pin one more time to `unpin` it
    //   // This will help us for not adding a new exception to API
    //   values.map(FilterStore.toogleFiltersFor(action.category));
    //   values.map(FilterStore.justUnpinFor(action.category));
    //   FilterStore.emitChange();
    // break;

    // case AppConstants.REMOVE_TAG:
    //   FilterStore.removeFilter(action.category, action.filter.value);
    //   FilterStore.emitChange();
    //   break;

    // case AppConstants.PIN_TAG:
    //   FilterStore.pinFilter(action.category, action.filter.value);
    //   FilterStore.emitChange();
    //   break;

    // case AppConstants.RECEIVED_SESSION_DATA:
    //   FilterStore.setSession(action.data['data']['query'] || {});
    //   _initialized = action.data['data'].readable_query || {};
    //   FilterStore.emitChange();
    //   break;

    default:
      break;
  }
});


module.exports = FilterStore;
