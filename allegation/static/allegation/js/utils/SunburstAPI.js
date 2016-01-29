/**
 * Created by eastagile on 11/2/15.
 */
global.jQuery = require('jquery');
var _ = require('lodash');


var AppConstants = require('constants/AppConstants');
var SunburstActions = require('actions/SunburstActions');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var ajax = null;

var SUNBURST_IGNORE_FILTERS = ['Final Outcome', 'Final Finding', 'Outcome'];


var SunburstAPI = {
  getData: function(query) {
    var filter = AllegationFilterTagsQueryBuilder.buildQuery(SUNBURST_IGNORE_FILTERS);
    var queryString = query || filter;

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON("/api/officer-allegations/sunburst/?" + queryString, function (data) {
      SunburstActions.receivedData(data);
    });
  }
};

module.exports = SunburstAPI;
