var pluralize = require('pluralize');

var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var OfficerPresenter = function (officer) {
  var displayName = function () {
    var officerFirst = HelperUtil.fetch(officer, 'officer_first', '');
    var officerLast = HelperUtil.fetch(officer, 'officer_last', '');

    return [officerFirst, officerLast].join(' ');
  };

  var id = function () {
    return HelperUtil.fetch(officer, 'id', 'Unknown');
  };

  var race = function () {
    var race = HelperUtil.fetch(officer, 'race', 'Unknown');
    // In DB, we mark unknown `Race` to be `Unknown` T_T
    return race.toLowerCase() == 'unknown' ? 'Race unknown' : race;
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
    coAccusedWith: coAccusedWith
  };
};

module.exports = OfficerPresenter;
