var jQuery = require('jquery');
var AppConstants = require('../constants/AppConstants');

var SessionsActions = require('actions/SessionSection/SessionsActions');

var ajax = null;

var SessionSearchableAPI = {
  toggleSearchable: function (target, enable) {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      'hash_id': target,
      'enable': enable
    };

    ajax = jQuery.post(AppConstants.SESSION_SEARCHABLE_API_ENDPOINT, params, function(data) {
      SessionsActions.toggledSearchable(data);
    });
  }
};

module.exports = SessionSearchableAPI;
