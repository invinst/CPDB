/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var FilterStore = require('../stores/FilterStore');
var FilterActions = require('../actions/FilterActions');
var cx = require('react/lib/cx');

var MapFilterItem = React.createClass({
  render: function(){
    return(<option value={this.props.key}>{this.props.label}</option>);
  }
})


var MapFilter = React.createClass({

  componentDidMount: function() {
    //FilterStore.addChangeListener();
    //this.render()
  },
  getInitialState: function() {
    return {
      filters:FilterStore.getAll(this.props.filterkey)
    }
  },
  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function(event) {

    if(event){
      FilterActions.changeFilter(this.props.filterkey,event.target.value);
    }
    this.setState(this.getInitialState())
  },



  /**
   * @return {object}
   */
  render: function() {


    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    var options = []
    for(var key in this.props.options){
      options.push(<MapFilterItem key={key} label={this.props.options[key]} />)
    }

    return <span>{this.props.filterkey}:
              <select key={this.props.filterkey} onChange={this._onChange} name={this.props.filterkey} value={this.state.value}>
              <option>Select a {this.props.filterkey}</option>
              {options}
              </select>
            </span>

  },



});

module.exports = MapFilter;