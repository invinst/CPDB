var faker = require('faker');

var f = require('utils/tests/f');

require('tests/factories/DocumentFactory');
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

  'documents': function () {
    return f.createBatch(2, 'Document');
  },

  'officer_allegation_set': function () {
    return f.createBatch(2, 'OfficerAllegation');
  }
});
