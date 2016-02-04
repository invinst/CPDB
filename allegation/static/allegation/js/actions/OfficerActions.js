var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var ComplaintListAPI = require('../utils/ComplaintListAPI');
var OfficerListStore = require('stores/OfficerListStore');
var SessionAPI = require('utils/SessionAPI');

var OfficerActions = {

  setViewMore: function (value) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_VIEW_MORE,
      value: value
    });
  },
  setActiveOfficer: function (officer, page) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_OFFICER,
      officer: officer
    });

    // We only do API call on Officer instance on homepage
    ComplaintListAPI.getData();
    // OutcomeAnalysisAPI.getAnalysisInformation();
    SessionAPI.updateSessionInfo({ 'query': OfficerListStore.getSession()});
  },

  setActiveOfficerInOfficerPage: function (officer) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_OFFICER_IN_OFFICER_PAGE,
      officer: officer
    });
  },

  setComplaintsCount: function (start, end) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_OFFICER_LIST_FILTER,
      start: start,
      end: end
    });
  }

};

module.exports = OfficerActions;
