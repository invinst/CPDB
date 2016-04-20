var faker = require('faker');

var f = require('utils/tests/f');
var u = require('utils/HelperUtil');

require('tests/factories/InvestigatorFactory');
require('tests/factories/PointFactory');


f.define('Allegation', {
  'crid': function () {
    return faker.random.number(1000000);
  },

  'investigator': function () {
    return f.create('Investigator');
  },

  'incident_date': function () {
    return '2012-10-07T07:30:00';
  },

  'beat': function () {
    return null;
  },

  'location': function () {
    return null;
  },

  'add1': function () {
    return null;
  },

  'add2': function () {
    return null;
  },

  'city': function () {
    return null;
  },

  'point': function () {
    return f.create('Point');
  },

  'document_id': function () {
    return faker.random.number(1000000);
  },

  'document_normalized_title': function () {
    return u.format('cr-{id}', { 'id': faker.random.number(1000000) });
  },

  'officer_allegation_set': function () {
    return f.createBatch(2, 'OfficerAllegation');
  }
});
