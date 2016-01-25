var OutcomeAnalysisServerActionCreator = require('../actions/ComplaintList/OutcomeAnalysisServerActionCreator');
var AllegationFetcherQueryBuilder = require('utils/querybuilders/AllegationFetcherQueryBuilder');

var ajax = null;


var OutcomeAnalysisAPI = {
  getAnalysisInformation: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON('/api/officer-allegations/analysis?' + AllegationFetcherQueryBuilder.buildAnalysisOutcomeQuery(), function (data) {
        OutcomeAnalysisServerActionCreator.receivedAnalysisInformation(data);
      });
    }
  }
};

module.exports = OutcomeAnalysisAPI;
