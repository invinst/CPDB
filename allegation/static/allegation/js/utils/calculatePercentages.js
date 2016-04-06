var _ = require('lodash');


function calculatePercentages(l) {
  var sum = _.reduce(l, function (acc, x) { return acc + x.value; }, 0);
  var off = 100 - _.reduce(l, function (acc, x) { return acc + Math.floor(x.value*100/sum); }, 0);
  return _.chain(l)
          .map(function (x, i) { x.oldIndex = i; return x; })
          .sortBy(function (x) { return -Math.floor(x.value*100/sum); })
          .map(function (x, i) {
            x.percent = Math.floor(x.value*100/sum) + (off >= l.length - i);
            return x;
          })
          .sortBy(function (x) { return x.oldIndex; })
          .value();
}

module.exports = calculatePercentages;
