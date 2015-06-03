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
};


var GRAPH_ELEM_SEL = '#complained-officers .graph';


function drawChart(col, rotated) {
    rotated = typeof rotated !== 'undefined' ? rotated : false;

    c3.generate({
        bindto: GRAPH_ELEM_SEL,
        data: {
            columns: [
                ['No. officers'].concat(col)
            ],
            type: 'area-spline',
            empty: {
                label: {
                    text: 'Loading data...'
                }
            }
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
            rotated: rotated,
            x: {
                label: {
                    text: 'Complaints',
                    position: 'outer-right'
                }
            },
            y: {
                label: {
                    text: 'Officers',
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
            },
            position: function (data, width, height, element) {
                return {
                    top: -15,
                    left: 300
                }
            },
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                var point = d[0];
                var numOfficers = point.value;
                var numComplaints = point.index;
                return '<strong>'+numOfficers + '</strong> officers with <strong>' + numComplaints + '</strong> complaints';
            }
        }
    });
}


var rotate = false;
var col = [];


var DistributionChartStore = assign({}, EventEmitter.prototype, {
  set: function(key, value){
    _state[key] = value;
  },
  data: [],
  rotateChart: function(){
    rotate = !rotate;
    drawChart(col, rotate);
  },
  update: function(){
    query_string = FilterStore.getQueryString();
    $.get('/officer/count/?by=num_complaints&' + query_string, function(data) {
        drawChart(data);
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
