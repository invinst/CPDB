var cookie = require('react-cookie');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');


var DisclaimerActions = {
  show: function() {
    cookie.save('disclaimered', 1);
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_DISCLAIMER
    })
  },

  hidden: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.DISCLAIMER_HIDDEN
    })
  }
};

module.exports = DisclaimerActions;
