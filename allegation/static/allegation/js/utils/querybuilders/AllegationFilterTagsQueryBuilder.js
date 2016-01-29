var _ = require('lodash');
require('utils/jQuery');

var AppConstants = require('../../constants/AppConstants');

var FilterTagStore = require('stores/FilterTagStore');


var AllegationFilterTagsQueryBuilder = {
  buildQuery: function (ignoreFilters) {
    return jQuery.param(AllegationFilterTagsQueryBuilder.buildQueryParams(ignoreFilters), true);
  },

  buildQueryParams: function (ignoreFilters) {
    var filters = FilterTagStore.getAll();
    ignoreFilters = ignoreFilters || [];

    filters = _.pick(filters, function (entries, category) {
      return !_.has(ignoreFilters, category) && entries.length > 0;
    });

    return _.mapValues(filters, function (entries) {
      return _.pluck(entries, 'value');
    });
  }
};

module.exports = AllegationFilterTagsQueryBuilder;
