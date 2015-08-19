var OfficerStore = require('../stores/OfficerStore');
var OutcomeAnalysisServerActionCreator = require('../actions/ComplaintList/OutcomeAnalysisServerActionCreator');
var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');
var ajax = null;

var OutcomeAnalysisAPI = {
  getAnalysisInformation: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();

    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON('/api/allegations/analysis?' + OfficerStore.getQueryString(), function (data) {
        OutcomeAnalysisServerActionCreator.receivedAnalysisInformation(data);
      });
    }
  }
};

module.exports = OutcomeAnalysisAPI;
