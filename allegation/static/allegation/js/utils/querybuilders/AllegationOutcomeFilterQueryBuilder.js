var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');

var ComplaintListStore = require('stores/ComplaintListStore');


var AllegationOutcomeFilterQueryBuilder = {
  buildQuery: function(activeFilter) {
    activeFilter = activeFilter || ComplaintListStore.getActiveFilter();

    if (activeFilter == 'all') {
      return '';
    }

    if (activeFilter == 'disciplined') {
      return ['final_outcome_class', activeFilter].join('=');
    }

    if (activeFilter == 'other') {
      return AppConstants.FILTER_CODES[activeFilter].map(function (x) {
        return 'final_finding=' + x
      }).join('&');
    }

    return ['final_finding', AppConstants.FILTER_CODES[activeFilter]].join('=');
  },
};

module.exports = AllegationOutcomeFilterQueryBuilder;
