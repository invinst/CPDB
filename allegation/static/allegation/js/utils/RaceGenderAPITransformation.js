var _ = require('lodash');

var GenderPresenter = require('presenters/GenderPresenter');
var FilterTagStore = require('stores/FilterTagStore');


var isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic'); };
var isWhite = function (x, y) { return _(['white', 'italian']).contains(y.toLowerCase()); };

var setTagActive = function (raceData, isOfficer) {
  var filterCategory = isOfficer ? 'officer__race' : 'complainant_race';
  var hasActiveFilter = FilterTagStore.getAll(filterCategory).length > 0;

  raceData = _.each(raceData, function (item) {
    var isActive = false;

    if (!hasActiveFilter) {
      isActive = true;
    } else {
      isActive = _(item.filters).reduce(function (active, filter) {
        return active && FilterTagStore.isInFilter(filterCategory, filter.value);
      }, true);
    }

    item['active'] = isActive;
  });
  return raceData;
};


var RaceGenderAPITransform = {
  transformRaces: function (complaintRaces, isOfficer) {
    var all = _(complaintRaces).sum();
    var white = _(complaintRaces).filter(isWhite).sum();
    var black = _(complaintRaces).get('Black', 0);
    var hispanic = _(complaintRaces).filter(isHispanic).sum();
    var others = all - white - black - hispanic;

    var allFilterValues = _.keys(complaintRaces);
    var hispanicFilterValues = _.filter(allFilterValues, function (x) {
      return _(x.toLowerCase()).contains('hispanic');
    });
    var whiteFilterValues = _.filter(allFilterValues, function (x) {
      return _(['white', 'italian']).contains(x.toLowerCase());
    });
    var otherFilterValues = _.difference(allFilterValues, _.union(hispanicFilterValues, whiteFilterValues, ['Black']));

    var hispanicFilters = _.map(hispanicFilterValues, function (x) {
      return { value: x, label: x };
    });
    var whiteFilters = _.map(whiteFilterValues, function (x) {
      return { value: x, label: x };
    });
    var otherFilters = _.map(otherFilterValues, function (x) {
      return { value: x, label: x };
    });

    var raceData = _([
      {
        label: this.raceLabel('White', isOfficer),
        value: white,
        filters: whiteFilters
      },
      {
        label: this.raceLabel('Black', isOfficer),
        value: black,
        filters: [{ value: 'Black', label: this.raceLabel('Black', isOfficer) }]
      },
      {
        label: this.raceLabel('Hispanic', isOfficer),
        value: hispanic,
        filters: hispanicFilters
      },
      {
        label: 'Others',
        value: others,
        filters: otherFilters
      }
    ]).chain().reject(function (x) { return x.value == 0; }).value();

    raceData = setTagActive(raceData, isOfficer);

    return raceData;
  },

  raceLabel: function (race, isOfficer) {
    return isOfficer ? race + ' officers' : race;
  },

  transformGenders: function (genders, isOfficer) {
    var filterCategory = isOfficer ? 'officer__gender' : 'complainant_gender';
    var hasActiveFilter = FilterTagStore.getAll(filterCategory).length > 0;

    return _(genders).map(function (x, y) {
      var genderLabel = GenderPresenter(y);

      return {
        'label': genderLabel,
        'filters': [{ value: y, label: genderLabel}],
        'value': x,
        'active': !hasActiveFilter || FilterTagStore.isInFilter(filterCategory, y)
      };
    }).sortBy('label').value();
  }
};

module.exports = RaceGenderAPITransform;
