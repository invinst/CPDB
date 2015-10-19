var _ = require('lodash');
var moment = require('moment');


var FilterLogPresenter = function (filter_log) {
  var unixTime = function() {
    return moment(filter_log.created_at).unix();
  };

  var tags = function() {
    return _.chain(filter_log.tag_name.split('&')).compact().value().map(function(x) { return  x.split('=') }).map(function(x) { return decodeURI(x[1]) })
  };

  var asHistoryEntry = function() {
    return 'User changed filters to [' + tags().join(', ')  + ']';
  };

  return {
    tags: tags(),
    asHistoryEntry: asHistoryEntry(),
    unixTime: unixTime()
  };
}

module.exports = FilterLogPresenter;
