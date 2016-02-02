var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var EmbedAction = {
  enterEmbedMode: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.ENTER_EMBED_MODE
    });
  },

  leaveEmbedMode: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.LEAVE_EMBED_MODE
    });
  }
};

module.exports = EmbedAction;
