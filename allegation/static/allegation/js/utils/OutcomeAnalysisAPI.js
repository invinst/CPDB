var OfficerStore = require('../stores/OfficerStore');
var OutcomeAnalysisServerActionCreator = require('../actions/ComplaintList/OutcomeAnalysisServerActionCreator');

var OutcomeAnalysisAPI = {
  getAnalysisInformation: function() {
    $.getJSON('/api/allegations/analysis?' + OfficerStore.getQueryString(), function (data) {
      OutcomeAnalysisServerActionCreator.receivedAnalysisInformation(data);
    });
  }
};

module.exports = OutcomeAnalysisAPI;
