var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');

var EmbedAction = {
  enterEmbedMode: function() {
    AppDispatcher.dispatch({
      actionType: MapConstants.ENTER_EMBED_MODE
    })
  },

  leaveEmbedMode: function() {
    AppDispatcher.dispatch({
      actionType: MapConstants.LEAVE_EMBED_MODE
    })
  }
};

module.exports = EmbedAction;
