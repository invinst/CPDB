var f = require('utils/tests/f');
var faker = require('faker');


f.define('ComplainingWitness', {
  'cwit_id': function () {
    return faker.random.number(10000);
  },

  'gender': function () {
    return 'M';
  },

  'race': function () {
    return 'Black';
  },

  'age': function () {
    return faker.random.number(50);
  }
});
