var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');


var SearchActions = {
  activate: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.ACTIVATE_SEARCH
    });
  },

  deactivate: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.DEACTIVATE_SEARCH
    });
  },

  searchFor: function (term) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_FOR,
      data: term
    });
  },
};

module.exports = SearchActions;
