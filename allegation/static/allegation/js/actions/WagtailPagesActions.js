var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WagtailPagesActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.WAGTAIL_PAGES_RECEIVED_DATA,
      data: data
    });
  },
};

module.exports = WagtailPagesActions;
