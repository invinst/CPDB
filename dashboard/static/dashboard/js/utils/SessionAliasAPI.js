var jQuery = require('jquery');
var AddSessionAliasModalServerActions = require('../actions/SessionSection/AddSessionAliasModalServerActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

var SessionAliasAPI = {
  create: function (alias, target) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.post(AppConstants.SESSION_ALIAS_API_ENDPOINT, {alias: alias, target: target}).done(function (data) {
        AddSessionAliasModalServerActions.receivedAliasCreationResult(data);
      }).fail(function (error) {
        AddSessionAliasModalServerActions.failedToCreateAlias(error.responseJSON);
      });
  }
};

module.exports = SessionAliasAPI;
