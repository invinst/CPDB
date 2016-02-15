require('should');
var _ = require('lodash');
var calculatePercentages = require('utils/calculatePercentages');


describe('calculatePercentages', function () {
  it('should give back percentage', function () {
    var results = calculatePercentages([{value: 5}, {value: 2}, {value: 3}]);
    (_.map(results, function (x) { return x.percent; })).should.deepEqual([50, 20, 30]);
  });

  it('should preserve order', function () {
    var results = calculatePercentages([
      {value: 23, name: 'A'}, {value: 65, name: 'B'}, {value: 15, name: 'C'}, {value: 47, name: 'D'}
    ]);
    (_.map(results, function (x) { return x.name; })).should.deepEqual(['A', 'B', 'C', 'D']);
  });
});
