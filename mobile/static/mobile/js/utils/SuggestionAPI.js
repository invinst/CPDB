var request = require('superagent');

var AppConstants = require('constants/AppConstants');

var MainPageServerActions = require('actions/MainPage/MainPageServerActions');


var ajax = null;

var SuggestionAPI = {
  // TODO: only trigger the api after threshold, could put it to be default 300ms
  get: function (query) {
    if (ajax) {
      ajax.abort()
    }

    ajax = request.get(AppConstants.SUGGESTION_API_ENDPOINT)
      .query({query: query})
      .end(function (err, res) {
        if (res.ok) {
          MainPageServerActions.received(res.body, query)
        } else {
          MainPageServerActions.failedToReceive(query)
        }
      });
  }
};

module.exports = SuggestionAPI;
