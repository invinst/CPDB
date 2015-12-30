var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var MainPageServerActions = require('actions/MainPage/MainPageServerActions');


var SuggestionAPI = {
  get: function (query) {
    request.get(AppConstants.SUGGESTION_API_ENDPOINT)
      .query({query: query})
      .end(function (err, res) {
        if (res.ok) {
          MainPageServerActions.received(res.body, query)
        } else {
          MainPageServerActions.failedToReceive()
        }
      });
  }
};

module.exports = SuggestionAPI;
