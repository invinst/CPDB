var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');

var OfficerPresenter = function(officer) {
  return {
    displayName: function() {
      var displayName = officer.officer_first.toLowerCase() + " " + officer.officer_last.toLowerCase();

      if (displayName.length > AppConstants.MAX_OFFICER_NAME_LENGTH) {
        displayName = officer.officer_first.toLowerCase().substr(0, 1) + ". " + officer.officer_last.toLowerCase();
      }

      return displayName;
    },

    gender: function() {
      var gender = officer.gender || '';
      gender = gender.replace('M', 'Male').replace('F', 'Female');

      return gender;
    },

    race: function() {
      return officer.race || '';
    },

    genderRace: function() {
      return _.compact([this.gender(), this.race()]).join(', ');
    }
  }
};

module.exports = OfficerPresenter;
