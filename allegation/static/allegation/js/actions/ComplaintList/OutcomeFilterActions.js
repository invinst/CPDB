var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var ComplaintListAPI = require('../../utils/ComplaintListAPI');

var OutcomeFilterActions = {
  setActiveFilter: function (val) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: val
    });

    ComplaintListAPI.getData(true);
  },

  setActiveFilterInvestigator: function (investigatorId, activeOutcomeFilter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: activeOutcomeFilter
    });

    ComplaintListAPI.getInvestigations(investigatorId, activeOutcomeFilter);
  },

  setActiveFilterOfficer: function (officerId, activeOutcomeFilter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: activeOutcomeFilter
    });

    ComplaintListAPI.getOfficerComplaints(officerId, activeOutcomeFilter);
  }
};

module.exports = OutcomeFilterActions;
