var _ = require('lodash');
require('utils/jQuery');

var AppConstants = require('../../constants/AppConstants');

var OfficerListStore = require('stores/OfficerListStore');


var AllegationOfficerQueryBuilder = {
  buildQuery: function () {
    return jQuery.param(AllegationOfficerQueryBuilder.buildQueryParams(), true);
  },

  buildQueryParams: function () {
    var activeOfficers = OfficerListStore.getActiveOfficers() || [];

    if (activeOfficers.length == 0) {
      return {};
    }

    return {
      officer: activeOfficers
    };
  }
};

module.exports = AllegationOfficerQueryBuilder;
