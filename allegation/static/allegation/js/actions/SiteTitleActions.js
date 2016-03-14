var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var SessionAPI = require('utils/SessionAPI');

var SiteTitleActions = {

  changeSiteTitle: function (title) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_SITE_TITLE,
      title: title
    });
    SessionAPI.updateSiteTitleDelayed500ms(title);
  }

};

module.exports = SiteTitleActions;
