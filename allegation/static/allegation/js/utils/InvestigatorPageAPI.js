var AppConstants = require('../constants/AppConstants');
var InvestigatorPageActions = require('actions/InvestigatorPage/InvestigatorPageActions');


var ajax = null;

var InvestigatorPageAPI = {
  getInvestigatorData: function (investigatorId) {
    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.INVESTIGATOR_API_ENDPOINT, {'pk': investigatorId}, function (data) {
      InvestigatorPageActions.receivedInvestigatorData(data);
    });
  }
};

module.exports = InvestigatorPageAPI;
