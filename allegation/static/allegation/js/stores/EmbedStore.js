/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * EmbedStore
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');


var ENTER_EVENT = 'enter';
var LEAVE_EVENT = 'leave';


var EmbedStore = assign({}, EventEmitter.prototype, {

  addEnterListener: function (callback) {
    this.on(ENTER_EVENT, callback);
  },

  emitEnter: function () {
    this.emit(ENTER_EVENT);
  },

  addLeaveListener: function (callback) {
    this.on(LEAVE_EVENT, callback);
  },

  removeLeaveListener: function (callback) {
    this.removeListener(LEAVE_EVENT, callback);
  },

  removeEnterListener: function (callback) {
    this.removeListener(ENTER_EVENT, callback);
  },

  emitLeave: function () {
    this.emit(LEAVE_EVENT);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
  case AppConstants.ENTER_EMBED_MODE:
    EmbedStore.emitEnter();
    break;

  case AppConstants.LEAVE_EMBED_MODE:
    EmbedStore.emitLeave();
    break;

  default:
    break;
  }
});

EmbedStore.setMaxListeners(0);
module.exports = EmbedStore;
