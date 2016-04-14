var f = require('utils/tests/f');

require('tests/factories/AllegationFactory');
require('tests/factories/OfficerFactory');


f.define('OfficerPageData', {
  'detail': function () {
    return f.create('Officer');
  },

  'complaints': function () {
    return f.createBatch(2, 'Allegation');
  },

  'co_accused': function () {
    return [];
  },

  'distribution': function () {
    return [];
  }
});
