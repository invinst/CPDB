global.jQuery = require('jquery');

var AppConstants = require('../constants/AppConstants');
var SessionsActions = require('actions/SessionSection/SessionsActions');

var ajax = null;
var limit = 0;
var count = 20;

var SessionsAPI = {
  get: function() {
    if (ajax) {
      ajax.abort();
    }

    limit = 0;

    ajax = jQuery.getJSON(AppConstants.SESSIONS_API_ENDPOINT, function(data) {
      SessionsActions.receivedData(data);
    });
  },

  getMore: function() {
    if (ajax) {
      ajax.abort();
    }

    limit += count;

    var params = {
      limit: limit,
      offset: limit + count
    };

    ajax = jQuery.getJSON(AppConstants.SESSIONS_API_ENDPOINT, params, function(data) {
      SessionsActions.receivedMore(data.results);
    });
  }
};

module.exports = SessionsAPI;
