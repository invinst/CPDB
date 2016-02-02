var _ = require('lodash');

var CollectionUtils = {
  getMostFrequent:  function (arr) {
    return _.chain(arr).countBy().pairs().max(_.last).head().value();
  }
};

module.exports = CollectionUtils;
