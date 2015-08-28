var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');
var ComplaintListAPI = require('../utils/ComplaintListAPI');
var OutcomeAnalysisAPI = require('../utils/OutcomeAnalysisAPI');

var FilterActions = {
  replaceFilters: function (values) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_REPLACE_FILTERS,
      filters: values
    })

    // call API here
    if (values.length > 0) {
      var lastFilter = values[values.length - 1];
      console.log(lastFilter);
      ga('send', 'event', 'filter', lastFilter.value[0], lastFilter.text);
    }
    ComplaintListAPI.getData();
    OutcomeAnalysisAPI.getAnalysisInformation();
  },

  changeFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_CHANGE_FILTER,
      key: key,
      value: {'value': value}
    });
    ComplaintListAPI.getData();
    OutcomeAnalysisAPI.getAnalysisInformation();
  },

  addFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_ADD_FILTER,
      key: key,
      value: value
    });
    ComplaintListAPI.getData();
    OutcomeAnalysisAPI.getAnalysisInformation();
  },

  saveSession: function() {
    AppDispatcher.dispatch({
      actionType: MapConstants.SAVE_SESSION
    })
  }
};

module.exports = FilterActions;
