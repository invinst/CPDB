
var _ = require('lodash');

var GenderPresenter = require('presenters/GenderPresenter');
var FilterTagStore = require('stores/FilterTagStore');


var isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic'); };
var isWhite = function (x, y) { return _(['white', 'italian']).contains(y.toLowerCase()); };
var shouldBeOthers = function (otherFilterValues) {
  return otherFilterValues.length !== 1 || otherFilterValues[0] === 'Unknown';
};

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

var SORT_ORDER = {
  gender: ['Male', 'Female'],
  race: ['Black', 'White', 'Hispanic']
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
    var otherFilterValues = _.difference(allFilterValues,
      _.union(hispanicFilterValues, whiteFilterValues, ['Black']));

    var hispanicFilters = _.map(hispanicFilterValues, function (x) {
      return { value: x, displayValue: x };
    });
    var whiteFilters = _.map(whiteFilterValues, function (x) {
      return { value: x, displayValue: x };
    });
    var otherFilters = _.map(otherFilterValues, function (x) {
      return { value: x, displayValue: x };
    });

    var otherLabel = shouldBeOthers(otherFilterValues) ? 'Others' : otherFilterValues[0];

    var raceData = _([
      {
        label: 'White',
        count: white,
        filters: whiteFilters
      },
      {
        label: 'Black',
        count: black,
        filters: [{ value: 'Black', displayValue: 'Black' }]
      },
      {
        label: 'Hispanic',
        count: hispanic,
        filters: hispanicFilters
      },
      {
        label: otherLabel,
        count: others,
        filters: otherFilters
      }
    ]).chain()
    .reject(function (x) { return x.count == 0; })
    .sortBy(function (x) {
      var ind = SORT_ORDER['race'].indexOf(x.label);
      if (ind === -1) return 99;
      return ind;
    })
    .value();

    raceData = setTagActive(raceData, isOfficer);

    return raceData;
  },

  transformGenders: function (genders, isOfficer) {
    var filterCategory = isOfficer ? 'officer__gender' : 'complainant_gender';
    var hasActiveFilter = FilterTagStore.getAll(filterCategory).length > 0;

    return _(genders).map(function (x, y) {
      var genderLabel = GenderPresenter(y);

      return {
        'label': genderLabel,
        'filters': [{ value: y, displayValue: genderLabel}],
        'count': x,
        'active': !hasActiveFilter || FilterTagStore.isInFilter(filterCategory, y)
      };
    })
    .sortBy(function (x) {
      var ind = SORT_ORDER['gender'].indexOf(x.label);
      if (ind === -1) return 99;
      return ind;
    })
    .value();
  },

  transformAge: function (ages, isOfficer) {
    var filterKey = isOfficer ? 'officer_age' : 'complainant_age';
    var hasActiveFilter = FilterTagStore.getAll(filterKey).length > 0;

    return _(ages).map(function (x, y) {
      function transformAgeVal(val) {
        if (val[val.length - 1] === '+') {
          return '>' + val.slice(0, -1);
        }
        return val;
      }

      return {
        'label': y,
        'filters': [{ value: transformAgeVal(y), displayValue: y}],
        'count': x,
        'active': !hasActiveFilter || FilterTagStore.isInFilter(filterKey, transformAgeVal(y))
      };
    })
    .sortBy(function (x) {
      var extractNumber = x.label ? x.label.match(/\d+/) : null;
      return extractNumber ? extractNumber[0] : -1;
    })
    .value();
  }
};

module.exports = RaceGenderAPITransform;
