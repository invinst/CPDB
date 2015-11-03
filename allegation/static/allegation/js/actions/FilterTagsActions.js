var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('utils/OutcomeAnalysisAPI');
var SessionAPI = require('utils/SessionAPI');
var RaceGenderAPI = require('utils/RaceGenderAPI');
var FilterStore = require('stores/FilterStore');


function updateSiteData() {
  ComplaintListAPI.getData();
  OutcomeAnalysisAPI.getAnalysisInformation();
  RaceGenderAPI.getData();
  SessionAPI.updateSessionInfo({'query': FilterStore.getSession()});
};

var FilterTagsActions = {
  addTag: function (category, filter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_TAG,
      category: category,
      filter: filter
    });
    updateSiteData();
  },

  toggleTags: function (category, filters) {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_TAGS,
      category: category,
      filters: filters
    });

    updateSiteData();
  },

  removeTag: function (category, filter) {
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_TAG,
      category: category,
      filter: filter
    });

    updateSiteData();
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
