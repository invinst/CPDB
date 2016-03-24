var _ = require('lodash');

var RaceGenderAPITransformation = require('utils/RaceGenderAPITransformation');

require('should');


describe('RaceGenderAPITransformation utils', function () {
  it('should put "Italian" into "White" category', function () {
    var result = RaceGenderAPITransformation.transformRaces({'Italian': 1}, false);
    var whiteResult = _.filter(result, function (obj) {
      return obj.label === 'White';
    })[0];

    whiteResult.count.should.equal(1);
    whiteResult.filters.should.deepEqual([{value: 'Italian', displayValue: 'Italian'}]);
  });

  it('should display "Asian" when there is only asian in filter result', function () {
    var result = RaceGenderAPITransformation.transformRaces({'Asian': 1}, false);
    var asianResult = _.filter(result, function (obj) {
      return obj.label === 'Asian';
    });
    asianResult.length.should.equal(1);
  });

  it('should display "Asian officers" when there is only asian officer in filter result', function () {
    var result = RaceGenderAPITransformation.transformRaces({'Asian': 1}, true);
    var asianResult = _.filter(result, function (obj) {
      return obj.label === 'Asian officers';
    });
    asianResult.length.should.equal(1);
  });

  it('should display "Others" when there is only "Unknown" in filter result', function () {
    var result = RaceGenderAPITransformation.transformRaces({'Unknown': 1}, false);
    var otherResult = _.filter(result, function (obj) {
      return obj.label === 'Others';
    });
    otherResult.length.should.equal(1);
  });

  it('should display "Others" when there are other officer', function () {
    var result = RaceGenderAPITransformation.transformRaces({'xyz': 1, 'abc': 1}, true);
    var otherResult = _.filter(result, function (obj) {
      return obj.label === 'Others';
    });
    otherResult.length.should.equal(1);
  });
});
