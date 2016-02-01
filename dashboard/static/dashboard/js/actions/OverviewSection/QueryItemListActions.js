var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var QueryItemListActions = {
  setActiveItem: function (activeQueryItem) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_ACTIVE_QUERY_ITEM,
      activeQueryItem: activeQueryItem
    });
  }
};

module.exports = QueryItemListActions;
