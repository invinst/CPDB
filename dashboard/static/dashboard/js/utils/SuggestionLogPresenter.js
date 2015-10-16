var moment = require('moment');

var SuggestionLogPresenter = function(suggestion) {
  var unixTime = function() {
    return moment(suggestion.created_at).unix();
  };

  var asHistoryEntry = function() {
    return 'User search for ' + suggestion.search_query;
  };

  return {
    asHistoryEntry: asHistoryEntry(),
    unixTime: unixTime()
  };
}

module.exports = SuggestionLogPresenter;
