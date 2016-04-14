var f = require('utils/tests/f');
var faker = require('faker');


f.define('Category', {
  'id': function () {
    return faker.random.number(1000);
  },
  'allegation_name': function () {
    return faker.lorem.words(4);
  },
  'category': function () {
    return faker.lorem.words(2);
  }
});
