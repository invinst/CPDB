/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');

var FilterActions = {
  replaceFilters: function (values) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_REPLACE_FILTERS,
      filters: values
    })
  },
  changeFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_CHANGE_FILTER,
      key: key,
      value: {'value': value}
    });
  },
  addFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_ADD_FILTER,
      key: key,
      value: value
    });
  },
  setActiveFilter: function (val) {
    AppDispatcher.dispatch({
      actionType: MapConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: val
    })
  }

};

module.exports = FilterActions;
