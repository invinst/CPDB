var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var OfficerPresenter = function (officer) {
  var displayName = function () {
    var officerFirst = HelperUtil.fetch(officer, 'officer_first', '');
    var officerLast = HelperUtil.fetch(officer, 'officer_last', '');

    return [officerFirst, officerLast].join(' ');
  };

  var race = function () {
    var race = HelperUtil.fetch(officer, 'race', 'Unknown');
    // In DB, we mark unknown `Race` to be `Unknown` T_T
    return race.toLowerCase() == 'unknown' ? 'Race unknown' : race;
  };

  var gender = function() {
    return GenderPresenter(officer['gender']).humanReadable;
  };

  var description = function () {
    var raceDisplay = '(' + race() + ')';

    return [gender(), raceDisplay].join(' ');
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

  var joinDate = function() {
    return HelperUtil.fetch(officer, 'appt_date', 'Unknown');
  };

  return {
    badge: badge(),
    displayName: displayName(),
    description: description(),
    gender: gender(),
    race: race(),
    unit: unit(),
    rank: rank(),
    joinDate: joinDate()
  };
};

module.exports = OfficerPresenter;
