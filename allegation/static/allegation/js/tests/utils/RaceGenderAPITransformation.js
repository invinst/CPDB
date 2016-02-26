var _ = require('lodash');

var RaceGenderAPITransformation = require('utils/RaceGenderAPITransformation');

require('should');


describe('RaceGenderAPITransformation utils', function () {
  it('should put "Italian" into "White" category', function () {
    var result = RaceGenderAPITransformation.transformRaces({'Italian': 1}, false);
    var whiteResult = _.filter(result, function (obj) {
      return obj.label === 'White';
    })[0];

    whiteResult.value.should.equal(1);
    whiteResult.filters.should.deepEqual([{value: 'Italian', label: 'Italian'}]);
  });
});
