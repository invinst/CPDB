/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var FilterStore = require('stores/FilterStore');
var MapStore = require('stores/MapStore');
var OfficerListStore = require('stores/OfficerListStore');
var FilterActions = require('actions/FilterActions');
var SessionAPI = require('utils/SessionAPI');
var cx = require('react/lib/cx');
var _sessionData = {};
var init_data = typeof(INIT_DATA) == 'undefined' ? false : INIT_DATA;
var init_filters = typeof(INIT_FILTERS) == 'undefined' ? {} : INIT_FILTERS;


function isSameTag(current, other) {
  return (current.value[0] == other.value[0] && current.value[1] == other.value[1])
}

function isDuplicatedTag(tags, tag) {
  for (var i = 0; i < tags.length; i++) {
    if (isSameTag(tags[i], tag)) {
      return true;
    }
  }
  return false;
}

var AutoComplete = React.createClass({

  tagsChanged: function (event) {
    if (event.item && event.item.layer) {
      event.item.layer.toggleStyle();
    }
    var tags = $(this.getDOMNode()).tagsinput("items");
    if (tags.length) {
      setTimeout(function () {
        $(".bootstrap-tagsinput .tag").addClass('fadeIn');
      }, 100);
    } else {
      // Should be used
    }
    FilterActions.replaceFilters(tags);
  },

  componentDidMount: function () {
    // TODO: Move this stuff cpdbAutocomplate to be a React one?
    if ($("#autocomplete").length) {
      cpdbAutocomplete($("#autocomplete"));
    }
    var element = this.getDOMNode();
    $(element).tagsinput({
      itemValue: 'value',
      itemText: 'text',
      tagClass: 'tag label label-info-autocomplete'
    });
    var filters = this.state.filters;
    for (var key in filters) {
      var filter = filters[key];
      for (var i = 0; i < filter.length; i++) {
        if (filter[i].value) {
          $(element).tagsinput("add", {
            text: tagLabel(key, filter[i].text),
            value: [key, filter[i].value]
          });
        } else {
          $(element).tagsinput("add", {
            text: tagLabel(key, filter[i]),
            value: [key, filter[i]]
          });
        }
      }
    }

    $(element).on('beforeItemAdd', this.beforeItemAdd);

    $(element).tagsinput("input").hide();

    $(element).on('itemAdded', this.tagsChanged)
      .on('itemRemoved', this.tagsChanged);

    if (filters) {
      $(element).trigger("itemAdded");
    }
    FilterStore.addChangeListener(this._onChange);
    FilterStore.addDisableListener(this._onDisable);
    FilterStore.addEnableListener(this._onEnable);
    OfficerListStore.addChangeListener(this._onChange);
  },

  beforeItemAdd: function (event) {
    var tags = $(this.getDOMNode()).tagsinput('items');
    var tag = event.item;
    event.cancel = isDuplicatedTag(tags, tag)
  },

  _onDisable: function () {
    $("#search-wrapper").hide();
    var element = this.getDOMNode();
    $(element).off("beforeItemAdd", this.beforeItemAdd)
      .on("beforeItemAdd", this.cancelItemChange)
      .on("beforeItemRemove", this.cancelItemChange);
  },

  _onEnable: function () {
    $("#search-wrapper").show();
    var element = this.getDOMNode();
    $(element).on("beforeItemAdd", this.beforeItemAdd)
      .off("beforeItemAdd", this.cancelItemChange)
      .off("beforeItemRemove", this.cancelItemChange);
  },

  cancelItemChange: function (event) {
    event.cancel = true;
  },

  getInitialState: function () {
    var filters = {};

    if (init_data){
      filters = FilterStore.setSession(init_filters);
      MapStore.setSession(init_data);
      OfficerListStore.setSession(init_data);
    } else {
      filters = FilterStore.getAll(this.props.filterkey);
    }
    return {
      filters: filters
    };
  },
  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function (event) {
    if (event) {
      FilterActions.changeFilter(this.props.filterkey, event.target.value);
    }
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  },

  /**
   * @return {object}
   */
  render: function () {
    return (
      <input id="cpdb-search" />
    )
  }

});

module.exports = AutoComplete;
