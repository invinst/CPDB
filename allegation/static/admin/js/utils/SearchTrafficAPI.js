var AppConstants = require('../constants/AppConstants');
var SearchTrafficServerActions = require('../actions/SearchTrafficServerActions');


var ajax =null;


var SearchTrafficAPI = {
  getTopQueries: function() {
    if (ajax) {
      ajax.abort();
    }

    ajax = $.getJSON(AppConstants.SEARCH_TRAFFIC_ENDPOINT, function(data) {
      SearchTrafficServerActions.receivedSearchTrafficData(data);
    })
  }
};

module.exports = SearchTrafficAPI;
