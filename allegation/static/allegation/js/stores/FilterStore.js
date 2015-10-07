var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'change';
var ENABLE_EVENT = 'enable';
var DISABLE_EVENT = 'disable';

var _initialized = false;
var _filters = {};


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
      filters: _filters
    };
  },

  setSession: function (session) {
    _filters = session.filters || {};
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
  removeFilter: function (filterName, filterValue) {
    $.each(_filters, function (i) {
      if (i == filterName) {
        var index = _filters[filterName].value.indexOf(filterValue);
        if (index > -1) {
          _filters[filterName].value.splice(index, 1);
        }
      }

    });
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
  /**
   * @param {function} callback
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addEnableListener: function (callback) {
    this.on(ENABLE_EVENT, callback);
  },

  addDisableListener: function (callback) {
    this.on(DISABLE_EVENT, callback);
  },

  addCreateListener: function (callback) {
    this.on(CREATE_EVENT, callback);
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

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.MAP_REPLACE_FILTERS:
            _initialized = false;

      FilterStore.replaceFilters(action.filters);
      break;

    case AppConstants.MAP_CHANGE_FILTER:
            _initialized = false;

      update(action.key, action.value);
      FilterStore.emitChange();
      break;

    case AppConstants.MAP_ADD_FILTER:
            _initialized = false;

      create(action.key, action.value);
      FilterStore.emitCreate();
      break;

    case AppConstants.ENTER_EMBED_MODE:
            _initialized = false;

      FilterStore.emitDisable();
      break;

    case AppConstants.LEAVE_EMBED_MODE:
      _initialized = false;

      FilterStore.emitEnable();
      break;

  case AppConstants.RECEIVED_SESSION_DATA:
      FilterStore.setSession(action.data['data']['query'] || {});
      _initialized = true;
      FilterStore.emitChange();
    default:
      break;
  }
});

module.exports = FilterStore;
