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
var AppConstants = require("../constants/AppConstants");
var CHANGE_EVENT = 'change';
var SUMMARY_CHANGE = 'summary-change';
var SET_ACTIVE_OFFICER = 'set-active-officer';
var _state = {

}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */


var DistributionChartStore = assign({}, EventEmitter.prototype, {
  set: function(key,value){
    _state[key] = value;
  },
  update: function(){
    query_string = FilterStore.getQueryString();
    console.log(query_string)
    $.get('/officer/count/?by=num_complaints&' + query_string, function(data) {
        if(_state['chart']){
            _state['chart'].destroy();
        }
        _state['chart'] = c3.generate({
          bindto: '#complained-officers',
          data: {
              columns: [
                ['No. officers'].concat(data)
              ],
              type: 'area-spline'
          },
          regions: [
              {
                end: AppConstants.AVG_COMPLAINTS_NUMBER_GREEN,
                class: 'light',
                opacity: .5
              },
              {
                start: AppConstants.AVG_COMPLAINTS_NUMBER_GREEN,
                end: AppConstants.AVG_COMPLAINTS_NUMBER_YELLOW,
                class: 'medium',
                opacity: .5
              },
              {
                start: AppConstants.AVG_COMPLAINTS_NUMBER_YELLOW,
                class: 'heavy',
                opacity: .5
              }
          ],
          point: {
              show: false
          },
          axis: {
              x: {
                  label: {
                      text: 'Number of complaints',
                      position: 'outer-right'
                  }
              },
              y: {
                  label: {
                      text: 'Number of officers',
                      position: 'outer-top'
                  }
              }
          },
          legend: {
              show: false
          },
          tooltip: {
              format: {
                  title: function(d) { return d + ' complaints'; }
              }
          }
        });
        var under20 = 0;
        for (var i = 0; i < 20; i++) {
            under20 += data[i];
        }
        _state['chart'].xgrids.add({value: 20, text: under20 + ' under 20 complaints', class: 'under20'});
    });
  },
  init: function(){
    this.update();
    return _state;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType){
    case MapConstants.MAP_REPLACE_FILTERS:
    case MapConstants.MAP_CHANGE_FILTER:
    case MapConstants.MAP_ADD_FILTER:
      DistributionChartStore.update();
      break;

    default:
      break;
  }
});

module.exports = DistributionChartStore;
