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
  addTag: function (category, value, filter, text) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_TAG,
      category: category,
      value: value,
      filter: filter,
      text: text
    });
    updateSiteData();
  },

  toggleTags: function (category, tags) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_TAGS,
      category: category,
      tags: tags
    });

    updateSiteData();
  },

  removeTag: function (category, value, dontUpdateSession) {
    if (EmbedStore.isEmbedMode()) {
      return
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_TAG,
      category: category,
      value: value
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
