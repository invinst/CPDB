var faker = require('faker');

var f = require('utils/tests/f');


f.define('Document', {
  'id': function () {
    return f.sequence('documentId');
  },

  'documentcloud_id': function () {
    return faker.random.number(1000);
  },

  'normalized_title': function () {
    return 'cr-274811';
  },

  'requested': function () {
    return false;
  },

  'pending': function () {
    return false;
  },

  'type': function () {
    return 'CPB';
  }
});
