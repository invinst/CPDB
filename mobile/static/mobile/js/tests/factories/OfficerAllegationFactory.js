var f = require('utils/tests/f');
var faker = require('faker');
require('tests/factories/OfficerFactory');
require('tests/factories/CategoryFactory');


f.define('OfficerAllegation', {
  'id': function () {
    return f.sequence('officerAllegationId');
  },
  'officer': function () {
    return f.create('Officer');
  },
  'cat': function () {
    return f.create('Category');
  },
  'start_date': function () {
    return faker.date.past();
  },
  'end_date': function () {
    return faker.date.recent();
  },
  'final_finding': function () {
    return 'UN';
  },
  'final_outcome_class': function () {
    return 'not-sustained';
  }
});
