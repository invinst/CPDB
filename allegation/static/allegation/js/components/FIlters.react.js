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
              <div className="row">
                <div className="col-lg-12">
                  <AutoComplete />
                </div>
              </div>
            <div className='hidden'>
              {all_filters}
            </div>
          </div>

  },
  getQueryString: function(){
    var s = ""
    for(var filter_name in this.state.filters){
      console.log(this.state.filters[filter_name]);
      var filter = this.state.filters[filter_name];
      console.log(filter);
      if(filter['value']){
        for(var i=0;i<filter['value'].length; i++){
          if(typeof(filter['value'][i]) == 'object'){
            s += filter_name + "=" + filter['value'][i][1] + "&";
          } else {
            s += filter_name + "=" + filter['value'][i] + "&";
          }
        }

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
    console.log(query_string)
    if(query_string.length > 5){
      $.getJSON(HOST + "/api/allegations/gis/?" + query_string,function(data){
        MapStore.setMarkers(data);
      })
    }
  }


});

module.exports = Filters;