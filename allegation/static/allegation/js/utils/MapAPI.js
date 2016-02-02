var MapActions = require('actions/MapActions');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var ajax = null;
var _queryString = null;

var AREA_FILTER = ['Area'];


var MapAPI = {
  getMarkers: function (query) {
    var queryString = AllegationFilterTagsQueryBuilder.buildQuery(AREA_FILTER);
    queryString = query || queryString;

    if (_queryString == queryString) {
      return;
    }
    _queryString = queryString;

    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON('/api/officer-allegations/cluster/?' + queryString, function (data) {
      MapActions.changeMarkers(data);
    });
  }
};

module.exports = MapAPI;
