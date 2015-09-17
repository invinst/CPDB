var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var AliasServerActions = {
  receivedAliasCreationResult: function(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_ALIAS_CREATION_RESULT,
      data: data
    });
  },

  failedToCreateAlias: function(error) {
    AppDispatcher.dispatch({
      actionType: AppConstants.FAILED_TO_CREATE_ALIAS,
      data: error.errors.__all__
    });

  }
};

module.exports = AliasServerActions;
