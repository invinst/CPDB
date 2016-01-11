var _ = require('lodash');

var AppConstants = require('../constants/AppConstants');
var ComplaintListStore = require('stores/ComplaintListStore');
var OfficerListStore = require('stores/OfficerListStore');
var FilterTagStore = require('stores/FilterTagStore');


var AllegationFetcherQueryBuilder = {
  buildOutcomeFilterQuery: function(activeFilter) {
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

  buildOfficerQuery: function(activeOfficers) {
    return _.map(activeOfficers, function (x) { return 'officer=' + x }).join('&');
  },

  buildFilterTagsQuery: function(ignoreFilters) {
    return FilterTagStore.getQueryString(ignoreFilters);
  },

  buildQuery: function(activeOutcomeFilter) {
    var filters = FilterTagStore.getAll();
    var ignoreFilters = [];
    var activeOfficers = OfficerListStore.getActiveOfficers();
    var activeOutcomeFilter = activeOutcomeFilter || ComplaintListStore.getActiveFilter();

    if (_.isEmpty(filters) && _.isEmpty(activeOfficers))
      return '';

    return _.compact([this.buildFilterTagsQuery(ignoreFilters), this.buildOfficerQuery(activeOfficers),
      this.buildOutcomeFilterQuery(activeOutcomeFilter)]).join('&');
  }
};

module.exports = AllegationFetcherQueryBuilder;
