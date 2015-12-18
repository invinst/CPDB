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
var TagUtil = require('utils/TagUtil');
var _sessionData = {};
var init_data = typeof(INIT_DATA) == 'undefined' ? false : INIT_DATA;
var init_filters = typeof(INIT_FILTERS) == 'undefined' ? {} : INIT_FILTERS;



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
    if (!FilterStore.isInitialized()) {
      if(!this.inAction) {
        FilterActions.replaceFilters(tags);
      }
    }
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  },
  componentWillUnmount: function() {
    FilterStore.setInitialized(true);
    FilterStore.removeChangeListener(this._onChange);
    OfficerListStore.removeChangeListener(this._onChange);
    FilterStore.removeDisableListener(this._onDisable)
    FilterStore.removeEnableListener(this._onEnable)
  },
  componentDidMount: function () {
    // TODO: Move this stuff cpdbAutocomplate to be a React one?
    $(document).ready(function() {
      if ($("#autocomplete").length) {
        cpdbAutocomplete($("#autocomplete"));
      }
    })

    var element = this.getDOMNode();
    $(element).tagsinput({
      itemValue: 'value',
      itemText: 'text',
      tagClass: 'tag label label-info-autocomplete'
    });

    $(element).on('beforeItemAdd', this.beforeItemAdd);

    $(element).tagsinput("input").hide();

    $(element).on('itemAdded', this.tagsChanged)
      .on('itemRemoved', this.tagsChanged);

    FilterStore.addChangeListener(this._onChange);
    FilterStore.addDisableListener(this._onDisable);
    FilterStore.addEnableListener(this._onEnable);
    OfficerListStore.addChangeListener(this._onChange);
  },

  beforeItemAdd: function (event) {
    var tags = $(this.getDOMNode()).tagsinput('items');
    var tag = event.item;
    event.cancel = TagUtil.isDuplicatedTag(tags, tag)
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
    return FilterStore.getSession();
  },

  _onChange: function (event) {
    if (event) {
      FilterActions.changeFilter(this.props.filterkey, event.target.value);
    }
    var filters = FilterStore.isInitialized();

    if (filters) {
      this.inAction = true;
      try {
        var element = this.getDOMNode();
      } catch(e) {
        return;
      };
      FilterStore.setInitialized(false);
      for (var key in filters) {
        var filter = filters[key];

        for (var i = 0; i < filter.length; i++) {
          if (filter[i].text) {
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

    }
    this.inAction = false;
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  },

  render: function () {
    return (
      <input id="cpdb-search" />
    )
  }

});

module.exports = AutoComplete;
