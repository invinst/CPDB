var _ = require('lodash');
require('utils/jQuery');

var FilterTagStore = require('stores/FilterTagStore');
var OfficerListStore = require('stores/OfficerListStore');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');
var AllegationOfficerQueryBuilder = require('utils/querybuilders/AllegationOfficerQueryBuilder');
var AllegationOutcomeFilterQueryBuilder = require('utils/querybuilders/AllegationOutcomeFilterQueryBuilder');
var QueryBuilderUtil = require('utils/querybuilders/QueryBuilderUtil');


var AllegationFetcherQueryBuilder = {
  buildQuery: function (activeOutcomeFilter) {
    return jQuery.param(AllegationFetcherQueryBuilder.buildQueryParams(activeOutcomeFilter), true);
  },

  buildQueryParams: function (activeOutcomeFilter) {
    var filterTags = FilterTagStore.getAll();
    var activeOfficers = OfficerListStore.getActiveOfficers();

    if (_.isEmpty(filterTags) && _.isEmpty(activeOfficers)) {
      return {};
    }

    return QueryBuilderUtil.mergeQueryParams([
      AllegationFilterTagsQueryBuilder.buildQueryParams(),
      AllegationOfficerQueryBuilder.buildQueryParams(),
      AllegationOutcomeFilterQueryBuilder.buildQueryParams(activeOutcomeFilter)
    ]);
  },

  buildAnalysisOutcomeQuery: function () {
    return jQuery.param(AllegationFetcherQueryBuilder.buildAnalysisOutcomeQueryParams(), true);
  },

  buildAnalysisOutcomeQueryParams: function () {
    return QueryBuilderUtil.mergeQueryParams([
      AllegationFilterTagsQueryBuilder.buildQueryParams(),
      AllegationOfficerQueryBuilder.buildQueryParams()
    ]);
  }
};

module.exports = AllegationFetcherQueryBuilder;
