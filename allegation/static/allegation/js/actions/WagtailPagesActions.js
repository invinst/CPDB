var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WagtailPagesActions = {
  receivedGlossaryData: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.WAGTAIL_GLOSSARY_PAGE_RECEIVED_DATA,
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
