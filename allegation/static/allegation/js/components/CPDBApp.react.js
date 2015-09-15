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


var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var FilterAction = require('../actions/FilterActions');
var OfficerList = require('./OfficerList.react');
var ComplaintSection = require('./ComplaintSection.react');
var DistributionChart = require('./DistributionChart.react');
var Map = require('./Map.react');
var EmbedBar = require('./Embed/Bar.react');
var Tabs = require('./Tabs.react');

/**
 * Retrieve the current TODO data from the MapStore
 */

function getMapState() {
  return {};
}

HOME_URL = location.pathname;
SAVE_STATE = false;
SESSION_HASH = '';

var CPDBApp = React.createClass({

  getInitialState: function () {
    return getMapState();
  },
  initShare: function () {
    if (location.pathname == '/') {
      $.getJSON('/share/init/', function (data) {
        SESSION_HASH = data.session.hash_id;
        HOME_URL = "/" + SESSION_HASH + "/";
        history.pushState({}, '', HOME_URL);
        SAVE_STATE = true;
      });
    } else {
      SESSION_HASH = HOME_URL.substr(1, HOME_URL.length - 1);
      SAVE_STATE = true;
    }
  },
  componentDidMount: function () {
    this.initShare();
    $('.smooth-scroll').click(function() {
      var target = $(this).data('target');
      var top = $(target).offset().top - 100;
      $("html, body").animate({scrollTop: top}, 500);
    })
  },

  /**
   * @return {object}
   */
  render: function () {

    return (
      <div className='container-fluid'>
          <div className="row" id='filter-row'>
             <div className="col-md-10 col-md-offset-1">
                <Filters />
             </div>
          </div>
        <div className='row map-row'>
          <div className='col-md-6 map-column relative'>
            <Map />
          </div>
          <div className='col-md-6 chart-row'>
            <Tabs />
          </div>
        </div>
        <div className='container content'>
          <div id='officer-cards'><OfficerList /></div>
          <div id='complaint-list'><ComplaintSection /></div>
        </div>
        <div>
          <div id='EmbedBar' className="row">
            <div className="col-md-12">
              <div className='container'>
                <EmbedBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CPDBApp;
