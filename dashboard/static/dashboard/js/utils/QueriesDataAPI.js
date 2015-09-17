var AppConstants = require('../constants/AppConstants');
var QueriesDataServerActions = require('../actions/SearchSection/QueriesDataServerActions');
global.jQuery = require('jquery');

var ajax = null;

var QueriesDataAPI = {
  get: function() {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.QUERIES_DATA_ENDPOINT, function(data) {
      QueriesDataServerActions.receivedQueriesData(data);
    });
  }
};

module.exports = QueriesDataAPI;
