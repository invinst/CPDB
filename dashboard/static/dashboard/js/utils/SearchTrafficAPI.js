var AppConstants = require('../constants/AppConstants');
var SearchTrafficServerActions = require('../actions/SearchTrafficServerActions');
global.jQuery = require('jquery');

var ajax = null;


var SearchTrafficAPI = {
  getTopQueries: function () {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.SEARCH_TRAFFIC_API_ENDPOINT, function (data) {
      SearchTrafficServerActions.receivedSearchTrafficData(data);
    });
  }
};

module.exports = SearchTrafficAPI;
