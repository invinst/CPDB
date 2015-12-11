var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var OfficerPresenter = function (officer) {
  var displayName = function () {
    var officerFirst = HelperUtil.fetch(officer, 'officer_first', '');
    var officerLast = HelperUtil.fetch(officer, 'officer_last', '');

    return [officerFirst, officerLast].join(' ');
  };

  var description = function () {
    var gender = GenderPresenter(officer['gender']).humanReadable;
    var race = HelperUtil.fetch(officer, 'race', '');
    var raceDisplay = race ? '(' + race + ')' : '';

    return [gender, raceDisplay].join(' ');
  };

  return {
    displayName: displayName(),
    description: description()
  };
};

module.exports = OfficerPresenter;
