var faker = require('faker');

var f = require('utils/tests/f');


f.define('Document', {
  'title': function () {
    return faker.random.words();
  },
  'documentcloud_id': function () {
    return 0;
  },
  'type': function () {
    return 'CR';
  },
  'requested': function () {
    return false;
  },
  'pending': function () {
    return false;
  },
  'normalized_title': function () {
    return '';
  }
});
