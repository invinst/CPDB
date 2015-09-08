/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
var React = require('react');
var L = require('leaflet');

var AutoComplete = require('./AutoComplete.react');
var FilterStore = require('../stores/FilterStore');
var MapStore = require('../stores/MapStore');
var _ajax_req = null;


function getFilterState() {
  return {
    'filters': FilterStore.getAll()
  }
}


var Filters = React.createClass({
  getInitialState: function () {
    return getFilterState()
  },

  componentDidMount: function () {
    FilterStore.addChangeListener(this._onChange);
    FilterStore.addCreateListener(this._onCreate);
    if (!this.props.doNotAutLoad) {
      this._onChange();
    }
  },
  /**
   * @return {object}
   */
  render: function () {
    // This section should be hidden by default
    // and shown when there are todos.


    return (
      <div className=''>
        <AutoComplete />
      </div>
    )
  },

  _onCreate: function () {
    this.setState(getFilterState());
  },
  _onChange: function () {
    this.setState(getFilterState());
    MapStore.update();
  }

});


module.exports = Filters;
