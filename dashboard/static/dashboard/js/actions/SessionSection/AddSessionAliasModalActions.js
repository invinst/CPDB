var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var SessionAliasAPI = require('../../utils/SessionAliasAPI');

var AddSessionAliasModalActions = {
  show: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_ADD_SESSION_ALIAS_MODAL,
      data: data
    });
  },

  hide: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.HIDE_ADD_SESSION_ALIAS_MODAL
    });
  },

  createAlias: function (alias, target, title) {
    SessionAliasAPI.create(alias, target, title);
  },

  formDataChange: function (stateName, stateValue) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SESSION_ALIAS_MODAL_FORM_DATA_CHANGED,
      stateName: stateName,
      stateValue: stateValue
    });
  }
};

module.exports = AddSessionAliasModalActions;
