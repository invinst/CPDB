/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
var HOST = 'http://localhost:8000';
var React = require('react');
var MapFilter = require('./MapFilter.react');
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
    var allFilters = [];
    for (var key in this.state.filters) {

      allFilters.push(<MapFilter filterkey={key} key={key} options={this.state.filters[key].items}
                                 value={this.state.filters[key].value}/>)
      //FilterStore.addFilter()
    }

    return <div>
      <AutoComplete />

      <div className='hidden'>
        {allFilters}
      </div>
    </div>

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
