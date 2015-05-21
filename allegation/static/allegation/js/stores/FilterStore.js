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

var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'change';
var _filters = {
      }


/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _filters[id] = assign({}, _filters[id], updates);
}

function create(id,filter){
  _filters[id] = {
    'items':filter,
    'value':"Select a " + id
  };
}


var FilterStore = assign({}, EventEmitter.prototype, {

  getAll : function(type){
      if(type in _filters){
        return _filters[type];
      }
      else{
          return _filters;
      }
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitCreate: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  addCreateListener: function(callback) {
    this.on(CREATE_EVENT, callback);
  },
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {


  switch(action.actionType){
    case MapConstants.MAP_CHANGE_FILTER:
      update(action.key,action.value);
      FilterStore.emitChange()
      break;
    case MapConstants.MAP_ADD_FILTER:
      create(action.key,action.value)
      FilterStore.emitCreate();
      break;
    default:
      // no op
  }
});

module.exports = FilterStore;
