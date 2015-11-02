/**
 * Created by eastagile on 11/2/15.
 */
var $ = require('jquery');
var _ = require('lodash');
require('jquery.cookie');

var AppConstants = require('constants/AppConstants');
var SunburstActions = require('actions/SunburstActions');
var FilterStore = require('stores/FilterStore');

var ajax = null;
var _queryString = null;

var SunburstAPI = {

  getData: function(query) {
    var filter = FilterStore.getQueryString(['final_outcome', 'final_finding', 'outcome_text', 'final_finding_text']);
    var queryString = query || filter;

    if (_queryString == queryString) {
      return;
    }
    _queryString = queryString;

    if (ajax) {
      ajax.abort();
    }

    ajax = d3.json("/api/allegations/sunburst/?" + queryString, function (error, data) {
      if (error) throw error;
      SunburstActions.receivedData(data);
    });
  }
};

module.exports = SunburstAPI;
