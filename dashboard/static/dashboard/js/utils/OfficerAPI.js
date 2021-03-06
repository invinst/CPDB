var AppConstants = require('../constants/AppConstants');
var OfficerListActions = require('../actions/OfficerSection/OfficerListActions');
var OfficerActions = require('../actions/OfficerSection/OfficerActions');
var ProfileActions = require('../actions/OfficerSection/Officer/ProfileActions');
var SearchStore = require('../stores/OfficerSection/SearchStore');

var ajax = null;
var OfficerAPI;

global.jQuery = require('jquery');


OfficerAPI = {

  get: function () {
    var query = SearchStore.getState()['query'];

    var params = {
      q: query
    };

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.OFFICER_END_POINT, params, function (data) {
      OfficerListActions.receivedOfficerList(data.results);
    });
  },

  loadById: function (id) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.OFFICER_END_POINT + id + '/', function (data) {
      OfficerActions.receivedOfficer(data);
    });
  },

  saveOfficerProfile: function (officer, origin) {
    jQuery.ajax({
      type: 'PUT',
      url: AppConstants.OFFICER_END_POINT + officer.id + '/',
      data: officer
    }).done(function (data) {
      ProfileActions.officerProfileUpdated(data, origin);
    });
  }
};

module.exports = OfficerAPI;
