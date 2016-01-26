var _ = require('lodash');

var FilterTagStore = require('stores/FilterTagStore');

isHispanic = function (x, y) { return _(y.toLowerCase()).contains('hispanic') };


var RaceGenderAPITransform = {
  transformRaces: function(complaintRaces, isOfficer) {
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

    raceData = _([
      { label: this.raceLabel('White', isOfficer), value: white, filterValue: 'White'},
      { label: this.raceLabel('Black', isOfficer), value: black, filterValue: 'Black' },
      { label: this.raceLabel('Hispanic', isOfficer), value: hispanic, filterValue: hispanicFilterValues },
      { label: 'Others', value: others, filterValue: otherFilterValues}
    ]).chain().reject(function(x) { return x.value == 0 }).value();

    var filterCategory = isOfficer ? 'Officer Race' : 'Complainant Race';
    var hasActiveFilter = FilterTagStore.getAll(filterCategory).length > 0;

    raceData = _.each(raceData, function (item) {
      var isActive = false;

      if (!hasActiveFilter) {
        isActive = true;
      } else {
        if (item.label == 'Others') {
          isActive = _(item.filterValue).reduce(function (active, filter) {
            return active || FilterTagStore.isInFilter(filterCategory, filter);
          }, false);
        } else {
          isActive = FilterTagStore.isInFilter(filterCategory, item.filterValue);
        }
      }

      item['active'] = isActive;
    });

    return raceData;
  },

  raceLabel: function (race, isOfficer) {
    return isOfficer ? race + ' officers' : race;
  },

  transformGenders: function(genders, isOfficer) {
    var that = this;

    var filterCategory = isOfficer ? 'Officer Gender' : 'Complainant Gender';
    var hasActiveFilter = FilterTagStore.getAll(filterCategory).length > 0;

    return _(genders).map(function(x, y) {
      var genderLabel = that.genderPresenter(y)

      return {
        'label': genderLabel,
        'filterValue': y,
        'value': x,
        'active': !hasActiveFilter || FilterTagStore.isInFilter(filterCategory, genderLabel)
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
