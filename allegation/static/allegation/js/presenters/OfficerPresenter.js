var AppConstants = require('../constants/AppConstants');
var moment = require('moment');
var _ = require('lodash');

var OfficerPresenter = function(officer) {
  var displayName = function() {
    var displayName = officer.officer_first.toLowerCase() + " " + officer.officer_last.toLowerCase();

    if (displayName.length > AppConstants.MAX_OFFICER_NAME_LENGTH) {
      displayName = officer.officer_first.toLowerCase().substr(0, 1) + ". " + officer.officer_last.toLowerCase();
    }

    return displayName;
  };

  var gender = function() {
    var gender = officer.gender || '';
    gender = gender.replace('M', 'Male').replace('F', 'Female');

    return gender;
  };

  var race = function() {
    return officer.race || '';
  };

  var unitName = function() {
    return AppConstants.UNITS[officer.unit] || 'Unknown unit';
  };

  var joinedDate = function() {
    return officer.appt_date ? moment(officer.appt_date, 'YYYY-MM-DD').format('MMM DD, YYYY') : '';
  };

  return {
    displayName: displayName(),
    gender: gender(),
    race: race(),
    genderRace: _.compact([gender(), race()]).join(', '),
    rank: AppConstants.RANKS[officer.rank] || 'N/A',
    unitWithName: officer.unit ? officer.unit + ' / ' + unitName() : '',
    joinedDate: joinedDate(),
    star: _.isEmpty(officer.star) ? '' : officer.star
  };
};

module.exports = OfficerPresenter;
