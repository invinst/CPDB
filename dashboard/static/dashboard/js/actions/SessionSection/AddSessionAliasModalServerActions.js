var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var SessionAliasServerActions = {
  receivedAliasCreationResult: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_SESSION_ALIAS_CREATION_RESULT,
      data: data
    });
  },

  failedToCreateAlias: function(error) {
    AppDispatcher.dispatch({
      actionType: AppConstants.FAILED_TO_CREATE_SESSION_ALIAS,
      data: error.errors.__all__
    });

  }
};

module.exports = SessionAliasServerActions;
