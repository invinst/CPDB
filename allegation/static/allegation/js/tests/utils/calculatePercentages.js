var _ = require('lodash');
var calculatePercentages = require('utils/calculatePercentages');

require('should');


describe('calculatePercentages', function () {
  it('should give back percentage', function () {
    var results = calculatePercentages([{value: 5}, {value: 2}, {value: 3}]);
    (_.pluck(results, 'percent')).should.deepEqual([50, 20, 30]);
  });

  it('should preserve order', function () {
    var results = calculatePercentages([
      {value: 23, name: 'A'}, {value: 65, name: 'B'}, {value: 15, name: 'C'}, {value: 47, name: 'D'}
    ]);
    (_.pluck(results, 'name')).should.deepEqual(['A', 'B', 'C', 'D']);
  });

  it('should ensure 1% is smallest', function () {
    var results = calculatePercentages([
      {value: 2992, name: 'A'}, {value: 3943, name: 'B'}, {value: 3798, name: 'C'},
      {value: 4114, name: 'D'}, {value: 69, name: 'E'}
    ]);
    _.min(_.pluck(results, 'percent')).should.equal(1);
  });
});
