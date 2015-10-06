var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var NavigationActions = {
  setActiveItem: function (activeItem) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_NAV_ITEM,
      activeItem: activeItem
    });
  }
};

module.exports = NavigationActions;
