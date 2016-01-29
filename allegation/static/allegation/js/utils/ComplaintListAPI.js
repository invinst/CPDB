var _ = require('lodash');
require('utils/jQuery');

var AllegationFetcherQueryBuilder = require('utils/querybuilders/AllegationFetcherQueryBuilder');
var AppConstants = require('../constants/AppConstants');
var ComplaintListStore = require('stores/ComplaintListStore');
var ComplaintListServerActions = require('../actions/ComplaintList/ComplaintListServerActions');
var RaceGenderTabActions = require('actions/DataToolPage/RaceGenderTabActions');
var APIUtil = require('utils/api/APIUtil');

var ajax = null;


var ComplaintListAPI = {
  preloadDataForOtherTab: function () {
    for (filter in AppConstants.FILTERS) {
      var params = AllegationFetcherQueryBuilder.buildQueryParams(filter);
      ajax = APIUtil.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      });
    }
  },

  getData: function (fromFilter) {
    var activeOutcomeFilter = !fromFilter ? 'all' : '';

    var params = AllegationFetcherQueryBuilder.buildQueryParams(activeOutcomeFilter);
    var that = this;
    ComplaintListServerActions.getData();

    if (!_.isEmpty(params)) {
      if (ajax) {
        ajax.abort();
      }

      ajax = APIUtil.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
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

    ajax = APIUtil.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      ComplaintListServerActions.receivedFullComplaints(data);
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

    ajax = APIUtil.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      ComplaintListServerActions.receivedFullComplaints(data);
    });
  },

  getMoreData: function (pageNumber) {
    var params = AllegationFetcherQueryBuilder.buildQueryParams();
    params = _.merge(params, {
      page: pageNumber,
      length: 50
    });

    APIUtil.getJSON(AppConstants.ALLEGATIONS_API_ENDPOINT, params, function (data) {
      ComplaintListServerActions.receivedMoreData(data);
    });
  }
};

module.exports = ComplaintListAPI;
