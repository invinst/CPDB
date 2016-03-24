var f = require('utils/tests/f');
var faker = require('faker');


f.define('Officer', {
  'id': function () {
    return faker.random.number(50);
  },
  'officer_first': function () {
    return faker.name.firstName();
  },
  'officer_last': function () {
    return faker.name.lastName();
  },
  'race': function () {
    return 'Black';
  },
  'gender': function () {
    return 'M';
  },
  'allegations_count': function () {
    return faker.random.number(50);
  }
});
