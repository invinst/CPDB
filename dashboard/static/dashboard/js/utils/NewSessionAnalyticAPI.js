var jQuery = require('jquery');
var moment = require('moment');

var NewSessionPerDayChartActions = require('../actions/OverviewSection/NewSessionPerDayChartActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

var NewSessionAnalyticAPI = {
  getRecent: function () {
    if (ajax) {
      ajax.abort();
    }

    end = moment().add(1, 'd').format(AppConstants.DATE_ONLY_FORMAT);
    begin = moment().subtract(AppConstants.NUMBER_OF_DAYS_SHOWN_IN_NEW_SESSION_CHART, 'd').format(AppConstants.DATE_ONLY_FORMAT);

    ajax = jQuery.get(AppConstants.NEW_SESSION_ANALYTICS_API_ENDPOINT, {begin: begin, end: end}).done(function (data) {
      NewSessionPerDayChartActions.receivedData(data);
    });
  }
};

module.exports = NewSessionAnalyticAPI;
