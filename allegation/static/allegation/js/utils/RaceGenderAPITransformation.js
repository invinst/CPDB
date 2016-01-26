var _ = require('lodash');

isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic') };


var RaceGenderAPITransform = {
  transformRacesForComplaint: function(complaintRaces, isOfficer) {
    var all = _(complaintRaces).sum();
    var white = _(complaintRaces).get('White', 0);
    var black = _(complaintRaces).get('Black', 0);
    var hispanic = _(complaintRaces).filter(isHispanic).sum();
    var others = all - white - black - hispanic;
    var allFilterValues = _.keys(complaintRaces);
    var hispanicFilterValues = _.filter(allFilterValues, function (x) {
      return _(x.toLowerCase()).contains('hispanic');
    });
    var otherFilterValues = _.difference(allFilterValues, _.union(hispanicFilterValues, ['White', 'Black']));

    return _([
      { label: this.raceLabel('White', isOfficer), value: white, filterValue: 'White'},
      { label: this.raceLabel('Black', isOfficer), value: black, filterValue: 'Black' },
      { label: this.raceLabel('Hispanic', isOfficer), value: hispanic, filterValue: hispanicFilterValues },
      { label: 'Others', value: others, filterValue: otherFilterValues}
    ]).chain().reject(function(x) { return x.value == 0 }).value();
  },

  transformRacesForOfficer: function(complaintRaces) {
    return this.transformRacesForComplaint(complaintRaces, true);
  },

  raceLabel: function (race, isOfficer) {
    return isOfficer ? race + ' officers' : race;
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
