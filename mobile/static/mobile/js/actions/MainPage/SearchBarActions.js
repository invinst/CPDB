var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SearchBarActions = {
  changed: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_INPUT_CHANGED
    });
  },

  focus: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_FOCUS
    });
  },

  blur: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_BLUR
    });
  }
};

module.exports = SearchBarActions;
