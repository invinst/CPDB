var AppConstants = require('../constants/AppConstants');
var ComplaintListStore = require('../stores/ComplaintListStore');
var OfficerStore = require('../stores/OfficerStore');
var FilterStore = require('../stores/FilterStore');

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

  buildFilterTagsQuery: function(filters, ignoreFilters) {
    var query = '';

    for (var filterName in filters) {
      if (ignoreFilters && ignoreFilters.indexOf(filterName) > -1) {
        continue;
      }
      var filter = filters[filterName];

      if (filter['value']) {
        for (var i = 0; i < filter['value'].length; i++) {
          var value = filter['value'][i];
          if (value && typeof(value) == 'object') {
            query += filterName + "=" + value[1] + "&";
          } else {
            query += filterName + "=" + value + "&";
          }
        }
      }
    }

    return query;
  },

  buildQuery: function(activeOutcomeFilter) {
    var filters = FilterStore.getFilters();
    var ignoreFilters = [];
    var activeOfficers = OfficerStore.getActiveOfficers();
    var activeOutcomeFilter = activeOutcomeFilter || ComplaintListStore.getActiveFilter();

    if (_.isEmpty(filters) && _.isEmpty(activeOfficers))
      return '';

    return _.compact([this.buildFilterTagsQuery(filters, ignoreFilters), this.buildOfficerQuery(activeOfficers),
      this.buildOutcomeFilterQuery(activeOutcomeFilter)]).join('&');
  }
};

module.exports = AllegationFetcherQueryBuilder;
