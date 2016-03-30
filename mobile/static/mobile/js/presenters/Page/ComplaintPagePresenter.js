var u = require('utils/HelperUtil');
var HashUtil = require('utils/HashUtil');
var CollectionUtil = require('utils/CollectionUtil');


var ComplaintPagePresenter = function (data, categoryHashId) {
  var categoryId = CollectionUtil.first(HashUtil.decode(categoryHashId));

  var officerAllegations = function () {
    var officerAllegations = u.fetch(data, 'officer_allegations', []);
    officerAllegations.sort(function (a, b) {
      return b.officer['allegations_count'] - a.officer['allegations_count'];
    });
    return u.fetch(data, 'officer_allegations', []);
  };

  var getAgainstOfficerAllegations = function () {
    return officerAllegations().filter(function (officerAllegation) {
      return u.fetch(officerAllegation, 'cat.id', 0) == categoryId;
    });
  };

  var getAccompliceOfficerAllegations = function () {
    return officerAllegations().filter(function (officerAllegation) {
      return u.fetch(officerAllegation, 'cat.id', 0) != categoryId;
    });
  };

  var currentOfficerAllegation = function () {
    var againstOfficerAllegations = getAgainstOfficerAllegations();
    return againstOfficerAllegations && againstOfficerAllegations[0];
  };

  var numberOfOfficerAllegations = function () {
    return Object.keys(CollectionUtil.groupBy(officerAllegations(), function (officerAllegation) {
      return u.fetch(officerAllegation, 'cat.id');
    })).length;
  };

  return {
    accompliceOfficerAllegation: getAccompliceOfficerAllegations(),
    againstOfficerAllegations: getAgainstOfficerAllegations(),
    allegation: u.fetch(data, 'allegation', {}),
    complainingWitnesses: u.fetch(data, 'complaining_witnesses'),
    currentOfficerAllegation: currentOfficerAllegation(),
    officerAllegations: officerAllegations(),
    isInvalidCategory: !currentOfficerAllegation(),
    numberOfOfficerAllegations: numberOfOfficerAllegations()
  };
};

module.exports = ComplaintPagePresenter;
