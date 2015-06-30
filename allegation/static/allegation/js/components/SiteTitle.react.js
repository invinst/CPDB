/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var FilterStore = require("../stores/FilterStore");
var init_data = typeof(INIT_DATA) == 'undefined' ? {} : INIT_DATA;


var SiteTitle = React.createClass({

  getInitialState: function () {
    var initial = init_data['title'] || "Police Misconduct in Chicago";
    return {
      text: initial,
      editing: false
    }
  },

  render: function(){
    var button = "";
    return <div>
        <div onClick={this.enableEditing} onKeyDown={this.keyDown} contentEditable={this.state.editing}>{this.state.text}</div>

      </div>

  },

  keyDown: function (e) {
    if (e.which == 13 || e.keyCode == 12) {
      e.preventDefault();
      this.setState({'text': $(e.target).text(), 'editing': false});
      FilterStore.saveSession({'title': $(e.target).text()});
    }
  },

  enableEditing: function(){
    // contenteditable field set to edit mode.
    this.setState({ editing: true });
  }

});

module.exports = SiteTitle;
