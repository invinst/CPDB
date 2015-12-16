var AppConstants = require('constants/AppConstants');
var InvestigatorPageActions = require('actions/InvestigatorPage/InvestigatorPageActions');

var ajax = null;

var InvestigatorPageAPI = {
  getInvestigatorData: function (investigator) {
    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.INVESTIGATOR_PAGE_API_ENDPOINT, {'pk': investigator}, function (data) {
      InvestigatorPageActions.receivedInvestigatorData(data);
    });
  }
};

module.exports = InvestigatorPageAPI;
