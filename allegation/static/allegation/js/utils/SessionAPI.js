var $ = require('jquery');
var _ = require('lodash');
require('jquery.cookie');

var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
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
      ComplaintListAPI.getData()
    });
  },

  updateSessionInfo: function(data) {
    var currentData = SessionStore.getState()['data'];
    var data = _.extend(currentData, data);
    var requestData = {
      'request_data': JSON.stringify(data),
    };

    if (ajax) {
      ajax.abort();
    }

    if (!_.isEmpty(data.hash)) {
      ajax = $.ajax({
        url: AppConstants.SESSION_API_ENDPOINT,
        data: requestData,
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          SessionActions.receivedUpdatedSessionInfoData(data);
        }
      });
    }
  }
};

module.exports = SessionAPI;
