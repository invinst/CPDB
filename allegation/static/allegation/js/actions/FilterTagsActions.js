var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('utils/OutcomeAnalysisAPI');
var SessionAPI = require('utils/SessionAPI');
var FilterStore = require('stores/FilterStore');


var FilterTagsActions = {
  addTag: function (category, filter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_TAG,
      category: category,
      filter: filter
    });

    ComplaintListAPI.getData();
    OutcomeAnalysisAPI.getAnalysisInformation();
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  },

  removeTag: function (category, filter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_TAG,
      category: category,
      filter: filter
    });

    ComplaintListAPI.getData();
    OutcomeAnalysisAPI.getAnalysisInformation();
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  }
};

module.exports = FilterTagsActions;
