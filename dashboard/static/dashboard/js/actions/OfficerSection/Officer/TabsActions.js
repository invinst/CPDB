var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');

var TabsActions = {
  setActive: function (method) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_OFFICER_TAB_ACTIVE,
      data: method
    });
  },
  goToStoryForm: function () {
    this.setActive('storyForm');
  }
};

module.exports = TabsActions;
