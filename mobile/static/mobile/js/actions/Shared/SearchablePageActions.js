var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SearchablePageActions = {
  changed: function (term) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_INPUT_CHANGED,
      data: term
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
  },

  clear: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_CLEAR
    });
  }
};

module.exports = SearchablePageActions;
