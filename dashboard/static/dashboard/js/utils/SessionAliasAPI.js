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
    if (ajax) {
      ajax.abort();
    }

    var alias_data = {
      alias: alias,
      target: target,
      title: title
    };

    ajax = jQuery.post(AppConstants.SESSION_ALIAS_API_ENDPOINT, alias_data).done(function (data) {
        AddSessionAliasModalServerActions.receivedAliasCreationResult(data);
      }).fail(function (error) {
        AddSessionAliasModalServerActions.failedToCreateAlias(error.responseJSON);
      });
  },

  get: function(query) {
    if (ajax) {
      ajax.abort();
    }

    limit = 0;
    var params = {
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSION_ALIAS2_API_ENDPOINT, params, function(data) {
      SessionsAliasActions.receivedData(data);
    });
  },

  getMore: function() {
    limit += count;

    var params = {
      limit: count,
      offset: limit,
      q: SessionSearchStore.getState()['query']
    };

    ajax = jQuery.getJSON(AppConstants.SESSION_ALIAS2_API_ENDPOINT, params, function(data) {
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
