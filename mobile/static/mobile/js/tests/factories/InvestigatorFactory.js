var f = require('utils/tests/f');
var faker = require('faker');


f.define('Investigator', {
  'name': function () {
    return faker.name.findName();
  },
  'complaint_count': function () {
    return faker.random.number(50);
  },
  'discipline_count': function () {
    return faker.random.number(50);
  },
  'current_rank':  function () {
    return faker.lorem.words(2);
  }
});
