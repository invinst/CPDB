var AppConstants = require('constants/AppConstants');
var OfficerPageActions = require('actions/OfficerPage/OfficerPageActions');

var ajax = null;

var OfficerPageAPIUtil = {
  getOfficerData: function (officer) {
    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.OFFICER_PAGE_API_ENDPOINT, {'pk': officer}, function (data) {
      OfficerPageActions.receivedOfficerData(data);
    });
  }
};

module.exports = OfficerPageAPIUtil;
