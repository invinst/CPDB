var _ = require('lodash');

isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic') };

var RaceGenderAPITransform = {
  transformRaces: function(complaintRaces) {
    var all = _(complaintRaces).sum();
    var white = _(complaintRaces).get('White', 0);
    var black = _(complaintRaces).get('Black', 0);
    var hispanic = _(complaintRaces).filter(isHispanic).sum();
    var others = all - white - black - hispanic;

    return _([
      { label: 'White officers', value: white, filterValue: 'White'},
      { label: 'Black officers', value: black, filterValue: 'Black' },
      { label: 'Hispanic officers', value: hispanic, filterValue: 'Hispanic' },
      { label: 'Others', value: others, filterValue: ['Native American', 'Unknown', 'Asian', 'White/Hispanic']}
    ]).chain().reject(function(x) { return x.value == 0 }).value();
  },

  transformGenders: function(genders) {
    var that = this;

    return _(genders).map(function(x, y) {
      return {
        'label': that.genderPresenter(y),
        'filterValue': y,
        'value': x
      };
    }).sortBy('label').value();
  },

  genderPresenter: function(gender) {
    if (gender.toLowerCase() == 'f') return 'Female';
    if (gender.toLowerCase() == 'm') return 'Male';
    if (gender.toLowerCase() == 'x') return 'Trans';
    return 'N/A';
  },
};

module.exports = RaceGenderAPITransform;
