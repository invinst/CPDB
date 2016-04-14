var should = require('should');

var SharedExample = require('utils/tests/SharedExample');


should.Assertion.add('behaveLike', function (name) {
  var example = SharedExample.get(name);
  example.apply(this, Array.prototype.slice.call(arguments, 1));
});
