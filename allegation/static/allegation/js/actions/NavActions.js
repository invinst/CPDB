var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

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

  goToPage: function (page) {
    AppDispatcher.dispatch({
      actionType: AppConstants.NAV_GO_TO_PAGE,
      page: page
    });

    if (page == 'data') {
      setTimeout(function () {  // wait scroll animation done
        AppDispatcher.dispatch({
          actionType: AppConstants.INIT_DATA_TOOL
        });
      }, 1200);
    }
  }
};

module.exports = NavActions;
