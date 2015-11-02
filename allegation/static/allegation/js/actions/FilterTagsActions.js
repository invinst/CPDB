var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('utils/OutcomeAnalysisAPI');
var SessionAPI = require('utils/SessionAPI');
var RaceGenderAPI = require('utils/RaceGenderAPI');
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
    RaceGenderAPI.getData();
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
    RaceGenderAPI.getData();
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  },

  pinTag: function (category, filter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PIN_TAG,
      category: category,
      filter: filter
    });
    SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
  }
};

module.exports = FilterTagsActions;
