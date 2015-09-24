var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
global.jQuery = require('jquery');
var OfficerListActions = require('../actions/OfficerSection/OfficerListActions');
var OfficerActions = require('../actions/OfficerSection/OfficerActions');
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
      OfficerListActions.receivedOfficerList(data.results);
    });
  },

  loadById: function(id) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.OFFICER_END_POINT + id + '/', function(data) {
      OfficerActions.receivedOfficer(data);
    });
  },

  saveOfficerProfile: function (officer, origin) {
    jQuery.ajax({
      type: 'PUT',
      url: AppConstants.OFFICER_END_POINT + officer.id + '/',
      data: officer
    }).done(function(data) {
      OfficerActions.officerProfileUpdated(data, origin);
    });
  }
};

module.exports = OfficerAPI;
