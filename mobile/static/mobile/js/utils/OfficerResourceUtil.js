var request = require('superagent');

var AppConstants = require('constants/AppConstants');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');

var OfficerResourceUtil = {
  get: function (pk) {
    request.get(AppConstants.OFFICER_API_ENDPOINT)
      .query({ pk: pk })
      .end(function (err, res) {
        if (res.ok) {
          OfficerPageServerActions.received(res.body)
        } else {
          OfficerPageServerActions.failedToReceive(pk)
        }
      });
  }
};

module.exports = OfficerResourceUtil;
