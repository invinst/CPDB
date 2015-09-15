var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');
var ComplaintListAPI = require('../utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('../utils/OutcomeAnalysisAPI');

var OfficerActions = {

  setViewMore: function (value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.OFFICER_VIEW_MORE,
      value: value
    });
  },
  setActiveOfficer: function (officer, page) {
    AppDispatcher.dispatch({
      actionType: MapConstants.SET_ACTIVE_OFFICER,
      officer: officer
    });

    // We only do API call on Officer instance on homepage 
    if (page == 'home') {
      ComplaintListAPI.getData();
      OutcomeAnalysisAPI.getAnalysisInformation();
    }
  },
  setComplaintsCount: function (start, end) {
    AppDispatcher.dispatch({
      actionType: MapConstants.SET_OFFICER_LIST_FILTER,
      start: start,
      end: end
    })
  }

};

module.exports = OfficerActions;
