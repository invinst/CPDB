var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WagtailPagesActions = {
  receivedData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.WAGTAIL_PAGES_RECEIVED_DATA,
      data: data
    });
  },

  changeWagtailPage: function (wagtailPage) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_WAGTAIL_PAGE,
      wagtailPage: wagtailPage
    });
  }
};

module.exports = WagtailPagesActions;
