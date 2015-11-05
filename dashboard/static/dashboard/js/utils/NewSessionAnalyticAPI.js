var _ = require('lodash');
var jQuery = require('jquery');
var moment = require('moment');

var NewSessionPerDayChartActions = require('../actions/OverviewSection/NewSessionPerDayChartActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

// Fill django-rest returned date data
function fill(data, begin) {
  index = begin;
  today = moment().format(AppConstants.DATE_ONLY_FORMAT);
  filledData = _(data['results']).pluck('created_date').value();

  while (index != today) {
    index = moment(index).add(1, 'd').format(AppConstants.DATE_ONLY_FORMAT);
    if (!_(filledData).contains(index)) {
      data['results'].push({
        'created_date': index,
        count: 0
      });
    }
  }

  data['results'] = _(data['results']).sortBy(function(x) { return moment(x['created_date']); }).value();

  return data;
}

var NewSessionAnalyticAPI = {
  getRecent: function () {
    if (ajax) {
      ajax.abort();
    }

    end = moment().add(1, 'd').format(AppConstants.DATE_ONLY_FORMAT);
    begin = moment().subtract(AppConstants.NUMBER_OF_DAYS_SHOWN_IN_NEW_SESSION_CHART, 'd').format(AppConstants.DATE_ONLY_FORMAT);

    ajax = jQuery.get(AppConstants.NEW_SESSION_ANALYTICS_API_ENDPOINT, {begin: begin, end: end}).done(function (data) {
      data = fill(data, begin, end);
      NewSessionPerDayChartActions.receivedData(data);
    });
  }
};

module.exports = NewSessionAnalyticAPI;
