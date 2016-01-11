var AppConstants = require('constants/AppConstants');
var OfficerPageActions = require('actions/OfficerPage/OfficerPageActions');
var FilterStore = require('stores/FilterStore');
var MapActions = require('actions/MapActions');

var ajax = null;
var _queryString = null;

var MapAPI = {
  getMarkers: function (query) {
    var queryString = FilterStore.getQueryString(['allegation__areas__id']);
    queryString = query || queryString;

    if (_queryString == queryString) {
      return;
    }
    _queryString = queryString;

    if (ajax) {
      ajax.abort()
    }

    ajax = $.getJSON("/api/officer-allegations/cluster/?" + queryString, function (data) {
      MapActions.changeMarkers(data);
    });
  }
};

module.exports = MapAPI;
