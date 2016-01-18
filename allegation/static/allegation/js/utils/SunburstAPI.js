/**
 * Created by eastagile on 11/2/15.
 */
global.jQuery = require('jquery');
var _ = require('lodash');


var AppConstants = require('constants/AppConstants');
var SunburstActions = require('actions/SunburstActions');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var ajax = null;
var _queryString = null;

var SUNBURST_IGNORE_FILTERS = ['Final Outcome', 'Final Finding', 'Outcome', 'final_finding_text'];


var SunburstAPI = {
  getData: function(query) {
    var filter = AllegationFilterTagsQueryBuilder.buildQuery();
    var queryString = query || filter;

    if (_queryString == queryString) {
      return;
    }
    _queryString = queryString;

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON("/api/officer-allegations/sunburst/?" + queryString, function (data) {
      SunburstActions.receivedData(data);
    });
  }
};

module.exports = SunburstAPI;
