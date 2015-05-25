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


var AutoComplete = React.createClass({

  tagsChanged: function(event){
    var tags = $(this.getDOMNode()).tagsinput("items");
    FilterActions.replaceFilters(tags);
  },
  componentDidMount: function() {
    var element = this.getDOMNode();
    $(element).tagsinput({
      itemValue: 'value',
      itemText: 'text'
    });

    var input = $(element).tagsinput("input");
    cpdbAutocomplete(input);
    $(element).on('itemAdded', this.tagsChanged)
              .on('itemRemoved', this.tagsChanged);
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
    console.log(event)
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


    return <input id="cpdb-search" className="form-control" />

  },



});

module.exports = AutoComplete;