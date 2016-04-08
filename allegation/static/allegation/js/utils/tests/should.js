var should = require('should');

should.Assertion.add('contains', function (str) {
  this.obj.indexOf(str).should.not.equal(-1);
});
