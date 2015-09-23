var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var AliasAPI = require('../../utils/AliasAPI');

var AddAliasModalActions = {
  show: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_ADD_ALIAS_MODAL,
      data: data
    });
  },

  hide: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.HIDE_ADD_ALIAS_MODAL
    });
  },

  createAlias: function(alias, target) {
    AliasAPI.create(alias, target);
  },

  formDataChange: function(stateName, stateValue) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ALIAS_MODAL_FORM_DATA_CHANGED,
      stateName: stateName,
      stateValue: stateValue
    });
  }
};

module.exports = AddAliasModalActions;
