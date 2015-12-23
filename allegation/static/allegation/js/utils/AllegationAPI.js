var AppConstants = require('../constants/AppConstants');
var AllegationActions = require('actions/DataToolPage/AllegationActions');

var AllegationAPI = {
  getData: function (crid) {
    $.getJSON(AppConstants.ALLEGATION_DETAILS_API_ENDPOINT, { crid: crid }, function (data) {
      AllegationActions.receivedData(data);
    });
  }
};

module.exports = AllegationAPI;
