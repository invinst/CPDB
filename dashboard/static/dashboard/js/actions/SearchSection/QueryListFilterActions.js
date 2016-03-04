var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var QueryListFilterActions = {
  setActiveItem: function (key) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_QUERY_LIST_ACTIVE_ITEM,
      data: key
    });
  }
};

module.exports = QueryListFilterActions;
