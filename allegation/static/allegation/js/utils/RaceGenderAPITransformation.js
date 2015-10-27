var _ = require('lodash');

isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic') };

var RaceGenderAPITransform = {
  transformRaces: function(complaintRaces) {
    var all = _(complaintRaces).sum();
    var white = _(complaintRaces).get('White', 0);
    var black = _(complaintRaces).get('Black', 0);
    var hispanic = _(complaintRaces).filter(isHispanic).sum();
    var others = all - white - black - hispanic;

    return [
      { label: 'White', value: white },
      { label: 'Black', value: black },
      { label: 'Hispanic', value: hispanic },
      { label: 'Others', value: others }
    ];
  },

  transformGenders: function(genders) {
    var that = this;

    return _.map(genders, function(x, y) {
      return {
        'label': that.genderPresenter(y),
        'value': x
      };
    });
  },

  genderPresenter: function(gender) {
    if (gender.toLowerCase() == 'f') return 'Female';
    if (gender.toLowerCase() == 'm') return 'Male';
    if (gender.toLowerCase() == 'x') return 'Trans';
    return 'N/A';
  },
};

module.exports = RaceGenderAPITransform;
