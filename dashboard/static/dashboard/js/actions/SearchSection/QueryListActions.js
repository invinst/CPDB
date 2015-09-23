var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var QueryListActions = {
  lockScroll: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.LOCK_SCROLL,
    });
  },
};

module.exports = QueryListActions;
