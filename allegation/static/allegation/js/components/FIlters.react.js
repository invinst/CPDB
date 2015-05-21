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
var FilterStore = require('../stores/FilterStore');
var MapStore = require('../stores/MapStore');
function getFilterState(){
  return{
    'filters':FilterStore.getAll()
  }
}

var Filters = React.createClass({
  getInitialState: function(){
    return getFilterState()
  },

  componentDidMount: function() {
    FilterStore.addChangeListener(this._onChange);
    FilterStore.addCreateListener(this._onCreate);
  },
  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    var all_filters = [];
    for(var key in this.state.filters){

      all_filters.push(<MapFilter filterkey={key} key={key} options={this.state.filters[key].items} value={this.state.filters[key].value} />)
      //FilterStore.addFilter()
    }



    return <div>
            <div class="row">
                <div class="col-lg-12">
                   AutoComplete <input id="cpdb-search" class="form-control" />
                </div>
            </div>

            {all_filters}
          </div>

  },
  getQueryString: function(){
    var s = ""
    for(var filter_name in this.state.filters){
      if(this.state.filters[filter_name]['value']
        && this.state.filters[filter_name]['value'] != "[object Object]"
        && this.state.filters[filter_name]['value'].indexOf("Select a") < 0){
        s += filter_name + "=" + this.state.filters[filter_name]['value'] + "&";
      }
    }
    return s;
  },
  _onCreate: function() {
    this.setState(getFilterState());
  },
  _onChange: function() {
    this.setState(getFilterState());
    var query_string = this.getQueryString();
    if(query_string.length > 5){
      $.getJSON(HOST + "/api/allegations/gis/?" + query_string,function(data){
        MapStore.setMarkers(data);
      })
    }
  }


});

module.exports = Filters;