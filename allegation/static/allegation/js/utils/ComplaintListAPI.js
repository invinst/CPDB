require('utils/jQuery');

var AllegationFetcherQueryBuilder = require('utils/querybuilders/AllegationFetcherQueryBuilder');
var AppConstants = require('../constants/AppConstants');
var ComplaintListStore = require('stores/ComplaintListStore');
var ComplaintListServerActions = require('../actions/ComplaintList/ComplaintListServerActions');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');

var ajax = null;

var ComplaintListAPI = {
  preloadDataForOtherTab: function () {
    for (filter in AppConstants.FILTERS) {
      var queryString = AllegationFetcherQueryBuilder.buildQuery(filter);
      ajax = jQuery.getJSON('/api/officer-allegations/?' + queryString, function (data) {
      });
    }
  },

  getData: function (fromFilter) {
    var activeOutcomeFilter = !fromFilter ? 'all' : '';

    var queryString = AllegationFetcherQueryBuilder.buildQuery(activeOutcomeFilter);
    var that = this;
    ComplaintListServerActions.getData();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = jQuery.getJSON('/api/officer-allegations/?' + queryString, function (data) {
        ComplaintListServerActions.receivedData(data, fromFilter);
        if (!fromFilter) {
          that.preloadDataForOtherTab();
        }
      });
    } else {
      ComplaintListServerActions.receivedData({'officer_allegations': [], 'analytics': {}, noQuery: true}, fromFilter);
    }
  },

  getAllForOfficer: function(officer) {
    var params = {
      officer: officer,
      length: -1
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      ComplaintListServerActions.receivedOfficerComplaints(data);
    });
  },

  getAllForInvestigator: function(investigator) {
    var params = {
      allegation__investigator: investigator,
      length: -1
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      ComplaintListServerActions.receivedOfficerComplaints(data);
    });
  },

  getMoreData: function (pageNumber) {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    var pagedQuery = [queryString, 'page=' + pageNumber, 'length=50'].join('&');

    if (queryString) {
      jQuery.getJSON('/api/officer-allegations/?' + pagedQuery, function (data) {
        ComplaintListServerActions.receivedMoreData(data);
      });
    }
  },
};

module.exports = ComplaintListAPI;
