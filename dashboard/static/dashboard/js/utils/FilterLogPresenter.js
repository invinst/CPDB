var _ = require('lodash');
var moment = require('moment');


var FilterLogPresenter = function (filterLog) {
  var unixTime = function () {
    return moment(filterLog.created_at).unix();
  };

  var tags = function () {
    return _.chain(filterLog.tag_name.split('&')).compact().value()
      .map(function (x) { return x.split('='); }).map(function (x) { return decodeURI(x[1]); });
  };

  var asHistoryEntry = function () {
    return 'User changed filters to [' + tags().join(', ') + ']';
  };

  return {
    tags: tags(),
    asHistoryEntry: asHistoryEntry(),
    unixTime: unixTime()
  };
};

module.exports = FilterLogPresenter;
