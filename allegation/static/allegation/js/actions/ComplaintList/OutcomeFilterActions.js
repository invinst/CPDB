var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var OutcomeFilterActions = {
  setActiveFilter: function (val) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: val
    })
  }
};

module.exports = OutcomeFilterActions;
