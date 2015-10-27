var OfficerListStore = require('../stores/OfficerListStore');
var OutcomeAnalysisServerActionCreator = require('../actions/ComplaintList/OutcomeAnalysisServerActionCreator');
var AllegationFetcherQueryBuilder = require('./AllegationFetcherQueryBuilder');
var ajax = null;

var OutcomeAnalysisAPI = {
  getAnalysisInformation: function () {
    var queryString = AllegationFetcherQueryBuilder.buildQuery();
    console.log(queryString);
    if (queryString) {
      if (ajax) {
        ajax.abort();
      }

      ajax = $.getJSON('/api/allegations/analysis?' + OfficerListStore.getQueryString(), function (data) {
        OutcomeAnalysisServerActionCreator.receivedAnalysisInformation(data);
      });
    }
  }
};

module.exports = OutcomeAnalysisAPI;
