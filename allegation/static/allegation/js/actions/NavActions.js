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

  initDataTool: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.INIT_DATA_TOOL
    });
  },

  goToPage: function (page, params) {
    AppDispatcher.dispatch({
      actionType: AppConstants.NAV_GO_TO_PAGE,
      page: page,
      first: first
    });

    first = false;
  }
};

module.exports = NavActions;
