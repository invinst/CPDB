var request = require('superagent');

var AppConstants = require('constants/AppConstants');
var OfficerPageServerActions = require('actions/OfficerPage/OfficerPageServerActions');


var OfficerResourceUtil = {
  get: function (id) {
    request.get(AppConstants.OFFICER_API_ENDPOINT)
      .query({ pk: id })
      .end(function (err, res) {
        if (res.ok) {
          OfficerPageServerActions.received(res.body);
        } else {
          OfficerPageServerActions.failedToReceive(id);
        }
      });
  }
};

module.exports = OfficerResourceUtil;
