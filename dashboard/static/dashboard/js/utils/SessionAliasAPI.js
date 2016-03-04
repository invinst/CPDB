var jQuery = require('jquery');
var AddSessionAliasModalServerActions = require('../actions/SessionSection/AddSessionAliasModalServerActions');
var AppConstants = require('../constants/AppConstants');
var SessionsAliasActions = require('actions/SessionSection/SessionsAliasActions');
var SessionSearchStore = require('stores/SessionSection/SessionSearchStore');

var ajax = null;
var limit = 0;
var count = 20;

var SessionAliasAPI = {
  create: function (alias, target, title) {
    var aliasData = {
      alias: alias,
      target: target,
      title: title
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.post(AppConstants.SESSION_ALIAS_API_ENDPOINT, aliasData).done(function (data) {
      AddSessionAliasModalServerActions.receivedAliasCreationResult(data);
    }).fail(function (error) {
      AddSessionAliasModalServerActions.failedToCreateAlias(error.responseJSON);
    });
  },

  get: function (query) {
    var params;

    if (ajax) {
      ajax.abort();
    }

    limit = 0;
    params = {
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSION_ALIAS2_API_ENDPOINT, params, function (data) {
      SessionsAliasActions.receivedData(data);
    });
  },

  getMore: function () {
    var params;

    limit += count;

    params = {
      limit: count,
      offset: limit,
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSION_ALIAS2_API_ENDPOINT, params, function (data) {
      SessionsAliasActions.receivedMore(data.results);
    });
  },

  deleteAlias: function (alias) {
    jQuery.ajax({
      type: 'DELETE',
      url: alias.url,
      success: function () {
        SessionsAliasActions.deletedAlias(alias);
      }
    });
  }
};

module.exports = SessionAliasAPI;
