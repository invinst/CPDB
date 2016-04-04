var _ = require('lodash');


module.exports = function replaceStaticTagWithRealPath(patterns) {
  return function (match) {
    _.each(patterns, function (data) {
      var regex = data[0];
      var replaceStr = data[1];
      match = match.replace(regex, replaceStr);
    });

    return match;
  };
};
