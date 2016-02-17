var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');

var OfficerListStore = require('stores/OfficerListStore');


var AllegationOfficerQueryBuilder = {
  buildQuery: function () {
    var activeOfficers = OfficerListStore.getActiveOfficers();

    return _.map(activeOfficers, function (activeOfficer) {
      return 'officer=' + activeOfficer;
    }).join('&');
  },
};

module.exports = AllegationOfficerQueryBuilder;
