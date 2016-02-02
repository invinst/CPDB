var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var CheckMarkActions = {
  mouseOut: function (officer) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OFFICER_MOUSE_OUT,
      officer: officer
    });
  }
};

module.exports = CheckMarkActions;
