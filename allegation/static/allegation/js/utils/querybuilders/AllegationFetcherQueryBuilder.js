var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');

var FilterTagStore = require('stores/FilterTagStore');
var OfficerListStore = require('stores/OfficerListStore');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');
var AllegationOfficerQueryBuilder = require('utils/querybuilders/AllegationOfficerQueryBuilder');
var AllegationOutcomeFilterQueryBuilder = require('utils/querybuilders/AllegationOutcomeFilterQueryBuilder');


var AllegationFetcherQueryBuilder = {
  buildQuery: function (activeOutcomeFilter) {
    var filterTags = FilterTagStore.getAll();
    var activeOfficers = OfficerListStore.getActiveOfficers();

    if (_.isEmpty(filterTags) && _.isEmpty(activeOfficers)) {
      return '';
    }

    return _.compact([
      AllegationFilterTagsQueryBuilder.buildQuery(),
      AllegationOfficerQueryBuilder.buildQuery(),
      AllegationOutcomeFilterQueryBuilder.buildQuery(activeOutcomeFilter)
    ]).join('&');
  },

  buildQueryInvestigatorPage: function (investigatorId, activeOutcomeFilter) {
    investigatorQuery = 'allegation__investigator=' + investigatorId;
    return _.compact([
      investigatorQuery,
      AllegationOutcomeFilterQueryBuilder.buildQuery(activeOutcomeFilter)
    ]).join('&')
  },

  buildQueryOfficerPage: function (officerId, activeOutcomeFilter) {
    var officerQuery = 'officer=' + officerId;
    return _.compact([
      officerQuery,
      AllegationOutcomeFilterQueryBuilder.buildQuery(activeOutcomeFilter)
    ]).join('&')
  },

  buildAnalysisOutcomeQuery: function () {
    return _.compact([
      AllegationFilterTagsQueryBuilder.buildQuery(),
      AllegationOfficerQueryBuilder.buildQuery(),
    ]).join('&');
  }
};

module.exports = AllegationFetcherQueryBuilder;
