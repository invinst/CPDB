var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');

var FilterActions = {
  replaceFilters: function (values) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_REPLACE_FILTERS,
      filters: values
    })
  },
  changeFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_CHANGE_FILTER,
      key: key,
      value: {'value': value}
    });
  },
  addFilter: function (key, value) {
    AppDispatcher.dispatch({
      actionType: MapConstants.MAP_ADD_FILTER,
      key: key,
      value: value
    });
  },
  saveSession: function() {
    AppDispatcher.dispatch({
      actionType: MapConstants.SAVE_SESSION
    })
  }

};

module.exports = FilterActions;
