require('utils/jQuery');
var _ = require('lodash');

var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var SessionActions = require('actions/SessionActions');
var SessionStore = require('stores/SessionStore');

var ajax = null;


var SessionAPI = {
  getSessionInfoRouter: function (session, callback) {
    var params = {
      'hash_id': session
    };

    ajax = $.getJSON(AppConstants.SESSION_API_ENDPOINT, params, function (data) {
      SessionActions.receivedSessionInfoData(data);
      ComplaintListAPI.getData();
      callback(data.data);
    });
  },

  getSessionInfo: function (session) {
    var params = {
      'hash_id': session
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.SESSION_API_ENDPOINT, params, function (data) {
      SessionActions.receivedSessionInfoData(data);
      if (session == '') {
        SessionActions.createdSession();
      }
      ComplaintListAPI.getData();
    });
  },

  updateSessionInfo: function (data) {
    var currentData = SessionStore.getState()['data'];
    data = _.extend(currentData, data);
    var requestData = {
      'request_data': JSON.stringify(data)
    };

    if (!_.isEmpty(data.hash)) {
      jQuery.ajax({
        url: AppConstants.SESSION_API_ENDPOINT,
        data: requestData,
        dataType: 'json',
        type: 'PUT',
        success: function (data) {
          SessionActions.receivedUpdatedSessionInfoData(data);
        }
      });
    }
  },

  createSharedSession: function (hashId) {
    $.ajax({
      url: AppConstants.SESSION_API_ENDPOINT,
      data: {'hash_id': hashId},
      dataType: 'json',
      type: 'POST',
      success: function (data) {
        SessionActions.receivedSharedSession(data);
      }
    });
  }
};

module.exports = SessionAPI;
