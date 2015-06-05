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
var FilterStore = require('./FilterStore');
var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var SET_ACTIVE_OFFICER = 'set-active-officer';
var _state = {
    'officers':{},
    'show_more':false,
    'active_officers':[],
    'complaints_count_start': 0,
    'complaints_count_end': 0
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _officers[id] = assign({}, _complaints[id], updates);
}


function create(id, officer){
  _officers[id] = {

  };
}


var OfficerStore = assign({}, EventEmitter.prototype, {
  getQueryString: function(){
    var queryString = FilterStore.getQueryString();
    for(var i=0;i<_state['active_officers'].length;i++){
      queryString += "officer_id=" + _state['active_officers'][i] + "&"
    }
    if(_state.complaints_count_start){
      queryString += "&allegations_count_start=" + _state.complaints_count_start;
    }
    if(_state.complaints_count_end){
      queryString += "&allegations_count_end=" + _state.complaints_count_end;
    }
    return queryString;
  },
  update: function(){
    _state['active_officers'] = [];
    $.getJSON('/api/allegations/officers/?' + OfficerStore.getQueryString(), function(data){
        _state['officers'] = data.officers;
        OfficerStore.emitChange();
    })
  },
  set: function(key, value){
    _state[key] = value;
    this.emitChange();
  },
  init: function(){
    this.update();
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
    case MapConstants.MAP_CHANGE_FILTER:
    case MapConstants.MAP_ADD_FILTER:
      OfficerStore.update();
      break;

    case MapConstants.OFFICER_VIEW_MORE:
      OfficerStore.set('show_more',!_state['show_more']);
      break;

    case MapConstants.SET_OFFICER_LIST_FILTER:
      _state.complaints_count_start = action.start;
      _state.complaints_count_end = action.end;
      OfficerStore.update();
      break;

    case MapConstants.SET_ACTIVE_OFFICER:
      var index = _state.active_officers.indexOf(action.officer.id);
      if(index == -1 ){
        _state.active_officers.push(action.officer.id);

      }
      else{
        _state.active_officers.splice(index,1);
      }
      OfficerStore.emitChange()
      break;

    default:
      break;
  }
});

module.exports = OfficerStore;
