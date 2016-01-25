var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var first = true;

var NavActions = {
  mobileSearchClick: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.MOBILE_SEARCH_CLICK
    });
  },

  mobileSearchCollapse: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.MOBILE_SEARCH_COLLAPSE
    });
  },

  goToPage: function (page, params) {
    AppDispatcher.dispatch({
      actionType: AppConstants.NAV_GO_TO_PAGE,
      page: page,
    });
  }
};

module.exports = NavActions;
