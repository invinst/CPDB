var faker = require('faker');

var f = require('utils/tests/f');

f.define('Suggestion', {
  'text': function () {
    return faker.lorem.words(2);
  },

  'url': function () {
    return '';
  },

  'resource': function () {
    return 'officer_allegation';
  },

  'resource_key': function () {
    return faker.random.number(100000);
  },

  'meta': function () {
    if (faker.random.number(10) % 2 == 0) {
      return f.create('AllegationFactory');
    } else {
      return f.create('OfficerFactory');
    }
  }
});
