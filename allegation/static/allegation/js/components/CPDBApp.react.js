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
//var Mapbox = require('mapbox.js')
/**
 * Retrieve the current TODO data from the MapStore
 */

function getMapState() {
  return {

  };
}

var CPDBApp = React.createClass({

  getInitialState: function() {
    return getMapState();
  },

  componentDidMount: function() {
    //MapStore.addChangeListener(this._onChange);
    MapStore.init();

    $.getJSON(HOST + "/api/filters/",function(data){
        $.each(data,function(i){
            FilterAction.addFilter(i,this);
        });
    })

  },

  componentWillUnmount: function() {
    //MapStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return <div>
      <Filters />
      <div id='map' className='pin-top pin-bottom'></div>


    </div>;
  },

  /**
   * Event handler for 'change' events coming from the MapStore
   */
  _onChange: function() {

  }

});

module.exports = CPDBApp;
