var $ = require('jquery');
var _ = require('lodash');
require('jquery.cookie');

var AppConstants = require('constants/AppConstants');
var SessionActions = require('actions/SessionActions');
var SessionStore = require('stores/SessionStore');

var ajax = null;

var SessionAPI = {
  getSessionInfo: function(session) {
    var params = {
      'hash_id': session
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.SESSION_API_ENDPOINT, params, function(data) {
      SessionActions.receivedSessionInfoData(data);
    });
  },

  updateSessionInfo: function(data) {
    var currentData = SessionStore.getState()['data'];
    var data = _.merge(currentData, data);
    var requestData = {
      'request_data': JSON.stringify(data),
    };

    $.ajax({
      url: AppConstants.SESSION_API_ENDPOINT,
      data: requestData,
      dataType: 'json',
      type: 'POST',
      success: function(data) {
          SessionActions.receivedUpdatedSessionInfoData(data);
      }
    });
  }
};

module.exports = SessionAPI;
