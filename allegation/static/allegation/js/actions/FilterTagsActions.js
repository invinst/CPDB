var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('utils/OutcomeAnalysisAPI');
var SessionAPI = require('utils/SessionAPI');
var RaceGenderAPI = require('utils/RaceGenderAPI');
var SunburstAPI = require('utils/SunburstAPI');
var FilterTagStore = require('stores/FilterTagStore');
var EmbedStore = require('stores/EmbedStore');


function updateSiteData(dontUpdateSession) {
  ComplaintListAPI.getData();
  OutcomeAnalysisAPI.getAnalysisInformation();
  RaceGenderAPI.getData();
  SunburstAPI.getData();
  if (!dontUpdateSession) {
    SessionAPI.updateSessionInfo({
      'query': _.assign(FilterTagStore.getSession(), {
        'active_officers': []
      })
    });
  }
};

var FilterTagsActions = {
  addTag: function (category, value, filter) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_TAG,
      category: category,
      value: value,
      filter: filter
    });
    updateSiteData();
  },

  toggleTags: function (category, filters) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_TAGS,
      category: category,
      filters: filters
    });

    updateSiteData();
  },

  removeTag: function (category, filter, dontUpdateSession) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_TAG,
      category: category,
      filter: filter
    });

    updateSiteData(dontUpdateSession);
  },

  removedTag: function (category, filter) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVED_TAG,
      category: category,
      filter: filter
    });

    SessionAPI.updateSessionInfo({'query': FilterTagStore.getSession()});
  },

  pinTag: function (category, value) {
    if (EmbedStore.isEmbedMode()) {
      return;
    }

    AppDispatcher.dispatch({
      actionType: AppConstants.PIN_TAG,
      category: category,
      value: value
    });
    SessionAPI.updateSessionInfo({'query': FilterTagStore.getSession()});
  }
};

module.exports = FilterTagsActions;
