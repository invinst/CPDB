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
      text: initial
    }
  },

  render: function() {
    return (
      <input className='site-title-input' type='text' value={this.state.text} onChange={this.change} />
    )
  },

  change: function (e) {
    newTitle = $(e.target).val()
    this.setState({ 'text': newTitle });
    FilterStore.saveSession({'title': newTitle});
    document.title = newTitle;
  },
});

module.exports = SiteTitle;
