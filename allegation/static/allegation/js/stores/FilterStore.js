/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * MapStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var FilterActions = require('../actions/FilterActions');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'change';
var _filters = {};


/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
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
    if (type in _filters) {
      return _filters[type];
    }
    else {
      return _filters;
    }
  },
  update: function (id, updates) {
    update(id, updates);
    this.emit(CHANGE_EVENT);
  },
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  emitCreate: function () {
    this.emit(CHANGE_EVENT);

  },
  tagsInputRemoveItemObject: function (tagValue) {
    var items = $('#cpdb-search').tagsinput("items");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.value[0] == tagValue.value[0] && item.value[1] == tagValue.value[1]) {
        $('#cpdb-search').tagsinput("remove", item);
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

          return;
        }
      }

    });
    this.emitChange();
  },
  replaceFilters: function (filters) {
    _filters = {};
    $.each(filters, function () {
      if (this.value[0] in _filters) {
        _filters[this.value[0]]['value'].push(this.value[1])
      }
      else {
        _filters[this.value[0]] = {'value': [this.value[1]]};
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
    case MapConstants.MAP_REPLACE_FILTERS:
      FilterStore.replaceFilters(action.filters);
      break;

    case MapConstants.MAP_CHANGE_FILTER:
      update(action.key, action.value);
      FilterStore.emitChange();
      break;

    case MapConstants.MAP_ADD_FILTER:
      create(action.key, action.value);
      FilterStore.emitCreate();
      break;

    default:
      break;
  }
});

module.exports = FilterStore;
