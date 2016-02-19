var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var QueryListActions = {
  lockScroll: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SCROLL
    });
  },

  sortBy: function (sortBy) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SORT_QUERY_LIST,
      data: sortBy
    });
  }
};

module.exports = QueryListActions;
