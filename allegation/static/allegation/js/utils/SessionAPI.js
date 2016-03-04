var _ = require('lodash');

var AppConstants = require('constants/AppConstants');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var SessionActions = require('actions/SessionActions');
var SessionStore = require('stores/SessionStore');

var ajax = null;
var _timeout = false;


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

  updateSessionRequest: function (data) {
    return $.ajax({
      url: AppConstants.SESSION_API_ENDPOINT,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      type: 'PUT'
    });
  },

  updateSessionInfo: function (data) {
    data = _.extend(SessionStore.getState()['data'], data);

    if (!_.isEmpty(data.hash)) {
      SessionAPI.updateSessionRequest(data)
      .done(function (result) {
        SessionActions.receivedUpdatedSessionInfoData(result);
      });
    }
  },

  updateSiteTitleDelayed500ms: function (siteTitle) {
    if (_timeout) {
      clearTimeout(_timeout);
    }

    _timeout = setTimeout(function () {
      SessionAPI.updateSessionInfo({'title': siteTitle});
    }, 500);
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
