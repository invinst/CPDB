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
var assign = require('object-assign');
var MapStore = require('../stores/MapStore');
var OfficerStore = require('../stores/OfficerStore');
var FilterStore = require('../stores/FilterStore')

var _sessionData = {};

var SessionStore = assign({}, EventEmitter.prototype, {
  saveSession: function () {
    if (!SAVE_STATE) {
      return;
    }

    var tempSessionData = {};
    $.extend(tempSessionData, FilterStore.getSession());
    $.extend(tempSessionData, MapStore.getSession());
    $.extend(tempSessionData, OfficerStore.getSession());

    if (! _.isEqual(tempSessionData, _sessionData)) {
      _sessionData = _.clone(tempSessionData);
    }

    $.ajax({
      url: document.location.href,
      data: JSON.stringify(_sessionData),
      success: function (returnData) {
      },
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      type: 'POST'
    });
  },
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case MapConstants.SAVE_SESSION:
      SessionStore.saveSession();
      break;

  }
});

module.exports = SessionStore;
