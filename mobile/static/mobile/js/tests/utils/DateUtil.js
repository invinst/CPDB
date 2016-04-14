var should = require('should');

var DateUtil = require('utils/DateUtil');


describe('DateUtil', function () {
  it('should date with default format', function () {
    var date = '2012-01-19';
    var sanitizeDate = DateUtil.sanitizeDate(date);

    sanitizeDate.date().should.be.equal(19);
    sanitizeDate.month().should.be.equal(0);
    sanitizeDate.year().should.be.equal(2012);
  });

  it('should return null if invalid date', function () {
    var date = 'invalid';
    var sanitizeDate = DateUtil.sanitizeDate(date);

    should(sanitizeDate).be.exactly(null);
  });

  it('should date with the format supplied in arguments', function () {
    var date = '19-02-2012';
    var sanitizeDate = DateUtil.sanitizeDate(date, 'DD-MM-YYYY');

    sanitizeDate.date().should.be.equal(19);
    sanitizeDate.month().should.be.equal(1);
    sanitizeDate.year().should.be.equal(2012);
  });
});


