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
var ComplaintList = require('./ComplaintList.react');
var OfficerDetail = require('./OfficerDetail.react');
var Filters = require('./Filters.react');
var FilterActions = require("../actions/FilterActions");


var OfficerPage = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentWillMount: function(){
    FilterActions.replaceFilters([{
      value: ['officers__id', this.props.officer.id]
    }]);
  },

  componentDidMount: function() {

  },

  componentWillUnmount: function() {
  },

  /**
   * @return {object}
   */
  render: function() {
  	return <div>
        <OfficerDetail officer={this.props.officer} />
        <ComplaintList allegations={this.props.officer.allegations} officer={this.props.officer} />
      </div>;
  },

  /**
   * Event handler for 'change'  events coming from the MapStore
   */
  _onChange: function() {

  }

});

module.exports = OfficerPage;
