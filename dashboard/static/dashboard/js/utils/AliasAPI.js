var jQuery = require('jquery');
var AliasServerActions = require('../actions/SearchSection/AliasServerActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

var AliasAPI = {
  create: function (alias, target) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.post(AppConstants.ALIAS_ENDPOINT, {alias: alias, target: target}).done(function (data) {
        AliasServerActions.receivedAliasCreationResult(data);
      }).fail(function (error) {
        AliasServerActions.failedToCreateAlias(error.responseJSON);
      });
  }
};

module.exports = AliasAPI;
