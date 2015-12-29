var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var MainPageServerActions = require('actions/MainPage/MainPageServerActions');

var AllegationResourceUtil = {
  get: function (query) {
    request.get(AppConstants.SUGGESTION_API_ENDPOINT)
      .query({ q: query })
      .end(function (err, res) {
        if (res.ok) {
          MainPageServerActions.received(res.body)
        } else {
          MainPageServerActions.failedToReceive(crid)
        }
      });
  }
};

module.exports = AllegationResourceUtil;
