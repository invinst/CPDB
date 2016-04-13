var CollectionUtil = require('utils/CollectionUtil');

var should = require('should');

describe('CollectionUtil', function () {
  describe('pluck', function () {
    it('should pluck field of array of object', function () {
      var items = [
        {'key': 1},
        {'key': 2}
      ];

      var pluckedByKey = CollectionUtil.pluck(items, 'key');
      pluckedByKey.should.have.length(2);
      pluckedByKey.should.be.eql([1, 2]);
    });
  });

  describe('#isSameField', function () {
    it('should return true if collection has the same field value', function () {
      var items = [
        {'field': 1},
        {'field': 1},
        {'field': 1}
      ];

      var isSame = CollectionUtil.isSameField(items, 'field');
      isSame.should.be.equal(true);
    });

    it('should return false if collection has different field value', function () {
      var items = [
        {'field': 1},
        {'field': 1},
        {'field': 2}
      ];

      var isSame = CollectionUtil.isSameField(items, 'field');
      isSame.should.be.equal(false);
    });

  });

  describe('#isSameAllFields', function () {
    it('should return true if collection has the same value for all specified fields', function () {
      var items = [
        {'field1': 1, 'field2': 2},
        {'field1': 1, 'field2': 2}
      ];

      var isSame = CollectionUtil.isSameAllFields(items, ['field1', 'field2']);
      isSame.should.be.equal(true);
    });

    it('should return false if collection has any different value in specified fields', function () {
      var items = [
        {'field1': 1, 'field2': 1},
        {'field1': 1, 'field2': 2}
      ];

      var isSame = CollectionUtil.isSameAllFields(items, ['field1', 'field2']);
      isSame.should.be.equal(false);
    });
  });

  describe('#first', function () {
    it('should return null if collection is empty', function () {
      var items = [];

      var first = CollectionUtil.first(items);
      should(first).be.exactly(null);
    });

    it('should return first element if collection is not empty', function () {
      var items = [1, 2];
      CollectionUtil.first(items).should.be.equal(1);
    });
  });

  describe('#groupBy', function () {
    it('should group items by specify function', function () {
      var items = [1, 1, 2];
      var result = CollectionUtil.groupBy(items, function (item) {
        return item;
      });
      result.should.be.deepEqual({1: [1,1], 2: [2]});
    });
  });

});


