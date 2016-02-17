var OutcomeAnalysisServerActionCreator = require('../actions/ComplaintList/OutcomeAnalysisServerActionCreator');
var AllegationFetcherQueryBuilder = require('utils/querybuilders/AllegationFetcherQueryBuilder');

var ajax = null;


var OutcomeAnalysisAPI = {
  getAnalysisInformation: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery('all');

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON(
        '/api/officer-allegations/analysis?' + queryString,
        function (data) {
          OutcomeAnalysisServerActionCreator.receivedAnalysisInformation(data);
        }
      );
    }
  }
};

module.exports = OutcomeAnalysisAPI;
