var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('utils/OutcomeAnalysisAPI');
var SessionAPI = require('utils/SessionAPI');
var RaceGenderAPI = require('utils/RaceGenderAPI');
var SunburstAPI = require('utils/SunburstAPI');
var MapAPI = require('utils/MapAPI');
var FilterTagStore = require('stores/FilterTagStore');
var EmbedStore = require('stores/EmbedStore');


var updateSiteData = function (dontUpdateSession) {
  ComplaintListAPI.getData();
  OutcomeAnalysisAPI.getAnalysisInformation();
  RaceGenderAPI.getData();
  SunburstAPI.getData();
  MapAPI.getMarkers();
  if (!dontUpdateSession) {
    SessionAPI.updateSessionInfo({
      'query': _.assign(FilterTagStore.getSession(), {
        'active_officers': []
      })
    });
  }
};


var FilterTagsActions = {
  toggleStackingMode: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_STACKING_MODE
    });
    SessionAPI.updateSessionInfo({'query': FilterTagStore.getSession()});
  },

  addTag: function (tagValue) {
    ga('send', 'event', 'filter', tagValue.category, tagValue.value);
    if (EmbedStore.isEmbedMode()) {
      return;
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_TAG,
      tagValue: tagValue
    });
    updateSiteData();
  },

  toggleTags: function (tags) {
    if (EmbedStore.isEmbedMode()) {
      return;
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_TAGS,
      tags: tags
    });

    updateSiteData();
  },

  removeTag: function (category, value, dontUpdateSession) {
    if (EmbedStore.isEmbedMode()) {
      return;
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_TAG,
      category: category,
      value: value
    });

    updateSiteData(dontUpdateSession);
  },

  removeCategory: function (category) {
    if (EmbedStore.isEmbedMode()) {
      return;
    }
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_CATEGORY,
      category: category
    });
  },

  removedTag: function (category, filter) {
    if (EmbedStore.isEmbedMode()) {
      return;
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
  },

  // Temporary function to hold sunburst logic
  saveTags: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SAVE_TAGS
    });
    updateSiteData();
  },

  toggleAllTags: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_ALL_TAGS
    });
    SessionAPI.updateSessionInfo({'query': FilterTagStore.getSession()});
  }
};

module.exports = FilterTagsActions;
