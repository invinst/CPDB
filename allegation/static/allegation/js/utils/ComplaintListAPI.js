var ComplaintListServerActions = require('../actions/ComplaintList/ComplaintListServerActions');
var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');
var AppConstants = require('../constants/AppConstants');
var $ = require('jquery');

var ajax = null;

var ComplaintListAPI = {
  preloadDataForOtherTab: function () {
    for (filter in AppConstants.FILTERS) {
      var queryString = AllegationFetcherQueryBuilder.buildQuery(filter);
      ajax = $.getJSON('/api/allegations/?' + queryString, function (data) {
      })
    }
  },

  getData: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var that = this;
    ComplaintListServerActions.getData();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON('/api/allegations/?' + queryString, function (data) {
        ComplaintListServerActions.receivedData(data);
        that.preloadDataForOtherTab();
      });
    } else {
      ComplaintListServerActions.receivedData({'allegations': [], 'analytics': {}});
    }
  },

  getAllForOfficer: function(officer) {
    var endpoint = '/api/allegations/?officer=' + officer + '&length=-1';

    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(endpoint, function (data) {
      ComplaintListServerActions.receivedOfficerComplaints(data);
    });
  },

  getMoreData: function (pageNumber) {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var pagedQuery = [queryString, 'page=' + pageNumber, 'length=25'].join('&');

    if (queryString) {
      $.getJSON('/api/allegations/?' + pagedQuery, function (data) {
        ComplaintListServerActions.receivedMoreData(data);
      });
    }
  }
};

module.exports = ComplaintListAPI;
