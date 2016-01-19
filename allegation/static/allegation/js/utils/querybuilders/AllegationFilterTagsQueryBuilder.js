var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');

var FilterTagStore = require('stores/FilterTagStore');


var AllegationFilterTagsQueryBuilder = {
  buildQuery: function (ignoreFilters) {
    var filters = FilterTagStore.getAll();

    ignoreFilters = ignoreFilters || [];

    filters = _.filter(filters, function (entries, category) {
      return ignoreFilters.indexOf(category) == -1 && entries.length > 0;
    });

    var query = _.map(filters, function (values, category) {
      return _.pluck(values, 'filter').join('&');
    }).join('&');

    return query;
  },
};

module.exports = AllegationFilterTagsQueryBuilder;
