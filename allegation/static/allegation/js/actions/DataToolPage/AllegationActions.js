var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');


var AllegationActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ALLEGATION_DETAILS_DATA_RECEIVED,
      data: data
    });
  }
}

module.exports = AllegationActions;
