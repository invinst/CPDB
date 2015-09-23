var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
global.jQuery = require('jquery');
var OfficerListActions = require('../actions/OfficerSection/OfficerListActions');
var SearchStore = require('../stores/OfficerSection/SearchStore');

var ajax = null;

var OfficerAPI = {

  get: function() {
    if (ajax) {
      ajax.abort();
    }
    var query = SearchStore.getState()['query'];

    var params = {
      q: query
    };

    ajax = jQuery.getJSON(AppConstants.OFFICER_END_POINT, params, function(data) {
      OfficerListActions.receivedOfficerList(data);
    });
  }
};

module.exports = OfficerAPI;
