var pluralize = require('pluralize');

var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var OfficerPresenter = function (officer) {
  var displayName = function () {
    var officerFirst = HelperUtil.fetch(officer, 'officer_first', '');
    var officerLast = HelperUtil.fetch(officer, 'officer_last', '');

    return [officerFirst, officerLast].join(' ');
  };

  var id = function () {
    return HelperUtil.fetch(officer, 'id', '').toString();
  };

  var race = function () {
    return HelperUtil.fetch(officer, 'race', 'Race unknown');
  };

  var gender = function () {
    return GenderPresenter(officer['gender']).humanReadable;
  };

  var description = function () {
    return HelperUtil.format('{gender} ({race})', {'gender': gender(), 'race': race()});
  };

  var badge = function () {
    return HelperUtil.fetch(officer, 'star', 'Unknown');
  };

  var unit = function () {
    var unitCode = HelperUtil.fetch(officer, 'unit', '');
    return HelperUtil.fetch(AppConstants.UNITS, unitCode, 'Unknown');
  };

  var rank = function () {
    var rankCode = HelperUtil.fetch(officer, 'rank', '');
    return HelperUtil.fetch(AppConstants.RANKS, rankCode, 'Unknown');
  };

  var joinedDate = function () {
    return HelperUtil.fetch(officer, 'appt_date', 'Unknown');
  };

  var allegationsCount = function () {
    return HelperUtil.fetch(officer, 'allegations_count', 0);
  };

  var has = function (officer, field) {
    return !!officer[field];
  };

  var hasDataIn = function (officer, field, collection) {
    return (collection.indexOf(officer[field]) > 0);
  };

  var hasData = function (label) {
    var field = AppConstants.OFFICER_SUMMARY_MAP[label];
    var checkers = {
      'race': has(officer, field),
      'unit': hasDataIn(officer, field, Object.keys(AppConstants.UNITS)),
      'rank': has(officer, field),
      'appt_date': has(officer, field),
      'gender': has(officer, field)
    };

    return checkers[field];
  };

  var hasSummarySection = function () {
    var labels = Object.keys(AppConstants.OFFICER_SUMMARY_MAP);
    var summarySectionData = labels.map(function (label) {
      return hasData(label);
    });
    return CollectionUtil.any(summarySectionData);
  };

  var coAccusedWith = function (numberOfCoAccusedOfficers) {
    var theOthers = pluralize('other', numberOfCoAccusedOfficers, true);
    var withSomeOfficers = HelperUtil.format(' and {theOthers}', {'theOthers': theOthers});
    var withNoOfficer = '';

    var coAccusedInformation = numberOfCoAccusedOfficers ? withSomeOfficers : withNoOfficer;

    return HelperUtil.format('{officerName} {coAccusedInformation}',
      {
        'officerName': displayName(),
        'coAccusedInformation': coAccusedInformation
      }).trim();
  };

  return {
    id: id(),
    badge: badge(),
    displayName: displayName(),
    description: description(),
    gender: gender(),
    race: race(),
    unit: unit(),
    rank: rank(),
    joinedDate: joinedDate(),
    allegationsCount: allegationsCount(),
    hasData: hasData,
    hasSummarySection: hasSummarySection(),
    coAccusedWith: coAccusedWith
  };
};

module.exports = OfficerPresenter;
