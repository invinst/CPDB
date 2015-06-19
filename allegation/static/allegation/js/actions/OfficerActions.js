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

var OfficerActions = {

  setViewMore: function (value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.OFFICER_VIEW_MORE,
      value: value
    });
  },
  setActiveOfficer: function (officer) {
    AppDispatcher.dispatch({
      actionType: MapConstants.SET_ACTIVE_OFFICER,
      officer: officer
    })
  },
  setComplaintsCount: function (start, end) {
    AppDispatcher.dispatch({
      actionType: MapConstants.SET_OFFICER_LIST_FILTER,
      start: start,
      end: end
    })
  }

};

module.exports = OfficerActions;
