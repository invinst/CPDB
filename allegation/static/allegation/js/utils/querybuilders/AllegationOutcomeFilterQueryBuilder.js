var _ = require('lodash');
require('utils/jQuery');

var AppConstants = require('../../constants/AppConstants');

var ComplaintListStore = require('stores/ComplaintListStore');


var AllegationOutcomeFilterQueryBuilder = {
  buildQuery: function (activeFilter) {
    return jQuery.param(AllegationOutcomeFilterQueryBuilder.buildQueryParams(activeFilter), true);
  },

  buildQueryParams: function (activeFilter) {
    activeFilter = activeFilter || ComplaintListStore.getActiveFilter();

    switch (activeFilter) {
      case 'all':
        params = {};
        break;

      case 'disciplined':
        params = {
          final_outcome_class: activeFilter
        };
        break;

      default:
        params = {
          final_finding: AppConstants.FILTER_CODES[activeFilter]
        };
        break;
    }

    return params;
  }
};

module.exports = AllegationOutcomeFilterQueryBuilder;
