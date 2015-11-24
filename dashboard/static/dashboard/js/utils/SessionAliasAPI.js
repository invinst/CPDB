var jQuery = require('jquery');
var AddAliasModalServerActions = require('../actions/SearchSection/AddAliasModalServerActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

var SessionAliasAPI = {
  create: function (alias, target) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.post(AppConstants.ALIAS_API_ENDPOINT, {alias: alias, target: target}).done(function (data) {
        //AddAliasModalServerActions.receivedAliasCreationResult(data);
      }).fail(function (error) {
        //AddAliasModalServerActions.failedToCreateAlias(error.responseJSON);
      });
  }
};

module.exports = SessionAliasAPI;
