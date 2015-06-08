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

/**
 * Retrieve the current TODO data from the MapStore
 */



var OfficerPage = React.createClass({

  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {

  },

  componentWillUnmount: function() {
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log(this.props.officer)
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
