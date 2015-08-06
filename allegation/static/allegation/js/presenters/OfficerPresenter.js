var AppConstants = require('../constants/AppConstants');

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
      var gender = officer.gender || 'Gender N/A';
      gender = gender.replace('M', 'Male').replace('F', 'Female');

      return gender;
    },

    race: function() {
      return officer.race || 'Race N/A';
    }
  }
};

module.exports = OfficerPresenter;
