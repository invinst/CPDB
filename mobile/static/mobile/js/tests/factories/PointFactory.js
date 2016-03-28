var faker = require('faker');

var f = require('utils/tests/f');


f.define('Point', {
  'x': function () {
    return faker.address.latitude();
  },

  'y': function () {
    return faker.address.longitude();
  }
});
