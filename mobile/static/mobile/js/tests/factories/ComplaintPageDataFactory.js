var f = require('utils/tests/f');

f.define('ComplaintPageData', {
  'complaining_witnesses': function () {
    return f.createBatch(2, 'ComplainingWitness');
  },
  'allegation': function () {
    return f.create('Allegation');
  },
  'officer_allegations': function () {
    return f.createBatch(2, 'OfficerAllegation');
  }
});
