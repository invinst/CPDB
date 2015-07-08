/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the MapStore and passes the new data to its children.
 */


var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var FilterAction = require('../actions/FilterActions');
var Summary = require('./Summary.react');
var OfficerList = require('./OfficerList.react');
var ComplaintList = require('./ComplaintList.react');
var DistributionChart = require('./DistributionChart.react');

/**
 * Retrieve the current TODO data from the MapStore
 */

function getMapState() {
  return {};
}

HOME_URL = location.pathname;
SAVE_STATE = false;

var CPDBApp = React.createClass({

  getInitialState: function () {
    return getMapState();
  },
  initShare: function () {
    SAVE_STATE = true;
    if (location.pathname == '/') {
      $.getJSON('/share/init/', function (data) {
        HOME_URL = "/" + data.session.hash_id + "/";
        history.pushState({}, '', HOME_URL);
      });
    }
  },
  componentDidMount: function () {
    MapStore.init();
    this.initShare();
    $('.smooth-scroll').click(function() {
      var target = $(this).data('target');
      var top = $(target).offset().top - 100;
      $("html, body").animate({scrollTop: top}, 500);
    })
  },

  componentWillUnmount: function () {
  },

  /**
   * @return {object}
   */
  render: function () {
    return (
      <div className='container-fluid'>
        <Filters />
        <div className='row map-row'>
          <div className='col-md-7 map-column relative'>
            <div id='map' className='pin-top pin-bottom'></div>
            <div id='map-arrow-down' data-target='#officer-cards' className='pointer smooth-scroll'><i className='fa fa-chevron-down fa-3x'></i></div>
          </div>
          <div className='col-md-5'><Summary /></div>
        </div>
        <div className='container'>
          <div id='officer-cards'><OfficerList /></div>
          <div className='row tcenter'>
            <i className='fa fa-chevron-up fa-3x smooth-scroll pointer' data-target="#map"></i>
            <i className='fa fa-chevron-down fa-3x smooth-scroll pointer' data-target="#complaint-list"></i>
          </div>
          <div id='complaint-list'><ComplaintList /></div>
        </div>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the MapStore
   */
  _onChange: function () {

  }

});

module.exports = CPDBApp;
