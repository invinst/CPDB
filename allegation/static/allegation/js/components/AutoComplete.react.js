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
var MapStore = require('../stores/MapStore');
var OfficerStore = require('../stores/OfficerStore');
var FilterActions = require('../actions/FilterActions');
var cx = require('react/lib/cx');
var _sessionData = {};

AUTOCOMPLETE_CATEGORY_NAMES = {
    'crid': 'Complaint ID',
    'cat__category': 'Complaint type',
    'cat': 'Allegation type',
    'investigator': 'Investigator',
    'officer': 'Officer name',
    'officer__star': 'Badge number',
    'recc_outcome': 'Recommended Outcome',
    'recc_finding': 'Recommended Finding',
    'final_outcome': 'Final Outcome',
    'final_finding': 'Final Finding',
    'incident_date_only__year': 'Incident Year',
    'incident_date_only__year_month': 'Incident Year/Month',
    'incident_date_only': 'Incident Date',
    'areas__id': 'Area'
};


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
    FilterActions.replaceFilters(tags);
  },
  componentDidMount: function () {
    var element = this.getDOMNode();
    $(element).tagsinput({
      itemValue: 'value',
      itemText: 'text'
    });
    var filters = this.state.filters;
    for (var key in filters) {
      var filter = filters[key];
      for (var i = 0; i < filter.length; i++) {
        if (filter[i].value) {
          $(element).tagsinput("add", {
            text: filter[i].text,
            value: [key, filter[i].value]
          });
        } else {
          $(element).tagsinput("add", {
            text: AUTOCOMPLETE_CATEGORY_NAMES[key] + ": " + filter[i],
            value: [key, filter[i]]
          });
        }
      }
    }

    $(element).on('beforeItemAdd', function (event) {
      var tags = $(this).tagsinput('items');
      var tag = event.item;
      event.cancel = isDuplicatedTag(tags, tag)
    });

    var input = $(element).tagsinput("input");
    cpdbAutocomplete(input);
    $(element).on('itemAdded', this.tagsChanged)
      .on('itemRemoved', this.tagsChanged);

    if (filters) {
      $(element).trigger("itemAdded");
    }
    FilterStore.addChangeListener(this._onChange);
    OfficerStore.addChangeListener(this._onChange);
  },
  getInitialState: function () {
    var filters = {};
    if (INIT_DATA){
      filters = FilterStore.setSession(INIT_FILTERS);
      MapStore.setSession(INIT_DATA);
      OfficerStore.setSession(INIT_DATA);
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
    var tempSessionData = {};
    $.extend(tempSessionData, FilterStore.getSession());
    $.extend(tempSessionData, MapStore.getSession());
    $.extend(tempSessionData, OfficerStore.getSession());

    console.log(tempSessionData, _sessionData, _.isEqual(tempSessionData, _sessionData));
    if (! _.isEqual(tempSessionData, _sessionData)) {
      _sessionData = _.clone(tempSessionData);
      FilterStore.saveSession(_sessionData);
    }
  },

  /**
   * @return {object}
   */
  render: function () {

    return <input id="cpdb-search" className="form-control" placeholder="Search by name, neighborhood, or complaint"/>

  }

});

module.exports = AutoComplete;
