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
var OfficerStore = require('./OfficerStore');
var ComplaintListStore = require('./ComplaintListStore');
var CHANGE_EVENT = 'change';

var _state = {
    'complaints':[]
}


var ComplaintListStore = assign({}, EventEmitter.prototype, {
  update: function(){

    var query_string = OfficerStore.getQueryString();

    $.getJSON('/api/allegations/?' + query_string, function(data){
        _state['complaints'] = data.allegations;
        ComplaintListStore.emitChange();
    })
  },
  set: function(key, value){
    _state[key] = value;
    this.emitChange();
  },
  init: function(initial){
    if(!initial){
        this.update();
    }
    else{
        _state = initial;
    }
    return _state;
  },
  getAll : function(type){
      return _state;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitSummaryChange: function() {
    this.emit(SUMMARY_CHANGE);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  addSummaryListener: function(callback) {
    this.on(SUMMARY_CHANGE, callback);
  },

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType){
    case MapConstants.MAP_REPLACE_FILTERS:
      ComplaintListStore.update();
      break;

    case MapConstants.MAP_CHANGE_FILTER:
      ComplaintListStore.update();
      break;

    case MapConstants.MAP_ADD_FILTER:
      ComplaintListStore.update();
      break;

    case MapConstants.SET_ACTIVE_OFFICER:

      ComplaintListStore.update();
      break;
    default:
      break;
  }
});

module.exports = ComplaintListStore;
